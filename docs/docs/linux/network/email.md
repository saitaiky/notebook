---
title: Email
---

https://salesblink.io/blog/difference-between-smtp-imap-pop3

## Workflow

![Email-workflow](/img/linux/network/Difference-Between-SMTP-IMAP-And-POP3-Comparisons.jpeg)
Source: [Email-workflow](https://salesblink.io/blog/difference-between-smtp-imap-pop3)

1. The email client of the sender connects to that of the SMTP server (for example, smtp.gmail.com)
2. The SMTP server authenticates the email address of the recipient.
3. After the authorization of the recipient, the Gmail SMTP server sends the email to spacex.com’s SMTP server.
4. The SMTP server of spacex.com checks whether elon@spacex.com is valid or not. 
5. After that, the SMTP server sends the email to the IMAP/POP3 server. 

## Definition

### What is SMTP?
> TL;DR - SMTP stands for Simple Mail Transfer Protocol. It is the standard protocol for sending email messages. Your email client and internet servers use SMTP after you finish typing your email, upon hitting send.

SMTP stands for Simple Mail Transfer Protocol. It is the standard protocol for sending email messages using SMTP. 

Your email client and internet servers use SMTP after you finish typing your email, upon hitting send. It moves your message over the internet and also makes it land into the recipient’s mailbox. 

SMTP servers are of two types: Relays and Receivers. 

Relays accept the user’s emails and route them to the recipient, while receivers deliver them to the mailbox after accepting the email from the relay servers.

### What Is IMAP?

> TL;DR - IMAP is an abbreviation for Internet Message Access Protocol. It is a popular protocol for receiving email messages. The biggest advantage of the IMAP protocol is that it lets you receive email on more than one computer.

IMAP is an abbreviation for Internet Message Access Protocol. It is a popular protocol for receiving email messages. The most significant advantage of the IMAP protocol is that it lets you receive email on more than one computer (or device). That is because after getting delivered, the email stays on the mail server. In short, you can read your email on your office computer, the desktop at home, your tablet and your smartphone. 

Also, it doesn’t download the entire message until you open it. That helps in a faster initial connection and startup.  

However, it won’t perform well when you have a slow internet connection.. And you won’t be able to read your emails. 

### What Is POP3?
 > TL;DR - POP3 is an abbreviation for Post Office Protocol, whereas ‘3’ refers to the version. Version 3 is the latest and most widely used one. It is a simple protocol not having much to offer apart from the download.

Like IMAP, POP3 is another protocol for receiving emails. POP3 is an abbreviation for Post Office Protocol, whereas ‘3’ refers to the version. Version 3 is the latest and most widely used one. It is a simple protocol not having much to offer apart from the download. 

POP3 downloads an email from the server to one computer (or device) and ends up removing it from the server once it gets downloaded on your computer. That means it won’t be possible to read your email messages from multiple locations, which is not ideal.  

The advantages of this protocol are that you can read your emails when you are offline. And the use of the email server’s storage is less.  However, as it works with one device and doesn’t store the messages on the server, there is a need to backup your computer. Failing to do so will result in you losing all your emails when your computer dies. 

## POP3 vs IMAP

POP3 downloads the email from a server to a single computer, then deletes the email from the server.

On the other hand, IMAP stores the message on a server and synchronizes the message across multiple devices.


### Which one to use?

Choosing between IMAP and POP3 requires you to weigh the advantages and disadvantages of both protocols and consider your requirements. 

You should choose IMAP if you want to access mail from multiple devices and organize your email in folders. Also, with IMAP, you will have no server storage space crunch. This protocol is well-suited for a stable internet connection and works well when you want to access your email fast. 

On the other hand, POP3 is the right choice for you when you have an unstable internet connection. If you are concerned about your privacy, POP3 is the best protocol for you as there will be no copies of the email you received on the server. The protocol is well-suited if you are the only one accessing it and also are using just one device for the purpose. 

## Further reading

- [Difference Between SMTP, IMAP, And POP3 (+ Comparisons)](https://salesblink.io/blog/difference-between-smtp-imap-pop3)