# Module 18 — System Design Cases

This module covers distributed system design methodologies, database selection, data storage patterns, and architectural workflows for web-scale applications.

---

## 1. Designing a URL Shortener (TinyURL)

### 1. Definition
A URL Shortener is a web service that takes long URLs (e.g., `https://example.com/very/long/path/to/resource`) and converts them into short, compact links (e.g., `https://tiny.url/abc123yz`).

### 2. Why it Exists
To save space in links sent via SMS, emails, or tweets, track click analytics, and make links human-readable and clean.

### 3. Why it is Important
Standard system design interview question that tests understanding of high-throughput read/write database scaling, hashing algorithms, and caching.
- Fits in: System Design.

### 4. Real World Analogy
**Coat Check Room**: You hand the attendant your heavy winter coat. They don't want to carry it around or describe it to find it later. They put a small ticket tag with number `#28` on the coat and hand you the matching number `#28` ticket. When you return the ticket, they match the number and retrieve your coat.

### 5. Real World Example
- **Bit.ly** or **TinyURL** resolving redirects.

### 6. Architecture Diagram
```
Write Path (Create Short Link):
[ Client ] ──(POST longURL)──► [ Write API Server ] ──► [ Key Gen / Hash ] ──► [ SQL/NoSQL DB ]

Read Path (Redirect to Long Link):
[ Client ] ──(GET shortURL)──► [ DNS ] ──► [ Load Balancer ]
                                               │
                                       [ Read API Servers ]
                                         /            \
                       (Cache Hit)      /              \ (Cache Miss)
                                       v                v
                             [ Cache (Redis) ]    [ Database ]
```

### 7. Working Step by Step (Read Redirection Flow)
1. **Request**: User clicks `http://tiny.url/abc123yz` in browser.
2. **DNS**: Domain resolves to public IP of the Load Balancer (LB).
3. **Routing**: LB routes the request to a Read API server.
4. **Cache Check**: API server queries Redis using short key `abc123yz`.
5. **Cache Hit**: Redis returns the long URL string instantly. API Server returns HTTP `301 Permanent Redirect` with the location header pointing to the long URL.
6. **Cache Miss**: If not in Redis, API Server queries the relational database (or NoSQL key-value store).
7. **DB Lookup**: DB finds the record, API Server updates Redis cache with the value, and returns the `301 Redirect`.
8. **Browser action**: User's browser receives the redirect response and immediately opens the long URL page.

### 8. Advantages
- Fast redirection times using high-speed caching layers.
- Simple, horizontal scaling capabilities by running stateless web nodes.

### 9. Disadvantages
- High read-to-write ratio (100:1) can overload databases if caching fails (Cache Avalanche).
- Handling base62 collisions in distributed hash generation systems.

### 10. Interview Explanation
"To design a URL Shortener, we need an API service that handles two paths. The write path takes a long URL, hashes it to a base62 string of 7-8 characters, and saves the mapping to a NoSQL database (like DynamoDB) for quick key-value access. The read path intercepts requests, checks a Redis cache first, and returns an HTTP 301 Permanent Redirect to route the user browser to the target site."

### 11. Frequently Asked Interview Questions
1. *What hashing algorithm should be used to shorten URLs?*
   - MD5 or SHA-256 can be used, and then we take the first 7 characters of the Base62 representation. Alternatively, we use a centralized Key Generation Service (KGS) to pre-generate unique keys.
2. *Why choose Base62 over Base64?*
   - Base62 includes `[a-z, A-Z, 0-9]`. Base64 includes special characters like `+` and `/` which have special meanings in URL paths, causing URL formatting bugs.
3. *What is HTTP 301 vs HTTP 302 redirect?*
   - **301 Permanent**: Browsers cache the redirect locally, so subsequent clicks bypass our servers. **302 Temporary**: Browsers query our servers every time, useful for tracking click analytics.
4. *How do you handle hash collisions?*
   - If using hashing, we check if the hash exists in the database. If it does, we append a random string to the long URL and re-hash. If using a KGS, collisions are impossible.
5. *Explain Key Generation Service (KGS).*
   - A dedicated microservice that pre-generates random 7-character strings and stores them in a database. When a request to shorten a URL arrives, we grab an unused key from KGS, preventing collision-checking latency.
6. *How do you estimate storage requirements for 5 years?*
   - 100M writes/month * 12 months * 5 years = 6 Billion URLs. If each record takes 500 bytes, total storage is `6B * 500 = 3 TB`.
7. *How many requests/sec (QPS) must a system handle for 100M writes/month?*
   - `100M / (30 days * 86400 seconds) ≈ 40 writes/sec`. If reads are 100x writes, read QPS is `40 * 100 = 4,000 QPS`.
8. *What caching policy is best for this system?*
   - LRU (Least Recently Used) because a small percentage of links (hot links) generate the vast majority of click traffic.
9. *Why is NoSQL database (like MongoDB or DynamoDB) preferred over SQL RDBMS?*
   - Because we do not require complex joins. We only need simple key-value reads, and NoSQL scales horizontally far more easily.
10. *Define database write replication lag.*
    - The delay in replicating a new short URL to read-replica databases, causing temporary 404 errors if a user clicks a link immediately after creation.

### 12. Common Mistakes
- Using a standard SQL database auto-incrementing integer ID directly as the short URL path, which allows users to guess URLs sequentially and steal data.

### 13. Best Practices
- Use a dedicated KGS to generate unique keys. Always put a Redis cache layer in front of the database to offload redirection traffic.

### 14. Hands-on Lab
- Write a Python script that takes a URL, converts it to base62, and stores it in a dictionary database mock.

### 15. Commands
- `curl -i http://localhost:5000/abc123yz` (Test redirect headers via CLI)

### 16. Code Examples
```python
# Simple Python Base62 URL shortener function
import hashlib

def generate_short_key(long_url):
    # Hash URL using MD5
    hash_object = hashlib.md5(long_url.encode('utf-8'))
    hex_hash = hash_object.hexdigest()
    
    # Map hex values to Base62 characters
    base62_chars = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789"
    # Convert first 8 bytes of hash to integer
    num = int(hex_hash[:8], 16)
    
    short_key = ""
    # Convert integer to Base62 string (7 characters)
    for _ in range(7):
        short_key += base62_chars[num % 62]
        num //= 62
        
    return short_key

print(f"Short URL Key: {generate_short_key('https://rohit-devops-master-course.com/syllabus')}")
```

### 17. Visual Memory Tricks
- **Base62 = 62 Options**: 26 lower + 26 upper + 10 digits.

### 18. MCQs
1. Which HTTP status code instructs the browser to cache redirects permanently?
   - A) 302
   - B) 301 (Correct)
   - C) 200
2. What service pre-generates short keys to prevent hash collisions?
   - A) API Gateway
   - B) Redis Cache
   - C) Key Generation Service (Correct)

### 19. Practical Scenario Questions
- *Scenario*: A short link goes viral on Twitter, generating 50,000 clicks per minute. The server database starts showing high CPU utilization. What is the solution?
  - *Answer*: Implement a caching layer in front of the database (like Redis or CloudFront) to cache the short-key-to-long-URL mappings, serving requests from memory rather than disk queries.

### 20. Summary
- **Key Points**: TinyURL converts URLs to Base62 strings. Uses KGS to prevent collisions. HTTP 301 for caching redirects. NoSQL for scaling database records.
- **Cheat Sheet**: Read path = check cache -> fetch DB if miss -> return 301 redirect. Write path = check KGS -> save to DB -> return short URL.
