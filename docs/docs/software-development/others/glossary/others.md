---
title: Others
description: Others
---

## What does LTS mean?
LTS stands for long term support. Here, support means that throughout the lifetime of a release there is a commitment to update, patch and maintain the software. For an LTS, there is a shorter development cycle, where engineers and contributors add to the body of the release. And a longer beta testing cycle, where more testing and bug fixing takes place to focus on a release’s performance and stability. 

Without long term support, software can become a security risk. Vulnerabilities develop over time and without mechanisms to patch or update them, systems become exposed and perform worse the longer they remain out-of-date. 

On the other hand, if users stick with the same release too long their system will start to fall behind. While some key features are occasionally backported to old releases, development moves forward. The latest is typically the greatest.

Reference: [What is an Ubuntu LTS release?](https://ubuntu.com/blog/what-is-an-ubuntu-lts-release)

## Emulators and Simulators

> Reference: [Emulators and Simulators](https://www.browserstack.com/emulators-simulators)

The terms ’emulators’ and ‘simulators’ are often used interchangeably, but they have very different sets of capabilities. Let’s look at each to make the difference clearer.

![emulator-vs-simulator](/img/software-development/others/emulator-vs-simulator.png)

Source: [What is the Difference Between Emulators and Simulators?](https://www.racksolutions.com/news/blog/what-is-the-difference-between-emulator-and-simulator/#:~:text=Emulators%20enable%20a%20computer%20system,configuration%20of%20another%20target%20device.)

### Emulators

Emulators mimic your target device’s hardware and software on your workstation. Android Emulator (by Android Developer Studio) is a popular example.

-  **Capabilities**: The emulator can give you virtual device instances with near-native capabilities and extended controls to adjust the devices’ physical sensors, battery state, geolocation, and more.
-  **Limitations**: These near-native capabilities come with a significant performance overhead, mostly due to binary translation.
    
    It is possible to speed up the ABI translation through hardware-assisted virtualization (also known as hardware acceleration). If the mobile device you’re emulating has the same **ISA** as your computer, the emulator can skip the translation and run the virtual device directly on your workstation’s hardware.
    - First, there’s the precondition–the ISAs of your computer and target mobile device need to match. Most commercially available mobile devices run on ARM’s architecture. Almost all computers work on Intel x86. Their ISAs are categorically different from each other.
    - You also need a sizable list of hypervisor components just to enable hardware acceleration. These are tricky to set up, even for the more experienced programmers.

:::info ISA -  Instruction Set Architecture
All computers–including mobile devices–work on an **ISA**, that is, Instruction Set Architecture. This is a set of instructions written in machine-language that your processor understands. Different processor families (think Intel, AMD, ARM, etc.) have their own instruction set architectures, which they implement in their own ways.
:::

### Simulators

Simulators let you run programs that were not made for your computer’s OS. Simulators for mobile app testing are commonly used by testers to run their code, especially in the early stages. **In the context of this post, ‘simulator’ refers to the iPhone and iPad simulator in XCode**. You can also think of them as mobile simulators (especially for iPhones).

:::info Note
There are no ‘**Android simulators**’, largely because it’s simpler to emulate Android devices with freely available tools like Quick Emulator (QEMU).
:::

- **Capabilities**: The iOS simulator is significantly faster than Android emulator, purely because there’s no machine-language translation involved.
- **Limitations**: The simulator cannot mimic battery states or cellular interrupts, unlike the Android emulator.
  - You also cannot use the iOS simulator on platforms other than macOS. This is because the simulator needs Apple’s native Cocoa API–a massive library of frameworks–to handle GUI, runtime, and more.
  - Porting Cocoa to a different platform is far too much trouble. Instead, developers virtualize macOS on their computer hardware–or procure a MacBook.



## Company's IP 

Intellectual property – or IP – refers to anything that has been created, like designs, inventions, brand names, and literary works.

IP is protected by law, for example through copyright, patents, and trade marks, so the author has sole authorisation over who can use and distribute their work.

Businesses take reasonable steps to protect fixed assets, like their stock and equipment. But intangible assets can be more difficult to secure.

Intellectual property (IP) is an intangible asset. Your IP isn’t physical in nature, but patents, trade marks and copyrights can all add value to your business.

Reference: [What is intellectual property?](https://www.simplybusiness.co.uk/knowledge/articles/2021/05/what-is-intellectual-property/#:~:text=Intellectual%20property%20%E2%80%93%20or%20IP%20%E2%80%93%20refers,use%20and%20distribute%20their%20work.)

## Workflow 

### SOP

Standard Operating Procedures (SOPs) are written documents or work instructions that detail all of the steps involved in a procedure or process. The SOP development services include end-to-end level mapping of processes and formatting SOPs to your template and organization structures.

The basis of Standard Operating Procedures is about systematizing processes and documenting them. Organizational activities and operations are aligned to work in accordance to industrial regulations and governmental regulations with the help of SOPs. It distinctly defines the roles and responsibilities of workers by proving descriptions of who does what and when, allowing for accountability and consistency throughout the workplace.

### SOW

Statement of Work (SOW) is a project management document that regulates the cooperation between two companies. Usually, it is part of the contract or a service agreement. Statement of Work defines and clarifies every aspect of the project, including schedules, terms, work standards, payment method, as well as acceptance criteria for deliveries. 

As a matter of fact, a high-quality SOW should cover every critical point of the work. 

![sow](/img/software-development/others/sow.webp)
Reference: [Statement of Work (SOW) Document in Software Development: Everything You Need To Know](https://relevant.software/blog/statement-of-work-sow-in-software-development-everything-to-know/#Purpose_of_Statement_of_Work_SOW_Document)

### WIP

The term work-in-progress (WIP) is a production and supply-chain management term describing partially finished goods awaiting completion. WIP refers to the raw materials, labor, and overhead costs incurred for products that are at various stages of the production process.

In software development WIP is the number of tasks one developer is working on in a specific moment.


## Cloud computing

### SaaS

Software as a service (SaaS) is a software distribution model in which a cloud provider hosts applications and makes them available to end users over the internet. In this model, an independent software vendor (ISV) may contract a third-party cloud provider to host the application. Or, with larger companies, such as Microsoft, the cloud provider might also be the software vendor.

SaaS is one of three main categories of cloud computing, alongside infrastructure as a service (IaaS) and platform as a service (PaaS). A range of IT professionals, business users and personal users use SaaS applications.

![what-is-sass](/img/software-development/others/glossary/what-is-saas.png)
Reference: [What is SaaS?](https://azure.microsoft.com/en-gb/resources/cloud-computing-dictionary/what-is-saas/)

#### Examples
| Platform Type | Common Examples                                                                                                         |
| ------------- | ----------------------------------------------------------------------------------------------------------------------- |
| SaaS          | Google Workspace, Dropbox, Salesforce, Outlook, Hotmail, Yahoo! , Concur, GoToMeeting                                                 |
| PaaS          | AWS Elastic Beanstalk, Windows Azure, Heroku, Force.com, Google App Engine, Apache Stratos, OpenShift                   |
| IaaS          | DigitalOcean, Linode, Rackspace, Amazon Web Services (AWS), Cisco Metapod, Microsoft Azure, Google Compute Engine (GCE) |

If you’ve used a web-based email service such as Outlook, Hotmail or Yahoo! Email, then you’ve already used a form of SaaS. With these services, you log into your account over the Internet, often from a web browser. The email software is located on the service provider’s network, where your messages are also stored. You can access your email and stored messages from a web browser on any computer or Internet-connected device.

The previous examples are free services for personal use. For organisational use, you can rent productivity apps, such as email, collaboration and calendaring, and sophisticated business applications such as customer relationship management (CRM), enterprise resource planning (ERP) and document management. You pay for the use of these apps by subscription or according to the level of use.

## Database

### Data Catalog

The earliest challenges that inhibited building a data lake were keeping track of all of the raw assets as they were loaded into the data lake, and then tracking all of the new data assets and versions that were created by data transformation, data processing, and analytics. Thus, an essential component of a data lake built on Amazon S3 is the Data Catalog. The Data Catalog provides an interface to query all assets stored in data lake S3 buckets. The Data Catalog is designed to provide a single source of truth about the contents of the data lake.

### Heterogeneous Database Migrations  (異構數據庫遷移)

AWS provides [AWS Database Migration Service](https://aws.amazon.com/dms/) for Heterogeneous Database Migration


## Hypervisor


A hypervisor, also known as a virtual machine monitor (VMM), is a software or hardware component that creates and manages multiple virtual environments, known as virtual machines (VMs), on a single physical computer. It allows these VMs to run independently, each with its own operating system and applications, while sharing the underlying hardware resources such as CPU, memory, storage, and networking. The hypervisor ensures isolation, security, and efficient resource allocation among the virtual machines, enabling better utilization of the physical hardware and facilitating server consolidation and cloud computing.

![how-does-a-hypervisor-work-1500x732](/img/software-development/others/how-does-a-hypervisor-work-1500x732.png)

Source: [What Is a Hypervisor? – Types, Benefits & How Does It Work?](https://www.parkplacetechnologies.com/blog/what-is-hypervisor-types-benefits/)

If that definition isn’t intuitive for you, allow us to take one step back. To understand what a hypervisor is, you must know about virtual machines, an advance on physical servers. Think back to the early days of computing. In that era, each physical server could only have one operating system. There was no partitioning and workloads affected each other. It was a fine way to do things, but limited.

Enter virtualization. This technology allows multiple virtual machines to run on one server. Now, a single piece of equipment in the physical world can actually look and act like multiple independent servers in the virtual world. (We’ll get to the advantages of a virtualization environment in a moment.)

A hypervisor might be hardware, or it could be a program to manage virtual machines, whether software or firmware. What makes a hypervisor a hypervisor is what it’s used for—it creates, monitors, and manages virtual machines.

:::infoHypervisor vs. Virtual Machine?
It is possible to have VMs without a hypervisor. Such virtualization typically takes the form of containers, basically tinier, cheaper, more portable VMs that use the same O/S as the host machine.

It’s probably best to think of hypervisors and VMs as a package deal, however, with containers representing a different architecture with its own advantages and use cases.
:::