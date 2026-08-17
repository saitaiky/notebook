import React from 'react';
import clsx from 'clsx';
import Link from '@docusaurus/Link';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';

import Layout from '@theme/Layout';

import HomepageFeatures from '@site/src/components/HomepageFeatures';
import RecentUpdates from '@site/src/components/RecentUpdates';
import KnowledgeGraph from '@site/src/components/KnowledgeGraph';

import styles from './styles.module.scss';
import './styles.scss';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTags } from '@fortawesome/free-solid-svg-icons';

function HomepageHeader({ heroStats }) {
  const { siteConfig } = useDocusaurusContext();
  return (
    <header className="hero hero--primary heroBanner">
      <div className={styles.intro}>
        <h1 className={clsx('hero__title', styles.heroTitle)}>{siteConfig.title}</h1>
        <h3 className={clsx('hero__subtitle', styles.heroTagline)}>{siteConfig.tagline}</h3>
        <div className={styles.actions}>
          <Link className={clsx('button button--primary button--lg', styles.ctaPrimary)} to="/ai">
            Explore AI
          </Link>
          <Link className={clsx('button button--outline button--primary button--lg', styles.ctaSecondary)} to="/aws">
            Explore AWS
          </Link>
        </div>
        {heroStats && (
          <div className={styles.statsRow}>
            <div className={styles.statItem}>
              <span className={styles.statNumber}>{heroStats.pages}</span>
              <span className={styles.statLabel}>Pages</span>
            </div>
            <span className={styles.statDivider} />
            <div className={styles.statItem}>
              <span className={styles.statNumber}>{heroStats.topics}</span>
              <span className={styles.statLabel}>Topics</span>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}

function RecentBlogPostCard({ recentPost }) {
  const { Preview } = recentPost;

  const { permalink, tags, readingTime, hasTruncateMarker } = Preview.metadata;
  const { title } = Preview.frontMatter;

  const isBlogPostPage = false;

  const dateObj = new Date(Preview.metadata.date);
  const year = dateObj.getFullYear();
  const day = dateObj.getDate();
  const month = dateObj.toLocaleString('default', { month: 'long' });
  const dateStr = `${month}, ${year}`;

  const renderTags = () => {
    return (
      (tags.length > 0 || hasTruncateMarker) && (
        <div className="post__tags-container margin-top--none margin-bottom--md">
          {tags.length > 0 && (
            <>
              <FontAwesomeIcon
                icon={faTags}
                color="#c4d3e0"
                className="margin-right--md"
              />
              {tags.slice(0, 4).map(({ label, permalink: tagPermalink }, index) => (
                <Link
                  key={tagPermalink}
                  className={`post__tags ${index > 0 ? 'margin-horiz--sm' : 'margin-right--sm'}`}
                  to={tagPermalink}
                  style={{ fontSize: '0.75em', fontWeight: 500 }}
                >
                  {label}
                </Link>
              ))}
            </>
          )}
        </div>
      )
    );
  };

  const renderPostHeader = () => {
    const TitleHeading = isBlogPostPage ? 'h1' : 'h2';

    return (
      <header>
        <TitleHeading
          className={clsx(
            isBlogPostPage ? 'margin-bottom--md' : 'margin-vert--md',
            styles.blogPostTitle,
            isBlogPostPage ? 'text--center' : ''
          )}
        >
          {isBlogPostPage ? title : <Link to={permalink}>{title}</Link>}
        </TitleHeading>
      </header>
    );
  };

  return (
    <div className={`row ${!isBlogPostPage ? 'blog-list--item' : ''}`}>
      <div className="post__date-container col col--3 padding-right--lg margin-bottom--lg">
        <div className="post__date">
          <div className="post__day">{day}</div>
          <div className="post__year_month">{dateStr}</div>
        </div>
      </div>

      <div className={`col ${isBlogPostPage ? 'col--12 article__details' : 'col--9'}`}>
        <article className={!isBlogPostPage ? 'margin-bottom--md' : undefined}>
          {renderPostHeader()}
          {!isBlogPostPage && renderTags()}

          {isBlogPostPage && (
            <p className="single-post--date text--center">
              {dateStr} ·{' '}
              <Translate
                id="blogpage.estimated.time"
                description="blog page estimated time"
              >
                预计阅读时间：
              </Translate>
              {readingTime && (
                <>
                  {' '}
                  {Math.ceil(readingTime)}{' '}
                  <Translate
                    id="blogpage.estimated.time.label"
                    description="blog page estimated time label"
                  >
                    分钟
                  </Translate>
                </>
              )}
            </p>
          )}

          {isBlogPostPage && (
            <>
              <div className="text--center margin-bottom--xs padding-bottom--xs">
                {renderTags()}
              </div>
              <Adsense responsive="true" format="auto" slot="2800800187" />
            </>
          )}

          <Preview />
        </article>

        <footer className="article__footer padding-top--md margin-top--lg margin-bottom--lg">
          {hasTruncateMarker && (
            <div className={styles.readmore_link}>
              <Link to={permalink} className="button button--primary button--lg">
                Read full text
              </Link>
            </div>
          )}
        </footer>
      </div>
    </div>
  );
}

export default function Home({ homePageBlogMetadata, recentPosts, recentUpdates, knowledgeGraph }) {
  let parsedGraph = null;
  if (typeof knowledgeGraph === 'string') {
    try {
      parsedGraph = JSON.parse(knowledgeGraph);
    } catch (error) {
      parsedGraph = null;
    }
  } else if (knowledgeGraph) {
    parsedGraph = knowledgeGraph;
  }

  const nodeCount = parsedGraph?.stats?.nodeCount ?? parsedGraph?.nodes?.length ?? 0;
  const topicCount = parsedGraph?.nodes ? new Set(parsedGraph.nodes.map((n) => n.section)).size : 0;

  const heroStats = nodeCount > 0
    ? { pages: nodeCount, topics: topicCount }
    : null;

  const { siteConfig } = useDocusaurusContext();
  return (
    <Layout
      title={`Hello from ${siteConfig.title}`}
      description="Description will go into a meta tag in <head />"
      wrapperClassName="blog-list__page"
    >
      <section className={styles.heroGraphBand}>
        <HomepageHeader heroStats={heroStats} />
        <div className={styles.heroGraphShell}>
          <KnowledgeGraph graphData={knowledgeGraph} />
        </div>
      </section>

      <main style={{ padding: 30 }}>
        <div style={{ display: 'flex', justifyContent: 'center' }}>
          <h1 className="blog__section_title">{homePageBlogMetadata.blogTitle}</h1>
        </div>
      </main>

      <div className="container-wrapper">
        <div className="container padding-vert--sm">
          <div className="row">
            <div className="col col--12">
              <div className="bloghome__posts">
                <div className="bloghome__posts-card">
                  {recentPosts.map((recentPost, index) => (
                    <RecentBlogPostCard
                      key={index}
                      recentPost={recentPost}
                    />
                  ))}
                </div>
                <div className="pagination-nav"></div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <RecentUpdates recentUpdates={recentUpdates} />
      <HomepageFeatures />
    </Layout>
  );
}
