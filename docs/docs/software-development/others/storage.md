---
title: Storage
description: Storage
---

Data storage is the retention of information using technology specifically developed to keep that data and have it as accessible as necessary. Data storage refers to the use of recording media to retain data using computers or other devices. The most prevalent forms of data storage are file storage, block storage, and object storage, with each being ideal for different purposes.

1. File Storage:
    - Data Structure: File storage organizes data into a hierarchical structure of files and directories.
    - Access Method: It provides access at the file level, making it suitable for shared file access.
    - Protocols: Common file storage protocols include NFS, SMB/CIFS, and AFP.
    - Use Cases: File storage is ideal for scenarios where multiple users or applications need shared access to files. It's commonly used in network-attached storage (NAS) systems for document sharing, multimedia content, and collaborative work.
2. Block Storage:
    - Data Structure: Block storage breaks data into fixed-sized blocks, typically without any inherent hierarchy.
    - Access Method: It offers low-level access to storage blocks, making it similar to using a raw disk. Block storage devices are commonly used as storage volumes that can be mounted by an operating system.
    - Protocols: Common block storage protocols include iSCSI and Fibre Channel.
    - Use Cases: Block storage is ideal for applications that require high-performance, low-latency access to data. It's commonly used in storage area networks (SANs) for databases, virtualization, and data-intensive workloads.
3. Object Storage:
    - Data Structure: Object storage stores data as discrete objects, each containing the data, metadata, and a unique identifier.
    - Access Method: It provides access at the object level and doesn't impose a hierarchical structure on data. Objects are typically accessed via HTTP/HTTPS and RESTful APIs.
    - Protocols: Object storage protocols include S3 (Simple Storage Service), Swift, and Azure Blob Storage.
    - Use Cases: Object storage is well-suited for storing vast amounts of unstructured data, such as media files, backups, and archival data. It's commonly used in cloud storage environments for its scalability and cost-effectiveness.

## iSCSI

Internet Small Computer Systems Interface or iSCSI is a storage area networking (SAN) protocol. It is an Internet Protocol-based networking standard for transferring data carrying SCSI commands over a TCP/IP network. iSCSI links data storage facilities and provides block-level access to storage devices.

### Analogy

Imagine you have a big box where you can keep all your toys and games. Now, think of iSCSI block storage as a magical box that is far away, but you can still use it to store and access your toys and games.

Instead of keeping your toys physically in the box, you pretend they are inside the magical box, and whenever you want to play with a specific toy, you use a special magical remote control called "iSCSI" to bring that toy to you. The iSCSI remote control knows how to connect to the magical box far away, and it can move toys in and out of it as if they were right there with you.

This way, you can have access to your toys and games from anywhere you want, just like you have them with you all the time. It's like having a big toy room far away that you can use whenever you like, without actually having to carry all the toys with you. That's how iSCSI block storage works, like magic storage that lets you keep and use your stuff even when it's not right next to you!

### iSCSI vs NFS

Imagine you have a bunch of toys that you want to share with your friends. NFS and iSCSI are like two different ways you can let your friends play with your toys.

NFS is like having a special magic door in your room that leads to a toy room. Your friends can come to your room, open the magic door, and play with the toys in the toy room. They can only play with the toys they see in the toy room, and they can't take the toys back to their rooms.

iSCSI, on the other hand, is like giving your friends special magic gloves that let them reach into your room from their own rooms. With these magic gloves, they can pick up any toy they want from your room and play with it directly in their own rooms. They can even keep the toy for a while and play with it whenever they want.

So, NFS is like sharing toys by going to a special toy room, and iSCSI is like sharing toys with magic gloves that let your friends play with the toys in their own rooms. Both ways let your friends play with your toys, but they do it in different ways!
