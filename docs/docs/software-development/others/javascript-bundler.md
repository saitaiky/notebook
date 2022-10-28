---
title: JS bundler
---

The JavaScript world has changed a lot in the last few years. Gone are the days of manually including jQuery, Bootstrap, and React on every page of your site. Nowadays, it's all about bundling everything up into one static file that you can load with just a single line of code.

Module bundlers are the way to organize and combine many files of JavaScript code into one file. A JavaScript bundler can be used when your project becomes too large for a single file or when you're working with libraries that have multiple dependencies.

## Features

A bundler is a development tool that combines many JavaScript code files into a single one that is production-ready loadable in the browser. A fantastic feature of a bundler is that it generates a **dependency graph** as it traverses your first code files. This implies that beginning with the entry point you specified, the module bundler keeps track of both your source files’ dependencies and third-party dependencies. This dependency graph guarantees that all source and associated code files are kept up to date and error-free.

Apart from providing a consistent tooling environment that saves you from the pain of dependencies, many popular module bundlers also come with performance optimization features. Code splitting and hot module replacement are examples of these functionalities. JavaScript bundlers also have productivity-enhancing features such as robust error logging, which lets developers easily debug and repair errors.


## How does a bundler work?

Overall, a bundler's operation is divided into two stages: dependency graph generation and eventual bundling.

### Mapping a Dependency Graph

The first thing a module bundler does is generate a relationship map of all the served files. This process is called Dependency Resolution. To do this, the bundler requires an entry file which should ideally be your main file. It then parses through this entry file to understand its dependencies.

Following that, it traverses the dependencies to determine the dependencies of these dependencies. Tricky, eh? It assigns unique IDs to each file it sees throughout this process. Finally, it extracts all dependencies and generates a dependency graph that depicts the relationship between all files.

Why is this process necessary?

-   It enables the module to construct a dependency order, vital for retrieving functions when a browser requests them.
-   It prevents naming conflicts since the JS bundler has a good source map of all the files and their dependencies.
-   It detects unused files allowing us to get rid of unnecessary files.

### Bundling

After receiving inputs and traversing its dependencies during the Dependency Resolution phase, a bundler delivers static assets that the browser can successfully process. This output stage is called Packing. During this process, the bundler will leverage the dependency graph to integrate our multiple code files, inject the required function and `module.exports` object, and return a single executable bundle that the browser can load successfully.


## Which bundler should you use?

There are many different module bundlers in the JavaScript ecosystem and each with its unique bundling method. For example `webpack, broswerify, parcel, esbuild and rollup` each of them has their own benefits and drawbacks.

Honestly, it's tough to determine which of these bundlers is the best overall because each offers distinctive features that may be ideal for your requirements. For example, if you're creating a large app with complex features, such as an e-commerce app, and want complete control over your configurations, Webpack is a fantastic option. On the other hand, Fusebox might be an attractive alternative if you're developing a hobby project and enjoy working with Typescript.

I'd say that regardless of the option you take, **performance and development workflow** metrics should be your north star.