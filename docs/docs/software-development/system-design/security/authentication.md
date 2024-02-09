---
title: Authentication (Identity verification)
---

Authentication is the process of proving you are who you say you are when accessing an application.

## Session vs. Token-Based Authentication

Session-based authentication is a method where the server maintains a record of user session information, typically stored in server memory or a database, which is referenced using session IDs stored in the user's cookies. Token-based authentication, on the other hand, issues a token (often a JWT, or JSON Web Token) upon successful login, which the client then includes in the HTTP header for subsequent requests, allowing stateless verification of the user's identity without server-side session storage.

The main difference between token and traditional session-based authentication is that session-based authentication is **stateful**. The server stores the session ID and user info in memory or in a separate session cache, which can become complex as the system or number of users scale. Also, cookies often face challenges with **Cross-Origin Resource Sharing (CORS)** when APIs are served from different domains.

Token-based authentication is not always stateless, though. Many API tokens are still stored in a database table so they can be verified or revoked.

Here is a comparison table summarizing key differences:

| Feature | Session-Based | Token-Based |
|---------|---------------|-------------|
| State | Stateful (server stores session) | Stateless (server does not store user session) |
| Storage | Server-side | Client-side (usually local storage) |
| Scalability | Lesser (due to server memory usage) | Better (no session data on server) |
| Portability | Cookies tied to a single domain | Tokens can be used across different domains and applications |
| Revocation | Sessions can be deleted server-side | Tokens are not easily revoked before expiry |

:::infoJWT
JWTs are a particularly popular flavor of token-based authentication because they save user data inside the token and can be validated without the database lookups mentioned above. This makes them well-suited for serverless and stateless applications. That said, being stateless is both an advantage in terms of scalability and a disadvantage the application cannot easily be revoked or invalidated on the server-side, introducing risk. (Because of this, they typically use shorter expiration times.) We'll explore JWT in the coming section.
:::

## OAuth 2.0

OAuth 2.0 is an open standard for authorization that enables third-party applications to access user data from a service provider without exposing the user's credentials. It is widely used for granting websites or applications access to user information on other websites but without giving them the passwords. This is done through a process that issues tokens to authorized clients.

:::infoAuth0
[Auth0](https://auth0.com/) is a cloud-based identity management platform that provides authentication and authorization as a service.  It is a commercial product that implements protocols like `OAuth 2.0` and `OpenID` Connect among others, to allow developers to implement complex identity solutions for their applications without having to build them from scratch.
:::

:::infoAuth0 vs. OAuth: What Is the Difference? 
Auth0 and OAuth (Open Authorization) are both authentication and authorization systems that are used to secure web and mobile applications. However, there are some key differences:

| Auth0                                                                                                                                                                            | 0Auth                                                                                                                      |
|----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|----------------------------------------------------------------------------------------------------------------------------|
| Auth0  is a cloud-based platform that provides a wide range of authentication and authorization services, such as social login, single sign-on, and multi-factor authentication. | OAuth  is a protocol that defines a set of rules for securely granting access to resources.                                |
| Auth0  provides an API, libraries, and SDKs that can be used to integrate authentication and authorization functionality into your applications.                                 | OAuth  is a protocol that is implemented by applications and services, rather than being provided as a standalone service. |
| Auth0  supports a wide range of authentication and authorization protocols, including OAuth, SAML, and JWT.                                                                      | OAuth  is primarily focused on enabling authorization for APIs.                                                            |                                                         |
:::

### Components

- **Resource Owner**: Usually the end-user who owns the data or has rights to access the protected resources.
- **Client**: The application that wants to access the user's data on the service provider. It must be registered with the provider.
- **Resource Server**: The server hosting the protected resources, capable of accepting and responding to protected resource requests using access tokens.
- **Authorization Server**: The server that issues access tokens to the client after successfully authenticating the resource owner and obtaining authorization. Usually, this is part of the service provider.

### How it Works

The OAuth 2.0 framework defines several grant types for different use cases, along with a framework for creating new grant types. The most commonly used grant types are:

- **Authorization Code** for apps running on a web server
- **Implicit** for browser-based or mobile apps
- **Resource Owner Password Credentials** for logging in with a username and password
- **Client Credentials** for application access without a user present

Here's a simplified flow of how OAuth 2.0 typically works with the Authorization Code grant type:

1. **User Authorization**: The user is first redirected to the service provider to authorize the third-party application to access their data.
2. **Authorization Grant**: If the user authorizes access, the service provider issues an authorization grant, which is a token representing the user’s approval.
3. **Access Token Request**: The third-party application requests an access token from the service provider by presenting authentication of its identity and the authorization grant.
4. **Access Token Response**: If the application identity is confirmed and the grant is valid, the service provider issues an access token to the application.
5. **Resource Request**: The application uses the access token to request a resource (like user data) from the resource server (service provider).
6. **Resource Response**: The resource server validates the access token and serves the resource to the application.

To illustrate this flow, let's use a diagram :

```mermaid
sequenceDiagram
    participant U as User
    participant C as Client
    participant SP as Service Provider
    participant RS as Resource Server

    U->>C: Request service
    C->>SP: Redirect to SP for Auth
    SP->>U: Request consent
    U->>SP: Grant consent
    SP->>C: Provide Authorization Code
    C->>SP: Request Access Token with Auth Code
    SP->>C: Issue Access Token
    C->>RS: Request Resource with Access Token
    RS->>C: Provide Resource
```


## JWT (JSON Web Tokens)

JWT, or JSON Web Tokens, is a compact, URL-safe means of representing claims to be transferred between two parties. The tokens are designed to be portable and can be used in various applications, such as authentication mechanisms and information exchange.

### Structure of JWT

A JWT is composed of three parts, each separated by a dot (`.`). You can play around on [jwt.io](https://jwt.io/).

![jwt](/img/software-development/system-design/security/jwt.png)

#### Header

The header typically contains two parts: the type of token, which is JWT, and the signing algorithm being used, such as HMAC SHA256 or RSA.

```json
{
  "alg": "HS256",
  "typ": "JWT"
}
```

This JSON is then Base64Url encoded to form the first part of the JWT.

#### Payload

The second part of the token is the payload, which contains the claims. Claims are statements about an entity (typically, the user) and additional data. There are three types of claims: registered, public, and private claims.

- **Registered claims**: These are a set of predefined claims which are not mandatory but recommended to provide a set of useful, interoperable claims. Some of them are `iss` (issuer), `exp` (expiration time), `sub` (subject), etc.
- **Public claims**: These can be defined at will by those using JWTs. However, they should be collision-resistant (to avoid named clashes, they should be defined in the IANA JSON Web Token Registry or be defined as a URI that contains a collision-resistant namespace).
- **Private claims**: These are the custom claims used to share information between parties that agree on using them and are neither registered or public claims.

The payload is also Base64Url encoded to form the second part of the JWT.

#### Signature

To create the signature part you have to take the encoded header, the encoded payload, a secret, the algorithm specified in the header, and sign that.

For example if you are using the HMAC SHA256 algorithm, the signature will be created in the following way:

```pseudo
HMACSHA256(
  base64UrlEncode(header) + "." +
  base64UrlEncode(payload),
  secret)
```

This signature is used to verify the message wasn't changed along the way, and, in the case of tokens signed with a private key, it can also verify that the sender is who it says it is.

### Decode a JWT

Decoding a JWT doesn't require any secret or key—simply splitting the token by the dots and then Base64 decoding the first two parts will give you the header and the payload. However, decoding is not the same as verifying. To verify the signature, you need the secret or the public key that was used to sign the token.

Here is the step-by-step process to decode the JWT:

1. Split the JWT string into its three parts using the dot separator.
2. Decode the Header and Payload from Base64Url to JSON.
3. Optionally, you can verify the signature using the encoded Header and Payload and the secret or public key to ensure the token's integrity.

Note that while you can decode and examine the contents of a JWT without the secret, you must never trust the contents unless you verify the signature.

Example:

```plaintext
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c
```

- Splitting by `.`, we have three parts:
  - `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9` (Header)
  - `eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ` (Payload)
  - `SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c` (Signature)

- Base64Url decode the two parts and you see the decoded JWT:
  - Header: `{"alg":"HS256","typ":"JWT"}`
  - Payload: `{"sub":"1234567890","name":"John Doe","iat":1516239022}`

Remember that without the secret, you cannot verify the authenticity of the JWT—you can only view its content.



## SSO (Single Sign-On)

Below is a sequence diagram that demonstrates the implementation of JWT (JSON Web Token) for SSO (Single Sign-On). The diagram will represent the main entities involved in the SSO flow including the client, identity provider, SSO service and application server.

```mermaid
sequenceDiagram
    participant Client
    participant IdentityProvider as Identity Provider
    participant SSOService as SSO Service
    participant AppServer as Application Server
    
    Note over Client,AppServer: SSO using JWT begins
    
    Client->>IdentityProvider: 1. Navigate to SSO URL
    IdentityProvider->>Client: 2. Redirect to Identity Provider Login
    
    Note over Client,IdentityProvider: User enters credentials
    
    Client->>IdentityProvider: 3. Submit credentials
    IdentityProvider->>SSOService: 4. Validate credentials
    SSOService-->>IdentityProvider: 5. Generate JWT
    IdentityProvider->>Client: 6. Redirect to App with JWT
    
    Note over Client,AppServer: Redirect includes JWT in URL or Cookie
    
    Client->>AppServer: 7. Access App with JWT
    AppServer->>SSOService: 8. Validate JWT
    SSOService-->>AppServer: 9. Return validation result
    alt JWT is valid
        AppServer->>Client: 10. Grant access to Client
    else JWT is invalid or expired
        AppServer->>Client: 10. Deny access and redirect to Identity Provider
    end
```

This diagram defines the steps followed during the SSO process using JWT between a client and an application server, with the identity provider responsible for authenticating the user and issuing the JWT. Here are the steps in the process:

1. The client navigates to the SSO URL.
2. The identity provider redirects the client to a login page.
3. The user enters their login credentials.
4. The identity provider sends the credentials to the SSO service.
5. The SSO service generates a JWT upon successful validation.
6. The client is redirected back to the destination application with the JWT included.
7. The client accesses the application, presenting the JWT.
8. The application server then validates the JWT with the SSO service.
9. The SSO service returns the validation result.
10. Depending on the JWT validation result, the client is either granted or denied access. If the JWT is invalid or expired, the client may be redirected back to the identity provider for re-authentication.




