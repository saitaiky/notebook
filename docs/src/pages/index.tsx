import React from 'react';
import clsx from 'clsx';
import Layout from '@theme/Layout';
import Link from '@docusaurus/Link';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
// import hasuras from '@site/static/img/hasuras.png';
import VersionedLink from '@site/src/components/VersionedLink';
import styles from './index.module.scss';

function HomepageHeader() {
  const { siteConfig } = useDocusaurusContext();
  return (
    <header className={clsx('hero', styles.heroBanner)}>
      <div className="container">
        <h1 className="hero__title">{siteConfig.title}</h1>
        <p className="hero__subtitle">{siteConfig.tagline}</p>
        {/*
        <div className={styles.links}>
          <VersionedLink
            className="button button--primary button--lg"
            to="/graphql/core/index">
            Hasura Core Docs
          </VersionedLink>
          <VersionedLink
            className="button button--success button--lg"
            to="/graphql/cloud/index">
            Hasura Cloud Docs
          </VersionedLink>
        </div>
        */}
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
        {/* <img src={hasuras} alt="Hasuras Image" /> */}
      </div>
    </header>
  );
}

export default function Home(): JSX.Element {
  const { siteConfig } = useDocusaurusContext();
  return (
    <Layout
      title={siteConfig.title}
      description="A notebook for study"
    >
      <HomepageHeader />
      <main></main>
    </Layout>
  );
}
