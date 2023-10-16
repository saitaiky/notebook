---
title: STS
description: STS
keywords:
  - STS
sidebar_position: 6
---
## How to use STS to decode authorization failure message when making AWS CLI commands?

Use STS `decode-authorization-message`

If a user is not authorized to perform an action that was requested, the request returns a Client.UnauthorizedOperation response (an HTTP 403 response). The message is encoded because the details of the authorization status can constitute privileged information that the user who requested the operation should not see. 

To decode an authorization status message, a user must be granted permissions via an IAM policy to request the `DecodeAuthorizationMessage` (`sts:DecodeAuthorizationMessage`) action.