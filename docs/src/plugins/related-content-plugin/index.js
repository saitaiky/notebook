const { buildGraphCached } = require('../knowledge-graph/buildGraph');

function asNumber(value, fallback) {
  return Number.isFinite(value) ? value : fallback;
}

function relationRank(kind) {
  return kind === 'explicit' ? 2 : 1;
}

function normalizePathname(pathname) {
  if (!pathname || pathname === '/') return '/';
  const withLeading = pathname.startsWith('/') ? pathname : `/${pathname}`;
  return withLeading.endsWith('/') ? withLeading : `${withLeading}/`;
}

function buildRelatedIndex(graphData, maxItems) {
  const nodes = graphData?.nodes || [];
  const links = graphData?.links || [];
  const nodeById = new Map(nodes.map((node) => [node.id, node]));
  const relatedByUrl = {};

  function addRelation(from, to, kind, score) {
    if (!from || !to || from === to || !nodeById.has(to)) return;
    if (!relatedByUrl[from]) relatedByUrl[from] = new Map();

    const existing = relatedByUrl[from].get(to);
    const incoming = {
      url: to,
      title: nodeById.get(to).title || to,
      section: nodeById.get(to).section || 'other',
      kind,
      score,
    };

    if (!existing) {
      relatedByUrl[from].set(to, incoming);
      return;
    }

    const existingRank = relationRank(existing.kind);
    const incomingRank = relationRank(incoming.kind);
    if (incomingRank > existingRank || (incomingRank === existingRank && incoming.score > existing.score)) {
      relatedByUrl[from].set(to, incoming);
    }
  }

  for (const link of links) {
    const source = normalizePathname(link.source);
    const target = normalizePathname(link.target);
    const kind = link.kind || 'explicit';
    const score = asNumber(link.weight, 1);

    // Skip semantic edges to avoid broken links pointing to non-routable nodes.
    // Use only explicit links entered manually in markdown.
    if (kind === 'semantic') continue;

    addRelation(source, target, kind, score);
    addRelation(target, source, kind, score);
  }

  const finalized = {};
  for (const [url, relationMap] of Object.entries(relatedByUrl)) {
    finalized[url] = Array.from(relationMap.values())
      .sort((a, b) => {
        const rankDiff = relationRank(b.kind) - relationRank(a.kind);
        if (rankDiff !== 0) return rankDiff;
        if (b.score !== a.score) return b.score - a.score;
        return a.title.localeCompare(b.title);
      })
      .slice(0, maxItems)
      .map(({ score, ...rest }) => rest);
  }

  return finalized;
}

module.exports = function relatedContentPlugin(context, options = {}) {
  const { siteDir } = context;
  const maxItems = Number(options.maxItems) > 0 ? Number(options.maxItems) : 8;

  return {
    name: 'related-content-plugin',
    async contentLoaded({ actions }) {
      try {
        const graphData = await buildGraphCached(siteDir);
        const relatedByUrl = buildRelatedIndex(graphData, maxItems);
        actions.setGlobalData({ relatedByUrl, maxItems });
      } catch (error) {
        console.error('[Related Content] Failed to build related index:', error.message);
        actions.setGlobalData({ relatedByUrl: {}, maxItems });
      }
    },
  };
};
