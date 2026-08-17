/**
 * KnowledgeGraph - Main wrapper component for the homepage knowledge graph.
 * Handles SSR safety by wrapping the canvas renderer in BrowserOnly.
 * Receives graph data from the custom blog plugin via route modules.
 */

import React from 'react';
import { useColorMode } from '@docusaurus/theme-common';
import BrowserOnly from '@docusaurus/BrowserOnly';
import KnowledgeGraphClient from './KnowledgeGraphClient';
import styles from './styles.module.scss';

interface GraphData {
  nodes: Array<{
    id: string;
    title: string;
    url: string;
    contentType: string;
    section: string;
    degree: number;
    inDegree: number;
    outDegree: number;
    community: number;
  }>;
  links: Array<{
    source: string;
    target: string;
    weight: number;
  }>;
  stats: {
    nodeCount: number;
    linkCount: number;
    unresolvedCount: number;
    communityCount: number;
  };
}

interface KnowledgeGraphProps {
  /**
   * Graph data loaded from the plugin (home-page-knowledge-graph.json).
   * Should be a stringified JSON object or require/import result.
   */
  graphData?: GraphData | string;
  /**
   * Optional canvas height override (any CSS length, e.g. '40vh' or '480px') so this
   * component can be reused at a smaller size elsewhere (e.g. a per-page related-pages
   * widget) without touching the homepage's default full-hero height.
   */
  height?: string;
}

/**
 * Main KnowledgeGraph component.
 * Renders a force-directed graph of page links on the homepage.
 */
function KnowledgeGraph({ graphData, height }: KnowledgeGraphProps) {
  const { colorMode } = useColorMode();

  // Parse graph data if it's a string
  let parsedData: GraphData | null = null;
  if (typeof graphData === 'string') {
    try {
      parsedData = JSON.parse(graphData);
    } catch (error) {
      console.error('[KnowledgeGraph] Failed to parse graph data:', error);
    }
  } else if (graphData) {
    parsedData = graphData;
  }

  if (!parsedData || !parsedData.nodes.length) {
    return null;
  }

  return (
    <div className={styles.knowledgeGraphContainer}>
      <BrowserOnly fallback={<div className={styles.graphFallback}>Loading knowledge graph...</div>}>
        {() => (
          <KnowledgeGraphClient 
            graphData={parsedData}
            colorMode={colorMode}
            height={height}
          />
        )}
      </BrowserOnly>
    </div>
  );
}

export default KnowledgeGraph;
