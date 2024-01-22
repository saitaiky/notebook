---
title: HTTP and HTTPS
---

## Why we need Https?

> This is a very good comic to read to understand [HOW HTTPS WORKS](https://howhttps.works/)

HTTP (Hypertext Transport Protocol) is the original request-response application layer protocol designed to connect web traffic through hyperlinks. It's the main protocol used by everything connected to the Internet. HTTP defines:

- A set of **request methods** (GET, POST, PUT, etc. - the same methods RESTful APIs use)
- Addresses (known *as URLs*)
- Default TCP/*IP ports *(port 80 for HTTP, port 443 for HTTPS).

Every time you visit a site with a http:// link, your browser makes a HTTP GET request for that URL.

HTTP is still in use, but it's been largely replaced by HTTPS (Hypertext Transport Protocol Secure), which serves the same purpose but with much better security features. In 2014, Google announced that it would give HTTPS sites a bump in rankings. That, combined with the increasing need for encrypted data transmission, resulted in much of the web over migrating to HTTPS. Below sections list out 3 benefits of using HTTPs instead of HTTP.

:::infoSome other differences
- HTTP operates at Application Layer. HTTPS operates at Transport Layer.
- HTTP by default operates on port 80, while HTTPS operates on port 443.
- HTTP transfers data in plain text. HTTPS transfers data in cipher text (encrypted text).
:::
### Privacy

Privacy means that **no one can eavesdrop on your messages**. HTTPS uses an [encryption](https://www.cloudflare.com/learning/ssl/what-is-encryption/) protocol to encrypt communications. The protocol is called [Transport Layer Security (TLS)](https://www.cloudflare.com/learning/ssl/transport-layer-security-tls/), although formerly it was known as [Secure Sockets Layer (SSL)](https://www.cloudflare.com/learning/ssl/what-is-ssl/). This protocol secures communications by using what's known as an [asymmetric public key infrastructure](https://www.cloudflare.com/learning/ssl/how-does-public-key-encryption-work/).

Before encryption: `This is a string of text that is completely readable`

After encryption: `ITM0IRyiEhVpa6VnKyExMiEgNveroyWBPlgGyfkflYjDaaFf/Kn3bo3OfghBPDWo6AfSHlNtL8N7ITEwIXc1gU5X73xMsJormzzXlwOyrCs`

### Integrity

Integrity means that the message **is not manipulated on the way to its destination**. In websites without HTTPS, it is possible for Internet service providers (ISPs) or other intermediaries to inject content into webpages without the approval of the website owner. This commonly takes the form of advertising, where an ISP looking to increase revenue injects paid advertising into the webpages of their customers. 

Unsurprisingly, when this occurs, the profits for the advertisements and the quality control of those advertisements are in no way shared with the website owner. HTTPS eliminates the ability of unmoderated third parties to inject advertising into web content.

WHat even worst is hacker can do a man-in-the-middle attack

### Identification

Identification means that I can **check that this message is coming from whom**. When you are browsing the web, identification means that the site that you are visiting is indeed the one you think it is. This SSL certificate is valid and has been issued by a legitimate Certificate Authority. 


## TLS Handshake Procedure

When your brower needs to communicate with a server, they both establish a secure connection to transmit messages, but first, they needed to agree on how to communicate securely.
- If the negotiation is not successful, your browser lets you know by showing an error or warning.
- If an agreement is reached, your browser is happy to display a green padlock on the address bar.

This process, the negotiation between a browser and a server, is called 'the handshake'. HTTPS works on top of TLS (Transport Layer Security) by default. TLS is a protocol used to encrypt communications in the transport layer, preventing unauthorized parties from listening in on communications. The process for initiating a secure session through TLS is called a TLS handshake.

### Overview steps

Here's what happens.

- The client requests to establish a secure connection with a server, usually by using port 443 which is reserved for TLS connections.
- The client and server agree to use a particular cipher suite (ciphers and hash functions.)
- The server submits a digital certificate which serves as proof of identity. Digital certificates are issued by 3rd party Certificate Authorities (CAs) and effectively vouch for the server.
- If the certificate is accepted by the client, the client will generate a session key which is used to encrypt any information transmitted during the session.

Once the session key is created, the handshake is finished and the session begins. All data transmitted will now be encrypted.

### Detailed steps

The exact steps within a TLS handshake will vary depending upon the kind of key exchange algorithm used and the cipher suites supported by both sides. The RSA key exchange algorithm, while now considered not secure, was used in versions of TLS before 1.3. 

:::infoKey Exchange Algorithms
Key exchange algorithms are methods used to securely establish a shared secret key between the client and the server. There are various key exchange mechanisms, and they can provide different features such as Forward Secrecy (FS). Examples of key exchange algorithms include:

- RSA (Rivest–Shamir–Adleman)
- DH (Diffie-Hellman)
- ECDHE (Elliptic Curve Diffie-Hellman Ephemeral)

Each key exchange algorithm works differently and offers varying levels of security and efficiency. For instance, ECDHE allows for forward secrecy, which means that even if the server's key is compromised in the future, past communication remains secure.
:::

:::infoCipher Suites
A cipher suite is a combination of encryption algorithms that define how the data will be encrypted during the TLS session. It includes algorithms for:

- Key exchange
- Bulk data encryption
- Message authentication
- Optionally, it can specify the pseudorandom function for generating keying material.

Examples of cipher suites are:

- TLS_AES_128_GCM_SHA256
- TLS_ECDHE_RSA_WITH_AES_256_GCM_SHA384
- TLS_DHE_RSA_WITH_AES_128_CBC_SHA

The client and server support multiple cipher suites, and they agree on one to use during the handshake. This agreement is based on the order of preference of the client and the availability on the server.f
:::

The handshake goes roughly as follows:

![ssl-handshake](/img/aws/networking/fundamental/tls-ssl-handshake.webp)
Source: [Cloudflare - What is a TLS handshake?](https://www.cloudflare.com/en-gb/learning/ssl/what-happens-in-a-tls-handshake/)

1.  **The 'client hello' message**: The client initiates the handshake by sending a "hello" message to the server. The message will include which TLS version the client supports, the cipher suites supported, and a string of random bytes known as the "client random."
2.  **The 'server hello' message**: In reply to the client hello message, the server sends a message containing the server's [SSL certificate](https://www.cloudflare.com/learning/ssl/what-is-an-ssl-certificate/).The server's chosen **cipher suite** (which is the best SSL/TLS version and encryption algorithm among the ones client sent to server, and based on the server preferences), and the "server random," another random string of bytes that's generated by the server.

    - A fancy word for the encryption algorithm list is '**cipher suite**'.
    - Server replies with its certificate, which includes server's public key, so client can verify who the server is.

3. **Client Key Exchange**
    -  **Authentication**: The client verifies the server's SSL certificate with the certificate authority that issued it. This confirms that the server is who it says it is, and that the client is interacting with the actual owner of the domain.
    -  **The premaster secret**: The client sends one more random string of bytes, the "**premaster secret**/**premaster key**." The premaster secret is encrypted with the server's public key and can only be decrypted with the private key by the server. (The client gets the [public key](https://www.cloudflare.com/learning/ssl/how-does-public-key-encryption-work/) from the server's SSL certificate.)
4.  **Private key used**: The server decrypts the premaster secret.
5.  **Session keys created**: Both client and server generate session keys from the client random, the server random, and the premaster secret. They should arrive at the same results.
:::info From open to secured
So far all the communication between them has been in the open. They haven't secured any messages. They used asymmetric keys (public and private keys) to encrypt the pre-master key so nobody could spy on it.
Now they both generate the same 'shared secret' that they are going to use as a symmetric key.
:::

6.  **Client is ready**: The client sends a "finished" message that is encrypted with a session key.
7.  **Server is ready**: The server sends a "finished" message encrypted with a session key.
8.  **Secure symmetric encryption achieved**: The handshake is completed, and communication continues using the session keys.

All TLS handshakes make use of asymmetric cryptography (the public and private key), but not all will use the private key in the process of generating session keys. For instance, an ephemeral Diffie-Hellman handshake.

Further reading: [Cloudflare - What is a TLS handshake?](https://www.cloudflare.com/en-gb/learning/ssl/what-happens-in-a-tls-handshake/)

## Certificate authority (CA)

> A very good comic to teach how [Certificate Authorities](https://howhttps.works/certificate-authorities/) works

Certificate Authorities (CAs) in the TLS (Transport Layer Security) procedure act as trusted  third-parties that issue digital certificates for verifying the identities of parties engaged in secure communication over the internet. It has 3 main objectives:

- Issuing certificates
- Confirming the identity of the certificate owner
- Providing proof that the certificate is valid

You might have heard of Symantec, Comodo, or Let's Encrypt, among others. Becoming a CA is an intense task of security requirements and audits. You need to be trusted to be accepted into a root store. 

A root store is basically a database of trusted CAs. Apple, Windows, and Mozilla run their own root stores that they pre-install in your computer or device.

### A Root Program (a certificate store)
Every device includes something called a root store. A root store is a collection of pre-downloaded root certificates (and their public keys) that live on the device itself. Generally, the device will use whatever root store is native to its OS, otherwise it might use a third-party root store via an app like a web browser. 

The major root certificate stores are [Apple](http://www.apple.com/certificateauthority/ca_program.html), [Microsoft](https://technet.microsoft.com/en-us/library/cc751157.aspx), [Mozilla](http://www.mozilla.org/projects/security/certs/policy/), and [Android](https://www.chromium.org/Home/chromium-security/root-ca-policy).  Apple users, both macOS and iOS, rely on the Apple root store, likewise for Microsoft users and its root store. Android uses Google’s. And the Mozilla suite of products uses its own proprietary root store.

When you visit a website, the website presents a certificate that's signed by another certificate, which is signed by another certificate, **until you reach one of the certificates in the store you're using**.

Each certificate store has its own requirements for a certificate authority to get added. However they all require certificate authorities to pass [WebTrust for Certification Authorities](http://www.webtrust.org/homepage-documents/item79807.pdf), an audited assurance process for the policies and procedures for verifying identity, issuing certificates, handling keys, and more.

:::info What happen when CAs violate the WebTrust requirement
Occasionally CAs violate the WebTrust requirements: the [Chinese government (CNNIC)](http://www.theregister.co.uk/2015/04/02/mozilla_revokes_cnnic_cert_trust/) and [Symantec](http://www.itpro.co.uk/security/25315/symantec-employees-fired-over-fake-security-certificates) both recently issued fake certificates for google.com. In CNNIC's case, they gave their private key to a third party that issued the fake certificate. CNNIC was removed from the Android and Mozilla root stores, but the Microsoft root store - used by Chrome on Windows and Edge on Windows - only revoked the misissued certificates.
:::
### Which certificate should you buy? 

There are basically 3 flavors.

- **Domain validated**. The certificate just verifies the domain name, and nothing else. You probably need this one.
- **Organization validated**. The certificate requires the validation and manual verification of the organization behind the certificate.
- **Extended validation**. The certificate requires an exhaustive verification of the business.

> All valid certificates result in the browser displaying a secure badge in the browser bar. EV certificates generally display the company name as well.


## How do certificates get validated?

When a CA issues a certificate, they sign the certificate with their root certificate pre-installed in the root store. Most of the time it's an intermediate certificate signed with a root certificate. 

![root-intermediates-enduser](/img/aws/networking/fundamental/root-intermediates-enduser.png)

Source: [What is a chain of SSL certificates?](https://www.nexcess.net/help/what-is-a-chain-of-ssl-certificates/)

:::caution Cat-astrophy case
If a cat-astrophy would occur and the root certificate is compromised, it's easier to revoke the intermediate certificates, since the root certificates are installed on each device.
:::

**Steps to validate a certificate**

1. Your browser connects to a site via HTTPS and downloads the certificate.
2. The certificate is not a root certificate.
3. Your browser downloads the certificate that was used to sign the certificate on the site.
4. But this certificate is still not the root certificate.
5. Your browser once more looks up the certificate that signed the intermediate certificate.
6. If that is a root certificate. The entire certificate chain is trusted, and thus the site certificate is trusted as well.


### Untrusted chain
In the event that the last certificate is not a root certificate, and there are no more certificates to download, the chain is untrusted.

### Why can't we self-sign your certificates?

> TL;DR - Self-signed certificates can be forged. Basically, they say 'Trust me, it's me, I promise!'. Whilist, a trusted certificate says: 'Trust me, an authority verified me'.

A self-signed certificate provides 
- the same level of encryption as one generated by an authority
- No one can spy on your data
- There is no charge to self-sign your certificates!

:::caution Yes, but no!
Almost every browser checks that the certificate is issued by a trusted authority. As such visitors are warned that the certificate cannot be trusted.

Self-signed certificates can be useful for testing, and intranets, but you should avoid using them on public sites.
:::

