const CONSENT_STORAGE_KEY = 'sai-notebook.analytics-consent.v1';
const CONSENT_COOKIE = 'sai_notebook_analytics_consent';

module.exports = function analyticsConsentPlugin() {
  return {
    name: 'analytics-consent-plugin',
    injectHtmlTags() {
      if (process.env.NODE_ENV !== 'production') return {};

      return {
        headTags: [
          {
            tagName: 'script',
            innerHTML: `
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              var analyticsConsent = 'denied';
              try {
                var storedAnalyticsConsent = localStorage.getItem('${CONSENT_STORAGE_KEY}');
                if (storedAnalyticsConsent === 'granted' || storedAnalyticsConsent === 'denied') {
                  analyticsConsent = storedAnalyticsConsent;
                }
              } catch (error) {}
              if (analyticsConsent === 'denied') {
                var consentCookie = document.cookie
                  .split('; ')
                  .find(function(cookie) { return cookie.indexOf('${CONSENT_COOKIE}=') === 0; });
                if (consentCookie && consentCookie.split('=')[1] === 'granted') {
                  analyticsConsent = 'granted';
                }
              }
              gtag('consent', 'default', {
                analytics_storage: analyticsConsent,
                ad_storage: 'denied',
                ad_user_data: 'denied',
                ad_personalization: 'denied',
                functionality_storage: 'granted',
                personalization_storage: 'denied',
                security_storage: 'granted',
                wait_for_update: 500
              });
              gtag('set', 'ads_data_redaction', true);
            `,
          },
        ],
      };
    },
  };
};
