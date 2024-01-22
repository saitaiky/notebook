---
title: UDP & TCP
---

![udp-tcp](/img/aws/networking/fundamental/udp-tcp.jpg)

Source: [TCP/IP vs UDP: What’s the Difference?](https://www.colocationamerica.com/blog/tcp-ip-vs-udp)

## UDP

User Datagram Protocol (UDP) refers to a protocol used for communication throughout the internet. It is specifically chosen for time-sensitive applications like gaming, playing videos, or Domain Name System (DNS) lookups. It's used by TFTP, SNMP, DNS, DHCP, RIP, VOIP.

<Tabs className="origin-shield">
    <TabItem value="adv-udp" label="UDP advantages">
        <ul>
            <li>small packet sizes than TCP by about 60%</li>
            <li>UDP header 20 bytes</li>
            <li>TCP header 80 bytes</li>
            <li>Connectionless: No connection to create and maintain</li>
            <li>You dont have to create connection first before sending out data</li>
            <li>You have more control of when data is being sent out</li>
        </ul>
    </TabItem>
    <TabItem value="dis-udp" label="UDP disadvantages">
        <ul>
            <li>Data corruption is a common occurance on the Internet, UDP has a primitive form of error detection.</li>
            <li>No compensation for lost packets</li>
            <li>Packets can arrive out of order</li>
            <li>No congestion control
            Conclusion: UDP may be light weight, but not that reliable.</li>
        </ul>
    </TabItem>
</Tabs>

## TCP

Transmission Control Protocol (TCP) is a communications standard that enables application programs and computing devices to exchange messages over a network. It is designed to send packets across the internet and ensure the successful delivery of data and messages over networks. It's used by other protocols FTP, SMTP, HTTP, HTTPs, Telnet. 

<Tabs className="origin-shield">
    <TabItem value="adv-tcp" label="TCP advantages">
            <ul>
            <li>Retransmission - When a sender doesnt get an acknowlegement after a certain period of time, it will assume that the packet got lost on its way. So, it will send it again-.</li>
            <li>In-order delivery - Because segments are ordered in TCP, it implements in-order delivery.
            Although packets may come out of order, TCP rearranges them before sending them to application.</li>
            <li>Congestion Control - Delays transmission when the network is congested</li>
            <li>Error Detection</li>
        </ul>
    </TabItem>
    <TabItem value="dis-tcp" label="TCP disadvantages">
        <ul>
            <li>Bigger header and overhead</li>
            <li>Data doesnt always sent out immeditaley</li>
            <li>side effect of congestion control</li>
            <li>Hence real time conversation will not feel real time as you wanted to be</li>
            <li>As you can see, congestion control can be a nuisance or an enhancemewnt</li>
            <li>Retransmission of packets, acknowledgement of packets</li>
            <li>For example, to send HD video, you need lots of bandwidth. But if you are using TCP, you need more becaue of retransmission and acknowledgement. Hence, in this case it makes sense to use UDP than TCP.</li>
        </ul>
    </TabItem>
</Tabs>

## TCP vs UDP

TCP emphasizes accurate delivery rather than speed and enforces the "rules of the road", similar to a traffic cop. How? It's **connection-oriented**, which means that the server must be "listening" for connection requests from clients, and the client and server must be connected before any data is sent. Because it's **a stateful protocol**, context is embedded into the **TCP segment** ("packaged" segments of the data stream including a TCP header), meaning that TCP can detect errors (either lost or out-of-order data packets) and request re-transmission.

## Use cases

When deciding between TCP and UDP, it's essential to consider the network communication requirements of your application. Here are key differences and concise use cases for each protocol:

### TCP

TCP is a connection-oriented protocol that ensures reliable, ordered, and error-checked delivery of a stream of bytes. It's like a phone call where you establish a connection and ensure the conversation is heard clearly and in the correct order. Below are the test cases:

1. **Web Browsing (HTTP/HTTPS):** For reliable delivery of web page content.
2. **Email (SMTP/IMAP/POP3):** To ensure that all your messages are sent and received accurately.
3. **File Transfers (FTP/SFTP):** For accurate transfer of files without any loss.
4. **Secure Shell (SSH):** For secure and reliable command-line access on remote servers.
5. **Online Banking and E-Commerce:** Where transaction integrity is crucial.

### UDP
UDP, on the other hand, is connectionless and does not guarantee delivery, order, or error-checking. It's like mailing a postcard; you send it off without confirmation that it's arrived or if it’s intact. Below are the test cases:

1. **Live Broadcasts or Streaming (e.g., IPTV):** Where occasional loss is preferable to delay.
2. **Online Gaming:** For fast transmission that can tolerate some packet loss.
3. **Voice or Video Calls (VoIP):** Where real-time communication is more important than precision.
4. **Domain Name System (DNS):** For quick queries that tolerate the risk of packet loss.
5. **Trivial File Transfer Protocol (TFTP):** Where simple and low-overhead transmission is needed.

When you’re choosing between TCP and UDP, weigh the trade-offs between reliability and speed based on your application's needs. Reliable and ordered delivery? Go with TCP. Need speed with some acceptable loss? UDP is your choice.

