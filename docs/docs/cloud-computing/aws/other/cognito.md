---
title: Cognito
description: Cognito
keywords:
  - Cognito
sidebar_position: 1
---

AWS Cognito is a web and mobile app authentication, authorization, and user management service. With it, users can sign in using a username and password or a third-party service like Azure AD, Amazon, or Google. AWS Cognito has two main components; 
- **the User pools**, a user directory that allows users to sign in, and
- **the Identity pools**, which give users access to other AWS services.

The User pools and Identity pools can be used independently or jointly.

## Allowing unauthenticated guest access to your application using Amazon Cognito

You can use Amazon Cognito authentication as an alternative to directly using AWS Identity and Access Management (IAM) with both frontend SDKs and direct HTTPS requests.

You may want to use this form of authentication for the following reasons:

- Unauthenticated users - If you have a website with anonymous users, you can use Amazon Cognito identity pools. For more information, see the section on Allowing unauthenticated guest access to your application using Amazon Cognito.
- Your own authentication - If you would like to use your own authentication process, or combine multiple authentication methods, you can use Amazon Cognito Federated Identities. For more information, see [Getting Started with Federated Identities](https://docs.aws.amazon.com/cognito/latest/developerguide/getting-started-with-identity-pools.html) in the *Amazon Cognito Developer Guide*.

To enable unauthenticated identities in identity pool in console, go to identity pool in the aws console and click on edit identity pool. Now scroll down to unauthenticated identities and enable it. **Unauthenticated Identities** permissions. Now you can 
- **make unauthenticated calls using cognito sdk** 
- if you don't provide credentials, **you will be given credentials for the unauthenticated role**.

![unauthenticaed-identities](/img/aws/other/unauthenticaed-identities.jpeg)

Source: [Get started with Amazon Elasticsearch Service: Use Amazon Cognito for Kibana access control](https://aws.amazon.com/blogs/database/get-started-with-amazon-elasticsearch-service-use-amazon-cognito-for-kibana-access-control/)
## Single Sign-On (SSO) using AWS Cognito and Azure AD

Azure Active Directory (Azure AD) is a cloud-based identity and access management (IAM) solution for enterprises. You can think of it as the backbone of the Office 365 system, which syncs with on-premise Active Directory and provides OAuth authentication to other cloud-based applications.

Azure AD will act as an identity provider (IdP), and AWS Cognito will act as a service provider (SP).

Before granting the user access to AWS services, AWS Cognito verifies the user's rights with the identity provider while Azure AD checks user identification (e.g., emails, passwords) and asserts to AWS Cognito that the user should have access and that the user's identity if it is legitimate. 

Reference: [Single Sign-On (SSO) using AWS Cognito and Azure AD](https://blog.getambassador.io/single-sign-on-sso-using-aws-cognito-and-azure-ad-356951536218)
## Cognito User Pools vs Identity Pools
- Cognito User Pools (for authentication = identity verification):
  - Database of users for your web and mobile application
  - Allows to federate logins through Public Social, OIDC, SAML...
  - Can customize the hosted UI for authentication (including the logo)
  - Has triggers with AWS Lambda during the authentication flow

![create-pool](/img/aws/other/create-pool.png)

- Cognito Identity Pools (for authorization = access control):
  - Obtain AWS credentials for your users
  - Users can login through Public Social, OIDC, SAML & Cognito User Pools 
  - Users can be unauthenticated (guests)
  - Users are mapped to IAM roles & policies, can leverage policy variables

![fill-identity-pool-info](https://d33wubrfki0l68.cloudfront.net/097eeaf7495e94c86602857ab4e42a64023660d8/adb62/assets/cognito-identity-pool/fill-identity-pool-info.png)


**Summery**: CUP + CIP = manage user / password + access AWS services