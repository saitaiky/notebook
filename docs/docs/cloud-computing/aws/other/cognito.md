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

On the other hand, Azure Active Directory (Azure AD) is a cloud-based identity and access management (IAM) solution for enterprises. You can think of it as the backbone of the Office 365 system, which syncs with on-premise Active Directory and provides OAuth authentication to other cloud-based applications.

Azure AD will act as an identity provider (IdP), and AWS Cognito will act as a service provider (SP).

Before granting the user access to AWS services, AWS Cognito verifies the user's rights with the identity provider while Azure AD checks user identification (e.g., emails, passwords) and asserts to AWS Cognito that the user should have access and that the user's identity if it is legitimate. The Single Sign-On authentication is based on the following steps:

-   The user visits an application, which sends them to an AWS Cognito-hosted website.
-   AWS Cognito determines the user's origin (by client id, application subdomain, and so on) and leads them to the identity provider for authentication. In our case, to the Azure Active Directory login page. This is a request for SAML authentication.
-   The user is redirected to an SSO URL on their browser. The user either already has an active browser session with the identity provider or creates one by logging in. The identity provider (Azure AD) creates the authentication response in the XML document format, which could contain the user's username, email address (and additional characteristics if set), and it is then signed with an X.509 certificate. The result is returned to the service provider (AWS Cognito) --- This is the authentication response for SAML.
-   The authentication response is retrieved and validated using the certificate fingerprint by the service provider, who already knows the identity provider and has a certificate fingerprint. With the access token in the URL, the user's identity is confirmed, and the user is granted app access.

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