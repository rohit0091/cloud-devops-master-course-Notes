# Module 15 — Caching Strategies

This module covers caching layers, caching database mechanisms (Redis, Memcached), Content Delivery Networks (CDNs), cache invalidation, and data policies.

---

## 1. Redis vs Memcached (Cache Hit / Miss, TTL & CDNs)

### 1. Definition
- **Cache**: A high-speed data storage layer which stores a subset of transient data, so that future requests for that data are served faster than querying the primary database.
- **Redis**: An open-source, in-memory key-value data store used as a database, cache, message broker, and streaming engine.
- **Cache Hit / Miss**: A **Hit** occurs when requested data is found in the cache. A **Miss** occurs when data is not found, requiring a query to the primary database.
- **TTL (Time to Live)**: An expiration timer set on cached keys after which the data is deleted automatically.
- **CDN (Content Delivery Network)**: A geographically distributed network of proxy servers that cache static assets (HTML, images, videos) close to end-users.

### 2. Why it Exists
Reading data from physical disks (SQL databases) is slow and CPU-intensive. Caching stores frequently requested data in system memory (RAM), offloading traffic from primary databases.

### 3. Why it is Important
Vastly improves application performance and reduces database load.
- Fits in: Performance optimization.

### 4. Real World Analogy
- **Caching = Desk vs Archives**: If you write reports, you keep your current files on your desk (Cache). If you need a file from 3 years ago (Cache Miss), you walk down to the basement archives (Database), fetch the file, make a copy, and place it on your desk (Cache Hit next time).
- **CDN = Local Bookstores**: Instead of ordering a textbook from the publisher's main printer in New York (Origin Server), you walk to your local neighborhood branch bookstore (CDN Edge Node) to buy a copy.

### 5. Real World Example
- **Flipkart** uses Redis to cache popular product detail pages, serving millions of users instantly during big sales events instead of running millions of SQL queries.

### 6. Architecture Diagram
```
Client ──► [ Query data ]
               │
               ├──► [ Cache (Redis - RAM) ] ──(Cache Hit)──► [ Return Data ]
               │
               └──► [ Database (SQL - Disk) ] ──(Cache Miss)──► [ Save in Cache ] ──► [ Return ]
```

### 7. Working Step by Step (Cache-Aside Strategy)
1. **Request**: Application receives a request: `Get User 101`.
2. **Lookup**: App queries Redis cache: `EXISTS user:101`.
3. **Hit Case**: If true, App reads JSON from Redis, deserializes, and returns. (Latency: ~1ms).
4. **Miss Case**: If false, App queries PostgreSQL database: `SELECT * FROM users WHERE id = 101`. (Latency: ~50ms).
5. **Caching**: App writes query result to Redis with a TTL of 3600 seconds: `SETEX user:101 3600 data`.
6. **Response**: App returns database output to user. Subsequent requests hit Redis.

### 8. Advantages
- Sub-millisecond read response speeds.
- Reduces database hosting costs.
- Scales reads easily.

### 9. Disadvantages
- Stale Data (data in cache might become out-of-sync if database is updated and cache is not cleared).
- Memory cost (RAM is much more expensive than disk storage).

### 10. Interview Explanation
"Caching improves read performance by storing data in high-speed RAM. A cache hit occurs when data is retrieved from RAM, while a cache miss forces a slow database fetch. We use Redis for complex cache structures and persistence, or Memcached for simple key-value lookups. We use TTL to automatically expire keys to keep cache fresh."

### 11. Frequently Asked Interview Questions
1. *Difference between Redis and Memcached?*
   - **Redis**: Supports complex data structures (hashes, lists, sets), data persistence (AOF/RDB snapshots), and replication. **Memcached**: Simple key-value store, purely in-memory, highly multithreaded.
2. *What is Cache Invalidation?*
   - The process of deleting or replacing cached data when the source database changes, preventing stale reads.
3. *What is Cache Penentration?*
   - A vulnerability where requests query keys that never exist in the database, bypassing the cache entirely and hitting the DB continuously. Resolved using Bloom filters or caching empty/null values.
4. *What is Cache Avalanche?*
   - A situation where many cached keys expire at the same time, causing a sudden spike in queries to the backend database, potentially crashing it. Resolved by adding random jitter to TTL expirations.
5. *What is Cache Stampede (Mutex Lock resolution)?*
   - Multiple application threads querying a cache miss at the exact same moment, all running the identical heavy SQL query. Resolved using locking.
6. *What are Cache Eviction Policies?*
   - Rules used by a cache when it runs out of memory (e.g. LRU: Least Recently Used, LFU: Least Frequently Used, FIFO).
7. *Explain Write-Through vs Cache-Aside caching.*
   - **Cache-Aside**: App checks cache; on miss, queries DB and updates cache. **Write-Through**: App writes to cache first, which immediately writes to database synchronously.
8. *What does CDN Origin Shield do?*
   - An extra caching layer between Edge locations and the Origin server to prevent Origin overload.
9. *What is CDN purge?*
   - Manually instructing the CDN to delete cached assets (like a CSS file) across all edge nodes globally.
10. *Define in-memory storage.*
    - Storing data entirely in system RAM for rapid accessibility.

### 12. Common Mistakes
- Setting infinite TTL values on dynamic user profiles, causing updates to user details to never show up on screen.

### 13. Best Practices
- Always set a TTL on cached values. Implement cache-busting URLs (e.g., `style.css?v=2`) for CDN updates.

### 14. Hands-on Lab
- Write a Python script connecting to a local Redis database to cache database query values using a cache-aside model.

### 15. Commands
- `redis-cli ping` (Check connection status)
- `SET mykey "hello" EX 60` (Set key with 60 second TTL expiration)
- `GET mykey` (Retrieve key value)

### 16. Code Examples
```python
# Python Cache-Aside implementation using Redis
import redis
import json
import time

r = redis.Redis(host='localhost', port=6379, db=0)

def mock_database_query(user_id):
    # Simulate slow database call
    time.sleep(2)
    return {"id": user_id, "name": "Rohit", "role": "Architect"}

def get_user_profile(user_id):
    cache_key = f"user:{user_id}"
    # Try fetching from cache
    cached_data = r.get(cache_key)
    
    if cached_data:
        print("Cache HIT!")
        return json.loads(cached_data)
        
    print("Cache MISS! Querying Database...")
    db_result = mock_database_query(user_id)
    
    # Save to cache with 10 seconds TTL
    r.setex(cache_key, 10, json.dumps(db_result))
    return db_result
```

### 17. Visual Memory Tricks
- **Redis = Remember Database**: Fast memory recall.
- **TTL = Tick-Tock-Limit**: Timer ticking down until deletion.

### 18. MCQs
1. Which caching engine supports complex structures like Sorted Sets?
   - A) Memcached
   - B) SQLite
   - C) Redis (Correct)
2. What cache eviction policy deletes the least recently requested data?
   - A) FIFO
   - B) LFU
   - C) LRU (Correct)

### 19. Practical Scenario Questions
- *Scenario*: During a ticket sale, thousands of queries hit the database for the event details page, crashing the server. How would you prevent this?
  - *Answer*: Cache the event details JSON payload in Redis. Since event details rarely change, set a high TTL (e.g., 2 hours) to serve all requests directly from memory.

### 20. Summary
- **Key Points**: Caching stores hot data in RAM. Redis is persistent and structured; Memcached is simple. CDNs cache static files at edge nodes.
- **Cheat Sheet**: RAM > Disk. Always set TTL. Stale data needs eviction/invalidation.
