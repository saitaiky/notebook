import React from 'react';
import Link from '@docusaurus/Link';
import { usePluginData } from '@docusaurus/useGlobalData';
import { useLocation } from '@docusaurus/router';
import styles from './styles.module.scss';

type RelatedItem = {
  url: string;
  title: string;
  section: string;
  kind: 'explicit' | 'semantic' | string;
};

type PluginData = {
  relatedByUrl?: Record<string, RelatedItem[]>;
};

function normalizePathname(pathname: string): string {
  if (!pathname || pathname === '/') return '/';
  const withLeading = pathname.startsWith('/') ? pathname : `/${pathname}`;
  return withLeading.endsWith('/') ? withLeading : `${withLeading}/`;
}

export default function RelatedContent(): JSX.Element | null {
  const { pathname } = useLocation();
  const pluginData = usePluginData('related-content-plugin') as PluginData | undefined;
  const relatedByUrl = pluginData?.relatedByUrl || {};
  const currentPath = normalizePathname(pathname);
  const relatedItems = relatedByUrl[currentPath] || [];

  if (!relatedItems.length) {
    return null;
  }

  return (
    <div className={styles.relatedBlock}>
      <h3 className={styles.title}>Related</h3>
      <ul className={styles.relatedList}>
        {relatedItems.map((item) => (
          <li key={item.url} className={styles.relatedItem}>
            <Link to={item.url} className={styles.relatedLink}>
              {item.title}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
