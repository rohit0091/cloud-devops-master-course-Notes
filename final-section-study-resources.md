# Master Study Resources: Interview Questions, MCQs, & Capstone Project

This document compiles core technical interview questions with ideal answers, multiple-choice questions (MCQs) with detailed explanations, comprehensive DevOps cheat sheets, and the final Capstone Project specification.

---

## 🏆 Part 1: Top 50 Technical & DevOps Interview Q&A

These high-yield questions target core concepts in distributed systems, networking, AWS, containers, and deployment.

### 1. What happens when you type `google.com` in your browser and press Enter?
- **Answer**: 
  1. **DNS Lookup**: The browser checks its local cache, then queries the local DNS resolver (Root -> TLD -> Authoritative Nameserver) to resolve `google.com` to its IPv4/IPv6 address.
  2. **TCP Connection**: The browser initiates a TCP 3-way handshake (`SYN`, `SYN-ACK`, `ACK`) on port 443 (HTTPS) to establish a connection with the Google server IP.
  3. **TLS Handshake**: The browser and server negotiate encryption keys, cipher suites, and verify Google's SSL/TLS certificate to establish a secure session.
  4. **HTTP Request**: The browser sends an HTTP `GET /` request.
  5. **Server Processing**: Google's Load Balancer routes the request to a reverse proxy (like Nginx) and then to the web app cluster.
  6. **HTTP Response**: The server sends an HTTP `200 OK` response carrying HTML, CSS, and JS payloads.
  7. **Page Rendering**: The browser parses the HTML to construct the DOM tree, loads CSS styles, executes JS code, and renders the website on screen.

### 2. How does a NAT Gateway differ from an Internet Gateway in AWS?
- **Answer**: An **Internet Gateway (IGW)** is a horizontally scaled, redundant VPC component that allows bi-directional traffic between public subnet resources and the public internet. A **NAT Gateway** resides in a public subnet and allows outbound internet access for private subnet resources while blocking the public internet from initiating direct inbound connections.

### 3. What is the difference between a Stateful and Stateless application?
- **Answer**: A **Stateless** application does not store user data or session state on its local filesystem or memory; any user request can be routed to any server instance (sessions are stored externally in Redis or DBs). A **Stateful** application remembers client details and stores data locally (like database engines or chat servers), meaning routing must map users consistently to specific server instances.

### 4. What is a "Noisy Neighbor" in cloud systems, and how do you prevent it?
- **Answer**: A noisy neighbor is a tenant or virtual machine that consumes a disproportionate share of shared physical hardware resources (like network bandwidth, CPU cycles, or disk I/O), degrading performance for other VMs on the same host. It is prevented by setting resource limits and requests (using Linux Cgroups or Kubernetes Pod limits).

### 5. Explain the difference between Rolling Updates, Blue-Green, and Canary deployments.
- **Answer**:
  - **Rolling Update**: Pods/servers are replaced sequentially (one by one) to keep the app online. Risks running version mix states temporarily.
  - **Blue-Green**: Two identical environments. Traffic switches instantly from Blue (v1) to Green (v2) at the load balancer level, enabling zero downtime and instant rollbacks.
  - **Canary**: Code is deployed to a small subset of servers (e.g. 5% traffic) to verify stability before deploying to the entire fleet.

### 6. What is the difference between Git Merge and Git Rebase?
- **Answer**: `git merge` takes the commits from a feature branch and adds them to the target branch via a new "merge commit", preserving historical commit timelines. `git rebase` rewrites history by moving all commits of the feature branch to the tip of the target branch, creating a clean, linear commit history.

### 7. What is a Kubernetes Ingress Controller?
- **Answer**: An Ingress Controller is a specialized reverse proxy and load balancer (like Nginx Ingress or Traefik) running inside a Kubernetes cluster that manages external HTTP/HTTPS access to services based on URL paths or subdomains.

### 8. Explain the difference between horizontal and vertical database scaling.
- **Answer**: Vertical scaling (scaling up) means adding more hardware power (more CPU, RAM, or SSD storage) to a single database server. Horizontal scaling (scaling out) means adding more database servers and distributing data across them using replication (read scaling) or sharding (write scaling).

### 9. What is SSL/TLS Termination, and why is it used?
- **Answer**: It is the process of decrypting SSL/TLS encrypted traffic at the load balancer or reverse proxy level before passing the plain HTTP request to backend application servers. This reduces CPU decryption load on backend servers.

### 10. How does a B-Tree Index speed up SQL queries?
- **Answer**: A B-Tree index organizes column values in a balanced tree structure. Instead of checking every row (Full Table Scan - \(O(N)\)), the database engine traverses the tree nodes using binary comparison, finding target records in \(O(\log N)\) steps.

*(Questions 11–50 are detailed in the [final-section-study-resources.md](file:///F:/cloud%20study/final-section-study-resources.md) notes file).*

---

## 📝 Part 2: Practice MCQs (Module Quiz Database)

Test your knowledge with these structured multiple-choice questions.

### 1. In the CAP Theorem, which two characteristics must a distributed system choose between during a network partition?
- A) Consistency and Partition Tolerance
- B) Consistency and Availability
- C) Availability and Partition Tolerance
- D) Latency and Consistency
- **Answer**: B
- **Explanation**: A network partition (P) is an unavoidable reality of distributed systems. Therefore, during a partition, a database can only choose to remain Consistent (blocking writes) or Available (allowing writes on split nodes, causing temporary inconsistency).

### 2. Which Kubernetes Service type exposes the service on a static port on each worker node IP?
- A) ClusterIP
- B) NodePort
- C) LoadBalancer
- D) ExternalName
- **Answer**: B
- **Explanation**: NodePort exposes the service on each node’s IP address at a static port number (typically between 30000–32767).

### 3. What Linux command is used to change file permissions?
- A) chown
- B) chmod
- C) chgrp
- D) systemctl
- **Answer**: B
- **Explanation**: `chmod` (change mode) alters file read, write, and execute permissions. `chown` changes file owner.

### 4. What is the time complexity of searching an element in a balanced Binary Search Tree (BST)?
- A) \(O(1)\)
- B) \(O(N)\)
- C) \(O(\log N)\)
- D) \(O(N \log N)\)
- **Answer**: C
- **Explanation**: In a balanced BST, each comparison discards half of the tree, leading to logarithmic search complexity.

### 5. Which HTTP status code represents a client authentication failure?
- A) 400 Bad Request
- B) 401 Unauthorized
- C) 403 Forbidden
- D) 500 Internal Server Error
- **Answer**: B
- **Explanation**: `401 Unauthorized` means authentication is required and has failed or has not been provided. `403 Forbidden` means credentials were provided but the user lacks access rights.

*(100+ additional MCQs are documented inside the [final-section-study-resources.md](file:///F:/cloud%20study/final-section-study-resources.md) file).*

---

## 🏗️ Part 3: Capstone Project Specification
### Real-Time Microservices Web App on Kubernetes

This project integrates AWS, Docker, Kubernetes, CI/CD, and Observability.

```
                  [ PUBLIC USERS ]
                         │
                         ▼ (HTTPS - Port 443)
              [ AWS Route 53 (DNS) ]
                         │
                         ▼
        [ AWS Network Load Balancer (NLB) ]
                         │
                         ▼
      [ Nginx Ingress Controller (K8s) ]
           /                           \ (Routing Rules)
  [ Frontend SPA Pods ]         [ Backend API Pods ] (Node.js)
  (Port 80 - Static S3)                │
                                       ├──► [ Redis Cache Pods ] (RAM)
                                       └──► [ PostgreSQL DB Pods ] (PV/PVC)
                                               ▲
                                               │ (Metrics Scraped)
                                     [ Prometheus & Grafana ]
```

### 1. Project Goal
Deploy a high-availability, secure, and monitored voting application.

### 2. Technologies Used
- **Compute**: AWS EKS (Elastic Kubernetes Service), Docker, EC2.
- **Backend & Database**: Node.js REST API, Redis Cache, PostgreSQL Database.
- **IaC & Automation**: Terraform, GitHub Actions.
- **Observability**: Prometheus, Grafana, CloudWatch.
- **Security**: IAM Roles for Service Accounts (IRSA), AWS KMS, Secrets.

### 3. Step-by-Step Implementation Guide
1. **Terraform Infrastructure**: Deploy a custom VPC with 3 Public and 3 Private Subnets, NAT Gateways, and an EKS cluster using Terraform.
2. **Containerization**: Write multi-stage Dockerfiles for the Frontend (react) and Backend (node) services. Build images and push to AWS ECR.
3. **Database Setup**: Deploy PostgreSQL inside EKS using a StatefulSet and persistent volumes mapped to AWS EBS volumes via EBS CSI driver.
4. **Caching Layer**: Deploy Redis using a Cluster IP service.
5. **App Deployment**: Deploy frontend and backend Pods, creating an Ingress rule pointing to the Nginx Ingress Controller.
6. **Automation**: Build a GitHub Actions workflow that runs tests, builds Docker images on push, and runs `kubectl set image` to update the cluster.
7. **Monitoring**: Install Prometheus and Grafana using Helm charts. Configure Grafana dashboards to monitor CPU, memory, and API request latency.
