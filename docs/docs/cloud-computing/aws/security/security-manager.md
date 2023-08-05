---
title: Security Manager
description: Security Manager
sidebar_position: 3
---

- Newer service compared to SSM, meant for storing secrets
- Capability to force rotation of secrets every X days
- Automate generation of secrets on rotation (uses Lambda)
- Integration with Amazon RDS (MySQL, PostgreSQL, Aurora) 
- Secrets are encrypted using KMS
- Mostly meant for RDS integration

## SSM Parameter Store vs Secrets Manager

- Secrets Manager ($$$):
  - Automatic rotation of secrets with AWS Lambda
  - Lambda function is provided for RDS, Redshift, DocumentDB - KMS encryption is mandatory
  - Can integration with CloudFormation
- SSM Parameter Store ($):
  -  Simple API
  -  No secret rotation (can enable rotation using Lambda triggered by CW Events)
  -  KMS encryption is optional
  -  Can integration with CloudFormation
  -  Can pull a Secrets Manager secret using the SSM Parameter Store API

## Delete an exsisting key and create a new key with the same name

When you delete a secret, the Secrets Manager deprecates it with a seven-day recovery window. This means that you can't recreate a secret using the same name using the AWS Management Console until seven days have passed. You can permanently delete a secret without any recovery window using the AWS Command Line Interface (AWS CLI).

Run the `DeleteSecret` API call with the `ForceDeleteWithoutRecovery` parameter to delete the secret permanently. If you receive errors when running AWS CLI commands, make sure that you're using the most recent version of the AWS CLI. Secrets deleted using the `ForceDeleteWithoutRecovery` parameter can't be recovered or restored.


### Automatic secret key rotation

Secrets Manager uses a Lambda rotation function to communicate with both Secrets Manager and the database or service.

AWS Secrets Manager has built-in rotation support for secrets for the following:
- Amazon RDS databases
- Amazon DocumentDB databases
- Amazon Redshift clusters

Reference: [What is AWS Secrets Manager?](https://docs.aws.amazon.com/secretsmanager/latest/userguide/intro.html)