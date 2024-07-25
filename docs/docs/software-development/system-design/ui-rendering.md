---
title: Rendering web content
---

## What is Rendering?

Rendering a webpage is the process of turning HTML, CSS, and JavaScript code into an interactive page that website visitors expect to see when clicking on a link.

## Impact of Rendering on Websites

- **Driving Traffic**
    - **Importance**: SEO depends on bots being able to crawl and index your site.
    - **Impact**: Search rankings (affecting up to 9- of traffic) consider content quality, speed, security, mobile friendliness, and crawlability.
- **User Interaction**
    - **Factors**: Device type, location, internet speed, and network conditions.
    - **Metrics**:
        - **TTFB (Time to First Byte)**: Time from clicking a link to receiving the first byte of content.
        - **FP (First Paint)**: When the first pixel is visible.
        - **FCP (First Contentful Paint)**: When requested content appears.
        - **TTI (Time to Interactive)**: When the page becomes interactive.
- **Data Integrity**
    - **High**: Requires fresh data every render. (e.g., product pages, social media updates) - **CSR**, **SSR**
    - **Medium**: Fresh data is ideal but stale data is tolerable. (e.g., blogs, profile pages) - **ISR**
    - **Low**: Data freshness is not critical. (e.g., about pages) - **SSG**
- **SEO (Search Engine Optimization)**
    - **SEO Friendly**: Pre-rendered content visible in page source. (e.g., shopping sites, forums) - **SSR**, **SSG**, **ISR**
    - **Not SEO Friendly**: Content not visible until rendered by the client. (e.g., registration pages) - **CSR**
- **Performance**
    - **Instant**: Loads immediately without fetching on request. - **SSG**, **ISR**
    - **Loads Before/After Render**: Slight delay before or after rendering. - **CSR**, **SSR**

:::info News
In 2019, Google introduced a set of metrics intent on measuring the actual performance of a website as the users would see it. These metrics are collectively called the Core Web Vitals.

- First Contentful Paint (FCP)
- Largest Contentful Paint (LCP)
- Cumulative Layout Shift (CLS) - doesn't measure time  ( CLS measures how much the content on a page moves around as other content is loaded and rendered. )
- First Input Delay (FID) -  measures whether the page is really done when the user thinks it’s done.

![core_web_vitals](/img/software-development/system-design/core_web_vitals.png)

More resources: [System Design — CSR vs SSR vs SSG](https://eishta.medium.com/system-design-csr-vs-ssr-vs-ssg-8e26dbb20b1d)
:::

## Overview of Rendering Techniques

1. **Client-Side Rendering (CSR)**
   - **Description**: Initial load fetches a bare HTML file. JavaScript and styles render the user interface in the browser.
   - **Use Case**: Single Page Applications (SPA), dynamic user interactions like forms, games, or chat applications.
2. **Server-Side Rendering (SSR)**
   - **Description**: Each request to the server generates and serves full HTML for the page.
   - **Use Case**: Applications that need SEO benefits or when the content must be fresh on each request.
3. **Static Site Generation (SSG)**
   - **Description**: Pages are pre-rendered at build time, serving static HTML files.
   - **Use Case**: Blogs or sites with mostly static content.
4. **Incremental Static Regeneration (ISR)**
   - **Description**: Combines SSG and dynamic updates by periodically revalidating pages.
   - **Use Case**: Content-heavy sites needing regular updates without a complete rebuild.

## Diagrams of Rendering Techniques

### Client-Side Rendering (CSR)

- **Definition**: CSR renders web pages directly in the browser using JavaScript after the initial HTML is loaded. The server delivers a minimal HTML shell, and JavaScript takes over to render the full user interface on the client side.
- **Rendering Type**: Client-side (no server-side rendering involved after the initial load).
- **Key Characteristics**:
    - Initial HTML file is often minimal.
    - Full rendering is performed by JavaScript in the browser.
    - Suitable for highly dynamic and interactive applications.
    
![csr](/img/software-development/system-design/csr.jpeg)

Source: [Visual Explanation and Comparison of CSR, SSR, SSG and ISR](https://dev.to/pahanperera/visual-explanation-and-comparison-of-csr-ssr-ssg-and-isr-34ea)

### Server-Side Rendering (SSR)

- **Definition**: SSR generates the full HTML for each page request on the server before sending it to the browser. This can improve performance and SEO by delivering fully-rendered pages directly from the server.
- **Rendering Type**: Server-side.
- **Key Characteristics**:
    - Each page request is processed and rendered on the server.
    - Full HTML is sent to the client.
    - Suitable for SEO and dynamic content that needs to be fresh.

![ssr](/img/software-development/system-design/ssr.jpeg)

Source: [Visual Explanation and Comparison of CSR, SSR, SSG and ISR](https://dev.to/pahanperera/visual-explanation-and-comparison-of-csr-ssr-ssg-and-isr-34ea)


### Static Site Generation (SSG)

- **Definition**: SSG pre-renders web pages at build time into static HTML files. These static pages are served directly by the server, without additional rendering, making it fast but less suited for highly dynamic content.
- **Rendering Type**: Build-time (static).
- **Key Characteristics**:
    - Pages are pre-built and served as static files.
    - Content is not rendered dynamically on each request.
    - Best for sites with static content like blogs.

![ssg](/img/software-development/system-design/ssg.jpeg)

Source: [Visual Explanation and Comparison of CSR, SSR, SSG and ISR](https://dev.to/pahanperera/visual-explanation-and-comparison-of-csr-ssr-ssg-and-isr-34ea)

### Incremental Static Regeneration (ISR)

- **Definition**: ISR is a hybrid approach where static pages are pre-rendered at build time, but updated or revalidated on the server periodically or on demand. This

![isr](/img/software-development/system-design/isr.jpeg)

Source: [Visual Explanation and Comparison of CSR, SSR, SSG and ISR](https://dev.to/pahanperera/visual-explanation-and-comparison-of-csr-ssr-ssg-and-isr-34ea)


## Comparison Table

- Key Points of Comparison
    - **Page Serve/Render Time**: CSR is faster than SSR after initial load but requires more client resources. SSR has higher initial load time but benefits SEO.
    - **Content Freshness**: ISR has a slight lag in content freshness compared to SSR, but it's more efficient than SSG.
    - **Resource Usage**: Static servers for SSG and ISR generally consume fewer resources than app servers needed for CSR and SSR.
- When to use which
    - **CSR** and **SSR**: Ideal for applications with dynamic interactions. CSR suits highly interactive UIs, while SSR benefits SEO and dynamic content needs.
    - **SSG** and **ISR**: Best for content-heavy sites. SSG is efficient for static content, while ISR provides a balance between static efficiency and content freshness.

| Metric                    | CSR                           | SSR                       | SSG                        | ISR                         |
|---------------------------|-------------------------------|---------------------------|----------------------------|-----------------------------|
| **Build Time**            | N/A                           | N/A                       | High                       | Moderate                    |
| **Dynamic Content**       | High                          | Moderate                  | Low                        | Moderate                    |
| **SEO**                   | Poor                          | Excellent                 | Excellent                  | Good                        |
| **Page Serve/Render Time**| Fast after initial load       | Slow per request          | Fast                       | Moderate                    |
| **Most Recent Content**   | Excellent                     | Excellent                 | Poor                       | Moderate                    |
| **Server Requirement**    | App Server                    | App Server                | Static Server              | Static Server               |

:::info CSR vs SSR
The main difference here is that:

for SSR, your server’s response to the browser is the HTML of your page that is ready to be rendered;
for CSR, the browser gets an empty document with links to your JavaScript.

![SSR_vs_CSR](/img/software-development/system-design/SSR_vs_CSR.jpg)

Source: [Next.js Framework For Full-stack and Frontend Development](https://itclub.com.au/next-js-framework/)
:::

