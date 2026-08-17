/**
 * Tests for buildGraph utilities.
 * Run with: node --test src/plugins/knowledge-graph/buildGraph.test.js
 */

const test = require('node:test');
const assert = require('node:assert');
const { 
  normalizeInternalLink, 
  deriveCanonicalRoute 
} = require('./buildGraph');

test('normalizeInternalLink - removes trailing hash and query', () => {
  assert.strictEqual(
    normalizeInternalLink('/ai/llm/rag#section'),
    '/ai/llm/rag/'
  );
  assert.strictEqual(
    normalizeInternalLink('/ai/llm?tab=overview'),
    '/ai/llm/'
  );
  assert.strictEqual(
    normalizeInternalLink('/ai/llm#top?foo=bar'),
    '/ai/llm/'
  );
});

test('normalizeInternalLink - ensures trailing slash', () => {
  assert.strictEqual(
    normalizeInternalLink('/ai/llm'),
    '/ai/llm/'
  );
  assert.strictEqual(
    normalizeInternalLink('/blog/2024/08/04/auth-bridging'),
    '/blog/2024/08/04/auth-bridging/'
  );
});

test('normalizeInternalLink - preserves root slash', () => {
  assert.strictEqual(
    normalizeInternalLink('/'),
    '/'
  );
});

test('deriveCanonicalRoute - docs index files', () => {
  assert.strictEqual(
    deriveCanonicalRoute('docs/ai/index.md', false),
    '/ai/'
  );
  assert.strictEqual(
    deriveCanonicalRoute('docs/index.md', false),
    '/'
  );
  assert.strictEqual(
    deriveCanonicalRoute('docs/aws/ai/index.md', false),
    '/aws/ai/'
  );
});

test('deriveCanonicalRoute - nested docs', () => {
  assert.strictEqual(
    deriveCanonicalRoute('docs/ai/llm/rag.md', false),
    '/ai/llm/rag/'
  );
  assert.strictEqual(
    deriveCanonicalRoute('docs/software-development/system-design/data/cache.md', false),
    '/software-development/system-design/data/cache/'
  );
});

test('deriveCanonicalRoute - blog with date prefix', () => {
  assert.strictEqual(
    deriveCanonicalRoute('blog/2024-08-04-auth-bridging-agents.md', true),
    '/blog/2024/08/04/auth-bridging-agents/'
  );
  assert.strictEqual(
    deriveCanonicalRoute('blog/2026-01-15-new-features.mdx', true),
    '/blog/2026/01/15/new-features/'
  );
});

test('deriveCanonicalRoute - blog fallback for irregular naming', () => {
  assert.strictEqual(
    deriveCanonicalRoute('blog/my-post.md', true),
    '/blog/my-post/'
  );
});

test('deriveCanonicalRoute - handles Windows path separators', () => {
  // Simulate Windows path (though unlikely in real usage on macOS)
  const windowsPath = 'docs\\ai\\llm\\rag.md';
  const result = deriveCanonicalRoute(windowsPath, false);
  assert.strictEqual(result, '/ai/llm/rag/');
});

test('normalizeInternalLink - empty/root handling', () => {
  assert.strictEqual(normalizeInternalLink(''), '/');
  assert.strictEqual(normalizeInternalLink('/'), '/');
});

console.log('All tests passed!');
