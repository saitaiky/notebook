---
title: GitOps
---

> Reference: [Gitlab - What is GitOps?](https://about.gitlab.com/topics/gitops/#what-is-git-ops)

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
