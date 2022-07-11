---
title: Redshift
description: Redshift
keywords:
  - Redshift
sidebar_position: 7
---

## Amazon Redshift

Redshift is a full-fledged **data warehouse** that is very efficient in storing raw data and collecting data from various different sources. It is based on PostgreSQL version 8.0.2. This means that you can use regular SQL queries with Redshift.

The main benefit of using AWS Redshift is the cost-benefit to your business. The cost is one-fifth (about one-twentieth) of competitors such as Teradata and Oracle. 

## Amazon Redshift Spectrum

> TL;DR - Using **Amazon Redshift Spectrum**, you can efficiently **query and retrieve structured and semistructured data from files in Amazon S3** without having to load the data into Amazon Redshift tables.

Amazon Redshift Spectrum is a feature within [Amazon Web Services](https://www.techtarget.com/searchaws/definition/Amazon-Web-Services)' [Redshift](https://www.techtarget.com/searchaws/definition/Amazon-RedShift) data warehousing service that lets a data analyst conduct fast, complex analysis on objects stored on the AWS cloud.

With Redshift Spectrum, an analyst can perform [SQL](https://searchsqlserver.techtarget.com/definition/SQL) queries on data stored in [Amazon S3](https://www.techtarget.com/searchaws/definition/Amazon-Simple-Storage-Service-Amazon-S3) buckets. This can save time and money because it eliminates the need to move data from a storage service to a database, and instead directly queries data inside an S3 bucket. Redshift Spectrum also expands the scope of a given query because it extends beyond a user's existing Redshift data warehouse nodes and into large volumes of unstructured S3 [data lakes](https://www.techtarget.com/searchaws/definition/data-lake).

### How Redshift Spectrum works

**While Amazon Redshift handles “analytical workloads,” Spectrum is the “bridge” layer that provides Redshift an interface to S3 data.** Redshift Spectrum must have a Redshift cluster and a connected [SQL](https://searchsqlserver.techtarget.com/definition/SQL) client. Multiple clusters can access the same S3 data set at the same time, but queries can only be conducted on data stored in the same AWS region.

Redshift Spectrum can be used in conjunction with any other AWS compute service with direct S3 access, including [Amazon Athena](https://www.techtarget.com/searchaws/definition/Amazon-Athena), as well as Amazon Elastic Map Reduce for [Apache Spark](https://www.techtarget.com/searchdatamanagement/definition/Apache-Spark), [Apache Hive](https://www.techtarget.com/searchdatamanagement/definition/Apache-Hive) and Presto.

The following image depicts the relationship between these services.

![redshift-relationship](/img/aws/database/redshift-relationship.png)

Source: [Optimizing Data Query Processing and Storage — Redshift vs. Redshift Spectrum](https://medium.com/pepperfry-tech/optimizing-data-query-processing-and-storage-redshift-vs-redshift-spectrum-733a04a99372)

:::info Data catalog
Data catalog holds the **data schema definition** of the organization data stored in S3 Data lakes and it is the central repositories of metadata of the data assets. **AWS glue, Athena data catalog, Hive metastore (Amazon EMR)** are the various options available in the catalog.
:::
## Amazon Redshift and Redshift Spectrum Architecture
### Amazon Redshift

Redshift architecture consists of two or more Computing Nodes that are connected to a Leader Node. All the communication between client applications and Cluster only happens through the Leader Node.

![NodeRelationships](/img/aws/database/02-NodeRelationships.png)

Source: [Amazon Redshift Spectrum Extends Data Warehousing Out to Exabytes—No Loading Required](https://docs.aws.amazon.com/redshift/latest/dg/images/02-NodeRelationships.png)

### Amazon Redshift Spectrum

Redshift spectrum works on top of redshift architecture. It is added after the storage Phase. This is clearly depicted in the diagram below.

![redshift_spectrum](/img/aws/database/redshift_spectrum.gif)

Source: [Amazon Redshift Spectrum Extends Data Warehousing Out to Exabytes—No Loading Required](https://aws.amazon.com/blogs/big-data/amazon-redshift-spectrum-extends-data-warehousing-out-to-exabytes-no-loading-required/)

## Redshift Spectrum vs. Athena

Amazon Athena is similar to Redshift Spectrum, though the two services typically address different needs. An analyst that already works with Redshift will benefit most from Redshift Spectrum because it can quickly access data in the cluster and extend out to infrequently accessed, external tables in S3. It's also better suited for fast, complex queries on multiple data sets.

Alternatively, Athena is a simpler way to run interactive, ad hoc queries on data stored in S3. It doesn't require any cluster management, and an analyst only needs to define a table to make a standard SQL query.

Other cloud vendors also offer similar services, such as [Google BigQuery](https://www.techtarget.com/searchdatamanagement/definition/Google-BigQuery) and Microsoft Azure SQL Data Warehouse.

## Amazon FSx for Lustre
Amazon FSx for Lustre makes it easy and cost-effective to launch and run the world’s most popular high-performance file system. It is used for workloads such as machine learning, high-performance computing (HPC), video processing, and financial modeling. The open-source Lustre file system is designed for applications that require fast storage – where you want your storage to keep up with your compute. **FSx for Lustre integrates with Amazon S3, making it easy to process data sets with the Lustre file system. When linked to an S3 bucket, an FSx for Lustre file system transparently presents S3 objects as files and allows you to write changed data back to S3.**

FSx for Lustre provides the ability to both process the 'hot data' in a parallel and distributed fashion as well as easily store the 'cold data' on Amazon S3. Therefore this option is the BEST fit for the given problem statement.
