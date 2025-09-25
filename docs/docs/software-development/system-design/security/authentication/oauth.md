---
title: OAuth
---

## History

### API Security Before OAuth

Before OAuth, APIs commonly used HTTP Basic Auth, where applications sent usernames and passwords directly to the API. This method required applications to ask for, store, and use user passwords in API requests, leading to significant security concerns, especially for third-party apps like Twitter clients. Users had to provide their passwords to these apps, without any assurance of how their credentials would be used, increasing the risk of misuse.

To address these issues, various platforms developed their own authentication methods:
- **Flickr**: Implemented FlickrAuth using "frobs" and "tokens".
- **Google**: Developed AuthSub.
- **Facebook**: Used MD5 signed requests.
- **Yahoo!**: Created BBAuth (Browser Based Auth).

However, these varied solutions still required users to share their passwords with third-party applications, posing substantial security risks.
### Evolution of OAuth

- **Collaborative Effort**: Developers from various companies recognized a shared problem and began collaborating on a unified solution.
- **OAuth 1.0**: Published in 2007 and deployed by companies like Twitter, it had limitations:
  - Confusing for developers.
  - Unsafe API key usage in mobile phones.
- **Transition to OAuth 2.0**: As mobile apps became popular, OAuth 1.0's limitations became evident. A new working group under IETF developed OAuth 2.0 to address these issues:
  - Simplified for developers by removing signature requirements and using Bearer tokens.
  - Designed to be secure for mobile apps and single-page apps.
  - Introduced a separation between the authorization server and API server for better scalability.
- **OAuth 2.0 Evolution**: 
  - Finalized in 2012, the OAuth 2.0 spec has continued to evolve.
  - The IETF Working Group continues to enhance OAuth with additional specifications:
    - **OAuth 2.0 for Native Apps**: An extension for native applications.
    - **Device Grant**: Enables OAuth use on smart TVs.
    - **OAuth Security Best Current Practice**: Provides guidelines for building secure OAuth systems.


## How OAuth Improves Application Security


![](/img/software-development/system-design/security/direct-password-handling.png)

Above is an example of direct password handling in Yelp and LinkedIn before 2007. 

- **Authentication Before OAuth (Direct Password Handling)**: 
  - Applications commonly used username and password prompts within the app.
  - The app exchanges the password for a session cookie, which works for simple web apps with built-in authentication.
  - Issues arise when expanding to mobile apps or multiple apps sharing a user database with single sign-on.
- **Risks of Handling Passwords Directly**
  - **User Concerns**:
    - Trust issues: Users cannot be sure how an app will handle their password.
    - Security risks: Apps could accidentally log or intentionally store passwords.
    - Third-party app risks: Apps asking for passwords (e.g., a photo editor asking for a Dropbox password) can gain full access to accounts, posing significant security threats.
  - **API Concerns**:
    - Indistinguishable requests: API cannot differentiate between genuine apps and potential attackers.
    - Password dumps: Attackers could use leaked passwords to access the API.
    - Scaling MFA: Adding multifactor authentication (MFA) requires updating each app, slowing down development.
- **How OAuth Solves These Issues**
  - **Redirecting to OAuth Server**:
    - **High-Level Mechanism**: Applications redirect users to an OAuth server for login, where users enter their passwords.
    - **Token-Based Access**: After login, the OAuth server redirects users back to the app with tokens, eliminating the need for apps to handle passwords directly.
  - **Benefits of this solution**:
    - **Enhanced Security**: Protects against untrusted third-party apps and ensures first-party apps are more secure and flexible.
    - **MFA Integration**: MFA can be added at the OAuth server without changes to individual apps, streamlining security updates across all applications.

## OAuth & OpenID

> TL;DR - OAuth is about accessing APIs without needing to know the user's identity, while OpenID Connect is about identifying the user by extending OAuth's capabilities. 

- **OAuth**:
  - **Purpose**: Designed for applications to access APIs.
  - **Access Focus**: The application only needs access to the API, not information about the user.
  - **Analogy**: 
    - **Hotel Check-In**: When you check into a hotel, you show your ID and credit card at the front desk (OAuth authorization server), and they give you a key card (access token).
    - **Resource Access**: The key card allows access to rooms (resources) without knowing who you are. The door (resource server) only validates the key card's encoded data, not the user's identity.
- **OpenID Connect**:
  - **Purpose**: Adds user identity information on top of OAuth.
  - **Identity Focus**: Used when an application needs to know who the user is (e.g., showing the user's name or profile photo).
  - **Extension of OAuth**: Uses OAuth's framework but includes user information in the flow.
  - **ID Tokens**: Issues ID tokens, which are statements about the user, in addition to OAuth's access tokens.
  - **Analogy Continuation**: Adds the concept of user information to the existing OAuth process, enabling the OAuth server to communicate user data back to the application.

:::info Auth0 vs. OAuth: What Is the Difference? 
Auth0 and OAuth (Open Authorization) are both authentication and authorization systems that are used to secure web and mobile applications. However, there are some key differences:

| Auth0                                                                                                                                                                            | 0Auth                                                                                                                      |
|----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|----------------------------------------------------------------------------------------------------------------------------|
| Auth0  is a cloud-based platform that provides a wide range of authentication and authorization services, such as social login, single sign-on, and multi-factor authentication. | OAuth  is a protocol that defines a set of rules for securely granting access to resources.                                |
| Auth0  provides an API, libraries, and SDKs that can be used to integrate authentication and authorization functionality into your applications.                                 | OAuth  is a protocol that is implemented by applications and services, rather than being provided as a standalone service. |
| Auth0  supports a wide range of authentication and authorization protocols, including OAuth, SAML, and JWT.                                                                      | OAuth  is primarily focused on enabling authorization for APIs.                                                            |                                                         |
:::

## Security Concepts

### Roles in OAuth

In OAuth, there are five main roles. Keep in mind that a platform/product can have multiple roles. For example, GitHub can be both resource server and authorization server.:

1. **Resource Owner**: The user who owns the data and grants access to it.
2. **User Agent**: The device or software (like a browser or mobile app) used by the user.
3. **OAuth Client**: The application requesting access to the user's data on behalf of the user.
4. **Resource Server**: The server hosting the user's data (API).
5. **Authorization Server**: The server responsible for authenticating the user and issuing access tokens to the client.

The authorization server ensures that the client gets access tokens without exposing the user’s credentials. The client then uses these tokens to access resources from the resource server securely.

### Application Types

In OAuth 2.0, client types are defined based on whether the application can use credentials for authentication during the OAuth flow. The two client types are:

- **Confidential Clients**: : Use credentials for secure communication with the authorization server. They are more secure and can skip certain security steps (e.g., consent screens).
    - **Credentials**: Have credentials (e.g., client secret).
    - **Environment**: Typically run on a secure server.
    - **Example**: Web apps using server-side languages like Java, .NET, or PHP.
    - **Security**: Users can't see the credentials as they are stored securely on the server.
    - **Usage**: Can authenticate requests to the authorization server, ensuring only the real application can make requests.
    - **Common Credential**: Client secret is easiest to implement, similar to an API key or password.
- **Public Clients**: Cannot use credentials securely, leading to potential security risks. The authorization server treats these clients differently to mitigate these risks.
    - **Credentials**: Do not have credentials.
    - **Environment**: Run on user-controlled devices.
    - **Example**: Mobile apps, single-page apps (SPA), IoT devices.
    - **Security**: Users can view the source code or extract strings, making it impossible to keep secrets secure.
    - **Risk**: Authorization server cannot be sure if requests are from the real application or a mimic.
    - **Usage**: Must handle authentication without relying on stored credentials.

:::warning Security Best Practices
![](/img/software-development/system-design/security/get-your-client-id-client-secret.jpg)

Never include **a client secret** in public client(e.g. a mobile or single-page application). Use alternative, more secure methods like public/private key pairs if higher security is needed.
:::

### User Consent

OAuth aims to protect user data by ensuring it’s shared only with authorized parties. A crucial part of this process is the consent screen, which asks users for permission and verifies their intent. This step is vital for security, preventing unauthorized access and ensuring that only the user can approve data sharing.

**The outdated password grant flow**, where users directly provide their password to an application, poses significant security risks. Third-party apps could misuse these passwords, and even first-party apps can't guarantee the user's active participation. The authorization server solves these issues by handling password entry and showing the consent screen, thus confirming user approval.

Moreover, **the redirect flow** used in OAuth supports multifactor authentication (MFA), enhancing security. Adding MFA to the authorization server automatically extends this protection to all connected applications without individual modifications, simplifying deployment across multiple apps.

While first-party confidential clients often skip the consent screen due to lower impersonation risks, the redirect step remains crucial for security and MFA integration. For mobile or single-page apps, maintaining the consent screen helps prevent attacks.

### Front Channel vs Back Channel

> TL;DR 
- The front channel: Using the browser’s address bar *to move data between two other pieces of software* is using the front channel.
- The back channel: Any HTTP client that makes a request to an HTTP server is using the back channel, *even if that client is JavaScript code in a browser*

Understanding the front channel and back channel is crucial for secure OAuth flows. The back channel uses secure HTTPS connections for data transfer, ensuring encryption and trust, akin to hand-delivering a package. The front channel uses the browser address bar, introducing security risks similar to using a package delivery service.

OAuth involves users through the front channel for consent, but delivering access tokens this way is insecure. Modern OAuth implementations prefer the back channel, especially with the advent of CORS, which allows secure cross-origin requests in JavaScript apps. The OAuth working group now recommends phasing out the **Implicit flow** to enhance security.

:::info Implicit Flow
The Implicit Flow is an OAuth 2.0 method where the access token is directly returned to the client via the user's browser, designed for client-side applications that cannot securely store secrets.
:::

:::warning Is the following JavaScript code making a front-channel or back-channel request?
```javascript
  fetch("https://authorization-server.com/", {
    method: "GET",
    headers: {
      "Content-Type": "application/json"
    }
  })
  .then((response) => {
    return response.json();
  });
```

**Answer**: Back channel, Even though the request method is GET, this is a back-channel request since the JavaScript code handles the HTTP response directly.
:::

:::warning Is the following JavaScript code making a front-channel or back-channel request?
```javascript
window.location = 'https://authorization-server.com/authorize?client_id=example';
```
Answer: Front Channel,  this code redirects the user's browser to the URL shown.
:::

### Application Identity in public client

Applications, or clients in OAuth terms, have unique identities represented by a **client ID**, which they use throughout the OAuth flow. This ensures users can grant different permissions to different applications.

Mobile and single-page apps can't use **client secrets**, making them vulnerable to token theft. The PKCE (Proof Key for Code Exchange) extension helps by using a unique secret for each request, ensuring only the app that started the flow can complete it.

**Redirect URIs** play a crucial role in verifying application identity, especially for public clients. While HTTPS URLs provide a reliable identity verification, custom URL schemes lack global uniqueness, making them less secure.

:::info How to verify the application identity in the API world?
![](/img/software-development/system-design/security/protect-api.png)

In Google APIs and services, you can restrict which websites are allowed to make API calls by specifying allowed domains. This involves setting up application restrictions in the Google Cloud Console, where you can declare specific domains that are permitted to use the API key.

The concept is quite similar to **redirect uri** in the OAuth flow, isn't it?
:::

## OAuth for different applications

In next few sections, we'll look at how to use OAuth in various applications. One thing you may notice when registering a client at the OAuth server, the server needs to know the type of application you are building to apply appropriate security policies and configurations. Different application types have unique security requirements and capabilities:

1. **Client Secret**: Server-side apps can securely store a client secret, while mobile and JavaScript apps cannot. Thus, mobile and JavaScript apps are typically not given a client secret.
2. **Token Policies**: The server may issue different types of tokens (e.g., refresh tokens) and set different token lifetimes based on the application type.
3. **CORS Headers**: For JavaScript apps, the server might need to enable CORS headers to facilitate secure cross-origin requests.

## OAuth for Server-Side Applications

### Concepts

- PKCE **Code Verifier**: PKCE mitigates this risk by adding an additional layer of security. It ensures that the authorization code can only be used by the client that requested it.
- **Code Challenge** (Hash): Created by applying a transformation (SHA-256 and Base64URL encoding) to the PKCE code_verifier.
- The `state` parameter: Originally for CSRF protection, can now store app-specific state (e.g., redirect pages like cart or checkout) if the OAuth server supports PKCE. If not, ensure the state is a random value for security.
- **Refresh Tokens**:
   - Used to obtain new access tokens without repeating the authorization code flow.
   - Include the refresh token, client ID, and secret in a back-channel request to the OAuth server.

:::info What is PKCE?
PKCE was originally developed for mobile apps, but now the OAuth working group recommends using PKCE for all types of applications, including server-side apps, even when a client secret is available. This is because PKCE can prevent a subtle attack where authorization codes could be swapped, potentially allowing someone to log into another user's account without detection, posing a significant security risk.
:::

### Sequence Diagram

:::warning APP in various systems
In the below sequence diagram, ..
- APP in server side application can be your Backend
- APP in mobile app can be the mobile app on your phone(user agent)
- APP in single-page application is your application which downloaded on your browser(user agent)
:::

```mermaid
sequenceDiagram
    participant User and User Agent
    participant App
    participant OAuth Server
    participant API Server

    rect rgb(25, 59, 72)
    note right of User and User Agent: Front channel request
    User and User Agent->>App: Clicks Login Button
    App->>App: 1. Generates PKCE Code Verifier<br>2. Hash it to become Code Challenge(Hash)
    App->>User and User Agent: Redirect with Code Challenge(Hash), Client ID, Redirect URL, Scope
    User and User Agent->>OAuth Server: Sends Auth Request via query string. <br>Check ① for the example URL. <br>Your app won't see the user again until they come back to the redirect URL with the authorization code.
    OAuth Server->>User and User Agent: Sends temporary one time use Authorization Code<br>Check ② for the example URL
    User and User Agent->>App: Redirect with Authorization Code to get an Access Token
    end
    rect rgb(25, 59, 72)
    note right of App: Back channel request
    App->>OAuth Server: Requests Access Token with Authorization Code, Client ID, Client Secret, PKCE Code Verifier <br>Check ③ for the POST request
    OAuth Server->>OAuth Server: 1. Check if anyone used that Authorization Code for the requested Client ID <br>2. Check if the Client Scrent mataches<br>3. Check if I can hash PKCE Code Verifier to get the same the Code Challenge at the first step
    OAuth Server->>App: Sends Access Token (and Refresh Token) <br>Check ④ for the server response
    App->>API Server: Makes API Requests with Access Token
    end
    API Server->>App: Responds to API Requests
    User and User Agent->>App: Uses Application with Access Token
```

- Front channel (via browser)
  - ① Example of Authorization Request URL:
    - https://authorization-server.com/oauth/authorize?response_type=code&client_id=your_client_id&redirect_uri=https%3A%2F%2Fyourapp.com%2Fcallback&scope=openid%20profile%20email&state=random_state_string&code_challenge=your_code_challenge&code_challenge_method=S256
  - ② Example of Redirect URL After User Authorization:
    - https://yourapp.com/redirect?code=authorization_code&state=random_state_string
    - If there is an error, you may have https://yourapp.com/redirect?errorcode=access_denied&state=random_state_string
- Back channel (via  HTTPS request from your application server to the servers token point)
  - ③ `POST` https://authorization-server.com/token
    - post body: 
      ```
      client_id=CLIENT_ID&
      client_secret=CLIENT_SECRET&
      code=AUTH_CODE_HERE
      redirect_uri=REDIRECT_URI&
      grant_type=authorization_code&
      ```
  - ④ Response
    ```json
    {
    "access_token": "SlAV32hkKG",
    "token_type": "Bearer",
    "refresh_token": "8xLOxBtZp8",
    "expires_in": 3600,
    "id_token": "eyJhbGciOiJSUzI1NiIsImtpZCI6IjFlOWdkazcifQ.ewogImlzc
      yI6ICJodHRwOi8vc2VydmVyLmV4YW1wbGUuY29tIiwKICJzdWIiOiAiMjQ4Mjg5
      NzYxMDAxIiwKICJhdWQiOiAiczZCaGRSa3F0MyIsCiAibm9uY2UiOiAibi0wUzZ
      fV3pBMk1qIiwKICJleHAiOiAxMzExMjgxOTcwLAogImlhdCI6IDEzMTEyODA5Nz
      AKfQ.ggW8hZ1EuVLuxNuuIJKX_V8a_OMXzR0EHR9R6jgdqrOOF4daGU96Sr_P6q
      Jp6IcmD3HP99Obi1PRs-cwh3LO-p146waJ8IhehcwL7F09JdijmBqkvPeB2T9CJ
      NqeGpe-gccMg4vfKjkM8FcGvnzZUN4_KSP0aAp1tOJ1zZwgjxqGByKHiOtX7Tpd
      QyHE5lcMiKPXfEIQILVq0pc_E2DzL7emopWoaoZTF_m0_N0YzFC6g6EJbOEoRoS
      K5hoDalrcvRYLSrQAZZKflyuVCyixEoV9GfNQC3_osjzw2PAithfubEEBLuVVk4
      XUVrWOLrLl0nx7RkKU8NXNHq-rvKMzqg"
    }
    ```

## OAuth for Native Applications

:::info The only difference is that Mobile application can't use client secret compared with web application!
Mobile apps differ from web server apps in OAuth implementation, particularly because it's unsafe to include client secrets in mobile apps. The client secret, if embedded in the app's code, can be extracted by anyone who downloads and decompiles the app, compromising security. Therefore, unlike web apps that securely store and use client secrets on the server, mobile apps avoid using client secrets altogether. Instead, they rely on methods like PKCE to securely handle the authorization code exchange. The flow is almost the same as above diagram in OAuth for Server-Side Applications but the only difference is at ③, the post body of the `POST` request doesn't have `client_secret`
```
client_id=CLIENT_ID&
code=AUTH_CODE_HERE
redirect_uri=REDIRECT_URI&
grant_type=authorization_code&
```
:::

Mobile apps handle OAuth redirect URLs differently than web apps, losing browser protections like DNS checks and HTTPS validation. Traditionally, apps used custom URL schemes, which can be insecure as any app can claim the same scheme, risking authorization code interception. Modern apps use app-claimed URL patterns (**deep linking**), which are more secure as developers must prove domain ownership. However, redirect reliability in mobile environments remains uncertain, we still don't trust the redirect URLs in mobile apps quite as much as we do in a browser environment. 

So you can imagine if you're the OAuth server and you're about to generate this authorization code and send a redirect back to the mobile app, you don't actually know whether that redirect is going to make it back to the app because there are many ways that can fail. This makes PKCE essential to secure authorization flows by mitigating risks of code interception and redirect handling failures.

### How mobile handle redirect URLs
- **Historical Challenges**
  - **Native Browser Flow**:
    - **User Experience**: Initially, mobile apps had to launch the native browser (Safari on iOS, Chrome on Android) for OAuth flows. Users would switch from the app to the browser and back, which was secure but disrupted the user experience.
    - **Flow**: The app would go to the background, the browser would launch, users would log in, and then switch back to the app. This left users out of the app's context, making the process fragile and less user-friendly.
  - **Embedded Web Views**:
    - **Improved UX but Insecure**: To keep users within the app, developers embedded web views. However, this approach had significant drawbacks:
      - **No Address Bar**: Users couldn't verify the authenticity of the authorization server, risking phishing attacks.
      - **Isolated Cookies**: Web views didn't share cookies with the system browser. Users had to log in every time, as their sessions weren't shared with Safari or Chrome.
      - **App Access to Web View**: The app could potentially read the contents of the web view, including user passwords, defeating OAuth's purpose of keeping passwords away from apps.
- **Modern Solutions**
  - <iframe width="560" height="315" src="https://www.youtube.com/embed/LVseK_CZp5g?si=af0BhunaTK0DMSgt&amp;start=198" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>
  - **Secure In-App Browsers**:
    - **iOS ([SFSafariViewController](https://developer.apple.com/documentation/safariservices/sfsafariviewcontroller))** and **Android ([Chrome Custom Tabs](https://developer.chrome.com/docs/android/custom-tabs))**: Modern mobile platforms introduced APIs that provide secure in-app browsers.
    - **User Experience**: These solutions keep users within the app while launching a secure browser overlay. Users don't leave the app but interact with a fully functional browser.
    - **Security Benefits**:
      - **Session Sharing**: These in-app browsers share cookies with the system browser. If users are logged into Safari or Chrome, they are also logged into the in-app browser, avoiding repeated logins.
      - **No App Access**: The app cannot inspect or control the in-app browser contents, protecting user credentials and supporting secure authentication methods like WebAuthn and TouchID.

### Refresh token

Refresh tokens improve user experience in mobile apps by allowing the app to obtain new access tokens without user involvement, preventing frequent logins. Mobile apps cannot securely store client secrets due to decompilation risks, unlike web apps that securely store them on servers. Instead, mobile apps use Proof Key for Code Exchange (PKCE).

When an access token expires, the app uses the refresh token to request a new access token from the OAuth server via a POST request to the token endpoint, including the `grant_type=refresh_token`, refresh token, and app’s client ID. No client secret is required.

To ensure security, mobile apps use device-specific secure storage APIs for storing refresh tokens. These APIs require biometric authentication (e.g., FaceID or thumbprint) to access the refresh token, allowing the app to request a new access token seamlessly. This approach prevents user interruptions with web browsers or password prompts, unlike web apps, which can quickly redirect users for re-authentication without noticeable disruptions.

![](/img/software-development/system-design/security/biometric.webp)

Source: [Udemy - The Nuts and Bolts of OAuth 2.0](https://www.udemy.com/course/oauth-2-simplified/)

## OAuth for Single-Page Applications

:::info The only difference is that Mobile application can't use client secret compared with web application!
Even though we're talking about a JavaScript app in a browser, we still have a back channel. But in this case, it means that the code in the JavaScript app itself makes a request to the OAuth server, rather than passing data through the address bar. Feel free to go back and review the front channel vs back channel lesson for more background on the distinction between these two different ways of passing data. 

It holds on to that PKCE **Code Verifier** in the browser, usually by storing it in **LocalStorage** or **SessionStorage** and then it calculates a hash of it called the code challenge.  
:::

Single-page apps (SPAs) face unique challenges with OAuth due to the browser environment. Unlike web apps with secure backends, SPAs cannot securely store client secrets or API keys because these can be easily extracted from the source code. Therefore, SPAs are considered public clients and rely on the PKCE extension for secure OAuth flows without client secrets.

- **Key Differences**:
  - **Client Secret Storage**: Web apps can securely store client secrets on servers, but SPAs cannot due to easy accessibility of source code.
  - **Secure Storage**: SPAs lack secure storage APIs for sensitive data like access or refresh tokens, making them vulnerable to cross-site scripting (XSS) attacks.
- **Security Challenges**:
  - **Cross-Site Scripting (XSS)**: XSS vulnerabilities can allow attackers to run malicious code, access user data, and misuse access tokens.
  - **Content Security Policy (CSP)**: Strong CSPs help mitigate XSS risks but can be challenging to implement due to reliance on third-party JavaScript for ads, analytics, etc.
  - **Browser Extensions**: User-installed extensions can inject JavaScript, potentially compromising application data.
- **Mitigation Strategies**:
  - **Refresh Tokens**: OAuth servers may disable or limit the use of refresh tokens in SPAs to reduce risk.
  - **Shorter Token Lifetimes**: Tokens may have shorter lifetimes to minimize the impact of leaks.


### Protecting Tokens in the Browser

Here are the main storage options and their associated risks:

- **Storage Options and Risks**:
  - **LocalStorage**: Persists data across sessions and tabs but is vulnerable to cross-site scripting (XSS) attacks.
  - **SessionStorage**: Data persists only within a session and is not shared across tabs, but still vulnerable to XSS.
  - **Cookies**: Can store tokens but are complex to manage and also susceptible to XSS.

Due to these vulnerabilities, alternatives to storing tokens in JavaScript include:

- **In-Memory Storage**: Keeps tokens in memory to avoid persistence across tabs or sessions, reducing XSS risk, but tokens are lost on page refresh.
- **Service Workers**: Isolate storage from the main browser window, protecting tokens from XSS, but adds complexity and doesn’t work in IE11. Requires the app to communicate with the Service Worker for API calls, ensuring JavaScript never directly handles tokens.
- **WebCrypto API**: Allows JavaScript to generate and use private keys to encrypt tokens. Prevents token extraction but requires support not available in all browsers (e.g., not in Safari).

Ultimately, the most secure method is to *avoid giving tokens to JavaScript altogether*, utilizing backend services to manage tokens and handle OAuth flows securely like what you did in a server-side applications. Though, if you're firmly set on deploying your single page app in pure static hosting like Amazon S3 and having that JavaScript app interact with your APIs directly from the JavaScript, then this won't really work for you. For the details, check [Security Considerations for Single-Page Apps](https://www.oauth.com/oauth2-servers/single-page-apps/security-considerations/)

## OAuth for Machine-to-Machine (Client Credentials Grant)

The client credentials grant is an OAuth flow used when no user interaction is required. It allows an application to use its own credentials to obtain an access token for accessing its own resources or backend services, such as microservices or statistical data. This flow is particularly useful for machine-to-machine communication and backend API verification.

**Advantages**:
- **Simplified API Security**: APIs only need to validate access tokens, not client credentials.
- **Centralized Credential Validation**: Only the OAuth server validates client credentials, beneficial for large-scale deployments.
- **Scalability**: APIs across multiple servers do not need to access the database for client credentials.

**Implementation Steps**:
1. **Register Application**: Register the application with the OAuth server to obtain a client ID and client secret.
2. **Request Access Token**: Make a POST request to the token endpoint with `grant_type=client_credentials`, including the client ID and client secret.
3. **Token Usage**: Use the access token to make API requests. Tokens may expire, requiring a new request to obtain a fresh token.

No refresh tokens are typically provided since no user interaction is involved. This process ensures secure and efficient access management for applications interacting with backend services.


## Future reading

- [The OAuth 2.0 Authorization Framework](https://datatracker.ietf.org/doc/html/rfc6749)
- [OAuth 2.0 Playground](https://www.oauth.com/playground/): This is a fun interactive walkthrough of the OAuth Flows. You can see step by step how each one works and you can see the requests and responses from each step along the way. It's a great way to refresh your memory if you're trying to remember how to write some code to deal with a certain part of a flow.