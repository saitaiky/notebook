---
title: DevOps
---

## Overview

![shift left, shift right](/img/software-development/devops/devops-shift-left-right.webp)

Source: [Shift left vs shift-right: A DevOps mystery solved](https://www.dynatrace.com/news/blog/what-is-shift-left-and-what-is-shift-right/#:~:text=and%20reliability%20criteria.-,What%20does%20shift%2Dleft%20mean%20in%20DevOps%3F,side%20of%20the%20DevOps%20lifecycle.)

To understand shift left and shift right, consider the software development cycle as a continuum, or infinity loop, from left to right. On the left side of the loop, teams plan, develop, and test software in pre-production. The main concern in pre-production on the left side of the loop is building software that meets design criteria. When teams release software into production on the right side of the loop, they make the software available to users. The concern in production is to maintain software that meets business goals and reliability criteria.

### Various roles in loop

When you consider the left-hand side of the infinity loop as **the product side** and the right-hand side as **the operation side**...

On the production side, the product manager who pushes a new feature into production is interested in seeing how the project breaks up into tasks and user stories. The developer on the left side of the project needs to see how to move the feature into production including project tickets, users stories, and dependencies. If developers adhere to the DevOps principle of “**you build it, you run it**”, they are also interested in incident remediation. 

Moving to the operations side of the life cycle, the site reliability engineer needs to understand the services that can be measured and monitored, so if there's a problem, it can be fixed. If you don’t have a toolchain that ties all these processes together, you have a messy, uncorrelated, chaotic environment. If you have a well-integrated toolchain, you can get better context into what is going on.  

### What does shift-left mean in DevOps?

> TL;DR - Ability to pull data for specific entities (processes, services, applications, tests …) through an Automation API and feed it into the tools that are used to decide on whether to stop the pipeline or keep it running

Shift-left is the practice of moving testing, quality, and performance evaluation early in the software development process to answer the key question: “**Is this a good or a bad change we try to push towards production?**” And if it is bad, don’t push it further down the pipeline!

This concept has become increasingly important as teams face pressure to deliver software faster and more frequently with higher quality. Shift-left speeds up development efficiency and reduces costs by detecting and addressing software defects earlier in the development cycle before they get to production.


### What does shift-right mean in DevOps?

> TL;DR - Ability to push deployment information and meta data to your monitoring environment, e.g: differentiate BLUE vs GREEN deployments, push build or revision number of deployment, notify about configuration changes …

Shift-right is the practice of performing testing, quality, and performance evaluation in production under real-world conditions. Shift-right methods ensure that applications running in production can withstand real user load while ensuring the same high levels of quality.

With shift-right, DevOps teams test a built application to ensure performance, resilience, and software reliability. The goal is to **detect and remediate issues that would be difficult to anticipate in development environments.**

Various types of test suites can be: 
- A/B testing
- Synthetic monitoring
- Chaos testing
- Deployment (Canary releases / Blue-green deployment)

### DevOps toolchain

A DevOps toolchain includes the tools and technology that enable development and operations teams to collaborate across the entire software lifecycle. It tackles key DevOps fundamentals including [continuous integration](https://www.atlassian.com/continuous-delivery/continuous-integration), [continuous delivery](https://www.atlassian.com/continuous-delivery/principles/pipeline), [automation](https://www.atlassian.com/devops/automation-tutorials), and [collaboration](https://www.atlassian.com/work-management/project-collaboration/collaborative-culture/build-collaborative-communication).

Since DevOps is a cultural shift where development and operations work as an integrated unit, there isn't a single tool that enables DevOps principles and practices. Instead, a DevOps toolchain is a collection of tools, often from a variety of vendors, that operate as an integrated unit to design, build, test, manage, measure, and operate software and systems. Often, organizations and teams need to experiment with different combinations of tools to find the right toolchain.

If you look across a sophisticated DevOps product, the DevOps toolchain should be able to tackle different parts of the development lifecycle very quickly and offer multiple lenses for different users. It should include development tools that address each phase of the development lifecycle, including continuous integration and delivery, [test automation](https://www.atlassian.com/devops/devops-tools/test-automation), and high-speed deployment.

On the operations side of DevOps, tools should include functionality that helps with [monitoring](https://www.atlassian.com/devops/devops-tools/devops-monitoring) and [incident management](https://www.atlassian.com/incident-management). Plus, tools should bridge development and operations by providing continuous feedback and logging.

## DevOps Best Practices

> TL;DR - DevOps best practices include [agile](https://www.atlassian.com/agile) project management, shifting left with CI/CD, automation, monitoring, observability, and continuous feedback.

> This section is mostly copied from: [atlassian - DevOps Best Practices](https://www.atlassian.com/devops/what-is-devops/devops-best-practices#:~:text=DevOps%20best%20practices%20include%20agile,%2C%20observability%2C%20and%20continuous%20feedback.)

### 1. Agile project management

[Agile](https://www.atlassian.com/agile) is an iterative approach to project management and software development that helps teams deliver value to their customers faster and with fewer headaches. Agile teams focus on delivering work in smaller increments, instead of waiting for a single massive release date. Requirements, plans, and results are evaluated continuously, allowing teams to respond to feedback and pivot as necessary.

The following are key concepts for agile project management:

-   Start with a workflow that includes four phases: to do, in progress, code review, and done. [Read more about workflows](https://www.atlassian.com/agile/project-management/workflow).
-   Teams need to break large-scale projects into smaller tasks and respond to changes in needs or scope as they make progress. [Read more about how to use epics, stories, and themes](https://www.atlassian.com/agile/project-management/epics-stories-themes) to scope and structure work.
-   How do you plan, track, and measure the incremental work? [Scrum](https://www.atlassian.com/agile/scrum) and [kanban](https://www.atlassian.com/agile/kanban) are core frameworks for teams practicing agile methodology.

### 2. ​​​​​​​Shift left with CI/CD

When teams "shift left", they bring testing into their code development processes early. Instead of sending [multiple changes](https://www.atlassian.com/itsm/change-management/best-practices) to a separate test or QA team, a variety of tests are performed throughout the coding process so that developers can fix bugs or improve code quality while they work on the relevant section of the codebase. The practice of continuous integration and  continuous delivery (CI/CD), and deployment underpins the ability to shift left. [Read more about CI/CD](https://www.atlassian.com/continuous-delivery).

From this
![Manual release steps: Dev, QA, Tools, Infrastructure, Platform, Release, InfoSec](/img/software-development/devops/manual-release.png)

Source: [atlassian - Continuous delivery](https://www.atlassian.com/continuous-delivery)

To this

![Continuous delivery pipeline steps: Developer, Laptop, Bitbucket, Bitbucket pipelines, Customers](/img/software-development/devops/continuous-delivery-pipeline.png)

Source: [atlassian - Continuous delivery](https://www.atlassian.com/continuous-delivery)

### ​​​​​​​3. Build with the right tools

**A DevOps toolchain** requires the right tools for each phase of the DevOps lifecycle, with key capabilities to improve software quality and speed of delivery. Read more about [how to choose DevOps tools](https://www.atlassian.com/devops/devops-tools/choose-devops-tools) and review functionality for each phase of the [DevOps lifecycle](https://www.atlassian.com/devops/devops-tools).

### 4. ​​​​​​​Implement automation

Continuous integration and delivery allows developers to merge code regularly into the main repository. Instead of manually checking code, CI/CD automates this process, from batching in a specified window to frequent commits. In addition to CI/CD, [automated testing](https://www.atlassian.com/devops/devops-tools/test-automation) is essential to successful DevOps practices. Automated tests might include end-to-end testing, unit tests, integration tests, and performance tests. Read more about incorporating automation into your software development processes. [Read more about automation](https://www.atlassian.com/solutions/devops/guides/intermediate). 

### ​​​​​​​5. Monitor the DevOps pipeline and applications

It's important to monitor the [DevOps pipeline ](https://www.atlassian.com/devops/devops-tools/devops-pipeline)so a broken build or failed test doesn't cause unnecessary delays. Automation improves the speed of development tremendously, but if there is a failure in an automated process and nobody knows about it, you're better off doing the work manually. In a similar vein, it's important to monitor production applications in order to identify failures or performance deficiencies, before you hear about them from your customers. 

### 6. ​​​​​​​Observability

As the industry moved away from monolithic, on-premise systems and applications to cloud-native, microservice-based applications, monitoring is now considerably more complex. As a result, there is an increasing interest in observability. It is often said that the three pillars of observability are logs, traces, and metrics. 

- Logs are generated by most systems components and applications and consist of time-series data about the functioning of the system or application. 
- Traces track the flow of logic within the application. 
- Metrics include CPU/RAM reservation or usage, disk space, network connectivity, and more. Observability simply means using all three of these sources of information in aggregate to make discoveries and predictions about the functioning of a complex system, which would otherwise be difficult to achieve. [Read more about observability](https://www.atlassian.com/solutions/devops/guides/advanced). 

### 7. ​​​​​​​Gather continuous feedback

Continuous feedback ensures team members have all the information needed to do their jobs on a timely basis. From the development perspective this entails that the team is alerted to any pipeline failures immediately. It also means that clear, thorough code test results are made available to the developers as quickly as possible. 

From the product management perspective the team is made aware of any production failures or performance deficiencies, or reported bugs. In the past there was widespread belief that a development team could only optimize for speed or quality. Continuous feedback is one of the elements of DevOps that makes it possible to have both.

### 8. ​​​​​​​Change the culture

DevOps requires collaboration, transparency, trust, and empathy. If your organization is one of the rare ones where these qualities are already established, it should be fairly easy for your teams to adopt DevOps practices. If not, some effort will be required to develop these qualities. The most common organizational structures are siloed, meaning different teams have separate areas of ownership and responsibility and there is minimal cross-team communication or collaboration. For DevOps to succeed, these barriers must be eliminated by adopting the **["you build it, you run it" practice](https://www.atlassian.com/incident-management/devops/you-built-it-you-run-it)** mentioned awhile ago - [a 2006 interview with Amazon CTO Werner Vogels](https://queue.acm.org/detail.cfm?id=1142065). 

This doesn't mean there aren't people or teams who specialize, only that the lines of communication and collaboration between teams are open and used. [Read more on building your team culture](https://www.atlassian.com/solutions/devops/guides/beginner). 


## Reference

- [Considerations for your DevOps toolchain](https://www.atlassian.com/devops/devops-tools/choose-devops-tools)
- [Atlassian - DevOps Best Practices](https://www.atlassian.com/devops/what-is-devops/devops-best-practices#:~:text=DevOps%20best%20practices%20include%20agile,%2C%20observability%2C%20and%20continuous%20feedback.)