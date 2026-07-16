# Module 4 — Networking Foundations

This module covers essential computer networking concepts, protocols, models, and operations required for cloud and system engineering.

---

## 1. The OSI Model vs TCP/IP Model

### 1. Definition
- **OSI Model (Open Systems Interconnection)**: A conceptual framework of 7 layers that standardizes network communication functions.
- **TCP/IP Model**: A practical 4-layer suite of protocols that powers the modern internet.

### 2. Why it Exists
Different computer hardware and operating systems must agree on packet formatting, routing rules, and error correction to communicate. The models partition these tasks into modular layers.

### 3. Why it is Important
Helps engineers troubleshoot communication issues. For example, if ping works (Layer 3/Network) but web browsing fails (Layer 7/Application), the issue is isolated to higher layers.
- Fits in: Core systems networking.

### 4. Real World Analogy
**Postal System**:
- **Layer 7 (Application)**: You write a letter to a friend.
- **Layer 6 (Presentation)**: You translate it to Spanish so they can read it.
- **Layer 5 (Session)**: You establish a dialog (wait for confirmation).
- **Layer 4 (Transport)**: You decide if it needs registered mail (TCP) or regular post (UDP).
- **Layer 3 (Network)**: You write the address and zip code on the envelope (IP address).
- **Layer 2 (Data Link)**: The letter is loaded into a local mail truck (MAC address/Ethernet).
- **Layer 1 (Physical)**: The truck drives on physical roads (cables/electrical signals).

### 5. Real World Example
- Opening Chrome and loading google.com uses HTTP (Layer 7), running over TCP (Layer 4), routed via IP addresses (Layer 3) over Wi-Fi (Layers 1 & 2).

### 6. Architecture Diagram
```
OSI Model Layers:                        TCP/IP Model Layers:
+------------------------------------+   +------------------------------------+
| Layer 7: Application (HTTP, DNS)   |   | Application Layer                  |
| Layer 6: Presentation (SSL, JSON)  |   | (Combines OSI 5, 6, 7)             |
| Layer 5: Session (RPC, Sockets)    |   |                                    |
+------------------------------------+   +------------------------------------+
| Layer 4: Transport (TCP, UDP)      |   | Transport Layer (TCP, UDP)         |
+------------------------------------+   +------------------------------------+
| Layer 3: Network (IP, Routers)     |   | Internet Layer (IP, ICMP)          |
+------------------------------------+   +------------------------------------+
| Layer 2: Data Link (MAC, Switch)   |   | Network Access Layer               |
| Layer 1: Physical (Cables, Fiber)  |   | (Combines OSI 1, 2)                |
+------------------------------------+   +------------------------------------+
```

### 7. Working Step by Step (Data Encapsulation)
1. **Application**: App generates data (e.g., HTTP Request).
2. **Transport**: Segment is created by wrapping data with source and destination ports (TCP header).
3. **Network**: Packet is created by wrapping segment with source and destination IP addresses.
4. **Data Link**: Frame is created by wrapping packet with source and destination MAC addresses.
5. **Physical**: Frame is serialized into binary bits and sent across physical medium.
6. **Decapsulation**: Receiving device reads frame -> packet -> segment -> raw data in reverse order.

### 8. Advantages
- Decouples systems (you can change physical cables without changing web browser software).
- Standardizes network debugging tools.

### 9. Disadvantages
- Theoretical model; some protocols (like SSL/TLS) cross multiple OSI boundaries.

### 10. Interview Explanation
"The OSI model is a 7-layer theoretical framework explaining network operations. TCP/IP is the practical 4-layer model used by the internet. As data moves down the layers, it gets wrapped in headers—ports at Layer 4, IPs at Layer 3, and MAC addresses at Layer 2—before being sent as electrical signals at Layer 1."

### 11. Frequently Asked Interview Questions
1. *What is Encapsulation?*
   - The process of wrapping data in headers and trailers at each network layer.
2. *At what layer do Routers operate?*
   - Layer 3 (Network Layer) because they route packets using IP addresses.
3. *At what layer do Switches operate?*
   - Layer 2 (Data Link Layer) because they forward frames using MAC addresses.
4. *At what layer does encryption (SSL/TLS) happen?*
   - Layer 6 (Presentation Layer) in the OSI model.
5. *Difference between Layer 4 and Layer 7 Load Balancers?*
   - L4 routes traffic based on TCP/UDP ports and IP addresses. L7 inspects HTTP headers, cookies, and URLs before routing.
6. *Name three protocols operating at the Application Layer.*
   - HTTP, DNS, SMTP, SSH, FTP.
7. *What is a MAC address?*
   - Media Access Control address. A unique, permanent hardware identifier assigned to a network interface controller.
8. *What is a Packet vs a Frame?*
   - A Packet is the data unit at Layer 3 (Network). A Frame is the data unit at Layer 2 (Data Link).
9. *What is socket connection?*
   - An endpoint of a two-way communication link defined by an IP address and a Port number.
10. *Define TCP handshake.*
    - A 3-step process (SYN, SYN-ACK, ACK) used to establish a reliable connection.

### 12. Common Mistakes
- Confusing Switches (Layer 2) with Routers (Layer 3), leading to routing configuration errors in virtual networks.

### 13. Best Practices
- When debugging connection timeouts, start testing from Layer 3 (ping/traceroute) up to Layer 7 (curl/http check).

### 14. Hands-on Lab
- Use a packet capture tool like Wireshark or `tcpdump` to inspect TCP handshake packets.

### 15. Commands
- `ping google.com` (Layer 3 connectivity test)
- `traceroute google.com` (Track path hops across Layer 3 routers)

### 16. Code Examples
```bash
# Verify connection to a specific port (Layer 4 check)
nc -zv google.com 443
# Connection to google.com 443 port [tcp/https] succeeded!
```

### 17. Visual Memory Tricks
- **OSI Layers (Bottom to Top)**: **P**lease **D**o **N**ot **T**hrow **S**ausage **P**izza **A**way (Physical, Data Link, Network, Transport, Session, Presentation, Application).

### 18. MCQs
1. Which layer handles routing packets across different networks?
   - A) Transport
   - B) Data Link
   - C) Network (Correct)
2. HTTP runs on top of which Layer 4 protocol?
   - A) UDP
   - B) TCP (Correct)
   - C) ICMP

### 19. Practical Scenario Questions
- *Scenario*: A user cannot load a website, but they can successfully ping the web server's IP address. What layer is the issue likely located?
  - *Answer*: Layer 7 (Application) or Layer 4 (Port blocked by firewall). Since Ping (Layer 3) succeeds, the physical and routing network layers are working.

### 20. Summary
- **Key Points**: OSI is 7 layers; TCP/IP is 4. Data gets encapsulated with headers down the stack.
- **Cheat Sheet**: L3 = IP Routing. L4 = Port/Connection. L7 = App content (HTTP/JSON).

---

## 2. DNS (Domain Name System)

### 1. Definition
DNS is the database system that translates human-readable domain names (like `google.com`) into computer-readable IP addresses (like `142.250.190.46`).

### 2. Why it Exists
Computers communicate using numbers (IP addresses), but humans cannot remember thousands of numeric strings. DNS acts as the phonebook of the internet.

### 3. Why it is Important
Without DNS, the internet would be unusable for average users.
- Fits in: Networking name resolution.

### 4. Real World Analogy
**Phone Contacts Book**: Instead of dialing `+1-555-0199` manually, you tap the contact name "John Doe". Your phone looks up the contact record and dials the underlying number automatically.

### 5. Real World Example
- **AWS Route 53** is a highly available and scalable cloud DNS web service.

### 6. Architecture Diagram
```
Client ---> [ DNS Resolver ] ---> [ Root Nameserver (.) ]
                 |            ---> [ TLD Nameserver (.com) ]
                 v            ---> [ Authoritative Nameserver (google.com) ]
Client <--- [ Return IP: 1.2.3.4 ]
```

### 7. Working Step by Step
1. User types `example.com` in a browser.
2. The browser checks local cache. If missing, it queries the local DNS Resolver (e.g. ISP or Google `8.8.8.8`).
3. Resolver queries the Root Server (`.`). Root directs it to the Top Level Domain (TLD) server (`.com`).
4. Resolver queries TLD. TLD directs it to the Authoritative Nameserver (e.g. Route 53 server).
5. Resolver queries Authoritative Server, retrieves the IP, caches it, and returns it to the browser.
6. Browser connects directly to the IP address.

### 8. Advantages
- Makes internet navigation human-friendly.
- Allows changing server IP addresses without changing the domain name.

### 9. Disadvantages
- DNS Propagation delay (updates can take up to 24-48 hours to spread globally).
- Susceptible to DNS Spoofing / Cache Poisoning attacks.

### 10. Interview Explanation
"DNS translates domain names to IP addresses. When a request is made, a recursive resolver queries root servers, TLD servers, and authoritative nameservers in sequence to fetch the correct IP address record. These records are cached locally for a duration defined by the TTL (Time to Live) value."

### 11. Frequently Asked Interview Questions
1. *What is an A Record vs a CNAME Record?*
   - **A Record**: Maps domain to IPv4 address. **CNAME (Canonical Name)**: Maps domain to another domain (alias).
2. *What is TTL (Time to Live) in DNS?*
   - The time (in seconds) a DNS record is cached by a resolver before it must fetch a fresh copy.
3. *What is a TXT Record used for?*
   - To store arbitrary text data, commonly used for email verification (SPF, DKIM) and domain ownership verification.
4. *What is an MX Record?*
   - Mail Exchanger record. Specifies the mail servers responsible for receiving email for the domain.
5. *What is a PTR Record?*
   - Pointer Record. Used for Reverse DNS lookup (find domain name from IP).
6. *What is the difference between Recursive and Iterative DNS queries?*
   - Recursive: Resolver does all the work querying other servers and returns final IP. Iterative: Server returns the address of the next DNS server to ask.
7. *What is DNS cache poisoning?*
   - An exploit where false DNS entry data is introduced into the cache of a resolver, redirecting users to malicious sites.
8. *What port does DNS use?*
   - Port 53 (TCP for large transfers, UDP for fast small queries).
9. *What is Anycast routing in DNS?*
   - Routing DNS queries to the nearest physical DNS server using single IP configurations.
10. *Define FQDN.*
    - Fully Qualified Domain Name (e.g., `www.example.com.`).

### 12. Common Mistakes
- Setting a very high TTL (like 86400 seconds / 24 hours) right before migrating servers. If the IP changes, users will hit the old server for 24 hours.

### 13. Best Practices
- Lower TTL values to 300 seconds (5 minutes) a few days before server migrations, and restore high values afterwards to save query costs.

### 14. Hands-on Lab
- Perform a DNS lookup for your favorite website using command line tools and identify record details.

### 15. Commands
- `nslookup google.com` (Standard DNS utility query)
- `dig A google.com` (Detailed DNS analysis tool on Linux)

### 16. Code Examples
```bash
# Dig query to find the A records of google.com
dig google.com +short
# Output:
# 142.250.190.46
```

### 17. Visual Memory Tricks
- **DNS = Domain Number System**: Translates letters (Domain) to Numbers (IP).

### 18. MCQs
1. Which DNS record maps a domain name to another domain name?
   - A) A Record
   - B) CNAME Record (Correct)
   - C) TXT Record
2. What protocol/port does standard DNS name resolution query run on?
   - A) Port 53, UDP (Correct)
   - B) Port 80, TCP
   - C) Port 443, SSL

### 19. Practical Scenario Questions
- *Scenario*: You buy a domain `mycoolapp.com` and want to point it to your AWS load balancer URL `lb-123.amazonaws.com`. What DNS record should you create?
  - *Answer*: Create a CNAME Record mapping `mycoolapp.com` to `lb-123.amazonaws.com`.

### 20. Summary
- **Key Points**: Maps names to IPs. Hierarchical lookup path (Root -> TLD -> Authoritative). Cached via TTL.
- **Cheat Sheet**: A = IP. CNAME = Alias. MX = Email. Port = 53.

---

## 3. Proxy vs Reverse Proxy

### 1. Definition
- **Forward Proxy**: A server that sits in front of clients, acting on behalf of the clients to fetch web pages (protects client identity).
- **Reverse Proxy**: A server that sits in front of web servers, acting on behalf of the servers to receive client requests (protects server identity, handles load balancing).

### 2. Why it Exists
- Forward proxies are used to bypass firewalls or monitor user outbound traffic.
- Reverse proxies are used to cache content, decrypt SSL, and distribute client traffic safely among backend servers.

### 3. Why it is Important
Reverse proxies are key architectural components in cloud backends, routing requests and protecting direct database/server exposure.
- Fits in: Network security and routing.

### 4. Real World Analogy
- **Forward Proxy = Lawyer**: Sits in front of the client. The client tells the lawyer to make a purchase on their behalf. The seller only knows the lawyer, not the client's identity.
- **Reverse Proxy = Receptionist**: Sits in front of the office staff (servers). A visitor (client) arrives at the desk. The receptionist receives the query, decides who should handle it, fetches the answer, and hands it to the visitor. The visitor never meets the internal staff directly.

### 5. Real World Example
- **Forward Proxy**: Corporate content filtering proxy that blocks workers from accessing social media at work.
- **Reverse Proxy**: **Nginx** acting as a frontend router and SSL terminator in front of a Node.js API application.

### 6. Architecture Diagram
```
Forward Proxy (Client protection):
[ Client 1 ] \
[ Client 2 ] ──► [ Forward Proxy ] ──► (Internet) ──► [ Target Website ]
                 (Masks Client IPs)

Reverse Proxy (Server protection / scaling):
[ Client ] ──► (Internet) ──► [ Reverse Proxy ] ──► [ Backend Server A ]
                              (Load Balancer)   ──► [ Backend Server B ]
```

### 7. Working Step by Step (Reverse Proxy)
1. Client sends request to `https://api.myapp.com` (resolves to Reverse Proxy IP).
2. Reverse Proxy receives request, decrypts SSL/TLS certificate.
3. Proxy inspects headers and route (e.g. `/users` vs `/orders`).
4. Proxy forwards request over local network to Backend Server A using private IP.
5. Server A processes request, returns JSON payload to Proxy.
6. Proxy encrypts payload and sends it back to the client over HTTPS.

### 8. Advantages
- **Reverse Proxy**:
  - Hides backend IP addresses (prevents DDOS targeting).
  - Handles SSL Termination (relieves backend CPU load).
  - Enables caching of static files.

### 9. Disadvantages
- Adds an extra network hop (minor latency increase).
- If the proxy fails, all backend services become unreachable (single point of failure if not run in high availability clusters).

### 10. Interview Explanation
"A Forward Proxy acts on behalf of clients, hiding their IPs from the internet. A Reverse Proxy acts on behalf of web servers, sitting between clients and backend servers. It secures servers by hiding their private IPs, manages SSL decryption, caches responses, and acts as a load balancer."

### 11. Frequently Asked Interview Questions
1. *What is SSL Termination?*
   - Decrypting SSL traffic at the proxy level so backend servers can communicate in plain HTTP, reducing CPU load.
2. *Can Nginx act as both a Forward and Reverse Proxy?*
   - Yes, though it is predominantly configured as a Reverse Proxy.
3. *What is the `X-Forwarded-For` header?*
   - An HTTP header used by proxies to identify the original client IP address connecting to the web server.
4. *Difference between Reverse Proxy and API Gateway?*
   - An API Gateway is an advanced reverse proxy that also handles rate limiting, authentication, telemetry, and request transformation.
5. *Why cache content on a reverse proxy?*
   - To serve static assets (like CSS, images) immediately without querying backend servers, improving response times.
6. *Explain Load Balancing.*
   - Distributing incoming requests across a group of backend servers.
7. *What port does Nginx listen on by default for SSL?*
   - Port 443.
8. *What is split-horizon DNS in relation to proxies?*
   - Resolving different IPs for internal servers vs external servers.
9. *What is an upstream block in Nginx?*
   - A configuration block defining the list of backend servers the reverse proxy can route traffic to.
10. *Define transparent proxy.*
    - A proxy that redirects client traffic without modifying client requests or requiring browser setup.

### 12. Common Mistakes
- Forgetting to pass the client's original IP header (`X-Forwarded-For`) to the backend, causing application logs to show all user actions originating from the proxy's IP.

### 13. Best Practices
- Keep reverse proxies in public subnets, and place target backend servers in private subnets, only allowing connections from the proxy's security group.

### 14. Hands-on Lab
- Write an Nginx configuration file setting up a reverse proxy route pointing to a local Node.js application.

### 15. Commands
- `nginx -t` (Test Nginx configuration syntax sanity)
- `systemctl reload nginx` (Reload Nginx config without dropping active connections)

### 16. Code Examples
```nginx
# Nginx Reverse Proxy Configuration Example
server {
    listen 80;
    server_name api.myapp.com;

    location / {
        proxy_pass http://127.0.0.1:3000; # Forward to local backend app port
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    }
}
```

### 17. Visual Memory Tricks
- **Forward = For Clients** (Goes out).
- **Reverse = Protects Servers** (Stops traffic coming in).

### 18. MCQs
1. What does a reverse proxy hide from clients?
   - A) Client IP address
   - B) Backend server IP addresses (Correct)
   - C) DNS resolver records
2. Which header passes the original client IP through a proxy?
   - A) Content-Type
   - B) Host
   - C) X-Forwarded-For (Correct)

### 19. Practical Scenario Questions
- *Scenario*: A Node.js API server keeps crashing due to high CPU load while processing HTTPS handshakes. How can a reverse proxy help?
  - *Answer*: Offload SSL/TLS decryption to an Nginx reverse proxy (SSL Termination), letting the Node.js server receive plain HTTP requests.

### 20. Summary
- **Key Points**: Forward proxy masks users. Reverse proxy masks servers. Nginx is a standard reverse proxy.
- **Cheat Sheet**: Reverse Proxy = Entry guard. Handles caching, SSL, and server protection.
