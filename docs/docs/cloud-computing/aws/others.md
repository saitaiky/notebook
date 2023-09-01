---
title: Others
description: Others
keywords:
  - Others
---

## Shared Responsibility Model

![shared-responsibility-model](/img/aws/other/shared-responsibility-model.jpg)

Source: [Shared Responsibility Model](https://aws.amazon.com/compliance/shared-responsibility-model/)

## AWS Managed Microsoft AD vs AD Connector vs Simple AD

- You should use AD Connector if you only need to **the on-premises users to log in to AWS applications** with their Active Directory credentials.
- Simple AD is the least expensive option and your best choice 
  - if you have >= 5,000 users
  - don't need the advanced Microsoft Active Directory features such as **trust relationships** with other domains.
- AWS Managed Microsoft AD would also allow you to run directory-aware workloads in the AWS Cloud. 
  - if you have > 5,000 users 
  - need a **trust relationship** set up between an AWS hosted directory and your on-premises directories.

## AWS Directory Service

:::cautionExam alert
The default inbound rules **allow traffic from any source (0.0.0.0/0)** to ports required by Active Directory. These rules do not introduce security vulnerabilities, **as traffic to the domain controllers is limited** to traffic from your VPC, other peered VPCs, or networks connected using AWS Direct Connect, AWS Transit Gateway or Virtual Private Network. 

If you see "Security Groups - Unrestricted Access." in a security check, you can ignore or suppress the red flag, in this scenario.
:::

AWS Directory Service for Microsoft Active Directory (Standard Edition or Enterprise Edition) is an actual Microsoft Active Directory in the AWS Cloud. It automatically creates an AWS security group in your VPC with network rules for traffic in and out of AWS managed domain controllers. 

In addition, the ENIs the security group is attached to, do not and cannot have Elastic IPs attached to them, limiting inbound traffic to local VPC and VPC routed traffic.

## CloudHSM (Hardware Security Module)

AWS CloudHSM (Hardware Security Module) is a cloud-based service that provides secure hardware for generating and storing cryptographic keys and performing cryptographic operations in a tamper-resistant environment.

:::infoKMS vs HSM
If you need to secure your encryption keys in a service backed by FIPS-validated HSMs, but you do not need to manage the HSM, you should use KMS.
:::

##  AWS Service Catalog

![sc-diagram-updated](/img/aws/other/sc-diagram-updated.png)

Source: [Initial Administrator Workflow](https://docs.aws.amazon.com/servicecatalog/latest/adminguide/what-is_concepts.html) & [AWS Service catalog](https://aws.amazon.com/servicecatalog/)

AWS Service Catalog lets you centrally manage your cloud resources to achieve governance at scale of your **infrastructure as code (IaC) templates**, written in CloudFormation or Terraform. With AWS Service Catalog, you can meet your compliance requirements while making sure your customers can quickly deploy the cloud resources they need.

To make your AWS Service Catalog products available to users who are not in your AWS account, such as users who belong to other organizations or other AWS accounts in your organization, you share your portfolios with them. You can share in several ways, including **account-to-account sharing, organizational sharing, and deploying catalogs using stack sets**.

### All copies of the catalog remain in sync

When you share a portfolio using **account-to-account sharing or AWS Organizations**, you allow an AWS Service Catalog administrator of another AWS account to import your portfolio into his or her account and distribute the products to end-users in that account.

This imported portfolio isn't an independent copy. The products and constraints in the imported portfolio **stay in sync with changes** that you make to the shared portfolio, the original portfolio that you shared. 


### TagOption library

To allow administrators to easily manage tags on provisioned products, Service Catalog provides a TagOption library. A TagOption is a key-value pair managed in Service Catalog. It is not an AWS tag, but serves as a template for creating an AWS tag based on the TagOption.

You can use TagOption library to enforce the tagging of all instances that will be launched in the VPC.

## Others

- Media server
  - **AWS Elemental MediaConvert** processes video files to prepare on-demand(streaming) content for distribution or archiving
- Data
  - **Amazon EMR** (previously called Amazon Elastic MapReduce) is a managed cluster platform that simplifies running big data frameworks, such as Apache Hadoop and Apache Spark, on AWS to process and analyze vast amounts of data. Using these frameworks and related open-source projects, you can process data for analytics purposes and business intelligence workloads. 
  - Aws neptune (Fully Managed Graph Database)
- Security
  - Amazon **GuardDuty** is a continuous security monitoring service that analyzes and processes the following data sources: AWS CloudTrail management event logs, AWS CloudTrail data events for S3, DNS logs, EKS audit logs, and VPC flow logs. <br/>
  It uses threat intelligence feeds, such as lists of malicious IP addresses and domains, and machine learning to identify unexpected and potentially unauthorized and malicious activity within your AWS environment. This can include issues like escalations of privileges, uses of exposed credentials, or communication with malicious IP addresses, or domains.
- Compliance
  - **AWS Artifact** is a central resource for **compliance-related information** that matters to your organization. For example, the Business Associate Addendum (BAA) is available for customers that need to comply with the Health Insurance Portability and Accountability Act (HIPAA). It is not a service, it's a no-cost, self-service portal for on-demand access to AWS’ compliance reports. (AWS Artifact可以檢閱和下載2,600 多個安全控管的報告和詳細資訊。AWS Artifact 入口網站可隨選存取 AWS 的資安及合規文件，包括 SOC 報告、PCI 報告，以及各地區、各種合規鍊下認證機構的認證。)
- **Amazon Inspector** is an automated security assessment service that helps you test the network accessibility of your Amazon EC2 instances and the security state of your applications running on the instances. 
- **AWS Compute Optimizer** helps avoid overprovisioning and underprovisioning four  types of AWS resources—Amazon Elastic Compute Cloud (EC2) instance types, Amazon Elastic Block Store (EBS) volumes, Amazon Elastic Container Service (ECS) services on AWS Fargate, and AWS Lambda functions—based on your utilization data.

## May need to jot after preparing exam

- IAM access analyzer
- EFS
  - Elastic throughput
  - MAX I/O
  - MAX throughput
  - Bursting Throughput
- VPC - Traffic mirroring
- AWS Datasync