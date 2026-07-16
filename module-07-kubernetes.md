# Module 7 — Kubernetes Orchestration

This module covers Kubernetes cluster architecture, workload resources, network services, storage models, and cluster operations.

---

## 1. Pods & Deployments

### 1. Definition
- **Pod**: The smallest deployable unit of computing in Kubernetes, representing a single running process in a cluster, containing one or more containers sharing storage and network.
- **Deployment**: A controller resource that manages declarative updates for Pods and ReplicaSets, managing scaling, rollouts, and rollbacks.

### 2. Why it Exists
Running containers manually on individual servers (using Docker CLI) doesn't scale. If a server crashes, you must manually restart containers. Kubernetes manages container lifecycles across a pool of machines.

### 3. Why it is Important
Deployments ensure high availability by maintaining a target number of healthy pods across nodes automatically.
- Fits in: Container orchestration control plane.

### 4. Real World Analogy
- **Container = Passenger**: The individual worker entity.
- **Pod = Car (Vehicular Unit)**: Can fit one driver (main app container) and helper passengers (sidecar containers). They share the car's engine, music system, and GPS (network namespace, volumes).
- **Deployment = Fleet Manager**: Decides how many cars must be running in the city. If a car crashes, the manager immediately dispatches an identical replacement car.

### 5. Real World Example
- Deploying a Node.js web server inside a Kubernetes cluster with 3 replicas. The Deployment schedules the Pods across different worker nodes.

### 6. Architecture Diagram
```
              [ Kubernetes Deployment ]
                         | (Manages)
              [ Kubernetes ReplicaSet ]
                 /       |       \ (Maintains Replicas)
            [ Pod 1 ] [ Pod 2 ] [ Pod 3 ]
               |         |         |
           [Container][Container][Container]
```

### 7. Working Step by Step
1. Dev writes a Deployment manifest YAML declaring 3 replicas of an image.
2. Dev runs `kubectl apply -f deployment.yaml`.
3. The control plane's API Server stores the spec in database `etcd`.
4. The Controller Manager notices the change and creates a ReplicaSet.
5. The Scheduler evaluates resource availability and assigns Pods to healthy Worker Nodes.
6. The local node agent `kubelet` receives instruction, calls container runtime (Docker/containerd) to pull image and launch containers.
7. Kubelet monitors container health, reporting status back to API Server.

### 8. Advantages
- Self-Healing (automatically restarts failed pods).
- Rolling Updates (deploy new versions with zero downtime).
- Horizontal Scaling (easily adjust replica counts).

### 9. Disadvantages
- High architectural complexity and learning curve.
- Heavy resource footprint for small workloads.

### 10. Interview Explanation
"A Pod is the smallest execution unit in Kubernetes, wrapping one or more containers that share the same network namespace and storage. A Deployment is a controller that defines the desired state for those Pods, managing ReplicaSets to handle scaling, self-healing, rolling updates, and rollbacks."

### 11. Frequently Asked Interview Questions
1. *What is the relationship between a Pod, a ReplicaSet, and a Deployment?*
   - A Deployment manages a ReplicaSet, which in turn ensures the correct number of duplicate Pods are running.
2. *What is a sidecar container?*
   - A helper container running inside the same Pod as the main application container to perform utility tasks like logging, proxying, or sync.
3. *What is self-healing in Kubernetes?*
   - The capacity to automatically detect dead containers or nodes and spin up replacement pods on healthy hardware.
4. *How does a Rolling Update work?*
   - Slowly replacing old pods with new ones (one by one) to keep the service online during a code deployment.
5. *How do you rollback a deployment?*
   - Run `kubectl rollout undo deployment/<name>` to revert to the previous version history.
6. *What is the role of the Kubelet?*
   - An agent that runs on each node in the cluster, ensuring that containers are running in a Pod according to specifications.
7. *What is ETCD?*
   - A distributed key-value store used as Kubernetes' database for cluster state details.
8. *What is Kube-Scheduler?*
   - Control plane component that selects a node for newly created pods based on resource requirements.
9. *What is a DaemonSet?*
   - A controller that ensures a copy of a specific Pod runs on every single node in the cluster (e.g. for logging agents).
10. *Define StatefulSet.*
    - A controller used to manage stateful applications (like databases) that require unique network identifiers and persistent storage mapping.

### 12. Common Mistakes
- Writing credentials directly inside the Deployment YAML instead of referencing Kubernetes Secrets.

### 13. Best Practices
- Always define CPU and memory Requests and Limits in Pod specifications to prevent resource starvation on worker nodes.

### 14. Hands-on Lab
- Write a deployment YAML file for an Nginx app, deploy it, scale it, and rollback a broken update.

### 15. Commands
- `kubectl get pods` (List active pods)
- `kubectl apply -f deploy.yaml` (Deploy resource configuration)
- `kubectl scale deployment/nginx-deploy --replicas=5` (Scale up to 5 pods)

### 16. Code Examples
```yaml
# Kubernetes Deployment Manifest Example
apiVersion: apps/v1
kind: Deployment
metadata:
  name: nginx-deployment
  labels:
    app: web
spec:
  replicas: 3
  selector:
    matchLabels:
      app: web
  template:
    metadata:
      labels:
        app: web
    spec:
      containers:
      - name: nginx
        image: nginx:1.21.0
        ports:
        - containerPort: 80
        resources:
          requests:
            memory: "64Mi"
            cpu: "250m"
          limits:
            memory: "128Mi"
            cpu: "500m"
```

### 17. Visual Memory Tricks
- **Deployment = Commander**: Orders the army (ReplicaSet), which manages the soldiers (Pods).

### 18. MCQs
1. What is the smallest deployable unit in a Kubernetes cluster?
   - A) Container
   - B) Pod (Correct)
   - C) Deployment
2. Which component schedules pods onto nodes?
   - A) API Server
   - B) Kubelet
   - C) Kube-Scheduler (Correct)

### 19. Practical Scenario Questions
- *Scenario*: An application deployment is updated with a bug that causes container boot failures. How does the Deployment handle this?
  - *Answer*: If health checks fail during the rolling update, the deployment pauses the rollout, leaving old healthy pods active, preventing complete service downtime.

### 20. Summary
- **Key Points**: Pods host containers. Deployments manage ReplicaSets for scaling and rollout management.
- **Cheat Sheet**: `kubectl apply` = Deploy. `kubectl scale` = Resize. `rollout undo` = Undo.

---

## 2. Kubernetes Services (ClusterIP, NodePort, LoadBalancer)

### 1. Definition
A Kubernetes Service is an abstract way to expose an application running on a set of Pods as a network service with a single static IP address and DNS name.

### 2. Why it Exists
Pods in Kubernetes are ephemeral. They are destroyed and recreated constantly, and their IP addresses change every time. A Service provides a stable, permanent gateway to reach active Pods.

### 3. Why it is Important
Enables networking communication between different microservices (e.g. backend pod talking to database pod) or exposes the application to external traffic safely.
- Fits in: Kubernetes networking.

### 4. Real World Analogy
**Company Support Hotline**: Customer service agents (Pods) leave, get hired, or change desk phones (IPs) daily. Customers calling the company don't call individual agents. They call the main hotline number (Service). The switchboard automatically routes the call to whichever agent is currently available.

### 5. Real World Example
- Exposing a front-end UI app to public users by configuring a Service of type `LoadBalancer` which provisions a cloud load balancer.

### 6. Architecture Diagram
```
[ External User ] ──► [ LoadBalancer Service (Public IP) ]
                            | (Routes Traffic)
                   [ ClusterIP Service ]
                    /        |        \ (Dispatches to Pod IPs)
               [ Pod A ]  [ Pod B ]  [ Pod C ]
```

### 7. Working Step by Step
1. Pods are launched with a label (e.g., `role: api`).
2. A Service is created with a selector matching that label.
3. Kubernetes control plane creates an Endpoint object that lists the IP addresses of all active Pods matching the selector.
4. Clients send traffic to the Service IP (ClusterIP).
5. The local node proxy `kube-proxy` intercepts the traffic and distributes it (using iptables or IPVS rules) to one of the active Pod IPs from the Endpoints list.

### 8. Advantages
- Stable DNS name resolution within the cluster (e.g., `http://my-service`).
- Load balancing across target pods.
- Automatic routing updates as pods are added or deleted.

### 9. Disadvantages
- NodePort exposes ports directly on physical worker hosts, creating security risks if not managed.
- LoadBalancer service type creates actual cloud load balancers, increasing monthly hosting costs.

### 10. Interview Explanation
"A Service provides a stable network endpoint for dynamic Pods. There are three key types: **ClusterIP** (default, internal cluster access only), **NodePort** (exposes a port on each worker node IP), and **LoadBalancer** (integrates with cloud providers to spin up an external load balancer directing traffic to the pods)."

### 11. Frequently Asked Interview Questions
1. *What is ClusterIP?*
   - The default Service type that exposes the Service on a cluster-internal IP, making it reachable only from within the cluster.
2. *What is NodePort?*
   - A Service type that exposes the service on each Node's IP at a static port (normally between 30000-32767).
3. *What is LoadBalancer service type?*
   - Exposes the service externally using a cloud provider's load balancer (e.g. AWS Network Load Balancer).
4. *How does a Service select which Pods to route to?*
   - Using label selectors defined in the Service manifest matching labels on target Pods.
5. *What is Kube-Proxy?*
   - A network agent running on each node that maintains network rules on host interfaces to direct service queries to target pods.
6. *What are Endpoints in Kubernetes?*
   - A dynamic list of Pod IP addresses that currently match the Service selector and are healthy.
7. *What is Headless Service?*
   - A Service with `clusterIP: None`, used when you want DNS queries to return individual Pod IPs directly instead of a single service IP (useful for database clusters).
8. *What is Ingress?*
   - An API object that manages external access to services, typically HTTP/S, providing routing rules, SSL termination, and path-based routing.
9. *What is ExternalName service type?*
   - A service that maps to a DNS name instead of selectors (e.g. redirecting to an external database URL).
10. *Define Service Port vs TargetPort.*
    - **Port**: The port exposed by the service itself. **TargetPort**: The port the application container is listening on inside the Pod.

### 12. Common Mistakes
- Misconfiguring selector labels in the Service manifest, resulting in empty endpoints and connection errors.

### 13. Best Practices
- Use ClusterIP for internal databases and backends. Use Ingress resources to manage public routing instead of creating multiple LoadBalancer services to save costs.

### 14. Hands-on Lab
- Write a manifest for a NodePort service, apply it, and access the application via a worker node IP.

### 15. Commands
- `kubectl get svc` (List services)
- `kubectl describe service <name>` (Inspect endpoints list)

### 16. Code Examples
```yaml
# Kubernetes Service Manifest Example (NodePort)
apiVersion: v1
kind: Service
metadata:
  name: web-service
spec:
  type: NodePort
  selector:
    app: web
  ports:
    - protocol: TCP
      port: 80         # Service Port
      targetPort: 80   # Container Port
      nodePort: 30080  # Node Access Port
```

### 17. Visual Memory Tricks
- **ClusterIP = Cluster Only** (Internal).
- **NodePort = Node Portal** (Door on the node).
- **LoadBalancer = Luxury Link** (Cloud connection, costs money).

### 18. MCQs
1. What is the default type of a Kubernetes Service?
   - A) NodePort
   - B) ClusterIP (Correct)
   - C) LoadBalancer
2. Which component maintains routing rules for services on nodes?
   - A) Kube-Proxy (Correct)
   - B) API Server
   - C) CoreDNS

### 19. Practical Scenario Questions
- *Scenario*: A backend API needs to query a database pod. What URL should the backend use?
  - *Answer*: The DNS name of the database service (e.g., `http://db-service.default.svc.cluster.local`) which remains stable even if database pods are recreated.

### 20. Summary
- **Key Points**: Services provide persistent IPs for ephemeral Pods. ClusterIP (internal), NodePort (open port on node), LoadBalancer (public cloud gateway).
- **Cheat Sheet**: Internal App = ClusterIP. Public Gateway = Ingress + ClusterIP or LoadBalancer.
