---
title: package manager
---


## Install locally vs globally

- If you’re installing something that you want to use in your program, using require('whatever'), then install it locally, at the root of your project.
- If you’re installing something that you want to use in your shell, on the command line or something, install it globally, so that its binaries end up in your PATH environment variable.

## dependency vs devDependencies

-   [`dependencies`](https://github.com/npm/npm/blob/2e3776bf5676bc24fec6239a3420f377fe98acde/doc/files/package.json.md#dependencies) are installed on both:
    -   `npm install` from a directory that contains `package.json`
    -   `npm install $package` on any other directory
-   [`devDependencies`](https://github.com/npm/npm/blob/2e3776bf5676bc24fec6239a3420f377fe98acde/doc/files/package.json.md#devdependencies) are:
    -   also installed on `npm install` on a directory that contains `package.json`, unless you pass the `--production` flag (go upvote [Gayan Charith's answer](https://stackoverflow.com/a/31229205/895245)), or if the `NODE_ENV=production` environment variable is set
    -   not installed on `npm install "$package"` on any other directory, unless you give it the `--dev` option.
    -   are not installed transitively.

:::info Use case of `devDependencies` - [source](https://stackoverflow.com/questions/11700487/how-do-i-add-a-newline-in-a-markdown-table)

`dependencies` are required to run, `devDependencies` only to develop, e.g.: unit tests, CoffeeScript to JavaScript transpilation, minification, ...

If you are going to develop a package, you download it (e.g. via `git clone`), go to its root which contains `package.json`, and run:

```
npm install
```

Since you have the actual source, it is clear that you want to develop it, so by default, both `dependencies` (since you must, of course, run to develop) and `devDependency` dependencies are also installed.

If however, you are only an end user who just wants to install a package to use it, you will do from any directory:

```
npm install "$package"
```

In that case, you normally don't want the development dependencies, so you just get what is needed to use the package: `dependencies`.

If you really want to install development packages in that case, you can set the `dev` configuration option to `true`, possibly from the command line as:

```
npm install "$package" --dev
```
:::

## npm vs npx

### NPM

The [**NPM:**](https://www.geeksforgeeks.org/node-js-npm-node-package-manager/) stands for **Node Package Manager **and itis the default package manager for [**Node.js.**](https://www.geeksforgeeks.org/introduction-to-nodejs/) [It ](https://www.geeksforgeeks.org/introduction-to-nodejs/)is written entirely in [**JavaScript, **](https://www.geeksforgeeks.org/javascript-tutorial/)developed by  [*Isaac Z. Schlueter*](https://www.linkedin.com/in/isaacschlueter), it was initially released on January 12, 2010. The **npm **manages all the packages and modules for node.js and consists of command-line client **npm**. It gets installed into the system with the [**installation of node.js.**](https://www.geeksforgeeks.org/installation-of-node-js-on-windows/) The required packages and modules in the Node project are installed using **npm**. A package contains all the files needed for a module and modules are the JavaScript libraries that can be included in the Node project according to the requirement of the project.


### NPX

**The npx stands for **Node Package Execute** and it comes with the npm, when you installed npm above 5.2.0 version then automatically npx will installed. It is an npm package runner that can execute any package that you want from the npm registry without even installing that package.

This is pretty useful, mostly because:

1.  you don't need to install anything
2.  you can run different versions of the same command, using the syntax @version


### Compairson

| npm                                                                                                                                     | npx                                                                                                                                                                     |
|-----------------------------------------------------------------------------------------------------------------------------------------|-------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| If you wish to run package through npm then you have to specify that package in your package.json and install it locally.               | A package can be executable without installing the package. It is an npm package runner so if any packages aren’t already installed it will install them automatically. |
| To use `create-react-app` in npm the commands are `npm install create-react-app` then `create-react-app myApp` (Installation required). | In npx you can create a react app without installing the package:  `npx create-react-app myApp`  <br />This command is required in every app’s life cycle only once.          |
| Npm is a tool that use to install packages.                                                                                             | Npx is a tool that use to execute packages.                                                                                                                             |
| Packages used by npm are installed globally. You have to care about pollution in the long term.                                         | Packages used by npx are not installed globally. You don’t have to worry about for pollution in the long term.                                                          |