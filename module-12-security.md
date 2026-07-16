# Module 12 — Security & Cryptography

This module covers cloud identity management, access control frameworks, cryptography (encryption/hashing), transport layer security, and application threat mitigation.

---

## 1. Hashing vs Encryption (Salting & Secrets Management)

### 1. Definition
- **Hashing**: A one-way mathematical function that maps input data of any size to a fixed-size character string. It cannot be reversed (e.g. SHA-256, bcrypt).
- **Encryption**: A two-way mathematical process that encodes information using a key, allowing authorized parties to decrypt it back to plain text using matching keys.
- **Salting**: Adding a random string of characters (a salt) to a password before hashing it, ensuring identical passwords generate unique hash values.

### 2. Why it Exists
- Without **Hashing**, storing passwords in plain text leads to massive breaches if the database is compromised.
- Without **Encryption**, data sent over networks or stored on disks can be read by hackers or unauthorized processes.
- Without **Salting**, hackers can use precomputed databases of hashed passwords ("rainbow tables") to crack passwords instantly.

### 3. Why it is Important
Safeguards user credentials and complies with data protection regulations (like GDPR and PCI-DSS).
- Fits in: Data security and threat defense.

### 4. Real World Analogy
- **Hashing = Making a Smoothie**: You put strawberries, bananas, and milk into a blender (hashing function). You get a pink smoothie (hash). You cannot extract the original strawberry in one piece from the smoothie (irreversible).
- **Encryption = Lock Box**: You put a document in a box, close it, and lock it with a key. Only someone with the duplicate key can unlock the box and read the document.
- **Salting = Unique Seasoning**: If two people order the same soup (password), but you add a random spice (salt) to each bowl, the soups smell and taste completely different (unique hashes).

### 5. Real World Example
- When you create an account on **Facebook**, the application hashes your password using `bcrypt` and stores the hash. When you log in, it hashes the entered text and compares the hashes. Facebook never knows your actual password.

### 6. Architecture Diagram
```
Hashing (One-Way):
[ Plain Password ] + [ Random Salt ] ──► [ Bcrypt Hash Function ] ──► [ Stored Hash ]

Encryption (Two-Way):
[ Plain Text Data ] ──► [ Encrypt (AES-256 + Key) ] ──► [ Cipher Text ]
                                                             │
[ Decrypted Text ]  ◄── [ Decrypt (AES-256 + Key) ] ◄────────┘
```

### 7. Working Step by Step (Password Hashing Verification)
1. **User input**: User registers with password `password123`.
2. **Salt Generation**: Database generates a unique random string (e.g., `8f9g2`).
3. **Hashing**: System appends salt to password (`password1238f9g2`) and passes it to the hashing algorithm (bcrypt).
4. **Storage**: Database stores the user record: `username: rohit`, `salt: 8f9g2`, `hash: $2b$12$L7R2...`.
5. **Login validation**: User logs in with `password123`.
6. **Lookup**: Server fetches user record and salt `8f9g2` from DB.
7. **Compute**: Server hashes the entered password using the retrieved salt.
8. **Comparison**: If the computed hash matches the stored hash, login succeeds.

### 8. Advantages
- Hashing protects credentials even if database tables are leaked.
- Encryption guarantees confidentiality of sensitive communications.

### 9. Disadvantages
- Hash computation takes server CPU time (deliberately slowed down in algorithms like bcrypt to prevent brute-force attacks).
- Key management in encryption is hard (losing the key means losing the data permanently).

### 10. Interview Explanation
"Hashing is a one-way, irreversible function used to verify data integrity, like storing user passwords securely. Encryption is a two-way process used to secure data confidentiality, requiring a key to lock and unlock the text. Salting adds a random string to passwords before hashing to defeat precomputed rainbow table attacks."

### 11. Frequently Asked Interview Questions
1. *Why is MD5 or SHA-1 not recommended for hashing passwords?*
   - Because they are too fast. Attackers can run billions of guesses per second. Modern schemes use `bcrypt` or `Argon2` which incorporate work factors to slow down computation.
2. *What is Symmetric vs Asymmetric Encryption?*
   - **Symmetric**: Uses the same key for encryption and decryption (e.g. AES). Fast, used for bulk data. **Asymmetric**: Uses a Public Key to encrypt and a Private Key to decrypt (e.g. RSA). Slow, used for key exchange and digital signatures.
3. *What is a Rainbow Table?*
   - A precomputed table of plaintext passwords and their corresponding hashes, used to crack password databases quickly.
4. *How does Salting defeat Rainbow Tables?*
   - It forces the attacker to compute a custom database of hashes for every unique salt value, making precomputed tables useless.
5. *What is TLS (Transport Layer Security)?*
   - A cryptographic protocol designed to provide secure communication over a computer network (replacing SSL).
6. *What does "Data at Rest" and "Data in Transit" mean?*
   - **At Rest**: Data stored on physical disks (encrypted using keys in databases or storage blocks). **In Transit**: Data moving across network cables (encrypted using HTTPS/TLS).
7. *Explain Least Privilege.*
   - A security principle that users/services should only be granted the minimum permissions required to perform their specific tasks.
8. *What is Multi-Factor Authentication (MFA)?*
   - Verification requiring two or more independent credentials (e.g. password + phone OTP).
9. *What are the OWASP Top 10?*
   - A standard awareness document listing the 10 most critical security risks for web applications (e.g., Injection, Broken Authentication, Sensitive Data Exposure).
10. *Define Zero Trust architecture.*
    - A security framework requiring continuous verification of every user and device, assuming the network is always compromised.

### 12. Common Mistakes
- Hardcoding database encryption keys or API tokens in application code files, allowing anyone with access to the Git repository to read them. Use a Secrets Manager instead.

### 13. Best Practices
- Use `bcrypt` for password hashing with a work factor of 10-12. Use KMS (Key Management Service) or HashiCorp Vault to rotate encryption keys automatically.

### 14. Hands-on Lab
- Write a Python script to hash a password using `bcrypt` and verify it.

### 15. Commands
- `openssl rand -base64 32` (Generate a secure random encryption key)

### 16. Code Examples
```python
# Password hashing and verification using bcrypt in Python
import bcrypt

# Registering User
plain_password = b"my_super_secure_password"
# Generate salt and hash the password
salt = bcrypt.gensalt(rounds=12)
hashed_password = bcrypt.hashpw(plain_password, salt)

print(f"Salt: {salt}")
print(f"Hashed: {hashed_password}")

# Login Verification
entered_password = b"my_super_secure_password"
# Verify password matches stored hash
if bcrypt.checkpw(entered_password, hashed_password):
    print("Login Successful!")
else:
    print("Invalid Password.")
```

### 17. Visual Memory Tricks
- **Hash = Hummus**: You can turn chickpeas into hummus, but you can never turn hummus back into chickpeas.

### 18. MCQs
1. Which algorithm is best suited for hashing user passwords?
   - A) AES-256
   - B) MD5
   - C) Bcrypt (Correct)
2. What encryption type uses different keys to encrypt and decrypt data?
   - A) Symmetric
   - B) Asymmetric (Correct)
   - C) Salting

### 19. Practical Scenario Questions
- *Scenario*: A database server is hacked, and all table columns are stolen. The users' passwords are saved in the table. How do you prevent the hacker from logging into the site as those users?
  - *Answer*: Since the passwords were encrypted using salted bcrypt hashes, the hacker cannot reverse them back to plain text, preventing account logins.

### 20. Summary
- **Key Points**: Hashing is one-way (credentials). Encryption is two-way (confidential data). Salting blocks rainbow table attacks.
- **Cheat Sheet**: Key = Encryption. Hash = Passwords. Salt = Random modifier.
