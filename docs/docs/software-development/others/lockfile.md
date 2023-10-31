
> TL;DR - Always commit the lock file to your source repository **if your project is an application!** If you don't, package managers would miss important imformation about installed packages without a lock file. It may result in installing two different modules from the same dependency definition.

### What is a Lock file?

Many people decide to ignore the lock files and they do not commit it to Git. What is a lock file and why should your repository contain one?

A lock file contains important information about installed packages and it should always be committed into your [Package Manager](https://developerexperience.io/practices/package-management) source repositories. Not committing the lock file to your source control results in installing two different modules from the same dependency definition.

**A lock file:**

-   Is generated automatically for any operation
-   Describes the dependency tree and its changes, so the coworkers are guaranteed to install exactly the same dependencies
-   Lets you "travel back in time" and check any former dependency tree
-   Allows your Package Manager to skip repeated metadata resolutions for previously-installed packages and, therefore, makes the installation much faster


### Lock File in repo?

The package managers need more than just the configuration information - they need the exact version of each dependency installed. Remember to always commit your lock files to your source repositories!

-   The lock file guarantees a consistent install across machines.
-   Your Package Manager will use the lock file to resolve and install modules.
-   The lock file locks the specific version, location, and integrity hash for every package.
-   The lock file ensures that the install creates the same version every time, no matter what device.

#### Ask these questions before 

Depends on what your project is:

- Is your project an application? Then: **Yes**, you can include the lock file
- Is your project a library? If so: **No**, you shouldn't include the lock file

Only the `yarn.lock`-file of the top level project will be used. So unless ones project will be used standalone and not be installed into another project, then there's no use in committing any `yarn.lock`-file -- instead it will always be up to the `package.json`-file to convey what versions of dependencies the project expects then.

### Common Pitfalls of the Lock File
- The lock file is being ignored
- The lock file is not committed in the source repository
- The lock file is rewritten by hand and it can lose its functions