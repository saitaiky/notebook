---
title: Debug
description: Debugging serverless applications using logging libraries, structured logging, and AWS Lambda logging best practices for troubleshooting Lambda functions.
keywords:
  - aws
  - amazon web services
  - development
  - debug
  - debug aws
  - debug guide
  - development on aws
  - debug tutorial
---

## Logging in Lambda

Debugging serverless applications is often tedious because they run in isolated, managed environments with limited visibility and control. Unlike local environments where you have direct access to the system and interactive debugging tools, serverless functions operate asynchronously and rely heavily on cloud services. This results in challenges like tracking distributed execution flows, depending primarily on logs for insight, and dealing with the ephemeral nature of functions which complicates state management and session persistence. The lack of direct access to the infrastructure and the reliance on logs and monitoring tools make identifying and resolving issues in serverless applications more complex compared to local debugging. 

Logging in AWS Lambda functions can be done using either the built-in `print` function or a more sophisticated logging library like Python's `logging` module or a specialized AWS Lambda logging library.

### 1. print()

The `print` function in Python writes output directly to the standard output (stdout), which is automatically captured by AWS Lambda and sent to Amazon CloudWatch Logs. It have below down side compares with using logging library.

- **No Levels**: Does not support different logging levels (e.g., DEBUG, INFO, WARNING, ERROR, CRITICAL).
- **No Configuration**: Cannot be easily configured or dynamically managed (e.g., enabling/disabling logs at runtime).
- **No Structured Logging**: Output is plain text without structured or contextual information.

### 2. the `logging` library

Logging libraries provide a more robust and flexible approach to logging, allowing you to configure logging levels, formats, and destinations. The benefit that I mention here is not specifically for debugging in Lambda in AWS but also a general advantage why you should use a logging library in other context as well.

- **Logging Levels**: Supports different levels such as DEBUG, INFO, WARNING, ERROR, and CRITICAL, allowing for fine-grained control over what gets logged.
   **Example**:
   ```python
   logger.debug("This is a debug message")
   logger.info("This is an info message")
   logger.error("This is an error message")
   ```
- **Third-party Integration**: Easier integration with third-party monitoring and log analysis tools (e.g., Datadog, Splunk).
   ```python
   import datadog
   from datadog import initialize, statsd
   
   options = {
       'statsd_host':'127.0.0.1',
       'statsd_port':8125
   }
   initialize(**options)
   statsd.event('Lambda function invoked', 'Details about the invocation')
   ```
- **Enable/Disable Logs**: Logs can be enabled or disabled at runtime by changing the logging level.
   ```python
   def set_log_level(level):
       logger.setLevel(level)
   
    # Once you've set logging level to DEBUG, only the logs from logger.debug() appear
   set_log_level(logging.DEBUG)  # Change log level to DEBUG at runtime
   ```
- **Structured Logging**: Supports structured logging and includes contextual information, which allows for JSON or other formats that can be more easily filter, parsed and analyzed. 
   ```python
   formatter = logging.Formatter('%(asctime)s - %(name)s - %(levelname)s - %(message)s')
   handler = logging.StreamHandler()
   handler.setFormatter(formatter)
   logger.addHandler(handler)

   logger.info(json.dumps({"event": "user_login", "user_id": 123}))
   ```


### 3. aws_lambda_logging in Python

`aws_lambda_logging` is a Python library specifically designed to facilitate structured and consistent logging in AWS Lambda functions. This library enhances the logging capabilities provided by the standard Python logging module by adding AWS Lambda-specific context and simplifying log configuration. Let’s take a simple example of AWS Lambda logging and see what will be the output:

```python
import aws_lambda_logging

def handler(event, context):
    # if you are using Boto3 AWS SDK for Python programming, you can set the level of boto3 separately:
    aws_lambda_logging.setup(level='DEBUG', boto_level='CRITICAL', aws_request_id=context.get('aws_request_id'))
    log.debug('first example')
    log.debug('{"Inputs": [“param1”,”param2”,”param3”]}')
```

Output
```json
{
    "level": "DEBUG",
    "timestamp": "2020-09-25 11:37:22,428",
    "apigw_request_id": "513fde81-536d-12e1-c7ed-1d374ea70152",
    "location": "root.handler:6",
    "message": {
        "first example",
        "Inputs": [
                    "param1",
                    "param2",
                    "param3"
                ]
    }
}
```

:::info Why do we need 2 different logging levels(your application and boto3)?
Imagine you are developing a Lambda function that interacts with multiple AWS services using Boto3. You want to log detailed information about your application logic but keep the AWS SDK logs minimal unless there is a critical issue.
:::

## Debug CDK

Below are the commands that I found comes in handy when debugging SDK
```sh
# --exclusively: Only deploys the specified stack(s), ignoring dependencies.
cdk deploy MyStack --exclusively

# --debug: Enable detailed debugging information. This option produces a verbose output that includes a lot more detail about what the CDK CLI is doing behind the scenes.
cdk synth --debug
cdk deploy --debug

# --verbose: Show debug logs. You can specify this option multiple times to increase verbosity.
cdk deploy --verbose

# --no-rollback: Prevents stack rollback on failure, which allows you to inspect the state and error messages of failed resources.
cdk deploy --no-rollback
```