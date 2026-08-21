export const ANALYTICS_CONSENT_STORAGE_KEY = 'sai-notebook.analytics-consent.v1';
const ANALYTICS_CONSENT_COOKIE = 'sai_notebook_analytics_consent';

export type AnalyticsConsent = 'granted' | 'denied';

export type AnalyticsEventName =
  | 'code_copy'
  | 'engaged_read'
  | 'feedback_submit'
  | 'graph_expand'
  | 'page_not_found'
  | 'search_result_select'
  | 'select_content'
  | 'view_search_results'
  | 'virtual_page_view';

type AnalyticsValue = string | number | boolean | undefined;

export type AnalyticsParameters = Record<string, AnalyticsValue>;

export type PageAnalyticsContext = {
  content_group: string;
  content_language: 'en' | 'ja' | 'zh' | 'mixed';
  page_path: string;
  page_title: string;
  page_type: 'blog' | 'docs' | 'home' | 'page';
};

declare global {
  interface Window {
    dataLayer?: unknown[];
    gtag?: (...args: unknown[]) => void;
  }
}

function canUseDOM(): boolean {
  return typeof window !== 'undefined' && typeof document !== 'undefined';
}

function ensureDataLayer(): unknown[] {
  window.dataLayer = window.dataLayer || [];
  return window.dataLayer;
}

function ensureGtag(): (...args: unknown[]) => void {
  if (!window.gtag) {
    window.gtag = function gtag(...args: unknown[]) {
      ensureDataLayer().push(args);
    };
  }
  return window.gtag;
}

export function getAnalyticsConsent(): AnalyticsConsent | null {
  if (!canUseDOM()) return null;

  try {
    const storedValue = window.localStorage.getItem(ANALYTICS_CONSENT_STORAGE_KEY);
    if (storedValue === 'granted' || storedValue === 'denied') {
      return storedValue;
    }
  } catch {
    // Fall back to the first-party preference cookie below.
  }

  const cookieValue = document.cookie
    .split('; ')
    .find(cookie => cookie.startsWith(`${ANALYTICS_CONSENT_COOKIE}=`))
    ?.split('=')[1];
  return cookieValue === 'granted' || cookieValue === 'denied' ? cookieValue : null;
}

export function updateAnalyticsConsent(consent: AnalyticsConsent): void {
  if (!canUseDOM()) return;

  try {
    window.localStorage.setItem(ANALYTICS_CONSENT_STORAGE_KEY, consent);
  } catch {
    // The consent update still reaches GTM when storage is unavailable.
  }

  const secureAttribute = window.location.protocol === 'https:' ? '; Secure' : '';
  document.cookie = `${ANALYTICS_CONSENT_COOKIE}=${consent}; Max-Age=31536000; Path=/; SameSite=Lax${secureAttribute}`;

  ensureGtag()('consent', 'update', {
    analytics_storage: consent,
    ad_storage: 'denied',
    ad_user_data: 'denied',
    ad_personalization: 'denied',
  });

  ensureDataLayer().push({
    event: 'analytics_consent_update',
    analytics_consent: consent,
  });

  window.dispatchEvent(new CustomEvent('analytics:consent-updated', { detail: { consent } }));
}

export function getContentGroup(pathname: string): string {
  const firstSegment = pathname.split('/').filter(Boolean)[0];

  const groups: Record<string, string> = {
    ai: 'AI',
    aws: 'AWS',
    blog: 'Blog',
    'container-orchestration': 'Cloud Native',
    crypto: 'Crypto',
    linux: 'Linux',
    other: 'Beyond Technology',
    'software-development': 'Software Development',
  };

  if (!firstSegment) return 'Home';
  return groups[firstSegment] || 'Other';
}

function getPageType(pathname: string): PageAnalyticsContext['page_type'] {
  if (pathname === '/') return 'home';
  if (pathname.startsWith('/blog/')) return 'blog';
  if (pathname === '/about' || pathname === '/about/') return 'page';
  return 'docs';
}

export function inferContentLanguage(text: string): PageAnalyticsContext['content_language'] {
  const hasKana = /[\u3040-\u30ff]/u.test(text);
  const hasHan = /[\u3400-\u4dbf\u4e00-\u9fff]/u.test(text);
  const latinCharacters = text.match(/[A-Za-z]/g)?.length || 0;

  if (!hasKana && !hasHan) return 'en';
  if (latinCharacters > 80) return 'mixed';
  return hasKana ? 'ja' : 'zh';
}

export function getPageAnalyticsContext(pathname = canUseDOM() ? window.location.pathname : '/'): PageAnalyticsContext {
  const normalizedPath = pathname || '/';
  const pageText = canUseDOM() ? document.querySelector('article, main')?.textContent || document.title : '';

  return {
    content_group: getContentGroup(normalizedPath),
    content_language: inferContentLanguage(pageText),
    page_path: normalizedPath,
    page_title: canUseDOM() ? document.title : '',
    page_type: getPageType(normalizedPath),
  };
}

export function trackEvent(event: AnalyticsEventName, parameters: AnalyticsParameters = {}): boolean {
  if (!canUseDOM() || getAnalyticsConsent() !== 'granted') return false;

  ensureDataLayer().push({
    event,
    ...getPageAnalyticsContext(),
    ...parameters,
  });

  return true;
}

export function trackVirtualPageView(pathname?: string): boolean {
  const context = getPageAnalyticsContext(pathname);
  return trackEvent('virtual_page_view', context);
}

export function sanitizeSearchTerm(searchTerm: string): {
  search_term: string;
  search_term_redacted: boolean;
} {
  const normalized = searchTerm.replace(/\s+/g, ' ').trim();
  const looksSensitive =
    /\b[^\s@]+@[^\s@]+\.[^\s@]+\b/u.test(normalized) ||
    /\b(?:\d[ -]*?){12,19}\b/u.test(normalized) ||
    /\b(?:sk|ghp|github_pat|xox[baprs])-[_A-Za-z0-9-]{12,}\b/u.test(normalized) ||
    /\beyJ[A-Za-z0-9_-]+\.[A-Za-z0-9_-]+\.[A-Za-z0-9_-]+\b/u.test(normalized);

  if (looksSensitive) {
    return { search_term: '[redacted]', search_term_redacted: true };
  }

  return {
    search_term: normalized.slice(0, 80),
    search_term_redacted: normalized.length > 80,
  };
}
