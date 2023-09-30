---
title: Cost
description: Cost
keywords:
  - Cost
---

## What are the types of AWS cost allocation tags?

:::infoOnly a Master account can activate this AWS generated tags feature
If you have a Master account for AWS, you can activate AWS generated tags from the Billing and Cost Management console. You must know that if you activate the tags from your master account, it will activate tags for all the member accounts as well.
:::

:::infoUse Tag Editor to attach tag to resources
AWS Resource Groups Tag Editor to identify resources lacking tags in each account. Tag Editor shows you any tags that are attached to resources. It also shows you whether those tags were added in Tag Editor, by the resource's service console, or by using the API.
![te_manage_tags_selected](/img/aws/management/cost/te_manage_tags_selected.png)
:::

There are two types of cost allocation tags: AWS-generated cost allocation tags and User-defined cost allocation tags 

![cost-allocation-tags-console](/img/aws/management/cost/cost-allocation-tags-console.png)

### AWS-generated cost allocation tags

![amazon_cost_allocation_tags](/img/aws/management/cost/amazon_cost_allocation_tags.png)


The AWS-generated tag `createdBy` defines and applies to supported AWS resources for cost allocation purposes. To use the AWS-generated tags, a management account owner must activate it in the Billing and Cost Management console. When a management account owner activates the tag, it is also activated for all member accounts.

After the tag is activated, AWS starts applying the tag to resources that are created after the AWS-generated tag was activated. The AWS-generated tags are available only in the Billing and Cost Management console and reports, and doesn't appear anywhere else in the AWS console, including the AWS Tag Editor. The `createdBy` tag does not count towards your tags per resource limit.

AWS-generated cost allocation tags do not apply to all AWS services. Specifically, they apply to:

- AWS CloudFormation
- Amazon Elastic Compute Cloud (EC2)
- Amazon Elastic Beanstalk
- Amazon S3 Glacier
- Amazon ElasticCache
- AWS Data Pipeline
- Amazon Kinesis
- Elastic Load Balancing
- Amazon Relational Database Service

### User-defined cost allocation tags

User-defined cost allocation tags - You create these custom tags to organize resource consumption and related costs according to your preferences. You create the tags using the [AWS Tag Editor](https://docs.aws.amazon.com/awsconsolehelpdocs/latest/gsg/tag-editor.html). By using the "user:" prefix, these tags can identify who created a specific resource, for example.

Here is an example of how the tags might appear in two Amazon EC2 instances (for example, Cost Center and Stack):

![cost-allocation-tags](/img/aws/other/cost-allocation-tags.png)

Source: [Using AWS cost allocation tags](https://docs.aws.amazon.com/awsaccountbilling/latest/aboutv2/cost-alloc-tags.html)

### Automation tags

![SOAF36-Automation-Tag](/img/aws/management/cost/SOAF36-Automation-Tags.png)




## Billing Alerts & AWS Budgets

### Billing Alerts

You can turn on billing alert in your Preferences page

![billing-alerts](/img/aws/management/cost/billing-alerts.png)

### AWS Budget

![aws-budgets-dashboard](/img/aws/management/cost/aws-budgets-dashboard.png)

AWS Budgets give you the ability to set custom budgets that alert you when your costs or usage exceed (or are forecasted to exceed) your budgeted amount.

You can also use AWS Budgets to set reservation utilization or coverage targets and receive alerts when your utilization drops below the threshold you define. **Reservation alerts** are supported for Amazon EC2, Amazon RDS, Amazon Redshift, Amazon ElastiCache, and Amazon Elasticsearch reservations.

### Billing Alerts vs AWS Budgets

![aws-budget](/img/aws/management/cost/aws-budget.png)

Source: [Control Your AWS Costs](https://aws.amazon.com/getting-started/hands-on/control-your-costs-free-tier-budgets/)

[Billing Alerts](https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/monitor_estimated_charges_with_cloudwatch.html#creating_billing_alarm_with_wizard) are very limited as compared to [Budgets](https://docs.aws.amazon.com/awsaccountbilling/latest/aboutv2/budgets-managing-costs.html). Most notably, the billing alarm represents only the amount you have been already charged. In contrast, a budget can alarm you based on **forecasted charges**, which can give you a bit of head up to figure out what's happening before you get hit with excess bill usage.

The other key difference is that Budgets allow you to create **filtered alarms**, only for some regions and services of interest. Filtering by region is not possible with billing alerts. Another thing is that budget support **linked accounts**, which again is not possible with the billing alerts.

Finally, budgets are far **easier** to use, set up and manage, than billing alerts.


## AWS Compute Optimizer

**AWS Compute Optimizer** generates **performance and cost recommendations** to these four  types of AWS resources: EC2 instance types, EBS volumes, ECS services on AWS Fargate, and AWS Lambda functions—based which helps avoid overprovisioning and underprovisioning.

![AWS-Compute-Optimizer-Recommendations](/img/aws/management/cost/AWS-Compute-Optimizer-Recommendations.png)

![aws-computer-optimizer-lambda](/img/aws/management/cost/aws-computer-optimizer-lambda.png)

### Savings Plans

![aws-savings-plans-details](/img/aws/management/cost/aws-savings-plans-details.jpg)

**Savings Plans** are a pricing model that offers discounted prices on regular On-Demand Instances when you commit to one or three years of use. A Savings Plan requires you to make an aggregate per dollar per hour commitment, such as $7.77/hour for one year.

The payment options for the Savings Plans can be:

- No Upfront
- Partial Upfront
- All Upfront

Take note that in reserving your computing capacity, you'll gain **the most discount if you paid everything upfront**. This means that the cheapest option among the payment options above is the All Upfront type, and conversely, the most expensive one is the No Upfront.

:::infoSavings Plans in EC2 vs Reserved Instances
**Reserved Instances** are based on the commitment to use an instance at a particular price over a specific period, while **Savings Plans** are based on the commitment to spend a particular dollar amount per hour over a specific period.
:::

## AWS Cost Explorer

![cost-explorer](/img/aws/management/cost/cost-explorer.png)

Cost Explorer is a tool that enables you to view and analyze your costs and usage. You can explore your usage and costs using the main graph, the Cost Explorer cost and usage reports, or the Cost Explorer RI reports. You can view data for up to the last 13 months, **forecast how much you're likely to spend for the next three months**, and get recommendations for what Reserved Instances to purchase. 

You can use Cost Explorer to identify areas that need further inquiry and see trends that you can use to understand your costs.