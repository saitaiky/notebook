---
title: Kinesis Data Stream
description: Kinesis Data Stream
keywords:
  - Kinesis Data Stream
sidebar_position: 1
---


## Integrated with KMS 

**Server-side encryption** is a feature in Amazon Kinesis Data Streams that automatically encrypts data before it's at rest by using an AWS KMS customer master key (CMK) you specify. 

Data is encrypted before it's written to the Kinesis stream storage layer and decrypted after it's retrieved from storage. As a result, your data is encrypted at rest within the Kinesis Data Streams service.

## Can you write data to Kinesis data stream?

When a Kinesis data stream is configured as the source of a Firehose delivery stream, Firehose’s PutRecord and PutRecordBatch operations are disabled and Kinesis Agent cannot write to Firehose delivery stream directly. 

Data needs to be added to the Kinesis data stream through the Kinesis Data Streams PutRecord and PutRecords operations instead. 

## Limitation

Q: What happens if the capacity limits of a Kinesis data stream are exceeded while the data producer adds data to the data stream?

A: The put data calls will be rejected with a `ProvisionedThroughputExceededException`

The capacity limits of an Amazon Kinesis data stream are defined by the number of shards within the data stream. The limits can be exceeded by either data throughput or the number of PUT records. While the capacity limits are exceeded, the put data call will be rejected with a ProvisionedThroughputExceeded exception. 

- If this is due to a temporary rise of the data stream's input data rate, retry by the data producer will eventually lead to completion of the requests. 
- If this is due to a sustained rise of the data stream's input data rate, you should increase the number of shards within your data stream to provide enough capacity for the put data calls to consistently succeed.