import type { ClientModule } from '@docusaurus/types';
import { getContentGroup, sanitizeSearchTerm, trackEvent, trackVirtualPageView } from '@site/src/utils/analytics';

const ENGAGED_READING_TIME_MS = 30_000;
const SEARCH_DEBOUNCE_MS = 800;

let readingCleanup: (() => void) | undefined;
let searchTimeout: number | undefined;
let lastSearchTerm = '';
let listenersRegistered = false;

function inferLinkSource(anchor: HTMLAnchorElement): string {
  const explicitSource = anchor.closest<HTMLElement>('[data-analytics-source]')?.dataset.analyticsSource;
  if (explicitSource) return explicitSource;
  if (anchor.closest('.DocSearch-Container')) return 'search';
  if (anchor.closest('.theme-doc-sidebar-container')) return 'sidebar';
  if (anchor.closest('.table-of-contents')) return 'table_of_contents';
  if (anchor.closest('.pagination-nav')) return 'pagination';
  if (anchor.closest('.navbar')) return 'navbar';
  if (anchor.closest('article')) return 'body';
  return 'other';
}

function getCodeLanguage(button: HTMLButtonElement): string {
  const codeElement = button.closest('.theme-code-block')?.querySelector<HTMLElement>('code[class*="language-"]');
  const languageClass = Array.from(codeElement?.classList || []).find(value => value.startsWith('language-'));
  return languageClass?.replace('language-', '') || 'unknown';
}

function handleDocumentClick(event: MouseEvent): void {
  const target = event.target;
  if (!(target instanceof Element)) return;

  const button = target.closest<HTMLButtonElement>('button');
  if (button?.closest('.theme-code-block')) {
    const label = `${button.title} ${button.getAttribute('aria-label') || ''}`;
    if (/copy/i.test(label)) {
      trackEvent('code_copy', { code_language: getCodeLanguage(button) });
      return;
    }
  }

  const anchor = target.closest<HTMLAnchorElement>('a[href]');
  if (!anchor || anchor.dataset.analyticsIgnore === 'true') return;

  let destination: URL;
  try {
    destination = new URL(anchor.href, window.location.href);
  } catch {
    return;
  }

  if (destination.origin !== window.location.origin) return;

  const sourceComponent = inferLinkSource(anchor);
  const parameters = {
    item_id: `${destination.pathname}${destination.hash}`,
    source_component: sourceComponent,
    target_section: getContentGroup(destination.pathname),
  };

  if (sourceComponent === 'search') {
    trackEvent('search_result_select', parameters);
    return;
  }

  trackEvent('select_content', parameters);
}

function handleSearchInput(event: Event): void {
  const target = event.target;
  if (!(target instanceof HTMLInputElement)) return;
  if (!target.classList.contains('DocSearch-Input')) return;

  if (searchTimeout) window.clearTimeout(searchTimeout);
  searchTimeout = window.setTimeout(() => {
    const query = target.value.trim();
    if (query.length < 2 || query === lastSearchTerm) return;

    lastSearchTerm = query;
    const sanitized = sanitizeSearchTerm(query);
    const hasNoResults = Boolean(document.querySelector('.DocSearch-NoResults, .DocSearch-Help'));

    trackEvent('view_search_results', {
      ...sanitized,
      result_state: hasNoResults ? 'no_results' : 'results',
    });
  }, SEARCH_DEBOUNCE_MS);
}

function registerGlobalListeners(): void {
  if (listenersRegistered) return;
  listenersRegistered = true;
  document.addEventListener('click', handleDocumentClick);
  document.addEventListener('input', handleSearchInput);
}

function calculateArticleProgress(): number {
  const article = document.querySelector<HTMLElement>('article');
  if (!article) return 0;

  const articleTop = article.getBoundingClientRect().top + window.scrollY;
  const visibleArticleHeight = window.scrollY + window.innerHeight - articleTop;
  return Math.max(0, Math.min(1, visibleArticleHeight / article.scrollHeight));
}

function startReadingTracker(): void {
  readingCleanup?.();

  const article = document.querySelector('article');
  if (!article) {
    readingCleanup = undefined;
    return;
  }

  let activeReadingMs = 0;
  let lastTick = Date.now();
  let emitted = false;

  const interval = window.setInterval(() => {
    const now = Date.now();
    if (document.visibilityState === 'visible' && document.hasFocus()) {
      activeReadingMs += now - lastTick;
    }
    lastTick = now;

    if (!emitted && activeReadingMs >= ENGAGED_READING_TIME_MS && calculateArticleProgress() >= 0.5) {
      emitted = trackEvent('engaged_read', {
        minimum_active_seconds: ENGAGED_READING_TIME_MS / 1000,
        minimum_scroll_percent: 50,
      });
    }
  }, 1000);

  const resetTick = () => {
    lastTick = Date.now();
  };
  document.addEventListener('visibilitychange', resetTick);
  window.addEventListener('focus', resetTick);
  window.addEventListener('blur', resetTick);

  readingCleanup = () => {
    window.clearInterval(interval);
    document.removeEventListener('visibilitychange', resetTick);
    window.removeEventListener('focus', resetTick);
    window.removeEventListener('blur', resetTick);
  };
}

const analyticsClientModule: ClientModule = {
  onRouteUpdate() {
    readingCleanup?.();
    readingCleanup = undefined;
  },
  onRouteDidUpdate({ location, previousLocation }) {
    registerGlobalListeners();

    const routeChanged =
      !previousLocation ||
      location.pathname !== previousLocation.pathname ||
      location.search !== previousLocation.search;

    if (!routeChanged) return;

    window.setTimeout(() => {
      trackVirtualPageView(location.pathname);
      startReadingTracker();
    });
  },
};

export default analyticsClientModule;
