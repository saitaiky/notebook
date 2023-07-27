---
title: CloudFront
description: CloudFront
keywords:
  - CloudFront
sidebar_position: 2
---


## Notes for exam

- What options of HTTPS are available in AWS CloudFront? 
  - Between clients and CloudFront as well as between CloudFront and origin
    via - [Viewer to Cloudfront ](https://docs.aws.amazon.com/AmazonCloudFront/latest/DeveloperGuide/using-https-viewers-to-cloudfront.html), [Cloudfront to Origin](https://docs.aws.amazon.com/AmazonCloudFront/latest/DeveloperGuide/using-https-cloudfront-to-custom-origin.html)
- IAM users can't create CloudFront key pairs. You must log in using **root credentials to create key pairs**.

## Serving Static and Dynamic content

Amazon CloudFront is commonly utilized for distributing static content stored in an Amazon S3 bucket, including images, videos, and other objects. However, it offers more than that. You can leverage Amazon CloudFront to distribute dynamic content from web applications built on platforms like Ruby on Rails or PHP. 

By doing so, you can take advantage of AWS's widespread network infrastructure, ensuring fast and reliable delivery of your dynamic content to users around the world.

![](/img/aws/networking/cloudfront/static-dynamic-content.png)

If you want to split between static and dynamic content you would *create an origin for each type of content (static & dynamic) within the same distribution*. The origins can be S3 or web servers (aws instances), etc. CloudFront can serve both static and dynamic content by following these steps:

- Serving Static Content
  1. Upload your static files (e.g., HTML, CSS, JavaScript) to an Amazon S3 bucket.
  2. Configure the bucket for static website hosting, specifying the index and error documents.
  3. Create a CloudFront distribution, setting the S3 bucket as the origin and configuring caching settings.
  4. Associate a domain name with the CloudFront distribution using a custom SSL certificate if needed.
  5. Update DNS records to point to the CloudFront distribution's domain name.
- Serving Dynamic Content
  1. Set up a web server (e.g., EC2 instance) or an application server (e.g., Lambda@Edge) to generate dynamic content.
  2. Configure the server to handle requests and generate appropriate responses for dynamic content.
  3. Create an Application Load Balancer (ALB) or an API Gateway and integrate it with your server.
  4. Set up the ALB or API Gateway as the origin for your CloudFront distribution.
  5. Configure caching behaviors and TTLs for dynamic content based on your application's requirements.
  6. Associate a domain name with the CloudFront distribution and update DNS records accordingly.

> Futher reading: 
- [What is the difference between static and dynamic content?](https://www.cloudflare.com/en-gb/learning/cdn/caching-static-and-dynamic-content/)
- [Serving Dynamic Websites with Amazon CloudFront](https://blog.shikisoft.com/serving-dynamic-website-with-amazon-cloudfront/)
- [StackOverflow - How AWS Cloudfront works for both static website and dynamic website](https://stackoverflow.com/questions/62773107/how-aws-cloudfront-works-for-both-static-website-and-dynamic-website-when-websit)


## Origin failover

How origin failover works: 

![](/img/aws/networking/cloudfront/failover.png)
via - [Link](https://docs.aws.amazon.com/AmazonCloudFront/latest/DeveloperGuide/high_availability_origin_failover.html)

- CloudFront fails over to the secondary origin only when the HTTP method of the viewer request is `GET`, `HEAD` or `OPTIONS`. CloudFront does not failover when the viewer sends a different HTTP method (for example POST, PUT, and so on).
- CloudFront routes all incoming requests to the primary origin, even when a previous request failed over to the secondary origin. CloudFront only sends requests to the secondary origin after a request to the primary origin fails.


## Signed URLs 


![](/img/aws/networking/cloudfront/signed-url.png)

Source: [CloudFront Signed URLs / Cookies and S3 Presigned URLs](https://liveroomlk.medium.com/cloudfront-signed-urls-cookies-and-s3-presigned-urls-be850c34f9ce)

1.  In your CloudFront distribution, specify one or more trusted key groups, which contain the public keys that CloudFront can use to verify the URL signature. You use the corresponding private keys to sign the URLs.

2.  Develop your application to determine whether a user should have access to your content and to create signed URLs for the files or parts of your application that you want to restrict access to.

3.  A user requests a file for which you want to require signed URLs. Your application verifies that the user is entitled to access the file: they've signed in, they've paid for access to the content, or they've met some other requirement for access.

4.  Your application creates and returns a signed URL to the user. The signed URL allows the user to download or stream the content.

## Signed Cookies


![](/img/aws/networking/cloudfront/signed-cookies.png)

Source: [CloudFront Signed URLs / Cookies and S3 Presigned URLs](https://liveroomlk.medium.com/cloudfront-signed-urls-cookies-and-s3-presigned-urls-be850c34f9ce)

## Cloudfront signers

Each signer that you use to create *CloudFront signed URLs or signed cookies* must have a public-private key pair. The signer uses its * **private key** to sign the URL or cookies*, and CloudFront uses the * **public key** to verify the signature*.

### Public Key & Private Key

When you create signed URLs or signed cookies, you use the private key from the signer's key pair to sign a portion of the URL or the cookie. When someone requests a restricted file, CloudFront compares the signature in the URL or cookie with the unsigned URL or cookie, to verify that it hasn't been tampered with. CloudFront also verifies that the URL or cookie is valid, meaning, for example, that the expiration date and time haven't passed.

### CloudFront key groups

When you use the root user to manage CloudFront key pairs, you can *only have up to **two active CloudFront key pairs** per AWS account*

Whereas, with **CloudFront key groups**, you can associate a higher number of public keys with your CloudFront distribution, giving you more flexibility in how you use and manage the public keys. By default, you can associate up to four key groups with a single distribution, and you can have up to five public keys in a key group.


Reference: <https://docs.aws.amazon.com/AmazonCloudFront/latest/DeveloperGuide/private-content-trusted-signers.html>

## Restricting access to files on custom origins

Reference: [Restricting access to files on custom origins](https://docs.aws.amazon.com/AmazonCloudFront/latest/DeveloperGuide/private-content-overview.html#forward-custom-headers-restrict-access)

If you use a custom origin, you can optionally set up custom headers to restrict access. For CloudFront to get your files from a custom origin, the files must be accessible by CloudFront using a standard HTTP (or HTTPS) request. But by using custom headers, you can further restrict access to your content so that users can access it only through CloudFront, not directly. This step isn't required to use signed URLs, but we recommend it.

To require that users access content through CloudFront, change the following settings in your CloudFront distributions:

1. Origin Custom Headers
   - Configure CloudFront to forward custom headers to your origin. See [Configuring CloudFront to add custom headers to origin requests](https://docs.aws.amazon.com/AmazonCloudFront/latest/DeveloperGuide/add-origin-custom-headers.html#add-origin-custom-headers-configure).
2. Viewer Protocol Policy
    - Configure your distribution to require viewers to use HTTPS to access CloudFront. See [Viewer protocol policy](https://docs.aws.amazon.com/AmazonCloudFront/latest/DeveloperGuide/distribution-web-values-specify.html#DownloadDistValuesViewerProtocolPolicy).
3. Origin Protocol Policy
    - Configure your distribution to require CloudFront to use the same protocol as viewers to forward requests to the origin. See [Protocol (custom origins only)](https://docs.aws.amazon.com/AmazonCloudFront/latest/DeveloperGuide/distribution-web-values-specify.html#DownloadDistValuesOriginProtocolPolicy).

After you've made these changes, update your application on your custom origin to only accept requests that include the custom headers that you've configured CloudFront to send.

The combination of Viewer Protocol Policy and Origin Protocol Policy ensure that the custom headers are encrypted in transit. However, we recommend that you **periodically do the following to rotate the custom header**s that CloudFront forwards to your origin:

1.  Update your CloudFront distribution to begin forwarding a new header to your custom origin.
2.  Update your application to accept the new header as confirmation that the request is coming from CloudFront.
3.  When requests no longer include the header that you're replacing, update your application to no longer accept the old header as confirmation that the request is coming from CloudFront.