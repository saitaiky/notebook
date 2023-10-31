import React from 'react';
import clsx from 'clsx';
import Layout from '@theme/Layout';
import Link from '@docusaurus/Link';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import styles from './index.module.scss';
import HomepageFeatures from '@site/src/components/HomepageFeatures';
import logo from '@site/static/img/about-me/favicon.JPEG'

function HomepageHeader() {
  const {siteConfig} = useDocusaurusContext();
  return (
    <header className={clsx(styles.heroBanner)}>
      <div className="container" style={{textAlign: 'center', paddingTop: '3rem'}}>
        <img src={logo} style={{width: 280, borderRadius: '50%'}} /> 
        {/* <h1 className="hero__title">{siteConfig.title}</h1> */}
        {/* <p className="hero__subtitle">{siteConfig.tagline}</p> */}
        {/* <div className={styles.links}>
          <Link
            className="button button--primary button--lg"
            to="/software-development/">
            Web development
          </Link>
        </div> */}
        <h1 className="hero__title">Sai Tai</h1>
        <br/>
        <p>Hi, I'm a software architect who focus on web-based and AI-driven applications for 12+ years.</p>
        <p>During the free time, I like to play guitar and drawing. Doing yoga are my recent interest after the pandemic.</p>
        <div>
          <img src="/img/about-me/sa.png" width="200px"></img>
          <img src="/img/about-me/developer.png" width="200px"></img>
          <img src="/img/about-me/sysops.png" width="200px"></img>
        </div>
      </div>
    </header>
  );
}

export default function Home() {
  const {siteConfig} = useDocusaurusContext();
  return (
    <Layout
      title={`Hello from ${siteConfig.title}`}
      description="Description will go into a meta tag in <head />">
      <div id="about-me">
        <HomepageHeader />
        <main>  
          <HomepageFeatures />
        </main>
      </div>
    </Layout>
  );
}
