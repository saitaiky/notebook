/**
 * KnowledgeGraphClient - Client-side force-directed graph renderer.
 * Uses react-force-graph-3d (Three.js/WebGL) for an interactive 3D scene.
 */

import React, { useRef, useState, useMemo, useCallback, useEffect } from 'react';
import ForceGraph3D from 'react-force-graph-3d';
import SpriteText from 'three-spritetext';
import { trackEvent } from '@site/src/utils/analytics';
import styles from './styles.module.scss';

interface GraphNode {
  id: string;
  title: string;
  url: string;
  contentType: string;
  section: string;
  subsection: string;
  degree: number;
  inDegree: number;
  outDegree: number;
  community: number;
  x?: number;
  y?: number;
  z?: number;
  isCluster?: boolean;
  pageCount?: number;
}

interface GraphLink {
  source: string | GraphNode;
  target: string | GraphNode;
  weight: number;
  kind?: 'explicit' | 'semantic';
}

interface GraphData {
  nodes: GraphNode[];
  links: GraphLink[];
  stats: {
    nodeCount: number;
    linkCount: number;
    unresolvedCount: number;
    communityCount: number;
  };
}

interface KnowledgeGraphClientProps {
  graphData: GraphData;
  colorMode: 'light' | 'dark';
  height?: string;
}

const COMMUNITY_COLORS = [
  '#0b89d0', '#e74c3c', '#2ecc71', '#f39c12', '#9b59b6',
  '#1abc9c', '#e67e22', '#c0392b', '#16a085', '#8e44ad',
  '#27ae60', '#2980b9', '#d35400', '#7f8c8d', '#f1c40f',
];

// Human-readable labels for section keys (top-level URL segment)
const SECTION_LABELS: Record<string, string> = {
  ai: 'AI',
  aws: 'AWS',
  'container-orchestration': 'Containers',
  crypto: 'Crypto',
  linux: 'Linux',
  other: 'Other',
  'software-development': 'Software Dev',
  blog: 'Blog',
  root: 'Root',
};

// Fixed per-section colors so hue is meaningful (unlike the ~300-way Louvain
// community split, which produced near-random rainbow noise at this node count).
const SECTION_COLORS: Record<string, string> = {
  ai: '#0b89d0',
  aws: '#e67e22',
  'container-orchestration': '#2ecc71',
  crypto: '#9b59b6',
  linux: '#e74c3c',
  other: '#7f8c8d',
  'software-development': '#1abc9c',
  blog: '#f1c40f',
  root: '#8e44ad',
};
const DEFAULT_SECTION_COLOR = '#5a5a5a';

function sectionLabel(section: string): string {
  return SECTION_LABELS[section] ?? section;
}

// Friendly label for a subsection cluster, e.g. 'ai/agentic-system' -> 'AI · Agentic System'
function subsectionLabel(subsection: string, section: string): string {
  if (subsection === section) return sectionLabel(section);
  const rest = subsection.slice(section.length + 1);
  const pretty = rest.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
  return `${sectionLabel(section)} · ${pretty}`;
}

function getSectionColor(section: string): string {
  return SECTION_COLORS[section] ?? DEFAULT_SECTION_COLOR;
}

function KnowledgeGraphClient({ graphData, colorMode, height }: KnowledgeGraphClientProps) {
  const fgRef = useRef<any>(null);
  // Guard: only auto-zoom on first settle per graph instance; drag reheats must not hijack camera.
  const initialFitDone = useRef(false);
  // Last known live x/y/z per node id, keyed by node id (or `cluster:<subsection>` while
  // collapsed) — lets an expand/collapse recompute keep existing nodes pinned in place
  // instead of the whole layout resettling from scratch.
  const positionsRef = useRef<Map<string, { x: number; y: number; z: number }>>(new Map());

  // 'all' shows every node; otherwise filter to a single top-level section
  const [activeSection, setActiveSection] = useState<string>('all');

  // Which subsections are expanded from their collapsed cluster into real pages
  // (only meaningful in the 'all' view — a single-section filter always shows real pages).
  // Defaulting to subsection (one folder level deeper than top-level section) gives a
  // richer initial view than a handful of giant per-section blobs.
  const [expandedGroups, setExpandedGroups] = useState<Set<string>>(() => new Set());

  const nodeById = useMemo(() => {
    const m = new Map<string, GraphNode>();
    graphData.nodes.forEach(n => m.set(n.id, n));
    return m;
  }, [graphData]);

  const sectionCounts = useMemo(() => {
    const counts = new Map<string, number>();
    graphData.nodes.forEach(n => counts.set(n.section, (counts.get(n.section) ?? 0) + 1));
    return counts;
  }, [graphData]);

  const subsectionCounts = useMemo(() => {
    const counts = new Map<string, number>();
    graphData.nodes.forEach(n => counts.set(n.subsection, (counts.get(n.subsection) ?? 0) + 1));
    return counts;
  }, [graphData]);

  const sections = useMemo(
    () => Array.from(sectionCounts.entries()).sort((a, b) => b[1] - a[1]),
    [sectionCounts]
  );

  // Build the graph actually handed to ForceGraph3D:
  // - a single section filter: only that section's real pages + intra-section links
  // - 'all': collapsed sections become one cluster node each; expanded sections show real pages
  const { graphForceData, neighborIds, nodeLinks, neighborNodes } = useMemo(() => {
    let nodes: (GraphNode & { isCluster?: boolean })[];
    let links: GraphLink[];

    if (activeSection !== 'all') {
      const filtered = graphData.nodes.filter(n => n.section === activeSection);
      // Clone and strip position/velocity/fixed state so a node dragged in one
      // view never carries a stale position into another view.
      nodes = filtered.map(({ x, y, z, vx, vy, vz, fx, fy, fz, ...rest }: any) => rest);
      const nodeIds = new Set(nodes.map(n => n.id));
      links = graphData.links
        .filter(l => nodeIds.has(l.source as string) && nodeIds.has(l.target as string))
        .map(l => ({ ...l }));
    } else {
      const resolvedId = (n: GraphNode) =>
        expandedGroups.has(n.subsection) ? n.id : `cluster:${n.subsection}`;

      const nodeMap = new Map<string, GraphNode & { isCluster?: boolean }>();
      graphData.nodes.forEach(n => {
        const id = resolvedId(n);
        if (nodeMap.has(id)) return;
        if (id.startsWith('cluster:')) {
          const count = subsectionCounts.get(n.subsection) ?? 0;
          // Pin the cluster at its last known spot, if any, so collapsing a group
          // back down doesn't fling the resulting cluster node across the scene.
          const known = positionsRef.current.get(id);
          nodeMap.set(id, {
            id,
            title: `${subsectionLabel(n.subsection, n.section)} — ${count} pages`,
            url: '',
            contentType: 'cluster',
            section: n.section,
            subsection: n.subsection,
            degree: 0,
            inDegree: 0,
            outDegree: 0,
            community: 0,
            isCluster: true,
            pageCount: count,
            ...(known ? { x: known.x, y: known.y, z: known.z, fx: known.x, fy: known.y, fz: known.z } : {}),
          });
        } else {
          // Clone + strip position state, same reasoning as the single-section branch above.
          const { x, y, z, vx, vy, vz, fx, fy, fz, ...rest } = n as any;
          // Was this page already individually visible (not just inside a collapsed
          // cluster) before this recompute? Pin it so it doesn't drift when other
          // groups expand/collapse. A freshly revealed page has no id-keyed entry yet —
          // seed it near its cluster's last spot (with jitter) but leave it unpinned
          // so it can spread out naturally via the force simulation.
          const known = positionsRef.current.get(id);
          const clusterSpot = positionsRef.current.get(`cluster:${n.subsection}`);
          const seed = known ?? clusterSpot;
          nodeMap.set(id, {
            ...rest,
            isCluster: false,
            ...(seed ? {
              x: seed.x + (Math.random() - 0.5) * 6,
              y: seed.y + (Math.random() - 0.5) * 6,
              z: seed.z + (Math.random() - 0.5) * 6,
              ...(known ? { fx: known.x, fy: known.y, fz: known.z } : {}),
            } : {}),
          });
        }
      });

      const linkWeights = new Map<string, { weight: number; a: string; b: string; kind: 'explicit' | 'semantic' }>();
      graphData.links.forEach(l => {
        const srcNode = nodeById.get(l.source as string);
        const tgtNode = nodeById.get(l.target as string);
        if (!srcNode || !tgtNode) return;
        const a = resolvedId(srcNode);
        const b = resolvedId(tgtNode);
        if (a === b) return; // internal to a still-collapsed cluster — hidden until expanded
        const key = a < b ? `${a}|${b}` : `${b}|${a}`;
        const prev = linkWeights.get(key);
        linkWeights.set(key, {
          weight: (prev?.weight ?? 0) + (l.weight ?? 1),
          a, b,
          kind: prev?.kind === 'explicit' ? 'explicit' : (l.kind ?? 'explicit'),
        });
      });

      links = Array.from(linkWeights.values()).map(({ a, b, weight, kind }) => ({
        source: a, target: b, weight, kind,
      }));
      nodes = Array.from(nodeMap.values());
    }

    const neighborIds = new Map<string, Set<string>>();
    const nodeLinks = new Map<string, Set<any>>();
    // Also track the node object for each neighbour id so the tooltip can show titles
    const neighborNodes = new Map<string, Map<string, GraphNode>>();
    const nodesById = new Map(nodes.map(n => [n.id, n]));
    nodes.forEach(n => {
      neighborIds.set(n.id, new Set());
      nodeLinks.set(n.id, new Set());
      neighborNodes.set(n.id, new Map());
    });
    links.forEach(link => {
      const src = link.source as string;
      const tgt = link.target as string;
      const srcNode = nodesById.get(src);
      const tgtNode = nodesById.get(tgt);
      neighborIds.get(src)?.add(tgt);
      neighborIds.get(tgt)?.add(src);
      nodeLinks.get(src)?.add(link);
      nodeLinks.get(tgt)?.add(link);
      if (tgtNode) neighborNodes.get(src)?.set(tgt, tgtNode);
      if (srcNode) neighborNodes.get(tgt)?.set(src, srcNode);
    });
    return { graphForceData: { nodes, links }, neighborIds, nodeLinks, neighborNodes };
  }, [graphData, activeSection, expandedGroups, sectionCounts, subsectionCounts, nodeById]);

  // Continuously mirror every currently-rendered node's live x/y/z into positionsRef so the
  // NEXT expand/collapse recompute (above) can seed/pin nodes at their last real position.
  useEffect(() => {
    let frameId: number;
    const sync = () => {
      graphForceData.nodes.forEach((n: any) => {
        if (typeof n.x === 'number') positionsRef.current.set(n.id, { x: n.x, y: n.y, z: n.z });
      });
      frameId = requestAnimationFrame(sync);
    };
    frameId = requestAnimationFrame(sync);
    return () => cancelAnimationFrame(frameId);
  }, [graphForceData]);

  const [highlightNodes, setHighlightNodes] = useState(() => new Set<string>());
  const [highlightLinks, setHighlightLinks] = useState(() => new Set<any>());
  const [hoverNode, setHoverNode] = useState<GraphNode | null>(null);

  const isDark = colorMode === 'dark';

  // Clear stale highlight state whenever the section changes, and collapse
  // all clusters back to their default (fully collapsed) state.
  useEffect(() => {
    setHoverNode(null);
    setHighlightNodes(new Set());
    setHighlightLinks(new Set());
    setExpandedGroups(new Set());
    initialFitDone.current = false; // new graph context — allow one auto-zoom on next settle
  }, [activeSection]);

  const handleNodeHover = useCallback((node: any) => {
    const hn = new Set<string>();
    const hl = new Set<any>();
    if (node) {
      hn.add(node.id);
      neighborIds.get(node.id)?.forEach(id => hn.add(id));
      nodeLinks.get(node.id)?.forEach(link => hl.add(link));
    }
    setHoverNode(node ?? null);
    setHighlightNodes(hn);
    setHighlightLinks(hl);
  }, [neighborIds, nodeLinks]);

  const handleLinkHover = useCallback((link: any) => {
    const hn = new Set<string>();
    const hl = new Set<any>();
    if (link) {
      hl.add(link);
      const src = typeof link.source === 'object' ? link.source.id : link.source;
      const tgt = typeof link.target === 'object' ? link.target.id : link.target;
      hn.add(src);
      hn.add(tgt);
    }
    setHoverNode(null);
    setHighlightNodes(hn);
    setHighlightLinks(hl);
  }, []);

  // isDark declared above with state variables so effects can use it
  const bgColor = colorMode === 'dark' ? '#0b0b0d' : '#f5f6f7';

  // Extend the default sphere with a text sprite for hovered/highlighted nodes,
  // and always for cluster nodes (their label is the section name, not optional).
  const nodeThreeObject = useCallback((node: any) => {
    const isHovered = hoverNode?.id === node.id;
    const isHighlighted = highlightNodes.has(node.id);
    const isCluster = !!node.isCluster;
    if (!isHovered && !isHighlighted && !isCluster) return null;

    const raw = node.title ?? node.id ?? '';
    const trimmed = raw.length > 28 ? raw.substring(0, 28) + '…' : raw;
    const label = isCluster ? `${trimmed}  ▸` : trimmed; // ▸ hints the bubble is expandable
    const sprite = new SpriteText(label);
    sprite.color = isHovered ? '#ff7744' : (isDark ? '#f0f0f0' : '#1a1a1a');
    sprite.textHeight = isHovered ? 3.2 : isCluster ? 2.8 : 2.4;
    sprite.backgroundColor = isDark ? 'rgba(15,15,18,0.85)' : 'rgba(255,255,255,0.85)';
    sprite.padding = 1.5;
    sprite.borderRadius = 2;
    (sprite as any).center.y = -0.9; // position above the node sphere — untyped in three-spritetext's .d.ts
    return sprite;
  }, [hoverNode, highlightNodes, isDark]);

  return (
    <div
      className={styles.graphCanvas}
      style={height ? ({ '--graph-height': height } as React.CSSProperties) : undefined}
    >
      <div className={styles.sectionToolbar}>
        <button
          className={activeSection === 'all' ? styles.sectionButtonActive : styles.sectionButton}
          onClick={() => setActiveSection('all')}
        >
          All ({graphData.nodes.length})
        </button>
        {sections.map(([section, count]) => (
          <button
            key={section}
            className={activeSection === section ? styles.sectionButtonActive : styles.sectionButton}
            onClick={() => setActiveSection(section)}
          >
            <span className={styles.legendDot} style={{ background: getSectionColor(section) }} />
            {sectionLabel(section)} ({count})
          </button>
        ))}
        <button
          className={styles.sectionButton}
          style={{ marginLeft: 'auto' }}
          onClick={() => fgRef.current?.zoomToFit(600, 60)}
          title="Recenter camera without resetting node positions"
        >
          ⤢ Fit view
        </button>
      </div>
      <div className={styles.legend}>
        <span className={styles.legendItem}>
          <span className={styles.legendDot} style={{ background: DEFAULT_SECTION_COLOR }} />
          Cluster ▸ click to expand
        </span>
        <span className={styles.legendItem}>
          <span className={styles.legendLine} style={{ background: isDark ? 'rgba(150,158,175,0.9)' : 'rgba(80,86,100,0.9)' }} />
          Linked page (→ direction)
        </span>
        <span className={styles.legendItem}>
          <span className={styles.legendLine} style={{ background: isDark ? 'rgba(45,212,212,0.9)' : 'rgba(15,140,140,0.9)' }} />
          Similar content (AI)
        </span>
      </div>
      {activeSection === 'all' && expandedGroups.size > 0 && (
        <div className={styles.expandedChips}>
          <span className={styles.infoLabel}>Expanded:</span>
          {Array.from(expandedGroups).map(s => (
            <button
              key={s}
              className={styles.chip}
              onClick={() => {
                setExpandedGroups(prev => {
                  const next = new Set(prev);
                  next.delete(s);
                  return next;
                });
              }}
              title={`Collapse back into a cluster`}
            >
              {s} ✕
            </button>
          ))}
        </div>
      )}

      <ForceGraph3D
        ref={fgRef}
        graphData={graphForceData}
        backgroundColor={bgColor}

        nodeRelSize={4}
        nodeVal={node => {
          const n = node as GraphNode;
          if (n.isCluster) return Math.max(4, Math.sqrt(n.pageCount ?? 1) * 1.5);
          return Math.max(1, Math.sqrt(n.degree ?? 1));
        }}
        nodeColor={node => {
          const n = node as GraphNode;
          if (hoverNode?.id === n.id) return '#ff5555';
          if (highlightNodes.has(n.id)) return getSectionColor(n.section);
          return highlightNodes.size > 0
            ? (isDark ? '#2a2a2e' : '#d8d8d8')
            : getSectionColor(n.section);
        }}
        nodeOpacity={0.9}
        nodeResolution={12}
        nodeThreeObject={nodeThreeObject}
        nodeThreeObjectExtend={true}

        linkColor={link => {
          const l = link as GraphLink;
          if (highlightLinks.has(link)) return 'rgba(255,140,80,0.95)';
          if (l.kind === 'semantic') return isDark ? 'rgba(45,212,212,0.85)' : 'rgba(15,140,140,0.85)';
          return isDark ? 'rgba(150,158,175,0.6)' : 'rgba(80,86,100,0.55)';
        }}
        linkWidth={link => {
          if (highlightLinks.has(link)) return 2.6;
          return (link as GraphLink).kind === 'semantic' ? 1.1 : 0.6;
        }}
        linkOpacity={1}
        linkDirectionalArrowLength={link => {
          // Arrows only while hovered, and only on explicit links (semantic similarity has no direction).
          const l = link as GraphLink;
          if (l.kind === 'semantic') return 0;
          return highlightLinks.has(link) ? 3.5 : 0;
        }}
        linkDirectionalArrowRelPos={0.92}
        linkDirectionalArrowColor={() => 'rgba(255,140,80,0.95)'}

        showNavInfo={false}

        onNodeHover={handleNodeHover}
        onLinkHover={handleLinkHover}
        onNodeClick={node => {
          const n = node as GraphNode;
          if (n.isCluster) {
            const sub = n.subsection;
            trackEvent('graph_expand', {
              graph_section: n.section,
              graph_subsection: sub,
            });
            // Expanding a cluster should own camera control; block fallback full-graph auto-fit.
            initialFitDone.current = true;
            setExpandedGroups(prev => new Set(prev).add(sub));
            // Fly the camera to frame just the pages we revealed, so the user
            // isn't lost among the many other clusters after expanding.
            setTimeout(() => {
              fgRef.current?.zoomToFit(900, 90, (nd: any) => nd.subsection === sub && !nd.isCluster);
            }, 1300);
            return;
          }
          trackEvent('select_content', {
            item_id: n.url,
            source_component: 'knowledge_graph',
            target_section: n.section,
          });
          window.location.href = n.url;
        }}
        onNodeDragEnd={node => {
          // Freeze the node at its dropped position instead of springing back
          const n = node as GraphNode & { x: number; y: number; z: number; fx?: number; fy?: number; fz?: number };
          if (n.isCluster) return;
          n.fx = n.x;
          n.fy = n.y;
          n.fz = n.z;
        }}

        warmupTicks={60}
        cooldownTime={5000}
        onEngineStop={() => {
          // Only run the startup fit when nothing is expanded; otherwise it causes
          // a delayed zoom-out right after the cluster-specific zoom-in.
          if (!initialFitDone.current && expandedGroups.size === 0) {
            initialFitDone.current = true;
            fgRef.current?.zoomToFit(500, 60);
          }
        }}
      />

      {hoverNode && (() => {
        const related = Array.from(neighborNodes.get(hoverNode.id)?.values() ?? []);
        const explicit = related.filter(n => {
          const link = Array.from(nodeLinks.get(hoverNode.id) ?? []).find(l => {
            const s = typeof l.source === 'object' ? (l.source as GraphNode).id : l.source;
            const t = typeof l.target === 'object' ? (l.target as GraphNode).id : l.target;
            return s === n.id || t === n.id;
          });
          return !link || link.kind !== 'semantic';
        });
        const semantic = related.filter(n => !explicit.includes(n));
        return (
          <div className={styles.nodeTooltip}>
            <div className={styles.nodeTitle}>{hoverNode.title || hoverNode.id}</div>
            <div className={styles.nodeInfo}>
              <span className={styles.infoLabel}>Section:</span> {hoverNode.section || hoverNode.contentType}
            </div>
            {explicit.length > 0 && (
              <div className={styles.nodeRelated}>
                <span className={styles.infoLabel}>Linked to:</span>
                {explicit.slice(0, 5).map(n => (
                  n.isCluster
                    ? <span key={n.id} className={styles.relatedLink}>{n.title}</span>
                    : <a key={n.id} href={n.url} className={styles.relatedLink}>{n.title || n.id}</a>
                ))}
              </div>
            )}
            {semantic.length > 0 && (
              <div className={styles.nodeRelated}>
                <span className={styles.infoLabel} style={{ color: isDark ? '#5abfbf' : '#0d7070' }}>Similar:</span>
                {semantic.slice(0, 5).map(n => (
                  n.isCluster
                    ? <span key={n.id} className={styles.relatedLink}>{n.title}</span>
                    : <a key={n.id} href={n.url} className={styles.relatedLink}>{n.title || n.id}</a>
                ))}
              </div>
            )}
          </div>
        );
      })()}
    </div>
  );
}

export default KnowledgeGraphClient;
