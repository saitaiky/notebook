"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var react_1 = require("react");
var clsx_1 = require("clsx");
var Layout_1 = require("@theme/Layout");
var useDocusaurusContext_1 = require("@docusaurus/useDocusaurusContext");
var index_module_scss_1 = require("./index.module.scss");
var HomepageFeatures_1 = require("@site/src/components/HomepageFeatures");
var favicon_JPEG_1 = require("@site/static/img/about-me/favicon.JPEG");
function HomepageHeader() {
    var siteConfig = (0, useDocusaurusContext_1.default)().siteConfig;
    return (<header className={(0, clsx_1.default)(index_module_scss_1.default.heroBanner)}>
      <div className="container" style={{ textAlign: 'center', paddingTop: '3rem' }}>
        <img src={favicon_JPEG_1.default} style={{ width: 280, borderRadius: '50%' }}/> 
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
        <br />
        <p>👋 Hi, this is Sai. I’m documenting my learning progress in this notebook(<a href="/blog/hello-world/">About this place</a>).</p>
        <p>I'm a software architect with 12+ years of experience living in London, currently focusing in AI-driven web applications.</p>
        <p>Outside of work, I like to play guitar and draw; yoga has become my favourite sport since the pandemic.</p>
        <div>
          <img src="/img/about-me/sa.png" width="200px"></img>
          <img src="/img/about-me/developer.png" width="200px"></img>
          <img src="/img/about-me/sysops.png" width="200px"></img>
        </div>
      </div>
    </header>);
}
function Home() {
    var siteConfig = (0, useDocusaurusContext_1.default)().siteConfig;
    return (<Layout_1.default title={"Hello from ".concat(siteConfig.title)} description="Description will go into a meta tag in <head />">
      <div id="about-me">
        <HomepageHeader />
        <main>  
          <HomepageFeatures_1.default />
        </main>
      </div>
    </Layout_1.default>);
}
exports.default = Home;
