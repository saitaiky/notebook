---
title: Other Concepts
description: Other Concepts of AWS
keywords:
  - Others
---

## Shared Responsibility Model

![shared-responsibility-model](/img/aws/other/shared-responsibility-model.jpg)

Source: [Shared Responsibility Model](https://aws.amazon.com/compliance/shared-responsibility-model/)

## AWS Directory Service

:::cautionImportant Points
The default inbound rules **allow traffic from any source (0.0.0.0/0)** to ports required by Active Directory. These rules do not introduce security vulnerabilities, **as traffic to the domain controllers is limited** to traffic from your VPC, other peered VPCs, or networks connected using AWS Direct Connect, AWS Transit Gateway or Virtual Private Network. 

If you see "**Security Groups - Unrestricted Access**" in a security check, you can ignore or suppress the red flag, in this scenario.
:::

AWS Directory Service for Microsoft Active Directory (Standard Edition or Enterprise Edition) is an actual Microsoft Active Directory in the AWS Cloud. It automatically creates an AWS security group in your VPC with network rules for traffic in and out of AWS managed domain controllers. 

In addition, the ENIs the security group is attached to, do not and cannot have Elastic IPs attached to them, limiting inbound traffic to local VPC and VPC routed traffic.

## CloudHSM (Hardware Security Module)

AWS CloudHSM (Hardware Security Module) is a cloud-based service that provides **secure hardware** for generating and storing cryptographic keys and performing cryptographic operations in a tamper-resistant environment. To know more about HSM, read this [article](/linux/security/other/#what-is-hsm).

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

To allow administrators to easily manage tags on provisioned products, Service Catalog provides a TagOption library. A TagOption is a key-value pair managed in Service Catalog. **It is not an AWS tag**, but serves as a template for creating an AWS tag based on the TagOption.

Administrators can associate TagOptions with portfolios and products. During **a product launch (provisioning)**, AWS Service Catalog aggregates the associated portfolio and product TagOptions, and applies them to the provisioned product, as shown in the following diagram.

![TagOption-library](/img/aws/other/TagOption-library.png)

## Others

- Media server
  - **AWS Elemental MediaConvert** processes video files to prepare on-demand(streaming) content for distribution or archiving
- Data
  - **Amazon EMR** (previously called Amazon Elastic MapReduce) is a managed cluster platform that simplifies running big data frameworks, such as Apache Hadoop and Apache Spark, on AWS to process and analyze vast amounts of data. Using these frameworks and related open-source projects, you can process data for analytics purposes and business intelligence workloads. 
  - Aws neptune (Fully Managed Graph Database)
- Security
  - Amazon **GuardDuty** is a **continuous threat detection service** that analyzes and processes the following data sources: AWS CloudTrail management event logs, AWS CloudTrail data events for S3, DNS logs, EKS audit logs, and VPC flow logs. <br/><br/>
  It uses threat intelligence feeds, such as lists of malicious IP addresses and domains, and **machine learning** to identify unexpected and potentially unauthorized and malicious activity within your AWS environment. This can include issues like escalations of privileges, uses of exposed credentials, or communication with malicious IP addresses, or domains.
  ![guardduty-malware-protection-finding-selected](/img/aws/other/guardduty-malware-protection-finding-selected.png)
  Source: [New for Amazon GuardDuty](https://aws.amazon.com/blogs/aws/new-for-amazon-guardduty-malware-detection-for-amazon-ebs-volumes/)
  - **Amazon Macie** is a fully managed data security and data privacy service that uses machine learning and pattern matching to help you discover, monitor, and protect sensitive data in your AWS environment. Macie automates the discovery of sensitive data, such as personally identifiable information (PII) and financial data, to provide you with a better understanding of the data that your organization stores in Amazon S3(**Amazon Macie only supports S3 as a data source**).
  - **AWS Security Hub** supports automated security checks aligned to the **Center for Internet Security’s (CIS) AWS Foundations Benchmark** by enabling scans all user accounts/specific OU departments. These automated checks encompass 39 rules that continuously assess 38 CIS v1.4.0 requirements across 8 AWS services. The CIS AWS Foundations Benchmark serves as a set of security configuration best practices for AWS. 
  ![security-hub-cis](/img/aws/other/security-hub-cis.png) 
  :::infoCIS Benchmarks
  [CIS Benchmarks](https://www.cisecurity.org/cis-benchmarks/) from the Center for Internet Security (CIS) are a set of globally recognized and consensus-driven best practices to help security practitioners implement and manage their cybersecurity defenses. Developed with a global community of security experts, the guidelines help organizations proactively safeguard against emerging risks. Companies implement the CIS Benchmark guidelines to limit configuration-based security vulnerabilities in their digital assets.
  :::
  - **AWS Artifact** is a central resource for **compliance-related information** that matters to your organization. For example, the Business Associate Addendum (BAA) is available for customers that need to comply with the Health Insurance Portability and Accountability Act (HIPAA). It is not a service, it's a no-cost, self-service portal for on-demand access to AWS’ compliance reports. (AWS Artifact可以檢閱和下載2,600 多個安全控管的報告和詳細資訊。AWS Artifact 入口網站可隨選存取 AWS 的資安及合規文件，包括 SOC 報告、PCI 報告，以及各地區、各種合規鍊下認證機構的認證。)
- Management
  - **[AWS Control Tower](https://aws.amazon.com/controltower/)**  simplifies the setup and management of a multi-account AWS environment with governance "**guardrails**" and defined baseline. If you want to *create or manage your multi-account AWS environment with best practices*, use AWS Control Tower. AWS Control Tower orchestrates multiple AWS services on your behalf while maintaining the security and compliance needs of your organization, such as 
    - AWS CloudFormation to establish a baseline
    - AWS Organizations service control policies (SCPs) to prevent configuration changes
    - AWS Config rules to continuously detect non-conformance


## May need to jot in the future 

- AWS Datasync automates and accelerates moving data between on premises and AWS Storage services.
- **OpenSearch** Dashboards is a community-driven project forked from Kibana and is distributed under the Apache License 2.0, which is an open-source license.
  - Kibana is developed by Elastic and is distributed under the Elastic License, which is not an open-source license. In contrast, OpenSearch Dashboards is a community-driven project forked from Kibana and is distributed under the Apache License 2.0, which is an open-source license. 