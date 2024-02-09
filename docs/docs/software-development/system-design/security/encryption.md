---
title: Encryption
---

Generally, you should encrypt both **in transit** and **at rest**. Encrypting in transit these days mainly means using HTTPS rather than HTTP, making use of TLS protocols above. Check this [post](/aws/networking/fundamental/protocols/http-https/) for HTTPS explanation.

**Encrypting at rest** means protecting data while in storage. Most modern databases allow for encryption, often AES 256-bit. The best practice for password protection is to both **hash** and **salt passwords** using something like bcrypt. Depending on your application, you may also want to encrypt while processing (for example, if you're working in fintech.) Cloud architecture offers great options.

Finally, modern messaging apps like iMessage, Whatsapp, and Signal often use **end-to-end encryption (E2EE)**. In these, the message is actually encrypted from one user to another, so the unencrypted message is never stored anywhere except on the user's device.

## Type of encryption

![types-of-encryption](/img/software-development/system-design/security/types-of-encryption.jpg)

Source: [Encryption](https://computer-trickster.blogspot.com/2015/11/encryption.html)

:::infoWhat is a cipher?
In cryptography, a cipher (or cypher) is an algorithm for performing encryption or decryption—a series of well-defined steps that can be followed as a procedure. An alternative, less common term is encipherment. To encipher or encode is to convert information into cipher or code.
:::

### Symmetric Encryption

Symmetric encryption involves using the identical key for encrypting and decrypting information. It's known for its speed and simplicity as long as the key remains confidential.

Though it might appear to carry some risk, symmetric encryption can be highly secure if you adhere to certain best practices. The robustness of the encryption depends largely on:

- The key's length
- The randomness of the key, known as entropy
- The difficulty in deciphering the key without knowledge of it

There are two main variants of symmetric ciphers: block and stream. Block ciphers operate on fixed-size chunks of data, whereas stream ciphers encrypt continuous streams of data, bit by bit. A commonly used block cipher on the internet is AES (Advanced Encryption Standard). It allows keys that are 128, 192, or 256 bits in length, with the 256-bit variant generally considered impervious to cracking.

### Asymmetric Encryption

In contrast, asymmetric encryption uses a pair of keys: one public key for encryption that anyone can access, and one private key for decryption that remains confidential. This form of encryption is typically slower but is reputed for its enhanced security features.

Notable examples of asymmetric encryption methods are RSA and the Diffie-Hellman Key Exchange, both foundational to early TLS (Transport Layer Security). RSA, though less robust in some respects than Diffie-Hellman, has the advantage of authentication, which Diffie-Hellman lacks. Both leverage complex mathematics to generate private keys which are virtually impossible for unauthorized parties to recreate and are widely implemented in modern digital security protocols.


### Hashing

Hashing is not a form of encryption, but it is often used in the field of cryptography. A hash function takes an input (or 'message') and returns a fixed-size string of bytes. The output, typically a 'digest', is unique to each unique input. It is a one-way function: you cannot derive the original input from the hash.

- Hashing is used only to verify data
- The same input will always produce the same output
- It’s impossible to reverse it back to the original data

## Password protection

Password protection is a crucial aspect of software development, ensuring that user accounts and sensitive data remain secure from unauthorized access. Here are some of the most common password protection approaches, including bcrypt, used in software development:

- **Hash Functions**:
    - A way to convert the password to a fixed-size string that looks nothing like the original password.
    - Examples include MD5 and SHA-1.
    - Often considered insufficient due to the rapid speed at which these hashes can be generated, allowing for quick brute-force attacks.
- **Salted Hashes**:
    - A "salt" (a random string) is added to the password before it's hashed.
    - Even if two users have the same password, the hashes will be different.
    - It makes precomputed rainbow table attacks more difficult.
- **Key Strengthening (Key Stretching)**:
    - The key will be hashed multiple times (iterations) to slow down hash generation. So you will hash a password, and then hash the hash of the password, and then hash the hash of the hash of the password, and so on. 
    - This increases the time required for an attacker to perform brute-force attacks.
    - Examples include bcrypt, scrypt, PBKDF2 and Argon2.

### bcrypt

You should always avoid plain text storage and outdated hashing algorithms like MD5 and SHA-1 when dealing with passwords. bcrypt is one of the most widely used password hashing algorithms. It incorporates salting and key stretching. Here's how it works:

- **Salting**: bcrypt automatically generates a salt when hashing a password and stores it along with the hash.
- **Work Factor**: bcrypt has a configurable cost (work factor) that determines how slow the hash function will be.
- **Adaptability**: As hardware gets faster, the work factor can be increased to make the hash computation slower to counteract.

```
# bcrypt hash example (simplified example):
$2b$[cost]$[22 characters salt][31 characters hash]
```

