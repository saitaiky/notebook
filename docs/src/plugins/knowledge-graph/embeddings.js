'use strict';

const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

// Minimal .env.local reader — avoids adding dotenv as a dependency.
function loadEnvLocal(siteDir) {
  const file = path.join(siteDir, '.env.local');
  if (!fs.existsSync(file)) return;
  for (const line of fs.readFileSync(file, 'utf8').split('\n')) {
    const m = line.trim().match(/^([A-Z][A-Z0-9_]*)=(.*)$/);
    if (!m || process.env[m[1]] !== undefined) continue;
    let val = m[2];
    if (/^["'].*["']$/.test(val)) val = val.slice(1, -1);
    process.env[m[1]] = val;
  }
}

function hashText(text) {
  return crypto.createHash('sha256').update(text, 'utf8').digest('hex');
}

// Normalize Float32Array in place; returns it.
function normalize(v) {
  let mag = 0;
  for (let i = 0; i < v.length; i++) mag += v[i] * v[i];
  mag = Math.sqrt(mag) || 1;
  for (let i = 0; i < v.length; i++) v[i] /= mag;
  return v;
}

// Dot product = cosine similarity when both vectors are normalized.
function dot(a, b) {
  let s = 0;
  for (let i = 0; i < a.length; i++) s += a[i] * b[i];
  return s;
}

function loadCache(cacheFile) {
  if (!fs.existsSync(cacheFile)) return {};
  try { return JSON.parse(fs.readFileSync(cacheFile, 'utf8')); } catch { return {}; }
}

function saveCache(cacheFile, cache) {
  try { fs.writeFileSync(cacheFile, JSON.stringify(cache)); } catch {}
}

async function fetchBatch(texts, endpoint, apiKey, model) {
  const url = endpoint.endsWith('/embeddings')
    ? endpoint
    : `${endpoint.replace(/\/$/, '')}/v1/embeddings`;

  const res = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${apiKey}`,
    },
    body: JSON.stringify({ model, input: texts }),
  });

  if (!res.ok) {
    const msg = await res.text().catch(() => '');
    throw new Error(`HTTP ${res.status} from ${url}: ${msg.slice(0, 300)}`);
  }

  const json = await res.json();
  // OpenAI response: { data: [{ embedding: [...], index: N }] }
  return json.data
    .sort((a, b) => a.index - b.index)
    .map(d => d.embedding);
}

/**
 * Build semantic similarity edges from page embeddings.
 *
 * @param {object[]} nodes - graph node objects with id, title
 * @param {Record<string, string>} contentMap - url → body text
 * @param {string} siteDir - Docusaurus root (where .env.local and cache file live)
 * @param {{ topK?: number, threshold?: number }} options
 * @returns {Promise<{source, target, weight, kind: 'semantic'}[]>}
 */
async function buildSemanticEdges(nodes, contentMap, siteDir, { topK = 5, threshold = 0.72 } = {}) {
  loadEnvLocal(siteDir);

  const endpoint = process.env.EMBEDDING_ENDPOINT;
  const apiKey   = process.env.EMBEDDING_API_KEY;
  const model    = process.env.EMBEDDING_MODEL || 'text-embedding-3-large';

  if (!endpoint || !apiKey) {
    console.warn('[Knowledge Graph] Skipping semantic edges — EMBEDDING_ENDPOINT or EMBEDDING_API_KEY not set');
    return [];
  }

  const cacheFile = path.join(siteDir, '.embedding-cache.json');
  const cache = loadCache(cacheFile);

  // Build one text snippet per node: title + first ~1800 chars of body
  const items = nodes.map(n => ({
    id: n.id,
    text: `${n.title || ''}\n${(contentMap[n.id] || '').slice(0, 1800)}`.trim(),
  }));

  // Split into cached vs. needs-fetch
  const vectors = new Array(items.length).fill(null);
  const toFetch = [];
  for (let i = 0; i < items.length; i++) {
    const h = hashText(items[i].text);
    if (cache[h]) {
      vectors[i] = cache[h];
    } else {
      toFetch.push({ i, h, text: items[i].text });
    }
  }

  if (toFetch.length > 0) {
    console.log(`[Knowledge Graph] Fetching embeddings: ${toFetch.length} new, ${items.length - toFetch.length} cached`);
    const BATCH = 20;
    for (let b = 0; b < toFetch.length; b += BATCH) {
      const batch = toFetch.slice(b, b + BATCH);
      try {
        const vecs = await fetchBatch(batch.map(x => x.text), endpoint, apiKey, model);
        for (let j = 0; j < batch.length; j++) {
          vectors[batch[j].i] = vecs[j];
          cache[batch[j].h] = vecs[j];
        }
        console.log(`[Knowledge Graph]   embedded ${Math.min(b + BATCH, toFetch.length)}/${toFetch.length}`);
      } catch (err) {
        console.warn(`[Knowledge Graph] Embedding batch ${b}–${Math.min(b + BATCH, toFetch.length)} failed: ${err.message}`);
      }
    }
    saveCache(cacheFile, cache);
  } else {
    console.log(`[Knowledge Graph] All ${items.length} embeddings served from cache`);
  }

  // Normalize to unit vectors so dot product == cosine similarity
  const norm = vectors.map(v => {
    if (!v || v.length === 0) return null;
    return normalize(Float32Array.from(v));
  });

  // For each node, find top-K most similar nodes above the threshold.
  // Uses a sorted insert to avoid sorting all n-1 candidates for large n.
  const edges = [];
  // Deduplicate undirected pairs so A–B and B–A aren't both emitted.
  const seen = new Set();

  for (let i = 0; i < nodes.length; i++) {
    if (!norm[i]) continue;

    const sims = [];
    for (let j = 0; j < nodes.length; j++) {
      if (i === j || !norm[j]) continue;
      const sim = dot(norm[i], norm[j]);
      if (sim >= threshold) sims.push({ j, sim });
    }
    sims.sort((a, b) => b.sim - a.sim);

    for (const { j, sim } of sims.slice(0, topK)) {
      const lo = Math.min(i, j), hi = Math.max(i, j);
      const key = `${lo}-${hi}`;
      if (!seen.has(key)) {
        seen.add(key);
        edges.push({
          source: nodes[i].id,
          target: nodes[j].id,
          weight: Math.round(sim * 1000) / 1000,
          kind: 'semantic',
        });
      }
    }
  }

  console.log(`[Knowledge Graph] Generated ${edges.length} semantic similarity edges (topK=${topK}, threshold=${threshold})`);
  return edges;
}

module.exports = { buildSemanticEdges };
