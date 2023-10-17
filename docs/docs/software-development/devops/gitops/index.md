---
title: GitOps
---

> Reference: [Gitlab - What is GitOps?](https://about.gitlab.com/topics/gitops/#what-is-git-ops)

<iframe width="560" height="315" src="https://www.youtube.com/embed/JtZfnrwOOAw" title="YouTube video player" frameBorder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowFullScreen></iframe>

## What is GitOps? 

GitOps is an [operational](https://about.gitlab.com/topics/ops/) framework that takes **DevOps best practices** used for application development such as version control, collaboration, compliance, and CI/CD tooling, and applies them to infrastructure automation.

While the software development lifecycle has been automated, infrastructure has remained a largely manual process that requires specialized teams. With the demands made on today's infrastructure, it has become increasingly crucial to implement infrastructure automation. Modern infrastructure needs to be elastic so that it can effectively manage cloud resources that are needed for continuous deployments.

Modern applications are developed with speed and scale in mind. Organizations with a mature DevOps culture can deploy code to production hundreds of times per day. DevOps teams can accomplish this through **development best practices** such as *version control, code review, and CI/CD pipelines that automate testing and deployments*.

**GitOps is used to automate the process of provisioning infrastructure**. Similar to how teams use application source code, operations teams that adopt GitOps use configuration files stored as code (**infrastructure as code**). GitOps configuration files generate the same infrastructure environment every time it's deployed, just as application source code generates the same application binaries every time it's built.

### How do teams put GitOps into practice? 

GitOps is not a single product, plugin, or platform. There is no one-size-fits-all answer to this question, as the best way for teams to put GitOps into practice will vary depending on the specific needs and goals of the team. However, some tips on how to get started with GitOps include using a dedicated GitOps repository for all team members to share configurations and code, automating the deployment of code changes, and setting up alerts to notify the team when changes occur.

GitOps requires three core components:

> DevOps **GitOps** = IaC + MRs + CI/CD

### How to get started with GitOps

To get started with GitOps you need infrastructure that can be **declaratively managed**. Because of this, GitOps is often used as an operating model for [Kubernetes ](https://www.redhat.com/en/topics/containers/what-is-kubernetes)and [cloud-native application](https://www.redhat.com/en/topics/cloud-native-apps) development and can enable continuous deployment for Kubernetes.

But using Kubernetes is not a requirement of GitOps. GitOps is a technique that can be applied to other infrastructure and deployment pipelines.   

Like Kubernetes, Ansible is a desired state engine that enables declarative modeling of traditional IT systems and can therefore be used for GitOps. An Ansible user can manage applications on Kubernetes, on an existing IT infrastructure, or across both through one control plane using [Ansible modules](https://docs.ansible.com/ansible/2.9/modules/modules_by_category.html).

GitOps can be used to build development pipelines, code applications, manage configurations, provision Kubernetes clusters, and deploy on Kubernetes or container registries.


## What is the difference between GitOps and DevOps? 

There are a few key differences between GitOps and DevOps. For one, GitOps relies heavily on automation and tooling to manage and deploy code changes, while DevOps focuses more on communication and collaboration between teams. Additionally, GitOps is typically used in conjunction with containerization technologies like Kubernetes, while DevOps can be used with any type of application.

GitOps is a branch of DevOps that focuses on using git repositories to manage infrastructure and application code deployments. The main difference between the two is that in GitOps, the git repository is the source of truth for the deployment state, while in DevOps, it is the application or server configuration files.



## What is a GitOps workflow?

> TL;DR - GitOps can be considered an evolution in [Infrastructure as Code (IaC)](https://www.redhat.com/en/topics/automation/what-is-infrastructure-as-code-iac) that uses Git as the version control system for infrastructure configurations. IaC often follows a declarative approach to infrastructure management by defining the desired state of the system and tracking the system's actual state.

As with IaC, GitOps requires you to **declaratively describe the desired state of the system**. By using declarative tools, all of your configuration files and source code can be version controlled in Git.

[CI/CD pipelines](https://www.redhat.com/en/topics/devops/what-cicd-pipeline) are usually triggered by an external event, like code being pushed to a repository. In a GitOps workflow, changes are made using pull requests which modify state in the Git repository. 

To roll out a new release using a GitOps workflow, a pull request is made in Git, which makes a change to the declared state of the cluster. The GitOps operator, which sits between the GitOps pipeline and the orchestration system, picks up the commit and pulls in the new state declaration from Git.  

Once the changes are approved and merged, they will be applied automatically to the live infrastructure. Developers can continue to use their standard workflow and (CI/CD) practices.

When using GitOps with Kubernetes, the operator will often be a [Kubernetes Operator](https://www.redhat.com/en/topics/containers/what-is-a-kubernetes-operator). The operator compares the desired state in the repository to the actual state of the deployed infrastructure. The operator will update the infrastructure whenever a difference is noticed between the actual state and what exists in the repository. The operator can also monitor a container image repository and make updates in the same way to deploy new images.

Observability, which refers to any system that can be observed, is an important concept in GitOps. Observability in GitOps lets you ensure that the desired state and the observed state (or actual state) are the same.

Using pull requests and a version control system like Git introduces visibility into the deployment process. It lets you view and track any changes made to a system, provides an audit trail, and gives you the ability to roll back changes if something breaks.

GitOps workflows can increase productivity and the velocity of development and deployments, while improving the stability and reliability of systems.

## What makes GitOps work?

As with any emerging technology term, GitOps isn't strictly defined the same way by everyone across the industry. GitOps principles can be applied to all types of infrastructure automation including VMs and containers, and can be very effective for teams looking to manage Kubernetes-based infrastructure. While many tools and methodologies promise faster deployment and seamless management between code and infrastructure, GitOps differs by focusing on a developer-centric experience. Infrastructure management through GitOps happens in the same version control system as the application development, enabling teams to collaborate more in a central location while benefiting from Git's built-in features.


## Tools For GitOps

In the following table, I have described different tools for each process required from code push to deployment using GitOps. I recommend comparing the tools and use the one that suits you best according to your requirements: 

| Operation                   | Tools      |
| --------------------------- | ---------- |
| Code and Repository Storage | Git        | 
| Git Management              | GitHub     / GitLab / BitBucket |
| Continuous Integration      | Jenkins    / GitLab / CircleCI |
| Continuous Delivery         | Spinnaker  / GitLab / Flux |
| Container Registry          | DockerHub  / GitLab |
| Configuration Management / IaC    | Puppet     / Chef / Ansible |
| Infrastructure Provisioning | Terraform  / AWS Cloud Formation / Pulumi |
| Container Orchestration     | Kubernetes |