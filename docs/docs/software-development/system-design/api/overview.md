---
title: API(SOAP, REST, GraphQL, and gRPC)
---

## Introduction
An architecture becomes practical when we comprehend how information moves across systems. Whether you are an application or enterprise architect, understanding tradeoffs is crucial when selecting a method for information exchange. Data exchange, a core aspect of enterprise architecture, has evolved from physical to digital methods. This article explores the history of data exchange and compares SOAP, REST, GraphQL, and gRPC APIs.

## Data Exchange Evolution
Early data exchange involved physical methods like magnetic tapes. With standardized network communication, digital exchanges became prominent, utilizing protocols such as Telnet, SMTP, FTP, and HTTP. The lack of standard data formats led to the advent of XML, later succeeded by text-based JSON, Protocol Buffers, and Thrift.

## API as the Linchpin
Standardized data formats prompted APIs to become pivotal in application architecture. APIs facilitate diverse client interactions, from PCs to IoT devices. The rise of machine learning and AI emphasizes service-to-service interactions, making APIs integral to the internet's core activities.

## API Formats Overview

### Simple Object Access Protocol (SOAP) 
- **Definition:** A precursor to REST. SOAP works like an envelope that contains a bulky, XML-encoded message. It is much slower than binary messaging protocols, such as RPC. However, the standardized text format and security features make enforcing legal contracts and authentication easy throughout the API's processing.
- **Usage:** 
  - **Enterprise Financial Services**: In banking or stock trading applications, where transactions require guaranteed delivery and security.
  - **Telecommunications**: When managing transactions across multiple services and maintaining a high level of reliability.
  - **Healthcare Systems**: For secure exchange of sensitive patient data where standards-compliant communication is essential.
- **Structure:** Hierarchical SOAP message with elements like `<soap:Envelope>`, `<soap:Header>`, `<soap:Body>`, and `<soap:Fault>`.

```xml
 POST /BobsTickers HTTP/1.1
 Host: www.example.org
 Content-Type: application/soap+xml; charset=utf-8
 Content-Length: 275
 SOAPAction: "http://cooltickers.org/soap"
 
<?xml version="1.0"?>
<soap:Envelope xmlns:soap="http://www.w3.org/2003/05/soap-envelope" xmlns:m="http://www.exampletickers.org">
  <soap:Header>
  </soap:Header>
  <soap:Body>
    <m:GetStockPriceRequest>
      <m:StockName>IBM</m:StockName>
    </m:GetStockPriceRequest>
  </soap:Body>
</soap:Envelope>
```

### REST

> [REST API Response code](https://www.ibm.com/docs/en/odm/8.8.1?topic=api-rest-response-codes-error-messages)

- **Definition:** Representational State Transfer (REST) employs standard HTTP methods (GET, POST, PUT, DELETE) for resource interactions.
- **Usage:** Well-known and widely used for simplicity and immediate productivity.
- **Structure:** Stateless request-response with JSON or XML response formats.

:::cautionDownside
Although REST APIs are among the most popular choices, a downside is that a client might have to deal with redundant data when making REST API calls.

For example, to fetch the name and members of a musical band, requesting the dedicated resources for that band would retrieve the name and its members (possibly from multiple endpoints) and also other information (such as its albums, founding year, and so on), depending on how the resources are organized by the server.
:::

```json
{
  "car": {
    "vin": "KNDJT2A23A7703818",
    "make": "kia",
    "model": "soul",
    "year": 2010,
    "links": {
      "service": "/cars/KNDJT2A23A7703818/service",
      "sell": "/cars/KNDJT2A23A7703818/sell",
      "clean": "/cars/KNDJT2A23A7703818/sell"
    }
  }
}
```

### GraphQL
- **Definition:** GraphQL was developed to allow clients to execute precise queries and retrieve only the data they are interested in, typically from a graph database. To achieve this process, servers need to predefine a schema that describes all possible queries and their return types. This reduces the server payload and offers the client a great amount of flexibility during query time.
- **Usage:** Enables explicit definition of returned data structure in queries. Supports asynchronous messaging via Subscriptions.
- **Structure:** Defined by a schema language, allowing clients to specify the structure of returned data.

:::cautionDownside
Performance can suffer when the client has too many nested fields in one request. Additionally, there is a steep learning curve that requires extensive knowledge.

Therefore, GraphQL users need to find a balance between its benefits and implementation costs.
:::

```json
// Query
{
  me {
    name
  }
}

// Result
{
  "me": {
    "name": "Luke Skywalker"
  }
}
```

### gRPC
- **Definition:** gRPC, developed by Google, uses Protocol Buffers *binary format* for fast, bidirectional, and asynchronous data exchange.
- **Usage:** Ideal for backend services due to speed and efficiency.
- **Structure:** .proto file defines the schema for data encoding/decoding. Supports bidirectional streaming.
```go
//proto file
// The greeting service definition.
service Greeter {
  // Sends a greeting
  rpc SayHello (HelloRequest) returns (HelloReply) {}
}

// The request message containing the user's name.
message HelloRequest {
  string name = 1;
}

// The response message containing the greetings
message HelloReply {
  string message = 1;
}
```

```javascript
function main() {
  var client = new hello_proto.Greeter('localhost:50051',
                                       grpc.credentials.createInsecure());
  client.sayHello({name: 'you'}, function(err, response) {
    console.log('Greeting:', response.message);
  });
  client.sayHelloAgain({name: 'you'}, function(err, response) {
    console.log('Greeting:', response.message);
  });
}
```


## API Format Comparison
### SOAP
- **Pros:** Protocol flexibility, WSDL for discovery, language-neutral.
- **Cons:** Complexity, verbosity (XML), potential latency.

### REST
- **Pros:** Simplicity, wide industry adoption, immediate productivity.
- **Cons:** Lack of flexibility in response structure, can be slow.

### GraphQL
- **Pros:** Flexibility, self-describing, tailored response structure, Subscriptions for asynchronous messaging.
- **Cons:** Learning curve, requires adherence to GraphQL way.

### gRPC
- **Pros:** Speed, efficiency, *bidirectional streaming*, Protocol Buffers compactness, language agnostic (can reuse proto file).
- **Cons:** Version coordination, learning curve, dependency on *HTTP/2 support*.

## Choosing the Right API Format
- **SOAP:** Legacy protocol with broad industry use, suitable for complex inter-service communication.
- **REST:** Simple, well-known, immediate productivity; suitable for risk-averse companies.
- **GraphQL:** Flexible, growing popularity, ideal for scenarios requiring frontend flexibility.
- **gRPC:** Fast, efficient, best for backend services where nanoseconds count.

## Conclusion
Selecting the right API format is a pivotal decision in enterprise architecture. Each format has unique benefits and challenges, and the choice should align with the organization's needs, risk tolerance, and future scalability. Collaborative decision-making involving a cross-functional team ensures a thoughtful and informed approach, recognizing that the chosen API format's impact extends well beyond the architectural diagrams.