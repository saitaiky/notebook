/**
 * Build homepage knowledge graph from docs and blog content.
 * Scans published docs/** and visible blog/** markdown files,
 * extracts internal links, derives canonical Docusaurus routes,
 * constructs a directed graphology model, computes metrics and communities,
 * and serializes to stable JSON for client-side rendering.
 */

const fs = require('fs');
const path = require('path');
const glob = require('fast-glob');
const matter = require('gray-matter');
const { unified } = require('unified');
const remarkParse = require('remark-parse');
const remarkMdx = require('remark-mdx');
const { visit } = require('unist-util-visit');
const Graph = require('graphology');
const louvain = require('graphology-communities-louvain');
const { buildSemanticEdges } = require('./embeddings');

/**
 * Parse markdown/mdx and extract internal markdown links using regex.
 * Returns array of {text, url} for links that are internal content paths.
 * Excludes external URLs, images, anchors-only, and static assets.
 * 
 * Handles Markdown link syntax: [text](url)
 */
function extractLinksFromMarkdown(markdown) {
  const links = [];
  
  try {
    // Match markdown links: [text](url)
    const markdownLinkRegex = /\[([^\[\]]+)\]\(([^)]+)\)/g;
    let match;
    
    while ((match = markdownLinkRegex.exec(markdown)) !== null) {
      const [, text, url] = match;
      
      if (!url) continue;
      
      // Remove anchor and query from URL
      const cleanUrl = url.split('#')[0].split('?')[0];
      
      // Skip external URLs, mailto, anchors-only, images, and assets
      if (
        cleanUrl.startsWith('http://') ||
        cleanUrl.startsWith('https://') ||
        cleanUrl.startsWith('mailto:') ||
        cleanUrl === '' ||
        cleanUrl.startsWith('/img/') ||
        cleanUrl.startsWith('/pdf/') ||
        cleanUrl.startsWith('/fonts/') ||
        cleanUrl.startsWith('/html/')
      ) {
        continue;
      }
      
      // Include absolute internal paths like /ai/llm/rag
      if (cleanUrl.startsWith('/')) {
        links.push({ text: text.trim(), url: cleanUrl });
      }
    }
  } catch (error) {
    // Silently continue on parse errors
  }
  
  return links;
}

/**
 * Normalize an internal link URL to canonical form.
 * Removes query and hash, ensures trailing slash for Docusaurus routing.
 * Returns the normalized path.
 */
function normalizeInternalLink(linkUrl) {
  // Remove query and hash
  let normalized = linkUrl.split('?')[0].split('#')[0];
  
  // Default to root if empty
  if (!normalized) {
    return '/';
  }
  
  // Ensure trailing slash for Docusaurus trailingSlash: true
  if (!normalized.endsWith('/')) {
    normalized += '/';
  }
  
  return normalized;
}

/**
 * Derive canonical Docusaurus route from a file path.
 * Docusaurus settings: routeBasePath: '/', trailingSlash: true
 * docs/ai/index.md -> /ai/
 * docs/ai/llm/rag.md -> /ai/llm/rag/
 * blog/2024-08-04-auth-bridging.md -> /blog/2024/08/04/auth-bridging/
 */
function deriveCanonicalRoute(filePath, isBlog = false) {
  let route;
  
  if (isBlog) {
    // Extract date from YYYY-MM-DD prefix
    const match = path.basename(filePath).match(/^(\d{4})-(\d{2})-(\d{2})-(.+)\.(md|mdx)$/);
    if (match) {
      const [, year, month, day, slug] = match;
      route = `/blog/${year}/${month}/${day}/${slug}/`;
    } else {
      // Fallback for irregular naming
      const base = path.basename(filePath, path.extname(filePath));
      route = `/blog/${base}/`;
    }
  } else {
    // Docs: relative path without extension, removing index.md
    // Normalize path separators first (handle Windows paths)
    let normalized = filePath.replace(/\\/g, '/');
    let relative = path.relative('docs', normalized);
    relative = relative.replace(/\\/g, '/'); // Ensure forward slashes
    relative = relative.replace(/\.(md|mdx)$/, '');
    
    // Special case: docs/index.md -> /
    if (relative === 'index') {
      route = '/';
    }
    // Remove index suffix (docs/ai/index.md -> /ai/)
    else if (relative.endsWith('/index')) {
      relative = relative.slice(0, -6); // Remove '/index'
      route = '/' + relative + '/';
    } else {
      route = '/' + relative + '/';
    }
  }
  
  return route;
}

/**
 * Load and parse frontmatter from a markdown file.
 * Returns {title, description, slug, tags, url, contentType, section}.
 * slug in frontmatter overrides derived route.
 */
function parseFrontmatter(filePath, derivedRoute, isBlog = false) {
  let title = '';
  let description = '';
  let slug = null;
  let tags = [];
  
  try {
    const content = fs.readFileSync(filePath, 'utf8');
    const { data } = matter(content);
    
    title = data.title || '';
    description = data.description || '';
    slug = data.slug || null;
    tags = Array.isArray(data.tags) ? data.tags : [];
  } catch (error) {
    console.warn(`Failed to parse frontmatter for ${filePath}:`, error.message);
  }
  
  // For blogs with slug override, build /blog/{slug}/ (Docusaurus omits the date from the route).
  // For docs, use slug override directly.
  let url;
  if (isBlog && slug) {
    url = `/blog/${slug}/`;
  } else {
    url = slug ? `/${slug}/` : derivedRoute;
  }

  // Derive section from source file path, not URL — a slug override changes
  // navigation but must not reclassify the page into a phantom section.
  // subsection adds one more folder level for a finer default cluster grain
  // (e.g. 'ai/agentic-system' instead of just 'ai').
  let section;
  let subsection;
  if (isBlog) {
    section = 'blog';
    subsection = 'blog';
  } else {
    const normalized = filePath.replace(/\\/g, '/');
    const relative = path.relative('docs', normalized).replace(/\\/g, '/');
    const segments = relative.split('/');
    const first = segments[0] || 'root';
    section = first.match(/\.(md|mdx)$/) ? 'root' : first;
    subsection = segments.length > 2 ? `${segments[0]}/${segments[1]}` : section;
  }

  return {
    title,
    description,
    url,
    contentType: isBlog ? 'blog' : 'doc',
    section,
    subsection,
    tags,
  };
}

/**
 * Scan docs/** and blog/** for published markdown files.
 * Exclude docs/**\/*.wip, draft docs, and unlisted blog posts.
 */
async function scanContentFiles(siteDir) {
  const docsPattern = path.join(siteDir, 'docs', '**', '*.{md,mdx}');
  const blogPattern = path.join(siteDir, 'blog', '*.{md,mdx}');
  
  let docsFiles = await glob(docsPattern, {
    ignore: ['**/\\*.wip'],
  });
  
  // Filter out .wip files
  docsFiles = docsFiles.filter(f => !f.endsWith('.wip'));

  // Filter out draft docs (draft: true skips route generation, so any graph
  // edge pointing at one becomes a broken link at build time)
  docsFiles = docsFiles.filter(f => {
    try {
      const content = fs.readFileSync(f, 'utf8');
      const { data } = matter(content);
      return data.draft !== true;
    } catch {
      return true; // Include if parsing fails
    }
  });
  
  let blogFiles = await glob(blogPattern);
  
  // Filter out unlisted blog posts
  blogFiles = blogFiles.filter(f => {
    try {
      const content = fs.readFileSync(f, 'utf8');
      const { data } = matter(content);
      return data.unlisted !== true;
    } catch {
      return true; // Include if parsing fails
    }
  });
  
  return {
    docs: docsFiles,
    blog: blogFiles,
  };
}

/**
 * Build the knowledge graph from content files.
 * Returns {nodes, links, unresolvedLinks, stats}.
 */
async function buildGraph(siteDir) {
  const contentFiles = await scanContentFiles(siteDir);
  const allFiles = [
    ...contentFiles.docs.map(f => ({ path: f, isBlog: false })),
    ...contentFiles.blog.map(f => ({ path: f, isBlog: true })),
  ];
  
  // Parse all files and build URL -> metadata map
  const urlToNode = new Map();
  const nodes = [];
  const allLinks = [];
  const unresolvedLinks = [];
  const contentMap = {}; // url → body text snippet for embedding
  
  for (const { path: filePath, isBlog } of allFiles) {
    const derivedRoute = deriveCanonicalRoute(filePath, isBlog);
    const metadata = parseFrontmatter(filePath, derivedRoute, isBlog);
    const url = metadata.url;
    
    const node = {
      id: url, // Use URL as stable node ID
      title: metadata.title || url,
      url,
      contentType: metadata.contentType,
      section: metadata.section,
      subsection: metadata.subsection,
      degree: 0,
      inDegree: 0,
      outDegree: 0,
      community: 0,
    };
    
    nodes.push(node);
    urlToNode.set(url, node);
  }
  
  // Extract links from each file
  for (const { path: filePath, isBlog } of allFiles) {
    const derivedRoute = deriveCanonicalRoute(filePath, isBlog);
    const metadata = parseFrontmatter(filePath, derivedRoute, isBlog);
    const sourceUrl = metadata.url;
    
    try {
      const content = fs.readFileSync(filePath, 'utf8');
      const { content: markdown } = matter(content);
      // Collect body text for embedding (first read wins; trimmed to 2000 chars)
      if (!contentMap[sourceUrl]) contentMap[sourceUrl] = markdown.trim().slice(0, 2000);
      const extractedLinks = extractLinksFromMarkdown(markdown);
      
      for (const link of extractedLinks) {
        const targetUrl = normalizeInternalLink(link.url);
        
        if (targetUrl && urlToNode.has(targetUrl)) {
          allLinks.push({
            source: sourceUrl,
            target: targetUrl,
          });
        } else if (targetUrl && targetUrl !== sourceUrl) {
          // Record unresolved links for diagnostics
          unresolvedLinks.push({
            source: sourceUrl,
            target: targetUrl,
          });
        }
      }
    } catch (error) {
      console.warn(`Failed to extract links from ${filePath}:`, error.message);
    }
  }
  
  // Build graphology graph
  const graph = new Graph.DirectedGraph();
  for (const node of nodes) {
    graph.addNode(node.id, {
      ...node,
    });
  }
  
  // Aggregate duplicate links (weight = count)
  const edgeWeights = new Map();
  for (const link of allLinks) {
    const key = `${link.source}|${link.target}`;
    edgeWeights.set(key, (edgeWeights.get(key) || 0) + 1);
  }
  
  // Add edges with aggregated weights
  for (const [key, weight] of edgeWeights) {
    const [source, target] = key.split('|');
    graph.addEdge(source, target, { weight });
  }
  
  // Compute degree metrics
  for (const node of nodes) {
    const id = node.id;
    node.degree = graph.degree(id);
    node.inDegree = graph.inDegree(id);
    node.outDegree = graph.outDegree(id);
  }
  
  // Run Louvain with seeded RNG for deterministic communities
  const seedrandom = require('seedrandom');
  const rng = seedrandom('knowledge-graph-v1');
  
  louvain.assign(graph, {
    resolution: 1.0,
    randomWalk: true,
    fastLocalMoves: true,
    rng,
  });
  
  // Extract community assignments
  for (const nodeId of graph.nodes()) {
    const community = graph.getNodeAttribute(nodeId, 'community');
    const nodeObj = nodes.find(n => n.id === nodeId);
    if (nodeObj && community !== undefined) {
      nodeObj.community = community;
    }
  }
  
  // Serialize links — mark explicit so the client can render them differently
  const links = Array.from(edgeWeights.entries()).map(([key, weight]) => {
    const [source, target] = key.split('|');
    return { source, target, weight, kind: 'explicit' };
  });

  // Build and merge semantic edges (skipped gracefully if no API credentials)
  const explicitPairs = new Set(
    links.flatMap(l => [`${l.source}|${l.target}`, `${l.target}|${l.source}`])
  );
  let semanticEdges = [];
  try {
    semanticEdges = await buildSemanticEdges(nodes, contentMap, siteDir, { topK: 8, threshold: 0.68 });
  } catch (err) {
    console.warn('[Knowledge Graph] Semantic edges skipped:', err.message);
  }
  for (const e of semanticEdges) {
    if (!explicitPairs.has(`${e.source}|${e.target}`)) links.push(e);
  }
  
  // Sort for stable output
  nodes.sort((a, b) => a.id.localeCompare(b.id));
  links.sort((a, b) => a.source.localeCompare(b.source) || a.target.localeCompare(b.target));
  
  return {
    nodes,
    links,
    unresolvedLinks: unresolvedLinks.slice(0, 50), // Cap for diagnostics
    stats: {
      nodeCount: nodes.length,
      linkCount: links.filter(l => l.kind === 'explicit').length,
      semanticLinkCount: links.filter(l => l.kind === 'semantic').length,
      unresolvedCount: unresolvedLinks.length,
      communityCount: Math.max(...nodes.map(n => n.community), 0) + 1,
    },
  };
}

const graphBuildCache = new Map();

async function buildGraphCached(siteDir) {
  if (!graphBuildCache.has(siteDir)) {
    graphBuildCache.set(siteDir, buildGraph(siteDir));
  }
  return graphBuildCache.get(siteDir);
}

module.exports = { buildGraph, buildGraphCached, normalizeInternalLink, deriveCanonicalRoute };
