import React from 'react';
import clsx from 'clsx';
import Link from '@docusaurus/Link';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';

import Layout from '@theme/Layout';
import MDXComponents from "@theme/MDXComponents";

import HomepageFeatures from '@site/src/components/HomepageFeatures';

import styles from './styles.module.css';
import './styles.css';
// import { StyledBlogItem } from "./style";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTags } from "@fortawesome/free-solid-svg-icons";

function HomepageHeader() {
  const { siteConfig } = useDocusaurusContext();
  return (
    // <header className={clsx('hero hero--primary', styles.heroBanner)}>
    <header className="hero hero--primary heroBanner">
      <div className={styles.intro}>
        <h1 className="hero__title">{siteConfig.title}</h1>
        <h3 className="hero__subtitle">{siteConfig.tagline}</h3>
        <div>

        </div>
        <div className={styles.links}>
          <Link
            className="button button--primary button--lg"
            to="/software-development">
            Software development
          </Link>
        </div>
        <div className={styles.links}>
          <Link
            className="button button--secondary button--lg"
            to="/aws/">
            AWS
          </Link>
        </div>
      </div>
      <div className={styles.img}></div>
    </header>
  );
}

function RecentBlogPostCard({ recentPost }) {

  const { Preview, metadata } = recentPost;

  const { permalink, tags, readingTime, hasTruncateMarker } = Preview.metadata;
  const {
    slug: postId,
    title,
  } = Preview.frontMatter;

  const isBlogPostPage = false;

  const dateObj = new Date(Preview.metadata.date);
  const year = dateObj.getFullYear();
  let month = dateObj.getMonth() + 1;
  const day = dateObj.getDate();
  month = dateObj.toLocaleString("default", { month: "long" });
  const dateStr = `${month}, ${year}`;

  const renderTags = () => {
    return (
      (tags.length > 0 || truncated) && (
        <div className="post__tags-container margin-top--none margin-bottom--md">
          {tags.length > 0 && (
            <>
              <FontAwesomeIcon
                icon={faTags}
                color="#c4d3e0"
                className="margin-right--md"
              />
              {tags
                .slice(0, 4)
                .map(({ label, permalink: tagPermalink }, index) => (
                  <Link
                    key={tagPermalink}
                    className={`post__tags ${
                      index > 0 ? "margin-horiz--sm" : "margin-right--sm"
                    }`}
                    to={tagPermalink}
                    style={{ fontSize: "0.75em", fontWeight: 500 }}
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
    const TitleHeading = isBlogPostPage ? "h1" : "h2";

    return (
      <header>
        <TitleHeading
          className={clsx(
            isBlogPostPage ? "margin-bottom--md" : "margin-vert--md",
            styles.blogPostTitle,
            isBlogPostPage ? "text--center" : ""
          )}
        >
          {isBlogPostPage ? title : <Link to={permalink}>{title}</Link>}
        </TitleHeading>
        {/* <div className="margin-vert--md">
          <time dateTime={date} className={styles.blogPostDate}>
            {month} {day}, {year}{" "}
            {readingTime && <> · {Math.ceil(readingTime)} min read</>}
          </time>
        </div> */}
      </header>
    );
  };

  return (
    <div className={`row ${!isBlogPostPage ? "blog-list--item" : ""}`}>
        <div className="post__date-container col col--3 padding-right--lg margin-bottom--lg">
            <div className="post__date">
                <div className="post__day">{day}</div>
                <div className="post__year_month">{dateStr}</div>
            </div>
        </div>

        <div
        className={`col ${
            isBlogPostPage ? `col--12 article__details` : `col--9`
        }`}
        >
            {/* 博文部分 */}
            <article
                className={!isBlogPostPage ? "margin-bottom--md" : undefined}
            >
                {/* 标题 */}
                {renderPostHeader()}
                {/* 列表页标签 */}
                {!isBlogPostPage && renderTags()}
                {/* 发布日期与阅读时间 */}
                {isBlogPostPage && (
                <p className={`single-post--date text--center`}>
                    {dateStr} ·{" "}
                    <Translate
                    id="blogpage.estimated.time"
                    description="blog page estimated time"
                    >
                    预计阅读时间：
                    </Translate>
                    {readingTime && (
                    <>
                        {" "}
                        {Math.ceil(readingTime)}{" "}
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
                {/* 标签 */}
                {isBlogPostPage && (
                <>
                    <div className="text--center margin-bottom--xs padding-bottom--xs">
                    {renderTags()}
                    </div>
                    <Adsense responsive="true" format="auto" slot="2800800187" />
                </>
                )}

                {/* 正文 */}
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
                {isBlogPostPage && (
                <Comments activityId={activityId} oid={oid} bvid={bvid} />
                )}
            </footer>
        </div>
    </div>
  );
}

export default function Home({ homePageBlogMetadata, recentPosts }) {
    
  const { siteConfig } = useDocusaurusContext();
  return (
    <Layout
      title={`Hello from ${siteConfig.title}`}
      description="Description will go into a meta tag in <head />"
      wrapperClassName="blog-list__page"
    >
      <HomepageHeader />
      
      <main style={{ padding: 30}}>
        <div style={{
                'display': 'flex',
                'justifyContent': 'center'
            }}>
            <h1 className="blog__section_title">{homePageBlogMetadata.blogTitle}</h1>
        </div>
        {/* <p>{homePageBlogMetadata.blogDescription}</p> */}
        {/* <p>
          Displaying some sample posts: 
          {homePageBlogMetadata.totalRecentPosts} /{' '}
          {homePageBlogMetadata.totalPosts}
        </p> */}
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

        {/* <hr /> */}
        <HomepageFeatures />
    </Layout>
  );
}