// @ts-check
// Note: type annotations allow type checking and IDEs autocompletion

import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';

const path = require('path');

/** @type {import('@docusaurus/types').Config} */
const config = {
  title: 'Sai\'s Notebook',
  tagline: 'Adapt and adjust',
  url: 'https://sai-tai.com',
  baseUrl: '/',
  trailingSlash: true,
  onBrokenLinks: 'throw',
  onBrokenMarkdownLinks: 'throw',
  favicon: '/img/about-me/website-icon.jpg',
  organizationName: 'hasura',
  projectName: 'graphql-engine',
  staticDirectories: ['static', 'public'],
  // scripts: [
  //   {
  //     src: "https://www.chatbase.co/embed.min.js",
  //     id: "iiL6XJbYo6tRR_M4rUB9F",
  //     defer: true,
  //   }
  // ],
  webpack: {
    jsLoader: isServer => ({
      loader: require.resolve('swc-loader'),
      options: {
        jsc: {
          parser: {
            syntax: 'typescript',
            tsx: true,
          },
          target: 'es2017',
        },
        module: {
          type: isServer ? 'commonjs' : 'es6',
        },
      },
    }),
  },
  presets: [
    [
      'classic',
      /** @type {import('@docusaurus/preset-classic').Options} */
      // For docs: https://docusaurus.io/docs/api/plugins/@docusaurus/plugin-content-docs
      // For blog: https://github.com/facebook/docusaurus/issues/4138
      ({
        docs: {
          routeBasePath: '/',
          sidebarPath: require.resolve('./sidebars.js'),

          // Sai: Don't need public contribution
          // editUrl: ({ docPath }) =>
          //   `https://github.com/hasura/graphql-engine/edit/master/docs/docs/${docPath}`,
          // docItemComponent: require.resolve(
          //   './src/components/CustomDocItem/index.tsx'
          // ),
          exclude: ['**/*.wip'],
          breadcrumbs: true,
          // showLastUpdateAuthor: true,
          showLastUpdateTime: true,
          /*
          lastVersion: "current",
          versions: {
            current: {
              label: 'v2.x',
              badge: true,
              path: 'latest',
            },
          }
          */
          remarkPlugins: [remarkMath],
          rehypePlugins: [[rehypeKatex, { strict: false }]],
        },
        blog: false,
        theme: {
          customCss: require.resolve('./src/css/custom.scss'),
        },
      }),
    ],
  ],
  plugins: [
    'docusaurus-plugin-sass',
    'plugin-image-zoom',
    // [
    //   path.resolve(
    //     __dirname,
    //     './src/plugins/docusaurus-plugin-segment-analytics'
    //   ),
    //   {
    //     // Segment write keys are technically public. Most sites have them published in the client facing JS
    //     prodKey: 'oDRhcj018aRrEcplMbaBQ0W2bJ9yhZaE',
    //     devKey: 'oDRhcj018aRrEcplMbaBQ0W2bJ9yhZaE',
    //     // boolean (defaults to false) on whether you want
    //     // to include analytics.page() automatically
    //     trackPage: true,
    //     // number (defaults to 50); time to wait after a route update before it should
    //     // track the page change, to implement this, make sure your `trackPage` property is set to `true`
    //     // trackPageDelay: 50,
    //   },
    // ],
    [
      '@docusaurus/plugin-google-gtag',
      {
        trackingID: 'G-B35TPRVQ3Q',
        anonymizeIP: true,
      },
    ],
    [
      // https://kgajera.com/blog/display-recent-blog-posts-on-home-page-with-docusaurus/
      path.resolve(__dirname, './src/plugins/custom-blog-plugin'),
      {
        id: 'blog',
        routeBasePath: 'blog',
        path: './blog',
        blogTitle: 'Latest blog posts',
        blogDescription: '',
      },
    ],
  ],
  stylesheets: [
    {
      href: 'https://cdn.jsdelivr.net/npm/katex@0.13.24/dist/katex.min.css',
      type: 'text/css',
      integrity:
        'sha384-odtC+0UGzzFL/6PNoE8rX/SPcQDXBJ+uRepguP4QkPCm2LBxH3FA3y+fKSiJ+AmM',
      crossorigin: 'anonymous',
    },
  ],
  markdown:{mermaid: true},
  themes: ['@docusaurus/theme-mermaid'],
  themeConfig:
    /** @type {import('@docusaurus/preset-classic').ThemeConfig} */
    ({
      docs: {
        sidebar: {
          hideable: true,
          autoCollapseCategories: true,
        },
      },
      colorMode: {
        defaultMode: 'dark',
        disableSwitch: false,
        respectPrefersColorScheme: true,
      },
      mermaid: {
        theme: {light: 'neutral', dark: 'dark'}, // https://mermaid.js.org/config/theming.html
      },
      image:
        'https://sai-tai.com/assets/images/homepage-banner-28130bbd71ae53de0f4be432a0220fb7.jpg',
      prism: {
        theme: require('prism-react-renderer').themes.vsLight,
        darkTheme: require('prism-react-renderer').themes.dracula,
        // https://prismjs.com/#supported-languages
        additionalLanguages: [
          'bash',
          'rest',
          'rust',
          'http',
          'haskell',
          'sql',
          'docker',
          'nginx',
          'javascript',
          'typescript',
          'markdown',
          'yaml',
        ],
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
      // Sai: don't need this function as of now
      // announcementBar: {
      //   id: 'announcementBar-2', // Increment on change
      //   content: `⭐️ If you think this blog is handy, follow my <a target="_blank" rel="noopener noreferrer" href="https://github.com/saitaiky">GitHub</a>`,
      // },
      // For header
      navbar: {
        hideOnScroll: true,
        title: 'Sai\'s Notebook',
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
            label: 'Tech',
            position: 'left',
            items: [
              {
                to: 'aws',
                label: 'AWS',
              },
              {
                to: 'software-development',
                label: 'Software Development',
              },
              {
                to: 'container-orchestration',
                label: 'Container Orchestration',
              },
              {
                to: 'linux',
                label: 'Linux',
              },
            ],
          },
          {
            to: 'ai',
            label: 'Artificial Intelligence',
            position: 'left',
            // type: 'doc',
            // docId: 'ai/index',
            items: [
              {
                to: 'ai/showcase',
                label: 'Showcase',
              },
              {
                to: 'ai/search-plan/',
                label: 'AI(Search, Plan, Reasoning)',
              },
              {
                to: 'ai/ml',
                label: 'Machine Learning',
              },
              {
                to: 'ai/dl',
                label: 'Deep Learning Foundations',
              },
              {
                to: 'ai/llm',
                label: 'Large Language Model',
              },
              {
                to: 'ai/agentic-system',
                label: 'Agentic System Design',
              },
            ],
          },
          {
            label: 'Crypto',
            to: 'crypto',
            position: 'left',
          },
          {
            label: 'Other',
            type: 'doc',
            docId: 'other/index',
            position: 'left',
          },
          {
            type: 'dropdown',
            label: 'Tools & Docs',
            position: 'left',
            items: [
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
                to: 'https://www.freeformatter.com/json-escape.html#before-output',
                label: 'JSON Escape/Unescape',
              },
              {
                to: 'https://htmlpreview.github.io/',
                label: 'GitHub HTML preview',
              },
              {
                to: 'https://tabletomarkdown.com/convert-website-table-to-markdown/',
                label: 'Table to Markdown',
              },
              {
                to: 'https://www.tablesgenerator.com/',
                label: 'Markdown Table',
              },
              {
                to: 'https://chatgpt-prompt-splitter.vercel.app/',
                label: 'ChatGPT PROMPTs Splitter',
              },
            ],
          },
          // {
          //   to: '/timeline',
          //   label: "What's New",
          //   id: 'whats-new-link',
          //   position: 'left',
          // },
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
            href: 'https://www.buymeacoffee.com/saitai',
            position: 'right',
            html: '<img src="/img/about-me/bmc-button.png" width="125" />',
            'aria-label': 'Buy me a coffee',
          },
          {
            href: 'https://github.com/saitaiky/',
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
