# Module 2 — Distributed Systems

This module covers the core concepts of distributed systems architecture, consistency models, data replication, and distributed consensus.

---

## 1. CAP Theorem

### 1. Definition
The CAP Theorem states that a distributed system can guarantee at most two out of three characteristics: Consistency (all nodes see the same data at the same time), Availability (every non-failing node returns a response), and Partition Tolerance (the system continues to operate despite network partition/message drops).

### 2. Why it Exists
In a network, wires can get cut, routers can crash, and network packets can be lost. When a network partition occurs, a distributed database must choose how to respond.

### 3. Why it is Important
It dictates distributed database choices (e.g. choose between CP or AP database).
- Fits in: Database architecture design.

### 4. Real World Analogy
**Bank Branches**:
- You have two bank branches (London and New York) connected by a phone line (network).
- The phone line cuts (Network Partition).
- A customer tries to withdraw money in London, and another customer tries to deposit in New York.
- **Choice 1 (Consistency)**: London branch says "Sorry, line is down. I cannot process withdrawals because I can't check the New York balance." (System is CP - consistent but not available).
- **Choice 2 (Availability)**: London branch allows the withdrawal. But now London and New York balances do not match. (System is AP - available but inconsistent).

### 5. Real World Example
- **Apache Cassandra** is an AP database (prefers Availability over strict consistency).
- **Google Spanner** is a CP database (uses atomic clocks to achieve Consistency and Partition tolerance).

### 6. Architecture Diagram
```
              [ Consistency ]
             /               \
            /      CA         \
           /     (RDBMS)       \
          /                     \
[ Availability ] ----------- [ Partition Tolerance ]
                  AP                 CP
             (Cassandra)          (MongoDB)
```

### 7. Working Step by Step
1. **Normal state**: Client writes data to Node A. Node A replicates data to Node B. Both nodes are in sync.
2. **Network Partition**: The connection between Node A and Node B breaks.
3. **Client Write**: Client tries to write to Node A.
4. **CP Choice**: Node A rejects the write because it cannot synchronize with Node B. The system remains consistent but becomes unavailable.
5. **AP Choice**: Node A accepts the write. Node B remains out of sync. Both nodes are available to clients, but their data is inconsistent.

### 8. Advantages
- Clarifies design trade-offs in distributed systems.
- Prevents engineers from attempting to design mathematically impossible "perfect" databases.

### 9. Disadvantages
- Often misunderstood; in reality, Partition Tolerance (P) is not optional. You must design for Partitions, leaving the trade-off strictly between Consistency (C) and Availability (A) when a partition occurs.

### 10. Interview Explanation
"The CAP Theorem states that in a distributed data store, when a network partition (P) occurs, you must choose between Consistency (C) and Availability (A). If you choose Consistency, you block writes to keep data synchronized across nodes, sacrificing availability. If you choose Availability, you accept writes on active nodes immediately, sacrificing consistency until the partition is resolved."

### 11. Frequently Asked Interview Questions
1. *What is Consistency in CAP vs ACID?*
   - In CAP, Consistency means every read returns the most recent write. In ACID, Consistency means the database transition is valid according to schema rules.
2. *Why is Partition Tolerance (P) mandatory in the real world?*
   - Because networks are inherently unreliable. Network failures *will* happen; we cannot choose to have no partitions.
3. *What is PACELC theorem?*
   - An extension of CAP: If there is a Partition (P), choose Availability (A) or Consistency (C); Else (E), choose Latency (L) or Consistency (C).
4. *Name a CP database.*
   - MongoDB, Redis, HBase.
5. *Name an AP database.*
   - Cassandra, DynamoDB, CouchDB.
6. *How does eventual consistency relate to CAP?*
   - Eventual consistency is a relaxed version of consistency used in AP databases.
7. *Can a system be CA?*
   - Only on a single node setup where network partitions are impossible. In a distributed multi-node network, CA is impossible.
8. *What happens when a network partition heals?*
   - The system must run anti-entropy or reconciliation protocols (like vector clocks) to merge conflicting data.
9. *What is split-brain scenario?*
   - A situation where a single cluster splits into two independent groups of nodes, both acting as master nodes.
10. *Define quorum.*
    - The minimum number of votes required for a distributed system to perform a transaction.

### 12. Common Mistakes
- Believing that you can choose "CA" for a distributed system. If your system runs on multiple servers, you *must* choose CP or AP during network partitions.

### 13. Best Practices
- Choose AP (Eventual Consistency) for shopping carts and social media feeds. Choose CP (Strict Consistency) for inventory balances and financial transactions.

### 14. Hands-on Lab
- Configure a local 3-node Redis cluster, simulate a network partition by blocking network traffic using local firewalls, and observe client write errors.

### 15. Commands
- `ping` (Check network latency to another node)
- `iptables -A INPUT -s <IP> -j DROP` (Block traffic from target node to simulate a partition on Linux)

### 16. Code Examples
```python
# Simple simulation showing node routing during partition
class Node:
    def __init__(self, name):
        self.name = name
        self.data = None
        self.connected_nodes = []
    
    def write(self, value):
        self.data = value
        for node in self.connected_nodes:
            try:
                node.sync(value)
            except Exception:
                print(f"Partition detected: Node {self.name} cannot sync with {node.name}")

    def sync(self, value):
        self.data = value
```

### 17. Visual Memory Tricks
- **C**-**A**-**P**: Choose **C**orrectness (C) or **A**lways-on (A) when **P**ath-breaks (P).

### 18. MCQs
1. What does consistency mean in the CAP theorem?
   - A) All nodes read the same value at the same time (Correct)
   - B) All tables are normalized
   - C) No concurrent transactions are allowed
2. If partition tolerance is chosen along with availability, the system is:
   - A) CP
   - B) AP (Correct)
   - C) CA

### 19. Practical Scenario Questions
- *Scenario*: A user posts a comment on Facebook. Another user in a different country doesn't see it for 2 seconds. What CAP choice was made?
  - *Answer*: AP. The system prioritized availability (letting the write succeed immediately) and tolerated temporary inconsistency.

### 20. Summary
- **Key Points**: Network partitions force a choice between C (Consistency) and A (Availability).
- **Cheat Sheet**: CP = Accurate, blocks on network drop; AP = Fast, allows out-of-sync writes.

---

## 2. ACID vs BASE Transactions

### 1. Definition
- **ACID**: A database model ensuring transactions are **A**tomic, **C**onsistent, **I**solated, and **D**urable (standard SQL RDBMS).
- **BASE**: A distributed data model designed for high scale, favoring **B**asic **A**vailability, **S**oft State, and **E**ventual consistency (NoSQL databases).

### 2. Why it Exists
ACID transactions are computationally expensive and hard to scale across multiple global servers. BASE was created to trade strict consistency for massive scale and speed.

### 3. Why it is Important
Choosing between ACID and BASE determines database selection for transactional reliability (banking) vs web scale (social media likes).
- Fits in: Core database transactional design.

### 4. Real World Analogy
- **ACID = Buying a House**: The transaction is all-or-nothing (Atomicity). You either get the keys and they get the money, or the deal fails completely. Both sides are strictly locked.
- **BASE = Sending a Letter**: You drop the letter in the mailbox (Basic Availability). The letter is in transit, state is changing (Soft State). Eventually, the receiver gets the letter (Eventual Consistency).

### 5. Real World Example
- **ACID**: PostgreSQL handling bank account transfers.
- **BASE**: Amazon DynamoDB managing user shopping carts.

### 6. Architecture Diagram
```
ACID: [Start Transaction] -> [Lock Rows] -> [Update A] -> [Update B] -> [Commit / Unlock] (Strict)
BASE: [Write to Node 1] -> [Acknowledge to User] -> (Background Replication) -> [Sync to Node 2] (Eventual)
```

### 7. Working Step by Step
- **ACID Transaction**:
  1. Transaction begins.
  2. Read and Write operations are locked to prevent interference (Isolation).
  3. If all updates succeed, data is written to disk (Durability).
  4. If any step fails, the entire transaction is rolled back (Atomicity).
- **BASE Transaction**:
  1. Node 1 accepts the write and acknowledges client immediately.
  2. Data is updated in the local background.
  3. Background processes replicate the data to Node 2 and Node 3.
  4. Read requests to Node 3 may return old data (Soft State) until synchronization finishes (Eventual Consistency).

### 8. Advantages
- **ACID**: Zero data corruption, predictable, safe for financial actions.
- **BASE**: High write throughput, low latency, survives hardware losses.

### 9. Disadvantages
- **ACID**: Scales poorly horizontally, locks cause bottle-necks under high traffic.
- **BASE**: Developers must handle stale reads and resolve conflicting data updates in application logic.

### 10. Interview Explanation
"ACID guarantees strict consistency and data accuracy by locking transactions to ensure atomic, isolated execution—ideal for relational databases. BASE prioritizes availability and performance in distributed NoSQL databases, allowing temporary soft states where data is eventually synchronized across nodes."

### 11. Frequently Asked Interview Questions
1. *Define Isolation levels in SQL.*
   - Read Uncommitted, Read Committed, Repeatable Read, Serializable (strictest).
2. *What is a Write-Ahead Log (WAL) in relation to Durability?*
   - A log file on disk where changes are written before modifying the database block, ensuring recovery if power fails.
3. *What is eventual consistency?*
   - A guarantee that if no new updates are made, all replicas will eventually contain the same data value.
4. *What is Soft State?*
   - Data state that can change over time without user interaction due to background sync.
5. *Explain two-phase commit (2PC).*
   - A distributed consensus algorithm to ensure all databases commit an ACID transaction together.
6. *What does Atomicity mean?*
   - The entire transaction succeeds or fails completely.
7. *How does MongoDB handle ACID?*
   - Traditionally document-level ACID, but modern MongoDB versions support multi-document ACID transactions.
8. *What is dirty read?*
   - Reading data written by another transaction that has not been committed yet.
9. *What is phantom read?*
   - A transaction reads rows matching a criteria, and a concurrent transaction inserts a new row matching that criteria before the first transaction commits.
10. *Define transactional rollback.*
    - Reverting database states back to the pre-transaction start point upon encountering errors.

### 12. Common Mistakes
- Choosing a NoSQL database (BASE) for a ledger app and expecting it to prevent negative account balances without writing complex lock systems.

### 13. Best Practices
- Use ACID databases for identity, billing, and transactional core records. Use BASE for logs, user profiles, and chat histories.

### 14. Hands-on Lab
- Write a SQL transaction statement in PostgreSQL or MySQL showing rollback on failure.

### 15. Commands
- `BEGIN TRANSACTION;` (SQL syntax)
- `ROLLBACK;` (SQL syntax)

### 16. Code Examples
```sql
-- Example of an ACID Transaction in SQL
BEGIN;
UPDATE accounts SET balance = balance - 100 WHERE id = 1;
UPDATE accounts SET balance = balance + 100 WHERE id = 2;
-- If any error occurs here, run ROLLBACK;
COMMIT;
```

### 17. Visual Memory Tricks
- **ACID = Concrete** (Rigid, solid, structural safety).
- **BASE = Water** (Flows, settles eventually, flexible).

### 18. MCQs
1. What does the "I" in ACID stand for?
   - A) Integration
   - B) Isolation (Correct)
   - C) Integrity
2. Eventually consistent systems follow which model?
   - A) ACID
   - B) BASE (Correct)
   - C) CAP

### 19. Practical Scenario Questions
- *Scenario*: A payment gateway deducts money from customer A but fails to credit customer B. Which ACID property was violated?
  - *Answer*: Atomicity. The transaction should have rolled back completely rather than executing only one half.

### 20. Summary
- **Key Points**: ACID = Strict consistency (SQL), BASE = Scalability and speed (NoSQL).
- **Cheat Sheet**: Use SQL/ACID when accuracy is vital. Use NoSQL/BASE when scaling capacity is vital.

---

## 3. Sharding & Replication

### 1. Definition
- **Replication**: Copying data across multiple database servers to ensure high availability and read scalability.
- **Sharding**: Partitioning a database horizontally to split data rows across completely separate server nodes.

### 2. Why it Exists
Single database servers have limits on storage capacity and transaction rates. Replication helps handle read-heavy traffic and server crashes. Sharding helps handle write-heavy traffic and massive storage growth.

### 3. Why it is Important
Critical for handling massive scale (e.g. billions of users).
- Fits in: Database performance and system design.

### 4. Real World Analogy
- **Replication = Photocopying a Book**: You make 3 exact copies of a dictionary and place them on different tables. Multiple people can read them at the same time (scaling reads). If one copy gets destroyed, you still have the others.
- **Sharding = Tearing Pages Out**: You split the dictionary. Node 1 has words A-M, Node 2 has words N-Z. If you look for "Apple", you go to Node 1. If you look for "Zebra", you go to Node 2. This splits the load.

### 5. Real World Example
- **Instagram** shards its database tables based on User IDs to handle billions of media records.

### 6. Architecture Diagram
```
Replication (Leader-Follower):                Sharding (Horizontal Partitioning):
     [ Client Write ]                                [ Route Query ]
            |                                           /         \
            v                                          /           \
     [(Leader) Database]                       [Shard A: A-M]     [Shard B: N-Z]
       /           \                           (Users 1-1000)     (Users 1001-2000)
      v             v
[(Follower)]   [(Follower)]
```

### 7. Working Step by Step
- **Replication**:
  1. Client writes to Master/Leader node.
  2. Master writes change to local binlog.
  3. Replicators read binlog and sync database state to Follower nodes.
  4. Clients read from Follower nodes to distribute the load.
- **Sharding**:
  1. Client sends query: `Get User 1500`.
  2. Database Router applies Shard Key hash: `1500 % 2 = Shard B`.
  3. Router fetches data directly from Shard B server.

### 8. Advantages
- **Replication**: High availability, read scaling, disaster recovery backups.
- **Sharding**: Infinite write scale, storage capacity grows as nodes are added.

### 9. Disadvantages
- **Replication**: Stale reads on replica nodes due to replication lag.
- **Sharding**: Extreme complexity, cross-shard joins are impossible or slow, re-sharding (re-balancing) is difficult.

### 10. Interview Explanation
"Replication copies the same database onto multiple nodes to handle high read traffic and prevent downtime. Sharding splits database rows horizontally across separate machines based on a shard key, enabling databases to scale writes and storage capacity infinitely."

### 11. Frequently Asked Interview Questions
1. *What is a Shard Key?*
   - The column or attribute used to determine which database shard holds a specific row of data.
2. *Difference between horizontal partitioning and vertical partitioning?*
   - Horizontal partitioning (sharding) splits rows across tables. Vertical partitioning splits columns across tables (e.g., separating user profile image blob from user login details).
3. *What is replication lag?*
   - The delay between a write on the master node and that write being updated on the follower node.
4. *What is synchronous replication?*
   - The master waits for all replicas to confirm writing the data before sending success to the client. Safest but slowest.
5. *What is asynchronous replication?*
   - Master writes locally and immediately returns success to the client, replicating data to followers in the background. Fast but risks data loss on master failure.
6. *What is hot standby vs cold standby?*
   - Hot standby is actively in sync and ready for instant failover. Cold standby must be booted up and loaded with backup data.
7. *Explain consistent hashing.*
   - A hashing algorithm that minimizes data movement when nodes are added or removed from a sharded cluster.
8. *What is a noisy neighbor in sharding?*
   - A single shard getting too much traffic due to a hot key, degrading performance on that node.
9. *What is multi-master replication?*
   - Allowing writes to occur on multiple database servers, which then sync with each other (requires conflict resolution).
10. *Define read-replica.*
    - A read-only copy of a database used to offload read queries from the primary master database.

### 12. Common Mistakes
- Selecting a poor Shard Key (e.g., choosing `country` when 90% of your users live in one country, creating an unbalanced database cluster).

### 13. Best Practices
- Choose shard keys that distribute data uniformly (e.g., UUIDs or Hashed User IDs). Use Read Replicas to scale read performance before jumping into sharding complexity.

### 14. Hands-on Lab
- Install MongoDB locally, run a command to initialize a local replica set, and write to primary while reading from secondary.

### 15. Commands
- `rs.initiate()` (MongoDB command to start a replica set)
- `rs.status()` (MongoDB command to check replication health)

### 16. Code Examples
```javascript
// MongoDB configuration snippet to initiate a local replica set
rs.initiate({
  _id: "rs0",
  members: [
    { _id: 0, host: "localhost:27017" },
    { _id: 1, host: "localhost:27018" },
    { _id: 2, host: "localhost:27019" }
  ]
});
```

### 17. Visual Memory Tricks
- **Replication = Repeat** (Duplicate copies).
- **Sharding = Shred** (Cut tables into small strips).

### 18. MCQs
1. Sharding is used to solve which scaling limit?
   - A) Read limits
   - B) Write and storage capacity limits (Correct)
   - C) Latency to client
2. What happens during asynchronous replication if the master fails before syncing?
   - A) System crashes permanently
   - B) Data loss of un-replicated writes (Correct)
   - C) Replicas automatically reject all reads

### 19. Practical Scenario Questions
- *Scenario*: A social media app has 99% reads and 1% writes. How should you scale the database?
  - *Answer*: Deploy Read Replicas (Replication) behind a load balancer to distribute the heavy read traffic.

### 20. Summary
- **Key Points**: Replication copies data for availability. Sharding cuts data for scaling writes.
- **Cheat Sheet**: Master-Slave = Read scaling. Horizontal splitting = Write/Storage scaling.
