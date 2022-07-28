---
title: CloudFront
description: CloudFront
keywords:
  - CloudFront
sidebar_position: 2
---

## What options of HTTPS are available in AWS CloudFront

Between clients and CloudFront as well as between CloudFront and backend

via - [Viewer to Cloudfront ](https://docs.aws.amazon.com/AmazonCloudFront/latest/DeveloperGuide/using-https-viewers-to-cloudfront.html), [Cloudfront to Origin](https://docs.aws.amazon.com/AmazonCloudFront/latest/DeveloperGuide/using-https-cloudfront-to-custom-origin.html)


## Serving Static and Dynamic content

You can configure CloudFront with multiple origins to serve *both static and dynamic content* at low latency to global users. Each of these origins can include their own cache behaviours which enable you to define whether they should be cached and how long.

![](/img/aws/networking/cloudfront/static-dynamic-content.png)

If you want to split between static and dynamic content you would *create an origin for each type of content (static & dynamic) within the same distribution*. One would be the default origin whilst the other would be matched based on a file path (/css or /images). 


> Futher reading: 
- [Serving Dynamic Websites with Amazon CloudFront](https://blog.shikisoft.com/serving-dynamic-website-with-amazon-cloudfront/)
- [StackOverflow - How AWS Cloudfront works for both static website and dynamic website](https://stackoverflow.com/questions/62773107/how-aws-cloudfront-works-for-both-static-website-and-dynamic-website-when-websit)


## Origin failover

How origin failover works: 

![](/img/aws/networking/cloudfront/failover.png)
via - [Link](https://docs.aws.amazon.com/AmazonCloudFront/latest/DeveloperGuide/high_availability_origin_failover.html)

- CloudFront fails over to the secondary origin only when the HTTP method of the viewer request is `GET`, `HEAD` or `OPTIONS`. CloudFront does not failover when the viewer sends a different HTTP method (for example POST, PUT, and so on).
- CloudFront routes all incoming requests to the primary origin, even when a previous request failed over to the secondary origin. CloudFront only sends requests to the secondary origin after a request to the primary origin fails.


## Signed URLs 

![](https://lh4.googleusercontent.com/Bu8XKpcwnq0FsZMxRNZPNw9q4YI_5S5Dl_RRgV7pNNKojJiTfzy4-bzKvAVJ43G5uiuVhSFlBfH3FCjxzkoEPIekRcFLGFWStHQFQ7_-SEFsOn-sZyp-B9syw4CS0TcNnU23mu1PgH9zCWJUuyeV1Q)

1.  In your CloudFront distribution, specify one or more trusted key groups, which contain the public keys that CloudFront can use to verify the URL signature. You use the corresponding private keys to sign the URLs.

2.  Develop your application to determine whether a user should have access to your content and to create signed URLs for the files or parts of your application that you want to restrict access to.

3.  A user requests a file for which you want to require signed URLs. Your application verifies that the user is entitled to access the file: they've signed in, they've paid for access to the content, or they've met some other requirement for access.

4.  Your application creates and returns a signed URL to the user. The signed URL allows the user to download or stream the content.

## Signed Cookies

![](https://lh6.googleusercontent.com/YprbtFgEZGIU9x0x-6XDRZJIubNrcQi4WA3gzmW7Gw6eu03O_4HLxHBVisfIs5peVcRck36NxlnFXS_wjU8XP_SpYj7yodrJlnCD0IDXBur1R4Ne7WGFcrVs175JY8VYB3gALeMeTUOq4kRbUDe_8w)

## Cloudfront signers

Each signer that you use to create *CloudFront signed URLs or signed cookies* must have a public-private key pair. The signer uses its * **private key** to sign the URL or cookies*, and CloudFront uses the * **public key** to verify the signature*.

### Public Key & Private Key

When you create signed URLs or signed cookies, you use the private key from the signer's key pair to sign a portion of the URL or the cookie. When someone requests a restricted file, CloudFront compares the signature in the URL or cookie with the unsigned URL or cookie, to verify that it hasn't been tampered with. CloudFront also verifies that the URL or cookie is valid, meaning, for example, that the expiration date and time haven't passed.

### CloudFront key groups

When you use the root user to manage CloudFront key pairs, you can *only have up to **two active CloudFront key pairs** per AWS account*

Whereas, with **CloudFront key groups**, you can associate a higher number of public keys with your CloudFront distribution, giving you more flexibility in how you use and manage the public keys. By default, you can associate up to four key groups with a single distribution, and you can have up to five public keys in a key group.


Reference: <https://docs.aws.amazon.com/AmazonCloudFront/latest/DeveloperGuide/private-content-trusted-signers.html>