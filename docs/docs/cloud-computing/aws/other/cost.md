## What are the types of AWS cost allocation tags?

:::infoOnly a Master account can activate this AWS generated tags feature
If you have a Master account for AWS, you can activate AWS generated tags from the Billing and Cost Management console. You must know that if you activate the tags from your master account, it will activate tags for all the member accounts as well.
:::

There are two types of cost allocation tags: AWS-generated cost allocation tags and User-defined cost allocation tags 

![cost-allocation-tags-console](/img/aws/other/cost-allocation-tags-console.png)

### AWS-generated cost allocation tags

AWS-generated cost allocation tags - Amazon Web Services or the AWS Marketplace ISV creates, defines, and applies these tags on your behalf. This means you have no control over these tags and can't customize them. They have an "*aws:createdBy*" format.

You can apply and compute these tags when you create a new AWS resource that is supported.

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

![SOAF36-Automation-Tag](/img/aws/other/SOAF36-Automation-Tags.png)




You can turn on billing alert in your Preferences page.

![billing-alerts](/img/aws/cost/billing-alerts.png)