---
title: Cognito, IAM Identity Center 
description: Cognito
keywords:
  - Cognito
sidebar_position: 1
---
 
## Cognito
AWS Cognito is a web and mobile app authentication, authorization, and user management service. With it, users can sign in using a username and password or a third-party service like Azure AD, Amazon, or Google. AWS Cognito has two main components; 
- **the User pools**, a user directory that allows users to sign in, and
- **the Identity pools**, which give users access to other AWS services.

The User pools and Identity pools can be used independently or jointly.

### Allowing unauthenticated guest access to your application using Amazon Cognito

You can use Amazon Cognito authentication as an alternative to directly using AWS Identity and Access Management (IAM) with both frontend SDKs and direct HTTPS requests.

You may want to use this form of authentication for the following reasons:

- Unauthenticated users - If you have a website with anonymous users, you can use Amazon Cognito identity pools.
- Your own authentication - If you would like to use your own authentication process, or combine multiple authentication methods, you can use Amazon Cognito Federated Identities. For more information, see [Getting Started with Federated Identities](https://docs.aws.amazon.com/cognito/latest/developerguide/getting-started-with-identity-pools.html) in the *Amazon Cognito Developer Guide*.

To enable unauthenticated identities in identity pool in console, go to identity pool in the aws console and click on edit identity pool. Now scroll down to unauthenticated identities and enable it. **Unauthenticated Identities** permissions. Now you can 
- **make unauthenticated calls using cognito sdk** 
- if you don't provide credentials, **you will be given credentials for the unauthenticated role**.

![unauthenticaed-identities](/img/aws/management/cognito/unauthenticaed-identities.jpeg)

Source: [Get started with Amazon Elasticsearch Service: Use Amazon Cognito for Kibana access control](https://aws.amazon.com/blogs/database/get-started-with-amazon-elasticsearch-service-use-amazon-cognito-for-kibana-access-control/)

### Integrate with Azure AD

> Azure AD will act as an identity provider (IdP), and AWS Cognito will act as a service provider (SP).

![sso-ad](/img/aws/management/cognito/sso-ad.png)
Image credit: Double Octopus

Azure Active Directory (Azure AD) is a cloud-based identity and access management (IAM) solution for enterprises. You can think of it as the backbone of the Office 365 system, which syncs with on-premise Active Directory and provides OAuth authentication to other cloud-based applications.

Before granting the user access to AWS services, AWS Cognito verifies the user's rights with the identity provider while Azure AD checks user identification (e.g., emails, passwords) and asserts to AWS Cognito that the user should have access and that the user's identity if it is legitimate. Check the offical document for the [full authentication flow](https://docs.aws.amazon.com/cognito/latest/developerguide/cognito-user-pools-saml-idp-authentication.html)

Reference: [Single Sign-On (SSO) using AWS Cognito and Azure AD](https://blog.getambassador.io/single-sign-on-sso-using-aws-cognito-and-azure-ad-356951536218)


### Cognito User Pools vs Identity Pools
- Cognito User Pools (**for authentication = identity verification**):
  - Database of users for your web and mobile application
  - Allows to federate logins through Public Social, OIDC, SAML...
  - Can customize the hosted UI for authentication (including the logo)
  - Has triggers with AWS Lambda during the authentication flow

![create-pool](/img/aws/management/cognito/create-pool.png)

- Cognito Identity Pools (**for authorization = access control**):
  - Obtain AWS credentials for your users
  - Users can login through Public Social, OIDC, SAML & Cognito User Pools 
  - Users can be unauthenticated (guests)
  - Users are mapped to IAM roles & policies, can leverage policy variables

![fill-identity-pool-info](https://d33wubrfki0l68.cloudfront.net/097eeaf7495e94c86602857ab4e42a64023660d8/adb62/assets/cognito-identity-pool/fill-identity-pool-info.png)

**Summery**: CUP + CIP = manage user / password + access AWS services


## Custom Login URL

:::cautionOne account, one alias
Your AWS account can have only one alias. If you create a new alias for your AWS account, the new alias overwrites the previous alias. The URL containing the previous alias stops working. 
Also, the account alias must be unique across all AWS products and must contain only lowercase letters, digits, and hyphens.
:::

The AWS account root user and AWS IAM users in the account sign in using a web URL. If you want the URL for your IAM users to contain your company name (or another easy-to-remember identifier) instead of the AWS account ID, you can create an **account alias**.

The sign-in page URL for your account's IAM users has the following format, by default:

https://123456789123.signin.aws.amazon.com/console/

If you create an AWS account alias for your AWS account ID, the IAM user sign-in page URL looks like the following example:

https://tutorialsdojo.signin.aws.amazon.com/console/

## IAM Identity center

### Credential report

![IAM-CredentialReport](/img/aws/management/cognito/IAM-CredentialReport.png)

You can generate and download a credential report that lists all users in your account and the status of their various credentials, including passwords, access keys, and MFA devices. You can get this credential report from the AWS Management Console, the AWS SDKs and Command Line Tools, or the IAM API.

### AWS SSO

:::infoReplacement
Please check [AWS IAM Identity Center](https://aws.amazon.com/iam/identity-center/) as the successor to AWS SSO
:::

:::infoA permission set
A permission set is a collection of administrator-defined policies that AWS SSO uses to determine a user’s effective permissions to access a given AWS account. Permission sets can contain either AWS-managed policies or custom policies that are stored in AWS SSO. 

![sso](/img/aws/management/cognito/sso.png)
:::

AWS SSO manages access to all your AWS Organizations accounts, AWS SSO-integrated applications, and other business applications that support the Security Assertion Markup Language (SAML) 2.0 standard. This allows you to assign and manage your employees’ access to multiple AWS accounts, SAML-enabled cloud applications (such as **Salesforce, Microsoft 365, and Box**), and custom-built in-house applications, all from a central place.

AWS SSO automatically provides you with **a store** by default, which you can use to manage your users and groups within AWS SSO. 
- If you choose to **store them in AWS SSO,** create your users and groups and assign their level of access to your AWS accounts and applications. 
- Alternatively, you can choose to connect to Your **External Identity Provider** using Azure Active Directory or connect to your Microsoft AD Directory using AWS Directory Service.
