---
title: API Gateway
description: API Gateway
keywords:
  - API Gateway
sidebar_position: 4
---


## Restrict access by using CORS

Cross-origin resource sharing (CORS) defines a way for client web applications that are loaded in one domain to interact with resources in a different domain

## Invalidate caching for the API clients 

Header Cache-Control: max-age=0

![](/img/aws/integration-messaging/invalidate-caching-for-api-clients.png)

## 3 types of authorizations

### IAM policy

### Amazon Cognito user pool

As an alternative to using IAM roles and policies or Lambda authorizers (formerly known as custom authorizers), you can use an Amazon Cognito user pool to control who can access your API in Amazon API Gateway.

### Lambda authorizers

There are two types of Lambda authorizers:

-   A token-based Lambda authorizer (also called a TOKEN authorizer) receives the caller's identity in a bearer token, such as a JSON Web Token (JWT) or an OAuth token. For an example application, see Open Banking Brazil - Authorization Samples on GitHub.

-   A request parameter-based Lambda authorizer (also called a REQUEST authorizer) receives the caller's identity in a combination of headers, query string parameters, stageVariables, and $context variables.

For WebSocket APIs, only request parameter-based authorizers are supported.