---
title: "Linux Package Manager"
metaTitle: "Syntax Highlighting is the meta title tag for this page"
metaDescription: "This is the meta description for this page"
---

## To-be translated

以原始碼的方式來安裝軟體，也就是利用廠商釋出的 Tarball 來進行軟體的安裝。不過，你應該很容易發現，那就是每次安裝軟體都需要偵測作業系統與環境、設定編譯參數、實際的編譯、 最後還要依據個人喜好的方式來安裝軟體到定位。這過程是真的很麻煩的，而且對於不熟整個系統的朋友來說，還真是累人啊！

那有沒有想過，如果我的 Linux 系統與廠商的系統一模一樣，那麼在廠商的系統上面編譯出來的執行檔， 自然也就可以在我的系統上面跑囉！也就是說，廠商先在他們的系統上面編譯好了我們使用者所需要的軟體， 然後將這個編譯好的可執行的軟體直接釋出給使用者來安裝，如此一來，由於我們本來就使用廠商的 Linux distribution ，所以當然系統 (硬體與作業系統) 是一樣的，那麼使用廠商提供的編譯過的可執行檔就沒有問題啦！ 說的比較白話一些，那就是利用類似 Windows 的安裝方式，由程式開發者直接在已知的系統上面編譯好，再將該程式直接給使用者來安裝，如此而已。

那麼如果在安裝的時候還可以加上一些與這些程式相關的資訊，將他建立成為資料庫，那不就可以進行安裝、反安裝、 升級與驗證等等的相關功能囉 (類似 Windows 底下的『新增移除程式』)？確實如此，在 Linux 上面至少就有兩種常見的這方面的軟體管理員，分別是 RPM 與 Debian 的 dpkg 。

## What are package managers
In Linux Package Managers are essentially software applications that help users to: Search, Download, Install, Remove and Update software applications on their computer operating system. These can be either Command Line tools or a complete Graphical User Interface application.

Experienced Linux users will very rarely download software from websites or any other location. The primary reasons for this included aspects as ease of use, security and the fact that most Linux distributions have a list of sources where users can download free open source software packages.

These package sources are referred to as repositories. Using a package manager users will automatically download the appropriate, package from a configured repository, install it and complete all the required configuration tasks. There is no need to for the user to click through a wizard screen or hunt down configuration settings. If packages version are updated within package repository, the package manager will update each package to its latest version whenever it is requested by the user to do so.

### What is a package ?

In Linux a package is a compressed software archive file that contains all the files that comes with a software application delivers any kind of functionality, this can be any kind of command line utility,GUI application or a software library.

A package may consist of a binary executable, configuration file and other software dependencies. Common types of Linux packages include .deb, .rpm, and .tgz. Linux packages don’t usually contain the dependencies necessary to install them, therefore Linux distributions use package managers to automatically read dependencies files and download the packages needed before proceeding with the installation.

The package usually includes a manifest of dependencies that must be satisfied for a software application to execute as expected on any give Linux computer.

:::info Package in Javascript package manager
If you are using Javascript package manager like npm or yarn, the packages that you download don't need to be compiled.

Becuase Javascript executes in runtime (namely the browser, node.js and Deno). 

JavaScript is a dynamic language and is also interpreted (well, mostly) and out of the usual runtimes, all of them use a [JIT compiler](https://blog.bitsrc.io/the-jit-in-javascript-just-in-time-compiler-798b66e44143) to optimize it during execution.

> Further reading: [Should You Compile Your JavaScript Code?](https://blog.bitsrc.io/should-you-compile-your-javascript-code-a857ad2e3032)
:::


## The Linux package managers
All Linux distributions don't use the same package manager. The Debian family, which includes Ubuntu, uses apt-get and dpkg. Where possible, apt-get should be preferred since it will resolve all dependencies; dpkg doesn't resolve dependencies but it can work directly with *.deb files. Also, apt-get invokes dpkg for low-level operations. Other relevant Debian tools are apt-cache and aptitude.

In RedHat, Fedora and SUSE distributions, rpm is the low-level package manager. Arch Linux uses pacman. Slackware distribution includes pkgtools and slackpkg but neither of these resolve dependencies. Slackware takes a unique approach. They distribute packages as intended by original creators. They give full control to administrators by not resolving dependencies.

It's common for distributions to offer graphical interfaces for those users who aren't comfortable with remembering or typing commands. YaST (openSUSE) and Synaptic (Debian) are two examples of GUIs. For those comfortable with commands, look up this handy reference.

### RPM 與 DPKG

由於自由軟體的蓬勃發展，加上大型 Unix-Like 主機的強大效能，讓很多軟體開發者將他們的軟體使用 Tarball 來釋出。 後來 Linux 發展起來後，由一些企業或社群將這些軟體收集起來製作成為 distributions 以發佈這好用的 Linux 作業系統。但後來發現到，這些 distribution 的軟體管理實在傷腦筋， 如果軟體有漏洞時，又該如何修補呢？使用 tarball 的方式來管理嗎？又常常不曉得到底我們安裝過了哪些程式？ 因此，一些社群與企業就開始思考 Linux 的軟體管理方式。

目前在 Linux 界軟體安裝方式最常見的有兩種，分別是：

dpkg：
這個機制最早是由 Debian Linux 社群所開發出來的，透過 dpkg 的機制， Debian 提供的軟體就能夠簡單的安裝起來，同時還能提供安裝後的軟體資訊，實在非常不錯。 只要是衍生於 Debian 的其他 Linux distributions 大多使用 dpkg 這個機制來管理軟體的， 包括 B2D, Ubuntu 等等。

RPM：
這個機制最早是由 Red Hat 這家公司開發出來的，後來實在很好用，因此很多 distributions 就使用這個機制來作為軟體安裝的管理方式。包括 Fedora, CentOS, SuSE 等等知名的開發商都是用這咚咚。

|distribution(Distro) |軟體管理機制   |使用指令   |Command to install dependency   |
|---|---|---|---|
|Red Hat/Fedora   |RPM	   |rpm, rpmbuild   |YUM (yum)   |
|Debian/Ubuntu   |DPKG   |dpkg   |APT (apt-get)   |

![Package manager](/img/linux/package-manager.jpg)
Package managers used in different Linux distributions. Source: The Linux Foundation 2015, ch. 7, sec. 5.

Source: [22.1.1 Linux 界的兩大主流: RPM 與 DPKG](http://linux.vbird.org/linux_basic/0520rpm_and_srpm.php#intro_import2)

### How would a package manager know the location of the repository?

Every package manager has associated configuration files that point to repository locations. 
- For example, in Ubuntu, `/etc/apt/sources`.list contains the locations of repositories. This would include the official repos but users can also update this file for getting packages from other repos. 
- Likewise, configuration for Fedora and CentOS distributions are at `/etc/yum.conf` for YUM and `/etc/dnf/dnf.conf` for DNF. For Arch Linux, it is at `/etc/pacman.conf` when pacman is used.

When adding third-party repos to a package manager, users must take care to check that those repos can be trusted. This is important so that you don't end up with a malware infecting your system. In fact, this is one of the problems solved by **trusted repos**. Instead of downloading software from a third-party website, downloading it via the package manager from a trusted repo is a more secure practice.

## Language package managers

Modern languages are delivered as a core part that comes with the default installation plus a wide range of optional packages that can be installed when necessary. Those that manage these add-ons are called language package managers. Within the scope of a project or application, the term dependency manager is used. The term package manager is used at system/language level whereas dependency manager is used at project level. For example, in PHP, PEAR can be called a package manager while Composer is a dependency manager.

Let's say, you're working on a Python project. This may depend on many other Python packages for correct execution. Moreover, another Python project will have its own dependencies. A dependency manager helps developers manage these dependencies and share their project settings in a consistent manner with others.

Here are some examples, in the format of "language: (manager, repository)":

- Python: (pip, PyPI)
- PHP: (Composer, Packagist)
- Ruby: (RubyGems, RubyGems), (Bundler, Bundler)
- Node.js and JavaScript: (NPM, NPM), (Yarn, (Yarn, NPM))
- Web frontend: (Bower, Bower), (Yarn, (Yarn, NPM))
- Java: (Maven, Maven), (Gradle, (Ivy, Maven, etc.))


## What is the difference between Homebrew and Cask?

### Homebrew

According to the Howbrew website, Homwbrew is amissing package manager for OS X which allows you to installs the stuff you need that Apple didn’t. Homebrew typically deals with command line software. Most of the software is distributed under an open source licence. See the [Formulas](https://formulae.brew.sh/formula/) for a list of available installs.

> `brew` [prefers pre-compiled binaries](https://docs.brew.sh/FAQ#why-do-you-compile-everything) but will compile from source in some cases

### Homebrew Cask

Cask extends Homebrew and brings its elegance, simplicity, and speed to OS X applications and large binaries alike. `brew cask` is an extension to brew that allows management of graphical applications through the [Cask](https://caskroom.github.io/) project. Cask offers a way for command line to manage the installation of graphical applications.

## Further reading

- [Package Management Essentials: apt, yum, dnf, pkg](https://www.digitalocean.com/community/tutorials/package-management-basics-apt-yum-dnf-pkg)
- [Lockfile](/software-development/others/lockfile)