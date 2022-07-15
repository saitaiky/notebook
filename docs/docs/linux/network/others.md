---
title: Otherts
---

## CName

A CNAME record maps DNS queries for the name of the current record, such as acme.example.com, to another domain (example.com or example.net) or subdomain (acme.example.com or zenith.example.org).

:::info 
You should keep in mind that the DNS protocol does not allow you to create a CNAME record for the top node of a DNS namespace, also known as the zone apex.  e.g. create `CNAME` record like: `example.com` but you can create `CNAME` record like:  `www.example.com`, `newproduct.example.com`
