// @ts-check
// Note: type annotations allow type checking and IDEs autocompletion

const path = require('path');
const lightCodeTheme = require('prism-react-renderer/themes/vsLight');
const darkCodeTheme = require('prism-react-renderer/themes/dracula');

/** @type {import('@docusaurus/types').Config} */
const config = {
  title: 'Sai\'s Note Book',
  tagline: 'Learn, update and iterate',
  url: 'https://sai-tai.netlify.app',
  baseUrl: '/',
  trailingSlash: true,
  onBrokenLinks: 'throw',
  onBrokenMarkdownLinks: 'throw',
  favicon: '/img/favicon.JPEG',
  organizationName: 'hasura',
  projectName: 'graphql-engine',
  staticDirectories:["static", "public"],

  presets: [
    [
      'classic',
      /** @type {import('@docusaurus/preset-classic').Options} */
      ({
        docs: {
          routeBasePath: "/",
          sidebarPath: require.resolve('./sidebars.js'),
          editUrl: ({ docPath }) => `https://github.com/hasura/graphql-engine/edit/master/docs/docs/${docPath}`,
          docItemComponent: require.resolve('./src/components/CustomDocItem/index.tsx'),
          exclude: ['**/*.wip'],
          breadcrumbs: true,
          // showLastUpdateAuthor: true,
          showLastUpdateTime: true,
          /*
          lastVersion: "current",
          versions: {
            current: {
              label: "v2.x",
              badge: true,
              path: 'latest'
            },
          }
          */
          remarkPlugins: [[require('mdx-mermaid'), { mermaid: { theme: 'dark' } }]],
        },
        theme: {
          customCss: require.resolve('./src/css/custom.scss'),
        },
      }),
    ],
  ],
  plugins: [
    'docusaurus-plugin-sass',
    'plugin-image-zoom',
    [
      'content-docs',
      /** @type {import('@docusaurus/plugin-content-docs').Options} */
      ({
        id: 'wiki',
        path: 'wiki',
        routeBasePath: "wiki",
        editUrl: ({ docPath }) => `https://github.com/hasura/graphql-engine/edit/master/docs/docs/${docPath}`,
        editCurrentVersion: true,
        docItemComponent: require.resolve('./src/components/CustomDocItem/CustomDocItemWiki.tsx'),
        // disableVersioning: true,
        breadcrumbs: true,
        sidebarPath: require.resolve('./sidebarsWiki.js'),
        showLastUpdateAuthor: true,
        showLastUpdateTime: true,
      }),
    ],
    [
      path.resolve(__dirname, './src/plugins/docusaurus-plugin-segment-analytics'),
      {
        // Segment write keys are technically public. Most sites have them published in the client facing JS
        prodKey: 'oDRhcj018aRrEcplMbaBQ0W2bJ9yhZaE',
        devKey: 'oDRhcj018aRrEcplMbaBQ0W2bJ9yhZaE',
        // boolean (defaults to false) on whether you want
        // to include analytics.page() automatically
        trackPage: true,
        // number (defaults to 50); time to wait after a route update before it should
        // track the page change, to implement this, make sure your `trackPage` property is set to `true`
        // trackPageDelay: 50,
      }
    ],
    [
      path.resolve(__dirname, './src/plugins/docusaurus-plugin-google-gtm'),
      {
        trackingID: "GTM-PF5MQ2Z",
      }
    ],
  //   [
  //     'ideal-image',
  //     {
  //       quality: 70,
  //       max: 1030, // max resized image's size.
  //       min: 640, // min resized image's size. if original is lower, use that size.
  //       steps: 2, // the max number of images generated between min and max (inclusive)
  //       disableInDev: false,
  //     },
  //   ],
  ],

  themeConfig:
    /** @type {import('@docusaurus/preset-classic').ThemeConfig} */
    ({
      hideableSidebar: true,
      autoCollapseSidebarCategories: true,
      colorMode: {
        defaultMode: 'light',
        disableSwitch: false,
        respectPrefersColorScheme: true,
      },
      image: 'https://graphql-engine-cdn.hasura.io/assets/hge-docs/og-image.png',
      prism: {
        theme: lightCodeTheme,
        darkTheme: darkCodeTheme,
        additionalLanguages: ['rest', 'http', 'haskell', 'plsql', 'docker', 'nginx', 'markdown'],
      },
      algolia: {
        // If Algolia did not provide you any appId, use 'BH4D9OD16A'
        appId: 'KZNS393M9I',
        // Public API key: it is safe to commit it
        apiKey: '3959de5f63af937a2fc30ab60d661edb',
        indexName: 'sai-tai',
        // Optional: see doc section below
        // contextualSearch: true,
        // Optional: Specify domains where the navigation should occur through window.location instead on history.push. Useful when our Algolia config crawls multiple documentation sites and we want to navigate with window.location.href to them.
        // externalUrlRegex: 'external\\.com|domain\\.com',
        // Optional: Algolia search parameters
        // searchParameters: {},
      },
      announcementBar: {
        id: 'announcementBar-2', // Increment on change
        content: `⭐️ If you think this blog is handy, give it a star on <a target="_blank" rel="noopener noreferrer" href="https://github.com/saitai0802/docusaurus-doc-theme">GitHub</a>`,
      },
      // For header
      navbar: {
        hideOnScroll: true,
        title: 'Sai\'s notebook',
        /*
        logo: {
          alt: 'Hasura Logo',
          src: '/img/logo.svg',
          srcDark: '/img/logo-light.svg',
          href: '/'
        },
        */
        items: [
          {
            type: 'dropdown',
            label: 'Technology',
            position: 'left',
            items: [
              {
                type: 'doc',
                docId: 'web-development/index',
                label: 'Web Development',
              },
              {
                type: 'doc',
                docId: 'tech-concepts/index',
                label: 'Tech Concepts',
              },
              {
                type: 'doc',
                docId: 'cloud-computing/aws/index',
                label: 'AWS',
              },
              {
                type: 'doc',
                docId: 'linux/index',
                label: 'Linux',
              },
            ],
          },
          {
            type: 'dropdown',
            label: 'Tools & Docs',
            position: 'left',
            items: [
              {
                to: 'wiki',
                label: 'Theme Wiki',
              },
              {
                to: 'https://docusaurus.io/docs',
                label: 'Docusaurus',
              },
              {
                to: 'https://mermaid-js.github.io/mermaid/#/',
                label: 'Mermaid',
              },
              {
                to: 'https://euangoddard.github.io/clipboard2markdown/',
                label: 'Clipboard2MD',
              },
              {
                to: 'https://tabletomarkdown.com/convert-website-table-to-markdown/',
                label: 'Table to Markdown',
              },
              {
                to: 'https://www.tablesgenerator.com/',
                label: 'Markdown Table',
              },
            ],
          },
          {
            label: 'Crypto',
            type: 'doc',
            docId: 'crypto/index',
            position: 'left',
          },
          /* Version control
          {
            type: 'docsVersionDropdown',
            position: 'right',
            dropdownActiveClassDisabled: true,
            dropdownItemsAfter: [
              {
                href: 'https://hasura.io/docs/1.0/graphql/core/index.html',
                label: 'v1.x',
              },
            ],
          },
          */
          {
            type: 'search',
            position: 'right',
          },
          {
            href: 'https://github.com/saitai0802/',
            position: 'right',
            className: 'header-github-link',
            'aria-label': 'GitHub repository',
          },
          {
            to: '/about',
            label: 'About me',
            position: 'right',
            activeBaseRegex: `/about/`,
          },
        ],
      },
    }),
};

module.exports = config;
