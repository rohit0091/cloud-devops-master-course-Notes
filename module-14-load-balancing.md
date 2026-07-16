# Module 14 — Load Balancing

This module covers load balancing layers, routing algorithms, session stickiness, and health monitoring strategies.

---

## 1. Layer 4 vs Layer 7 Load Balancing (Algorithms & Health Checks)

### 1. Definition
- **Load Balancer**: A device or software that acts as a reverse proxy to distribute network or application traffic across a pool of servers.
- **Layer 4 Load Balancing**: Routing traffic at the Transport layer (TCP/UDP) based on IP address and port numbers, without inspecting the packet content.
- **Layer 7 Load Balancing**: Routing traffic at the Application layer (HTTP/HTTPS) by inspecting packet content such as headers, URLs, cookies, and SSL details.

### 2. Why it Exists
A single server can only handle a limited number of requests before running out of CPU or memory. Load balancers distribute requests across multiple servers, allowing websites to scale horizontally and remain online if a server crashes.

### 3. Why it is Important
Critical for achieving high availability, fault tolerance, and horizontal scaling.
- Fits in: Routing and scale architecture.

### 4. Real World Analogy
- **Layer 4 Load Balancer = Mailroom Clerk**: Receives envelopes, reads the recipient address (IP) and department room number (Port), and passes it down without opening the envelope.
- **Layer 7 Load Balancer = Customs Officer**: Opens the mail, inspects the contents (URL route, cookies), translates the language (SSL termination), and decides who gets the letter based on the specific payload.

### 5. Real World Example
- **AWS ALB (Application Load Balancer)** acts at Layer 7 to route request routes (e.g. `/api` vs `/static`) to different target EC2 auto-scaling groups.

### 6. Architecture Diagram
```
L4 Load Balancing:
[ User ] ──► [ L4 Balancer (IP:Port) ] ──► [ Server A (10.0.1.5:80) ]
                                      ──► [ Server B (10.0.1.6:80) ]

L7 Load Balancing:
[ User ] ──► [ L7 Balancer ] ──► Route /api   ──► [ API Server Cluster ]
                            ──► Route /static ──► [ Static S3 Buckets ]
```

### 7. Working Step by Step (Health Check Cycle)
1. The Load Balancer (LB) is configured with a list of backend servers and a health check path (e.g. `/health`).
2. Every 10 seconds, the LB sends an HTTP request to each backend server's `/health` port.
3. If Server A responds with `200 OK`, it is marked as **Healthy**.
4. If Server B times out or returns `500 Error` twice consecutively, it is marked as **Unhealthy**.
5. The LB immediately stops routing user requests to Server B.
6. Kubelet or Auto-scaling restarts Server B. Once B passes 3 consecutive health checks, the LB resumes routing traffic to it.

### 8. Advantages
- **Layer 4**: Extremely fast (no packet inspection overhead), lower CPU consumption, works for all TCP/UDP traffic.
- **Layer 7**: Smart routing (path-based, cookie-based), SSL termination support, header modifications, sticky sessions.

### 9. Disadvantages
- **Layer 4**: Cannot route based on HTTP details (cannot do `/users` vs `/orders` splits), cannot handle SSL termination.
- **Layer 7**: Slower than L4 (must decrypt and inspect packets), consumes more CPU/memory resources on the balancer host.

### 10. Interview Explanation
"Load balancing distributes incoming traffic across a server farm. Layer 4 balancing works at the transport layer, routing packets based on IP and Port without looking inside. Layer 7 operates at the application layer, routing based on cookies, headers, and URL paths. Algorithms include Round Robin, Least Connections, and IP Hash."

### 11. Frequently Asked Interview Questions
1. *What is Round Robin load balancing?*
   - An algorithm that routes requests sequentially down the list of servers one by one.
2. *What is Least Connections algorithm?*
   - Routes requests to the server with the fewest active connections, ideal for long-running transactions.
3. *What are Sticky Sessions (Session Affinity)?*
   - A configuration routing all requests from a specific user to the exact same backend server for the duration of their session, typically managed via cookies.
4. *Why are sticky sessions discouraged in modern scalable designs?*
   - Because they break load balance distribution. If one server hosts all active users due to session stickiness, it will crash while others sit idle. It also makes horizontal scaling-in difficult.
5. *What is SSL Passthrough vs SSL Termination?*
   - **Termination**: The load balancer decrypts HTTPS traffic and passes plain HTTP to backends. **Passthrough**: Balancer routes encrypted traffic directly to backends without decrypting it.
6. *What is Weighted Round Robin?*
   - A variation where servers are assigned weights based on capacity. Higher-weight servers receive more traffic.
7. *How does IP Hash algorithm work?*
   - The balancer hashes the client's IP address to determine the backend server, ensuring the client consistently lands on the same server without using cookies.
8. *What port does an Application Load Balancer listen on for secure web traffic?*
   - Port 443.
9. *What is a dynamic port allocation?*
   - A load balancing feature mapping random high-range ports on target containers to standard balancing ports.
10. *Define active-active load balancing.*
    - Running multiple load balancers in parallel to share the routing load, preventing the load balancer itself from becoming a single point of failure.

### 12. Common Mistakes
- Pointing health checks to a heavy database query endpoint, causing backend servers to crash under the weight of health check queries.

### 13. Best Practices
- Keep health check endpoints (`/healthz` or `/ping`) extremely lightweight, returning a simple hardcoded string value. Avoid using sticky sessions; store sessions in Redis instead.

### 14. Hands-on Lab
- Write an Nginx configuration file demonstrating load balancing using round-robin and least-connections upstream blocks.

### 15. Commands
- `curl -I http://localhost:80` (Verify load balancer is reachable)

### 16. Code Examples
```nginx
# Nginx Upstream Load Balancing Configuration
http {
    upstream my_backend_cluster {
        least_conn; # Use Least Connections algorithm
        server backend1.example.com:8080 weight=3;
        server backend2.example.com:8080;
        server backend3.example.com:8080 backup; # Fallback only
    }

    server {
        listen 80;
        location / {
            proxy_pass http://my_backend_cluster;
        }
    }
}
```

### 17. Visual Memory Tricks
- **L4 = Letter Address** (IP and Port on the box).
- **L7 = Letter Content** (Inspecting the letter inside).

### 18. MCQs
1. Which load balancer type can route requests based on HTTP cookies?
   - A) Layer 4
   - B) Layer 7 (Correct)
   - C) Layer 3
2. What algorithm routes traffic to the node with the lowest current traffic?
   - A) Round Robin
   - B) Least Connections (Correct)
   - C) Weighted Hash

### 19. Practical Scenario Questions
- *Scenario*: A shopping cart application requires users to stay logged in. The dev team runs 3 API servers. When users add items, the cart sometimes empties on page refresh because the load balancer sends them to different servers. How do you fix this?
  - *Answer*: Configure Sticky Sessions (Session Affinity) on the load balancer, or (better) migrate user session state to a shared Redis database cache.

### 20. Summary
- **Key Points**: L4 balances ports/IPs. L7 balances routes/content. Health checks protect routers.
- **Cheat Sheet**: L4 = fast/raw. L7 = smart/slow. Sticky session = bad scaling.
