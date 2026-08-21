import React from 'react';
import Layout from '@theme/Layout';

export default function PrivacyPage(): JSX.Element {
  return (
    <Layout title="Privacy" description="How Sai's Notebook uses privacy-conscious web analytics.">
      <main className="container margin-vert--lg">
        <article className="col col--8 col--offset-2">
          <h1>Privacy and analytics</h1>
          <p>
            I use Google Analytics to understand which subjects are useful and how readers move through this notebook.
            Analytics is optional. The site waits for your choice before sending its own behavioural events, and you can
            change that choice using the Analytics settings button. A first-party preference cookie remembers that
            choice for up to one year.
          </p>

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
