# Module 16 — System Architecture Patterns

This module covers architectural styles, microservices design patterns, event-driven architectures, serverless computing, and asynchronous message queuing.

---

## 1. Monolith vs Microservices (Serverless & Message Queues)

### 1. Definition
- **Monolithic Architecture**: An application architecture where all software components (UI, business logic, database access) are packaged and deployed together as a single unified service unit.
- **Microservices**: An architectural style that structures an application as a collection of small, loosely coupled, independently deployable services.
- **Serverless**: A cloud-computing execution model where the cloud provider dynamically manages machine resource allocations (e.g. AWS Lambda).
- **Message Queue**: An asynchronous communication protocol where services publish messages to temporary buffers (queues) without waiting for immediate responses (e.g. RabbitMQ, Kafka).

### 2. Why it Exists
Monoliths are simple to build but hard to scale. As teams grow, modifying code inside a monolith leads to deployment bottlenecks. Microservices allow independent scaling and deployment of modular features. Message queues solve tight coupling, letting services communicate asynchronously.

### 3. Why it is Important
Determines system reliability, organization of engineering teams, and cost of deployment.
- Fits in: High-level system design.

### 4. Real World Analogy
- **Monolith = Swiss Army Knife**: All tools (knife, scissors, file, corkscrew) are attached to a single handle. If the scissors break, you must repair or replace the entire tool.
- **Microservices = Toolbox**: Each tool is independent. You can upgrade your hammer without modifying your screwdriver.
- **Serverless = Renting a Taxi**: You pay only for the exact duration of the ride. When the ride ends, the taxi leaves.
- **Message Queue = Mailbox**: You drop a letter in your friend's mailbox. You don't wait at their front door for them to read it. They read it when they are ready, and your day continues.

### 5. Real World Example
- **Netflix** migrated from a monolithic Java application to thousands of microservices communicating asynchronously to handle global streaming loads.

### 6. Architecture Diagram
```
Monolithic Architecture:
[ Clients ] ──► [ Monolithic Web App (UI, Auth, Orders, Payments) ] ──► [ Single DB ]

Microservices with Message Queue:
                  [ API Gateway ]
                     /       \
         [ Auth Service ]  [ Order Service ] ──► [ Message Queue (RabbitMQ) ]
                                                       │ (Async Event)
                                                       v
                                               [ Payment Service ]
```

### 7. Working Step by Step (Message Queue Workflow)
1. **Order Placed**: User clicks "Buy" on the checkout page.
2. **Order API**: Order Service updates the local database and publishes an event: `{"order_id": 12, "amount": 100}` to RabbitMQ.
3. **Async ACK**: Order Service immediately returns "Order Placed" to the user. (Time: ~10ms).
4. **Queue Storage**: RabbitMQ stores the message safely in memory or disk.
5. **Consumption**: Payment Service (which subscribes to order events) pulls the message from RabbitMQ.
6. **Processing**: Payment Service charges the user's credit card.
7. **Task Completion**: Payment Service sends an ACK (acknowledgement) to RabbitMQ, deleting the message from the queue.

### 8. Advantages
- **Microservices**: Independent scaling, modular code, fast deployment pipelines.
- **Serverless**: Zero server administration, scales down to zero cost when idle.
- **Message Queues**: Decoupling, spikes buffer (rate-limiting), system reliability.

### 9. Disadvantages
- **Microservices**: Complex distributed network debugging, data consistency issues (requires Saga patterns).
- **Serverless**: Cold start latencies, vendor lock-in, harder local debugging.
- **Message Queues**: Adds infrastructure complexity, eventual consistency challenges.

### 10. Interview Explanation
"Monoliths deploy all modules as a single unit, whereas Microservices split them into independent network services. Message Queues enable asynchronous communication between microservices, decoupling systems to absorb traffic spikes and improve overall fault tolerance."

### 11. Frequently Asked Interview Questions
1. *What is a Cold Start in Serverless?*
   - The latency occurred when a serverless function is invoked after being idle, as the provider boots a container container to run the function.
2. *What is the difference between RabbitMQ and Apache Kafka?*
   - **RabbitMQ**: A traditional message queue that routes messages to specific consumers and deletes them on receipt. **Kafka**: A high-throughput event streaming platform that logs messages sequentially, allowing multiple consumers to replay logs from specific offsets.
3. *What is a Saga Pattern?*
   - A design pattern used to manage distributed transactions across multiple microservice databases by running a sequence of local transactions and compensating rollbacks.
4. *What is an API Gateway?*
   - A reverse proxy entry point that handles authentication, rate limiting, and route redirection to internal backend microservices.
5. *Explain loose coupling.*
   - Designing system components so they have minimal dependency on other components, preventing local changes from breaking external services.
6. *What is Event-Driven Architecture?*
   - A software architecture pattern where flow is determined by events (state changes) published to event brokers.
7. *Explain dead letter queue (DLQ).*
   - A secondary message queue where messages that fail processing repeatedly are sent for debugging.
8. *What does "scale to zero" mean?*
   - Serverless resources automatically terminating when traffic stops, resulting in zero billing charges.
9. *What is service discovery in microservices?*
   - A system tracking service IPs automatically as containers scale up and down (e.g. using Consul or Kubernetes CoreDNS).
10. *Define circuit breaker pattern.*
    - A design pattern that stops calling a failing dependency service if its failure rate exceeds a threshold, preventing cascading crashes.

### 12. Common Mistakes
- Building microservices too early for a simple startup application, leading to complex networking overheads before validating the business model.

### 13. Best Practices
- Start with a modular monolith. Separate databases for each microservice to guarantee domain boundaries. Use message queues for long-running tasks.

### 14. Hands-on Lab
- Write a Python script to publish a task message to a RabbitMQ queue and consume it using a separate worker script.

### 15. Commands
- `docker run -d --name rabbitmq -p 5672:5672 rabbitmq` (Start RabbitMQ)

### 16. Code Examples
```python
# Publisher Script (producer.py)
import pika
import json

connection = pika.BlockingConnection(pika.ConnectionParameters('localhost'))
channel = connection.channel()

# Declare queue
channel.queue_declare(queue='order_queue')

message = {"order_id": 99, "status": "PENDING"}
channel.basic_publish(
    exchange='',
    routing_key='order_queue',
    body=json.dumps(message)
)
print("Sent Order Message!")
connection.close()
```

### 17. Visual Memory Tricks
- **Monolith = Massive Castle**: One big building.
- **Microservices = Village Houses**: Many small buildings connected by paths.

### 18. MCQs
1. Which technology allows running code without provisioning VM servers?
   - A) Monolith
   - B) Serverless (Correct)
   - C) SQL
2. What message system is optimized for high-throughput log streaming?
   - A) RabbitMQ
   - B) SQLite
   - C) Apache Kafka (Correct)

### 19. Practical Scenario Questions
- *Scenario*: A payment API goes offline for maintenance. The order API keeps accepting orders. How do you prevent orders from failing to pay?
  - *Answer*: Place a Message Queue between the Order API and the Payment API. Order API saves orders to the queue. When the Payment API boots back online, it processes the pending queue.

### 20. Summary
- **Key Points**: Monolith = Simple, unified. Microservices = Scalable, complex. Queues decouple services asynchronously.
- **Cheat Sheet**: Asynchronous task = Queue. High scale = Microservices. Serverless = No VM management.
