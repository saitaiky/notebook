---
title: Encoding
description: Data encoding overview covering Base64, URL encoding, UTF-8, ASCII, and binary encoding schemes used for data transmission, storage, and web communication.
keywords:
  - encoding
  - base64
  - url encoding
  - utf-8
  - ascii encoding
  - data encoding
  - binary encoding
---

Encoding is the process of converting data from one form to another. This process often involves transforming data into a format that can be efficiently stored, transmitted, or interpreted by different systems. Encoding ensures that data maintains its integrity and usability across various environments and platforms.

:::info Encryption vs Encoding
Encryption and encoding are fundamentally different processes with different purposes. Encryption is intended to protect data by converting it into a form that is unreadable without the decryption key, thus ensuring confidentiality. Encoding, on the other hand, is about data representation, transforming it into a different format for compatibility or efficiency in transport or storage.
:::

## Why?

We need encoding algorithms for several reasons:

- **Data Integrity**: Ensure that the structure of the data remains intact during transport or storage, avoiding issues with special characters or binary data that may not be handled correctly by all systems.
- **Compatibility**: Facilitate the transfer of data between systems that may have different ways of representing or handling data. For example, older systems might not support Unicode characters, necessitating encoding text data for compatibility.
- **Efficiency**: Optimize the size of the data or adapt it for faster processing. Some encoding methods are designed to reduce the data size (compression), while others, like Base64, increase it but make it safe for transport over channels that might not support binary data.
- **Data Obfuscation**: While encoding isn’t secure like encryption, it can offer a basic level of obfuscation. It won’t prevent someone from understanding the data if they want to, but it can prevent casual observation of content.

In the next section we'll have a look at some common encoding algorithms. Each encoding algorithm was developed to address specific issues related to data representation, transmission, and storage. Here's an overview of the problems each encoding algorithm aims to solve:

| Encoding          | Problem Solved                                                                 | Purpose                                                                                       | Rules (High-Level)                                                                                           |
|-------------------|--------------------------------------------------------------------------------|-----------------------------------------------------------------------------------------------|--------------------------------------------------------------------------------------------------------------|
| ASCII             | Standardizing character representation for text communication                  | Provides a common encoding for English letters, digits, punctuation, and control characters   | 7-bit encoding for 128 characters including control characters, letters, digits, and punctuation.            |
| Base64            | Encoding binary data for safe transmission over text-based protocols           | Converts binary data to an ASCII string format suitable for text-only protocols               | Converts 3 bytes of binary data into 4 ASCII characters using a set of 64 characters plus padding (`=`).      |
| UTF               | Representing text in multiple languages and scripts uniformly                  | Supports all languages and symbols with a universal character set, backward compatible with ASCII | Variable-length encoding (1-4 bytes) for each character, covering all Unicode characters.                   |
| URL Encoding      | Encoding special characters in URLs                                            | Ensures safe transmission of URLs by encoding special and non-ASCII characters                | Encodes special characters as `%` followed by two hexadecimal digits (e.g., space as `%20`).                  |
| HTML/XML Entities     | Displaying special characters in HTML/XML documents                                | Encodes special characters to avoid conflicts with HTML/XML syntax                                | Characters like `<`, `>`, `&`, `'`, and `"` are encoded as `&lt;`, `&gt;`, `&amp;`, `&apos;`, and `&quot;`.   |

Each encoding algorithm addresses specific challenges related to data representation, ensuring compatibility, integrity, and proper display or transmission of text and binary data across different platforms and protocols.

## Common Encoding Algorithms

There are several different encoding algorithms used for various purposes. Here are some common ones:

### ASCII

ASCII (American Standard Code for Information Interchange), developed in the 1960s, is a 7-bit character encoding standard that represents text in computers and other devices. It encodes 128 characters, sufficient for basic English letters, digits, punctuation, and control characters, but inadequate for other languages and symbols. Its limitations led to the development of Unicode in the late 1980s, which provides a unique code for every character worldwide. 

UTF-8, a widely used Unicode encoding, maintains ASCII compatibility while supporting global characters using 1 to 4 bytes. This ensures efficient, scalable, and universal text processing, accommodating diverse languages, symbols, and emojis, which ASCII couldn't handle. Thus, UTF-8 replaces ASCII for comprehensive internationalization and modern computing requirements, allowing seamless text processing across different languages and platforms.

:::info UTF vs ASCII
Using UTF instead of ASCII in modern operating systems is essential because UTF (Unicode Transformation Format) supports a vast range of characters from virtually every language, enabling global language support and internationalization, which ASCII cannot provide due to its 128-character limitation. 

UTF includes not only basic English letters but also accented letters, symbols, emojis, and more, making it crucial for modern applications requiring diverse characters. Additionally, UTF-8, a popular Unicode encoding, maintains compatibility with ASCII while efficiently encoding a broad spectrum of characters, ensuring that systems can handle text from any language seamlessly.
:::

:::info
If you use ASCII encoding in your IDE and save a file that contains characters not present in the ASCII table, you will encounter issues because ASCII can only represent 128 specific characters (the basic English letters, digits, punctuation, and control characters).

If you type "你好嗎" (which means "How are you?" in Chinese) and try to save it using ASCII encoding, those characters do not exist in the ASCII table, as ASCII only supports 128 specific characters. It might show garbled text or some kind of error characters(e.g. `��`), depending on how the IDE handles unsupported characters like.
:::

#### ASCII Table

| Char | Dec | Hex  | Binary   | Description         |
|------|-----|------|----------|---------------------|
| !    | 33  | 0x21 | 00100001 | Exclamation mark   |
| "    | 34  | 0x22 | 00100010 | Double quote       |
| #    | 35  | 0x23 | 00100011 | Number sign        |
| $    | 36  | 0x24 | 00100100 | Dollar sign        |
| %    | 37  | 0x25 | 00100101 | Percent sign       |
| ...    | ...  | ... | ... | ...         |
| a    | 97  | 0x61 | 01100001 | Lowercase a        |
| b    | 98  | 0x62 | 01100010 | Lowercase b        |
| c    | 99  | 0x63 | 01100011 | Lowercase c        |
| d    | 100 | 0x64 | 01100100 | Lowercase d        |
| e    | 101 | 0x65 | 01100101 | Lowercase e        |

#### Example

In Python, you might write text to a file like this:

```python
with open('example.txt', 'w') as file:
    file.write('Hello')
```

- The string "Hello" is composed of the characters H, e, l, l, o.
- The ASCII values of these characters are 72, 101, 108, 108, and 111.
- These values are converted to binary: `01001000`, `01100101`, `01101100`, `01101100`, and `01101111`.
- The system stores these binary values in the file.

When you read the text back:

```python
with open('example.txt', 'r') as file:
    content = file.read()
    print(content)
```

- The system reads the binary data from the file.
- It decodes the binary data back into the ASCII characters.
- You see the string "Hello" as output.



### Base64

Base64 is an encoding scheme used to represent binary data in an ASCII string format by translating it into a radix-64 representation. This is particularly useful for transmitting binary data over media that are designed to deal with textual data, such as email or HTTP.

Base64 encoding takes three bytes of data (24 bits) and splits them into four 6-bit values. Each 6-bit value is then mapped to a character in the Base64 alphabet, which includes A-Z, a-z, 0-9, +, and /. If the input data is not a multiple of three bytes, padding with `=` characters is used to ensure that the Base64 encoded string is properly aligned.
```python
import base64

# Original string
original_string = "Hello, World!"

# Encode the string to bytes
encoded_bytes = base64.b64encode(original_string.encode('utf-8'))

# Convert encoded bytes to string
encoded_string = encoded_bytes.decode('utf-8')
print(f"Encoded: {encoded_string}")  # Outputs: SGVsbG8sIFdvcmxkIQ==

# Decode the Base64 string back to bytes
decoded_bytes = base64.b64decode(encoded_string)

# Convert bytes back to original string
decoded_string = decoded_bytes.decode('utf-8')
print(f"Decoded: {decoded_string}")  # Outputs: Hello, World!
```

### UTF
Unicode Encoding (UTF-8, UTF-16, etc.): Encodes a vast set of characters from various languages and scripts across the world. UTF-8 is a variable-width character encoding that uses one to four bytes per character; it's backwards compatible with ASCII but can represent every character in the Unicode standard.

```python
# Encode UTF-8
text = "こんにちは"
utf8_bytes = text.encode('utf-8')  # Convert text to UTF-8 bytes
print(utf8_bytes)  # Outputs: b'\xe3\x81\x93\xe3\x82\x93\xe3\x81\xab\xe3\x81\xa1\xe3\x81\xaf'

# URL Encode the UTF-8 Bytes
encoded_str = urllib.parse.quote(text)
print(encoded_str)  # Outputs: %E3%81%93%E3%82%93%E3%81%AB%E3%81%A1%E3%81%AF
```


### Others

- **URL Encoding (Percent Encoding)**: Encodes special characters in URLs into a format that can be transmitted over the Internet. It uses percent signs followed by two hexadecimal values representing the ASCII code of the character (e.g., space becomes `%20`).
- **HTML and XML Entities**: Used to represent reserved characters or characters that do not readily appear on a keyboard in HTML or XML (e.g., `&` becomes `&amp;`).
