import React, { useEffect, useState, type ReactNode } from 'react';
import Link from '@docusaurus/Link';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import {
  getAnalyticsConsent,
  trackVirtualPageView,
  updateAnalyticsConsent,
  type AnalyticsConsent,
} from '@site/src/utils/analytics';
import styles from './styles.module.scss';

type Props = {
  children: ReactNode;
};

export default function Root({ children }: Props): JSX.Element {
  const { siteConfig } = useDocusaurusContext();
  const analyticsProvider = siteConfig.customFields?.analyticsProvider;
  const analyticsEnabled = analyticsProvider === 'gtm';
  const [consent, setConsent] = useState<AnalyticsConsent | null>(null);
  const [preferencesOpen, setPreferencesOpen] = useState(false);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    setConsent(getAnalyticsConsent());
    setHydrated(true);
  }, []);

  const chooseConsent = (choice: AnalyticsConsent) => {
    const consentChanged = choice !== consent;
    updateAnalyticsConsent(choice);
    setConsent(choice);
    setPreferencesOpen(false);

    if (choice === 'granted' && consentChanged) {
      window.setTimeout(() => trackVirtualPageView());
    }
  };

  const showBanner = analyticsEnabled && hydrated && (consent === null || preferencesOpen);

  return (
    <>
      {children}
      {showBanner ? (
        <aside className={styles.consentBanner} aria-label="Analytics preferences" aria-live="polite">
          <div className={styles.consentCopy}>
            <strong>Help improve this notebook</strong>
            <p>
              I use anonymous analytics to understand which subjects are useful and how readers move between them.
              Advertising storage remains disabled, and feedback text or copied code is never collected.{' '}
              <Link to="/privacy" data-analytics-ignore="true">
                Privacy details
              </Link>
              .
            </p>
          </div>
          <div className={styles.consentActions}>
            <button type="button" className={styles.rejectButton} onClick={() => chooseConsent('denied')}>
              Decline
            </button>
            <button type="button" className={styles.acceptButton} onClick={() => chooseConsent('granted')}>
              Allow analytics
            </button>
          </div>
        </aside>
      ) : null}
      {analyticsEnabled && hydrated && consent !== null && !preferencesOpen ? (
        <button type="button" className={styles.preferencesButton} onClick={() => setPreferencesOpen(true)}>
          Analytics settings
        </button>
      ) : null}
    </>
  );
}
