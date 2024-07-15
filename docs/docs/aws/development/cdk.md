---
title: CDK
sidebar_position: 3
---

## Introduction

The AWS Cloud Development Kit (CDK) is an open-source software development framework for defining cloud infrastructure in code and provisioning it through AWS CloudFormation. It allows developers to use familiar programming languages like TypeScript, Python, Java, and C# to create and manage AWS resources, streamlining infrastructure development and enabling infrastructure as code (IaC). 

AWS CDK uses programming languages for a developer-centric approach, while Terraform is cloud-agnostic with its HCL for multi-cloud environments. CloudFormation is AWS-specific using JSON/YAML, and Pulumi supports multiple clouds using programming languages. Each tool's choice depends on project needs and workflows.

## Custom Resources

Custom resources in AWS CDK allow you to extend AWS CloudFormation templates to manage resources not natively supported by CloudFormation. They enable you to create, update, or delete resources dynamically during stack operations using Lambda functions or other AWS services.

### Provider

A **provider** in AWS CDK is a mechanism that supplies the custom resource functionality by defining how the custom resource interacts with AWS services. It typically involves:

1. **Lambda Function**: Executes the logic for create, update, and delete operations.
2. **Permissions**: Grants the necessary IAM permissions to the Lambda function to perform its actions.
3. **Service Token**: Used by the custom resource to communicate with the provider.

This setup enables you to manage resources that are not natively supported by CloudFormation through AWS CDK custom resources. 

### Example

Here’s an example of defining a custom resource using a Lambda provider:

```typescript
import * as cdk from 'aws-cdk-lib';
import * as customResources from 'aws-cdk-lib/custom-resources';
import * as lambda from 'aws-cdk-lib/aws-lambda';
import * as path from 'path';

const stack = new cdk.Stack();

const myFunction = new lambda.Function(stack, 'MyFunction', {
  runtime: lambda.Runtime.NODEJS_18_X,
  handler: 'index.handler',
  code: lambda.Code.fromAsset(path.join(__dirname, 'my-lambda-handler')),
});

const provider = new customResources.Provider(stack, 'MyProvider', {
  onEventHandler: myFunction,
});

new cdk.CustomResource(stack, 'MyCustomResource', {
  serviceToken: provider.serviceToken,
});
```

In this example:
- A Lambda function `myFunction` is defined.
- A `Provider` is created using the Lambda function.
- A `CustomResource` is created using the provider’s service token.

For more details, visit the [AWS CDK Custom Resources documentation](https://docs.aws.amazon.com/cdk/api/v2/docs/aws-cdk-lib.custom_resources-readme.html).



## Aspects

Aspects in AWS CDK are used when you need to apply common behaviors or policies to multiple constructs in your CDK application. This can include enforcing security standards, tagging resources, or applying common configurations across resources. 

In the below example scenario, imagine that you want to ensure that all S3 buckets in your stack have server-side encryption enabled. Instead of manually setting this property for each bucket, you can use an aspect to enforce this policy across all buckets.

- **Aspect Class**: `EnsureEncryptionAspect` implements `cdk.IAspect` and checks if a node is an S3 bucket. If the bucket does not have encryption enabled, it overrides the property to enable server-side encryption.
- **Applying the Aspect**: The aspect is added to the stack using `cdk.Aspects.of(this).add(new EnsureEncryptionAspect());`, ensuring all buckets in the stack have the encryption policy enforced.

```typescript
import * as cdk from 'aws-cdk-lib';
import { IConstruct } from 'constructs';
import * as s3 from 'aws-cdk-lib/aws-s3';

class EnsureEncryptionAspect implements cdk.IAspect {
  visit(node: IConstruct): void {
    if (node instanceof s3.Bucket) {
      if (!node.encryption) {
        node.addPropertyOverride('BucketEncryption.ServerSideEncryptionConfiguration', [{
          ServerSideEncryptionByDefault: { SSEAlgorithm: 'AES256' }
        }]);
      }
    }
  }
}

class MyStack extends cdk.Stack {
  constructor(scope: cdk.App, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    // Define multiple S3 buckets
    new s3.Bucket(this, 'MyBucket1');
    new s3.Bucket(this, 'MyBucket2');

    // Apply the encryption aspect to all constructs in the stack
    cdk.Aspects.of(this).add(new EnsureEncryptionAspect());
  }
}

const app = new cdk.App();
new MyStack(app, 'MyStack');
```