---
title: SSM
description: SSM
---

## AWS resource group

AWS resource group is a collection of related AWS resources, allowing you to organize and manage them together based on criteria like tags, resource types, or regions. It provides a consolidated view and simplifies management tasks by enabling actions on multiple resources simultaneously.

![Resource group](https://d2908q01vomqb2.cloudfront.net/972a67c48192728a34979d9a35164c1295401b71/2018/09/13/Picture1.png)

Resource: [Use new resource types in AWS Resource Groups to support day-to-day operations](https://aws.amazon.com/blogs/mt/use-new-resource-types-in-aws-resource-groups-to-support-day-to-day-operations/)


## SSM document

AWS SSM document, part of AWS Systems Manager, is a JSON or YAML script that defines the actions to be performed on instances. It can be used to automate operational tasks, such as software installation, configuration management, and security patching, across a fleet of instances in a consistent and scalable manner.

![SSM document](https://d2908q01vomqb2.cloudfront.net/972a67c48192728a34979d9a35164c1295401b71/2018/05/01/Image1-1.png)
Resource: [Writing your own AWS Systems Manager documents](https://aws.amazon.com/blogs/mt/writing-your-own-aws-systems-manager-documents/)


You can also run commands via SSM document and choose which EC2 targets you want to run the commands. 
- There are rate and error control parameters.
- You don't need SSH to connect to the EC2 instance.

![rc_create_doc_3](https://media.amazonwebservices.com/blog/2016/rc_create_doc_3.png)
Resource: [EC2 Systems Manager – Configure & Manage EC2 and On-Premises Systems](https://aws.amazon.com/blogs/mt/writing-your-own-aws-systems-manager-documents/)


## SSM automation

With AWS Automation, you can automate tasks like instance patching, software installations, and system maintenance, reducing manual effort and ensuring consistency and efficiency in your operations. Automation workflows can be triggered manually or scheduled to run at specific times or events.

![devops-992-02-Figure3](https://d2908q01vomqb2.cloudfront.net/972a67c48192728a34979d9a35164c1295401b71/2021/06/08/devops-992-02-Figure3.png)
Resource: [Use AWS Systems Manager Automation runbooks to resolve operational tasks](https://aws.amazon.com/blogs/mt/use-aws-systems-manager-automation-runbooks-to-resolve-operational-tasks/)


## Inventory & State Manager

### Inventory

AWS Inventory allows you to collect metadata about your managed instances, such as operating system details, installed software, and configuration settings. It provides a centralized inventory view of your resources, making it easier to track and manage them. 

You can use this information for compliance, auditing, and asset management purposes. Inventory data can be queried, filtered, and exported to other AWS services or external systems for further analysis and automation.

You can configure Inventory to collect the following types of data:
-   Applications: Application names, publishers, versions, etc.
-   AWS components: EC2 driver, agents, versions, etc.
-   Files: Name, size, version, installed date, modification and last accessed times, etc.
-   Network configuration: IP address, MAC address, DNS, gateway, subnet mask, etc.
-   Instance details: System name, operating systems (OS) name, OS version, DNS, domain, work group, OS architecture, etc.
-   Services: Name, display name, status, dependent services, service type, start type, etc.
-   Tags: Tags assigned to your nodes.

![inventory-cards](https://docs.aws.amazon.com/images/systems-manager/latest/userguide/images/inventory-cards.png)
Resource: [AWS Systems Manager Inventory](https://docs.aws.amazon.com/systems-manager/latest/userguide/systems-manager-inventory.html)

### State Manager

- Specify a schedule for applying the desired state to instances (**EC2/On- premises**) that you defined with the SSM document
- Use cases: bootstrap instances with software, patch OS/software updates on a schedule ...
- State Manager Association:
    - Defines the state that you want to maintain to your managed instances
    - Example: port 22 must be closed, antivirus must be installed ... 
    - Specify a schedule when this configuration is applied
- Uses SSM Documents to create an Association (e.g., SSM Document to configure CW Agent)

![association-details](https://static.us-east-1.prod.workshops.aws/public/f6ed2ac8-8808-4ca7-8456-c7ee04aba55c/static/remote_management/State_Manager/association-details.png)
Resource: [Configuration management using State Manager](https://catalog.workshops.aws/getting-started-with-com/en-US/remote-management/state-manager)

## Pack Manager

Patch Manager in SSM is a service that simplifies the process of patching and managing software(e.g. Windows and Amazon Linux) updates on instances. It provides automated patching capabilities, including patch assessment, approval workflows, and patch deployment. Patch Manager helps keep your instances secure and up to date with the latest patches and security updates.

## Session Manager

> TL;DR - Web interface as EC2 CLI

- Allows you to start a secure shell on your EC2 and on- premises servers
- Access through AWS Console, AWS CLI, or Session Manager SDK
- Does not need SSH access, bastion hosts, or SSH keys

:::infoWhy use Session manager instead of SSH?
> TL;DR - Way more control and a lot more compliance around it
Using SSH, you need to create inbound rules in security group for the users with specific IP addresses as a session to our instance, but using session manager, we don't need any inbound rules. 

You just need the instance with the SSM agents and the right IAM role, and then a user with a correct IAM permission can use session manager to run commands against our EC2 instance.

All the data of the session is going to be logged or could be logged into Amazon S3 or CloudWatch logs. In contract, if someone uses an SSH command into an EC2 instance, you do not have the history of all the commands that will run, and so **less security, less compliance**.
:::

## OpsWorks

OpsWorks lets you use Chef and Puppet to automate how servers are configured, deployed, and managed across your **Amazon EC2 instances or on-premises** compute environments.

- It’s an alternative to AWS SSM
- AWS OpsWorks = Managed **Chef & Puppet**
- Chef & Puppet help you perform server configuration automatically, or repetitive actions
- Chef / Puppet have similarities with SSM / Beanstalk / CloudFormation but they’re open-source tools that work cross-cloud