# Module 11 — Backend Development

This module covers REST API design patterns, HTTP protocols, session and cookie management, JSON Web Tokens (JWT) for authentication, and routing middlewares.

---

## 1. REST APIs & Authentication (JWT vs Sessions / Cookies)

### 1. Definition
- **REST API (Representational State Transfer)**: An architectural style for designing networked applications using stateless HTTP methods.
- **JWT (JSON Web Token)**: An open standard (RFC 7519) that defines a compact, self-contained way for securely transmitting information between parties as a JSON object, signed cryptographically.
- **Session/Cookie Auth**: A stateful authentication mechanism where the server saves user details in memory/database (session) and returns a unique ID to the client browser (cookie) to track requests.

### 2. Why it Exists
Web services must exchange data and verify client identities securely.
- REST provides standard HTTP endpoints.
- Session/Cookie authentication is stateful, requiring database checks on every request, which is hard to scale.
- JWT provides stateless authentication, allowing backend systems to trust the client payload directly without database lookups.

### 3. Why it is Important
Foundational to modern client-server web apps, single page apps, and mobile applications.
- Fits in: API routing and security architecture.

### 4. Real World Analogy
- **Session/Cookie = Coat Check Ticket**: You give your coat to a receptionist. They hang it up (Session saved in server database) and hand you a plastic ticket with ID `#42` (Cookie stored in browser). Every time you buy a drink, you show ticket `#42`. The receptionist looks at the rack to verify it is you.
- **JWT = Theme Park Wristband**: You buy a ticket. They print a wristband showing your name, expiry time, and a security hologram stamp (JWT Signature). You wear it. Every ride operator checks the wristband hologram (decodes the token) and lets you in immediately. They don't check a central passenger log (stateless lookup).

### 5. Real World Example
- **Zomato** API server returns a JWT to a customer's phone on login. When ordering food, the app sends the JWT in the `Authorization` header to authenticate the request stateless-ly.

### 6. Architecture Diagram
```
Session/Cookie (Stateful):
Client ──(Login)──► [ Server ] ──► [ Save Session in DB ]
Client ◄──(Cookie ID)── [ Server ]
Client ──(GET /profile + Cookie ID)──► [ Server ] ──► [ Check DB ] ──► [ Profile Data ]

JWT Authentication (Stateless):
Client ──(Login)──► [ Server ] ──► [ Sign Token with Private Key ]
Client ◄──(JWT Token)── [ Server ]
Client ──(GET /profile + JWT in Header)──► [ Server ] ──► [ Validate Signature ] ──► [ Profile Data ]
                                                        (No DB check needed)
```

### 7. Working Step by Step (JWT Verification)
1. **Login**: Client submits username and password to `/api/login`.
2. **Creation**: Server validates credentials. Creates a JSON payload containing expiration (`exp`) and claims (e.g. `user_id: 101`).
3. **Signing**: Server signs payload using a secret key (HMAC-SHA256) or private key (RSA), creating a token: `header.payload.signature`.
4. **Sending**: Server returns the token to the client.
5. **Storage**: Client stores token in localStorage or cookie.
6. **Submitting**: Client sends requests with headers: `Authorization: Bearer <token>`.
7. **Verification**: Server extracts token, validates the signature using the secret/public key, verifies expiration, and extracts the payload.

### 8. Advantages
- **REST**: Highly standardized, uses native HTTP capabilities.
- **JWT**: Stateless (scales easily across server clusters), works across domains, lightweight.
- **Sessions**: Revocation is easy (delete session from database instantly to logout user).

### 9. Disadvantages
- **JWT**: Hard to revoke before expiration (unless using a blacklist database, making it stateful again). If token is stolen, the attacker has access until expiry.
- **Sessions**: Storing sessions in server RAM limits scale, requiring shared stores like Redis.

### 10. Interview Explanation
"REST APIs are stateless services communicating via HTTP methods. To authenticate, we use Sessions (stateful, server stores login state, browser tracks using cookies) or JWT (stateless, client stores a signed cryptographical token). JWTs scale better because the server doesn't perform database checks on every request, verifying the signature instead."

### 11. Frequently Asked Interview Questions
1. *What are the 6 constraints of REST?*
   - Client-Server, Statelessness, Cacheability, Layered System, Code-on-Demand (optional), and Uniform Interface.
2. *What are the components of a JWT?*
   - **Header** (defines algorithm & token type), **Payload** (stores data claims), and **Signature** (verifies authenticity).
3. *What are HTTP Status codes in the 2xx, 3xx, 4xx, and 5xx ranges?*
   - **2xx**: Success (200 OK, 201 Created). **3xx**: Redirection (301 Moved). **4xx**: Client Error (400 Bad Request, 401 Unauthorized, 403 Forbidden, 404 Not Found). **5xx**: Server Error (500 Internal Server Error, 502 Bad Gateway).
4. *How do you invalidate a JWT before it expires?*
   - Store short-lived access tokens (e.g. 15 mins) and use refresh tokens, or maintain a Redis blacklist of revoked tokens.
5. *Difference between PUT and PATCH?*
   - **PUT**: Replaces the entire resource. **PATCH**: Updates partial fields of a resource.
6. *What is idempotency in REST?*
   - An operation that yields the same result no matter how many times it is run (GET, PUT, DELETE are idempotent; POST is not).
7. *What is CORS?*
   - Cross-Origin Resource Sharing. A browser security mechanism that blocks web scripts from querying APIs hosted on different domains unless the API sends correct headers.
8. *What does Middleware do in backend routing?*
   - Code that runs between receiving a request and sending a response, commonly used for logging, authentication checks, or parsing JSON.
9. *What is an API Gateway?*
   - An entry point that sits between clients and microservices, handling routing, SSL, rate limiting, and analytics.
10. *Define token signature.*
    - A cryptographic hash generated by combining header, payload, and a secret key, ensuring the token payload cannot be altered.

### 12. Common Mistakes
- Storing passwords in plain text in database schemas or storing sensitive user details (like passwords or credit card info) inside the readable base64 payload of a JWT.

### 13. Best Practices
- Keep JWT lifetimes short. Set the `HttpOnly` and `Secure` flags on auth cookies to protect against Cross-Site Scripting (XSS) attacks.

### 14. Hands-on Lab
- Write a simple Express.js application implementing a JWT login authentication router.

### 15. Commands
- `curl -X POST -H "Content-Type: application/json" -d '{"user":"test"}' http://localhost:3000/login` (Test login endpoints)

### 16. Code Examples
```javascript
// Simple Node.js Express.js JWT authentication middleware
const jwt = require('jsonwebtoken');
const SECRET_KEY = 'my_super_secret_key';

function authenticateToken(req, res, next) {
    const authHeader = req.headers['authorization'];
    // Format: Bearer <TOKEN>
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) return res.status(401).json({ error: "Access token missing" });

    jwt.verify(token, SECRET_KEY, (err, user) => {
        if (err) return res.status(403).json({ error: "Invalid or expired token" });
        req.user = user; // Attach payload user context to request
        next(); // Move to next route handler
    });
}
```

### 17. Visual Memory Tricks
- **JWT = hologram Ticket**: Checks validity without calling headquarters.
- **Cookie = Plastic Ticket**: Must call desk to verify match.

### 18. MCQs
1. Which HTTP status code represents a resource is forbidden?
   - A) 401
   - B) 403 (Correct)
   - C) 404
2. Which HTTP method is not idempotent?
   - A) GET
   - B) PUT
   - C) POST (Correct)

### 19. Practical Scenario Questions
- *Scenario*: A developer forgets to configure CORS headers on a backend API. An Angular client app tries to fetch user profiles but logs showing network errors. What is happening?
  - *Answer*: The browser intercepts the API response and blocks it because the API lacks the `Access-Control-Allow-Origin` header matching the client app's origin domain.

### 20. Summary
- **Key Points**: REST provides stateless resource routing. JWT is stateless token authentication. Sessions are database-tracked stateful auth.
- **Cheat Sheet**: 200 = OK. 401 = Login needed. 403 = Access denied. 500 = Code error.
