const fs = require('fs');
const path = require('path');
const { execFileSync } = require('child_process');

function parseFrontMatter(fileContent) {
  const match = fileContent.match(/^---\n([\s\S]*?)\n---/);

  if (!match) {
    return {};
  }

  const frontMatter = match[1];
  const titleMatch = frontMatter.match(/^title:\s*(?:"([^"]+)"|'([^']+)'|(.+))$/m);
  const slugMatch = frontMatter.match(/^slug:\s*(?:"([^"]+)"|'([^']+)'|(.+))$/m);

  return {
    title: titleMatch ? (titleMatch[1] || titleMatch[2] || titleMatch[3] || '').trim() : undefined,
    slug: slugMatch ? (slugMatch[1] || slugMatch[2] || slugMatch[3] || '').trim() : undefined,
  };
}

function prettifySegment(segment) {
  const knownLabels = {
    ai: 'AI',
    aws: 'AWS',
    dl: 'DL',
    llm: 'LLM',
    ml: 'ML',
    api: 'API',
    cpu: 'CPU',
    uid: 'UID',
    gid: 'GID',
    csp: 'CSP',
  };

  if (knownLabels[segment]) {
    return knownLabels[segment];
  }

  return segment
    .split('-')
    .map((part) => knownLabels[part] || (part ? part[0].toUpperCase() + part.slice(1) : part))
    .join(' ');
}

function inferTitleFromPath(relativePath) {
  const normalizedPath = relativePath.replace(/\\/g, '/');
  const withoutExtension = normalizedPath.replace(/\.(md|mdx)$/i, '');
  const segments = withoutExtension.split('/');
  const fileName = segments[segments.length - 1];

  if (fileName === 'index' && segments.length > 1) {
    return prettifySegment(segments[segments.length - 2]);
  }

  return prettifySegment(fileName);
}

function normalizePermalinkFromSlug(slug) {
  if (!slug) {
    return undefined;
  }

  const cleanedSlug = slug.trim().replace(/^['"]|['"]$/g, '');

  if (!cleanedSlug) {
    return undefined;
  }

  if (cleanedSlug === '/') {
    return '/';
  }

  return cleanedSlug.startsWith('/') ? cleanedSlug : `/${cleanedSlug}`;
}

function inferPermalink(relativePath, slug) {
  const fromSlug = normalizePermalinkFromSlug(slug);

  if (fromSlug) {
    return fromSlug;
  }

  const normalizedPath = relativePath.replace(/\\/g, '/');
  const withoutExtension = normalizedPath.replace(/\.(md|mdx)$/i, '');
  const withoutIndex = withoutExtension.endsWith('/index')
    ? withoutExtension.slice(0, -'/index'.length)
    : withoutExtension === 'index'
      ? ''
      : withoutExtension;

  return withoutIndex ? `/${withoutIndex}` : '/';
}

function inferSection(relativePath) {
  const normalizedPath = relativePath.replace(/\\/g, '/');
  const segments = normalizedPath.split('/').slice(0, -1);

  if (segments.length === 0) {
    return 'Docs';
  }

  return segments.slice(0, 2).map(prettifySegment).join(' / ');
}

function readGitHistory(siteDir) {
  try {
    return execFileSync(
      'git',
      ['log', '--date=iso-strict', '--name-only', '--pretty=format:__COMMIT__%n%aI|||%s', '--', 'docs'],
      {
        cwd: siteDir,
        encoding: 'utf8',
      },
    );
  } catch (error) {
    console.warn('[recent-updates-plugin] Unable to read git history for docs updates.', error.message);
    return '';
  }
}

function collectRecentUpdates(siteDir, limit) {
  const gitLogOutput = readGitHistory(siteDir);

  if (!gitLogOutput) {
    return [];
  }

  const seenFiles = new Set();
  const updates = [];
  let currentCommit = null;

  for (const rawLine of gitLogOutput.split(/\r?\n/)) {
    const line = rawLine.trim();

    if (!line) {
      continue;
    }

    if (line === '__COMMIT__') {
      currentCommit = null;
      continue;
    }

    if (!currentCommit && line.includes('|||')) {
      const [date, ...messageParts] = line.split('|||');
      currentCommit = {
        date,
        message: messageParts.join('|||').trim(),
      };
      continue;
    }

    if (!currentCommit || !/\.mdx?$/i.test(line) || !line.startsWith('docs/')) {
      continue;
    }

    if (seenFiles.has(line)) {
      continue;
    }

    seenFiles.add(line);

    const absolutePath = path.join(siteDir, line);
    if (!fs.existsSync(absolutePath)) {
      continue;
    }

    const relativePath = line.replace(/^docs\//, '');
    const fileContent = fs.readFileSync(absolutePath, 'utf8');
    const { title, slug } = parseFrontMatter(fileContent);
    const lastModifiedTimestamp = Date.parse(currentCommit.date);

    if (Number.isNaN(lastModifiedTimestamp)) {
      continue;
    }

    updates.push({
      title: title || inferTitleFromPath(relativePath),
      permalink: inferPermalink(relativePath, slug),
      section: inferSection(relativePath),
      lastModified: currentCommit.date,
      lastModifiedTimestamp,
      commitMessage: currentCommit.message,
      sourceFilePath: line,
    });
  }

  return updates
    .sort((left, right) => right.lastModifiedTimestamp - left.lastModifiedTimestamp)
    .slice(0, limit);
}

module.exports = function recentUpdatesPlugin(context, options = {}) {
  return {
    name: 'recent-updates-plugin',

    async loadContent() {
      const limit = options.limit || 15;
      return collectRecentUpdates(context.siteDir, limit);
    },

    async contentLoaded({ content, actions }) {
      actions.setGlobalData({
        title: options.title || 'Recent Updates',
        totalUpdates: content.length,
        updates: content,
      });
    },
  };
};