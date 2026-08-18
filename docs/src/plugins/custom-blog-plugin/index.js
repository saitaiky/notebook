// ./custom-blog-plugin.js

const blogPluginExports = require('@docusaurus/plugin-content-blog');
const recentUpdatesPlugin = require('../recent-updates-plugin');
const { buildGraphCached } = require('../knowledge-graph/buildGraph');

const defaultBlogPlugin = blogPluginExports.default;
const collectRecentUpdates = recentUpdatesPlugin.collectRecentUpdates;
const recentUpdatesLimit = 8;

async function blogPluginExtended(...pluginArgs) {

  const blogPluginInstance = await defaultBlogPlugin(...pluginArgs);
  const pluginOptions = pluginArgs[1];
  
  return {
    // Add all properties of the default blog plugin so existing functionality is preserved
    ...blogPluginInstance,
    /**
     * Override the default `contentLoaded` hook to access blog posts data
     */
    contentLoaded: async function (params) {
      const { content, actions } = params;
      const siteDir = pluginArgs[0].siteDir;
      const visibleBlogPosts = content.blogPosts.filter((blogPost) => {
        const frontMatter = blogPost.metadata.frontMatter || {};
        return frontMatter.unlisted !== true;
      });
      const recentUpdates = collectRecentUpdates(siteDir, recentUpdatesLimit);

      // Get the 5 latest blog posts
      const recentPostsLimit = 5;
      const recentPosts = [...visibleBlogPosts].splice(0, recentPostsLimit);

      // Build the knowledge graph
      let graphData = null;
      try {
        graphData = await buildGraphCached(siteDir);
        console.log(`[Knowledge Graph] Built graph: ${graphData.stats.nodeCount} nodes, ${graphData.stats.linkCount} links, ${graphData.stats.communityCount} communities`);
      } catch (error) {
        console.error('[Knowledge Graph] Failed to build graph:', error.message);
        graphData = { nodes: [], links: [], stats: { nodeCount: 0, linkCount: 0, unresolvedCount: 0, communityCount: 0 } };
      }

      async function createRecentPostModule(blogPost, index) {
        
        return {
          // Inject the metadata you need for each recent blog post
          metadata: await actions.createData(
            `home-page-recent-post-metadata-${index}.json`,
            JSON.stringify({
              title: blogPost.metadata.title,
              description: blogPost.metadata.description,
              frontMatter: blogPost.metadata.frontMatter,
            })
          ),

          // Inject the MDX excerpt as a JSX component prop
          // (what's above the <!-- truncate --> marker)
          Preview: {
            __import: true,
            // The markdown file for the blog post will be loaded by webpack
            path: blogPost.metadata.source,
            query: {
              truncated: true,
            },
          },
        };
      }

      actions.addRoute({
        // Add route for the home page
        path: '/',
        exact: true,

        // The component to use for the "Home" page route
        component: '@site/src/components/Home/index.js',

        // These are the props that will be passed to our "Home" page component
        modules: {
          homePageBlogMetadata: await actions.createData(
            'home-page-blog-metadata.json',
            JSON.stringify({
              blogTitle: pluginOptions.blogTitle,
              blogDescription: pluginOptions.blogDescription,
              totalPosts: visibleBlogPosts.length,
              totalRecentPosts: recentPosts.length,
            })
          ),
          recentUpdates: await actions.createData(
            'home-page-recent-updates.json',
            JSON.stringify({
              title: 'Recent Updates',
              totalUpdates: recentUpdates.length,
              updates: recentUpdates,
            })
          ),
          recentPosts: await Promise.all(
            recentPosts.map(createRecentPostModule)
          ),
          knowledgeGraph: await actions.createData(
            'home-page-knowledge-graph.json',
            JSON.stringify(graphData)
          ),
        },
      });

      // Call the default overridden `contentLoaded` implementation
      return blogPluginInstance.contentLoaded(params);
    },

    /**
     * Override getPathsToWatch to include docs and blog files for dev rebuild
     */
    getPathsToWatch() {
      const defaultPaths = blogPluginInstance.getPathsToWatch ? blogPluginInstance.getPathsToWatch() : [];
      return [
        ...defaultPaths,
        '../../docs/**/*.{md,mdx}',
        '../../blog/**/*.{md,mdx}',
      ];
    },
  };
}

module.exports = {
  ...blogPluginExports,
  default: blogPluginExtended,
};