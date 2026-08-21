import React, { useEffect, useState } from 'react';
import Layout from '@theme/Layout';
import {
  getAnalyticsConsent,
  trackVirtualPageView,
  updateAnalyticsConsent,
  type AnalyticsConsent,
} from '@site/src/utils/analytics';

export default function PrivacyPage(): JSX.Element {
  const [consent, setConsent] = useState<AnalyticsConsent | null>(null);

  useEffect(() => {
    setConsent(getAnalyticsConsent());
  }, []);

  const chooseConsent = (choice: AnalyticsConsent) => {
    const consentChanged = choice !== consent;
    updateAnalyticsConsent(choice);
    setConsent(choice);

    if (choice === 'granted' && consentChanged) {
      window.setTimeout(() => trackVirtualPageView());
    }
  };

  return (
    <Layout title="Privacy" description="How Sai's Notebook uses privacy-conscious web analytics.">
      <main className="container margin-vert--lg">
        <article className="col col--8 col--offset-2">
          <h1>Privacy and analytics</h1>
          <p>
            I use Google Analytics to understand which subjects are useful and how readers move through this notebook.
            Analytics is optional. The site waits for your choice before sending its own behavioural events. You can
            change that choice on this page at any time, and a first-party preference cookie remembers it for up to one
            year.
          </p>

          <h2>Your analytics preference</h2>
          <p aria-live="polite">
            Current choice:{' '}
            <strong>{consent === 'granted' ? 'Allowed' : consent === 'denied' ? 'Declined' : 'Not set'}</strong>
          </p>
          <div className="button-group margin-bottom--lg" role="group" aria-label="Analytics preference">
            <button
              type="button"
              className="button button--secondary"
              aria-pressed={consent === 'denied'}
              onClick={() => chooseConsent('denied')}
            >
              Decline analytics
            </button>
            <button
              type="button"
              className="button button--primary"
              aria-pressed={consent === 'granted'}
              onClick={() => chooseConsent('granted')}
            >
              Allow analytics
            </button>
          </div>

          <h2>What is measured</h2>
          <p>
            When you allow analytics, the site may record page views, broad content categories, anonymous reading
            engagement, internal-link and search-result selections, knowledge-graph use, code-copy actions and page
            ratings. Standard Google Analytics information such as device category and referral source may also be
            available.
          </p>

          <h2>What is not collected</h2>
          <p>
            I do not send written feedback, copied code, account identifiers or advertising-personalisation data. Search
            terms that resemble an email address, payment-card number or access token are redacted before an analytics
            event is created.
          </p>

          <h2>Retention and your choice</h2>
          <p>
            Event-level analytics data is configured for a maximum retention of 14 months. Declining analytics prevents
            the notebook's behavioural events from being sent. Advertising storage and personalisation remain disabled
            even when analytics is allowed.
          </p>
        </article>
      </main>
    </Layout>
  );
}
