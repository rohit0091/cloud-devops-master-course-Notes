# Module 10 — Databases (SQL & NoSQL)

This module covers database architecture, SQL query mechanics (indexes, joins), schema normalization, NoSQL storage structures (MongoDB), scaling, and aggregation.

---

## 1. Database Indexing & Schema Normalization (SQL Joins)

### 1. Definition
- **Database Index**: A data structure (usually a B-Tree) that improves data retrieval speeds on database tables at the cost of slower writes and additional storage.
- **Normalization**: The process of organizing database tables to reduce data redundancy and dependency by dividing large tables into smaller ones and linking them using relationships.
- **SQL Join**: An operation used to combine rows from two or more tables based on a related column between them.

### 2. Why it Exists
- Without **Indexes**, searching a table with millions of rows requires a "Full Table Scan", reading every single row from disk, which is extremely slow.
- Without **Normalization**, duplicate data takes up extra space and leads to data update anomalies (e.g. updating a customer's address in one place but forgetting to update it in another).

### 3. Why it is Important
Directly impacts query performance and application reliability under load.
- Fits in: Database performance and system design.

### 4. Real World Analogy
- **Index = Book Index**: If you want to find "Virtualization" in a 500-page book, you don't read every page (Full Table Scan). You go to the back of the book, look up "Virtualization", find it is on page 42, and flip directly to page 42 (Index Scan).
- **Normalization = Wardrobe Organizer**: Instead of throwing all clothes, socks, belts, and shoes into a single massive pile (Denormalized), you put socks in a drawer, shoes in a rack, and shirts on hangers. They are organized separately and linked when you dress up.

### 5. Real World Example
- A banking system uses highly normalized PostgreSQL tables (Users, Accounts, Transactions) with indexes on `user_id` to retrieve bank balances in milliseconds.

### 6. Architecture Diagram
```
Without Index: [ Query ] ──► [ Full Table Scan: Checks Row 1, Row 2, Row 3 ... Row 1,000,000 ]
With Index:    [ Query ] ──► [ B-Tree Index Lookup ] ──► [ Direct Row Address ] ──► [ Result ]

Joins Venn Diagram:
   Inner Join:       Left Join:       Right Join:
     ( A ∩ B )        ( A ∪ (A∩B) )    ( B ∪ (A∩B) )
```

### 7. Working Step by Step (Index Scan)
1. User queries: `SELECT * FROM users WHERE email = 'test@test.com'`.
2. The Database Query Optimizer checks if an index exists on the `email` column.
3. If an index exists, it searches a B-Tree data structure.
4. The B-Tree search uses binary-like search trees, locating the value in \(O(\log N)\) steps rather than \(O(N)\) steps.
5. The leaf node of the B-Tree yields the physical disk block address of the matching record.
6. The database engine fetches the target block from disk directly.

### 8. Advantages
- **Indexing**: Drastically improves read speeds.
- **Normalization**: Eliminates data redundancy, saves storage, and ensures data integrity.

### 9. Disadvantages
- **Indexing**: Slows down inserts, updates, and deletes (`INSERT/UPDATE/DELETE`) because the index tree must be updated on every write.
- **Normalization**: Multiple joins are required to fetch comprehensive data records, which can degrade query latency.

### 10. Interview Explanation
"An Index is a B-Tree data structure that speeds up database lookups from \(O(N)\) to \(O(\log N)\), but slows down write operations. Schema Normalization is organizing tables into forms like 1NF, 2NF, and 3NF to eliminate duplicate data. We then use SQL Joins—like Inner, Left, or Outer Joins—to combine records from these normalized tables during query execution."

### 11. Frequently Asked Interview Questions
1. *What is a Clustered vs Non-Clustered Index?*
   - **Clustered Index**: Determines the physical order of data rows in a table (only one allowed per table, typically the Primary Key). **Non-Clustered**: A separate search index containing pointers back to the physical data rows.
2. *What are 1NF, 2NF, and 3NF?*
   - **1NF (First Normal Form)**: Atomic values, no repeating groups. **2NF**: Meets 1NF, and all non-key columns depend on the entire primary key. **3NF**: Meets 2NF, and no non-key columns depend transitively on another non-key column.
3. *What is the difference between LEFT JOIN and INNER JOIN?*
   - **INNER JOIN** returns rows only when there is a match in both tables. **LEFT JOIN** returns all rows from the left table, plus matching rows from the right table (unmatched right columns return NULL).
4. *How does database optimization analyze queries?*
   - By running the `EXPLAIN ANALYZE` prefix command before queries to inspect the query plan, checking if it uses index scans or full table scans.
5. *What is a composite index?*
   - An index built on multiple columns combined (e.g. indexing `(last_name, first_name)`).
6. *What is database transaction deadlock?*
   - A situation where two transactions hold locks on resources the other transaction needs to proceed, causing both to block indefinitely.
7. *Explain referential integrity.*
   - A database rule using Foreign Keys to ensure relationships between tables remain consistent.
8. *What is a view in SQL?*
   - A virtual table representing the result of a pre-defined SQL query.
9. *What is database denormalization?*
   - A strategy to deliberately inject redundant data into tables to skip slow joins, optimizing for read-heavy workloads.
10. *Define primary key vs foreign key.*
    - **Primary Key**: A unique identifier for a table row. **Foreign Key**: A column referencing a primary key in another table, creating a link.

### 12. Common Mistakes
- Adding indexes to every single column in a table, causing inserts to become extremely slow and wasting storage space.

### 13. Best Practices
- Index columns that are frequently used in `WHERE`, `JOIN`, and `ORDER BY` clauses. Use database connection pools to manage database connections efficiently.

### 14. Hands-on Lab
- Set up a SQLite database, write a query using INNER JOIN, run `EXPLAIN QUERY PLAN` on a search query, create an index, and run `EXPLAIN` again to observe the difference.

### 15. Commands
- `CREATE INDEX idx_user_email ON users(email);` (Create Index)
- `EXPLAIN ANALYZE SELECT * FROM users WHERE email = 'test@test.com';` (Check execution plan)

### 16. Code Examples
```sql
-- Normalizing a table structure: Users and Orders
CREATE TABLE users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100),
    email VARCHAR(100) UNIQUE
);

CREATE TABLE orders (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT,
    product_name VARCHAR(100),
    price DECIMAL(10,2),
    FOREIGN KEY (user_id) REFERENCES users(id)
);

-- Query using Joins with Index Optimization
SELECT users.name, orders.product_name, orders.price
FROM users
INNER JOIN orders ON users.id = orders.user_id
WHERE users.email = 'rohit@example.com';
```

### 17. Visual Memory Tricks
- **Index = Table of Contents**: Jump straight to the page.
- **Normalization = Drawers**: Put everything in its separate container.

### 18. MCQs
1. Which index type orders data physically on disk?
   - A) Non-Clustered
   - B) Clustered (Correct)
   - C) Composite
2. What normalization form removes transitive dependencies?
   - A) 1NF
   - B) 2NF
   - C) 3NF (Correct)

### 19. Practical Scenario Questions
- *Scenario*: A user details search query takes 5 seconds on a table with 2 million rows. You run an explain query plan and see "Table Scan". How do you resolve this?
  - *Answer*: Create a database index on the column used in the query search filter (e.g. `CREATE INDEX idx_users_search ON users(search_column);`).

### 20. Summary
- **Key Points**: Indexes speed up reads but slow down writes. Normalization organizes tables to avoid duplication. Joins combine tables.
- **Cheat Sheet**: Slow query = check indexes. Data duplication = normalize. Keep indexes on frequently queried columns.
