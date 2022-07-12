---
title: Kinesis Data Stream
description: Kinesis Data Stream
keywords:
  - Kinesis Data Stream
sidebar_position: 1
---


## Can you write data to Kinesis data stream?

When a Kinesis data stream is configured as the source of a Firehose delivery stream, Firehose’s PutRecord and PutRecordBatch operations are disabled and Kinesis Agent cannot write to Firehose delivery stream directly. 

Data needs to be added to the Kinesis data stream through the Kinesis Data Streams PutRecord and PutRecords operations instead. 