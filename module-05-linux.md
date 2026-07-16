# Module 5 — Linux System Administration

This module provides a comprehensive guide to the Linux operating system, user administration, permissions, file systems, process management, shell scripting, and core commands.

---

## 1. File Permissions & Ownership (chmod / chown)

### 1. Definition
Linux is a multi-user operating system. File Permissions and Ownership control which users can Read (r), Write (w), or Execute (x) specific files and directories.

### 2. Why it Exists
To secure the system. You don't want a regular application user altering system configurations, reading other users' private files, or running unauthorized system scripts.

### 3. Why it is Important
Misconfiguring file permissions leads to security vulnerabilities (making secrets readable by anyone) or operational errors (scripts failing because they lack execute bits).
- Fits in: Core Linux OS security.

### 4. Real World Analogy
**Office Building Security**:
- **Owner**: You own the desk. You can read, write, or shred files.
- **Group**: Your department teammates can read but not change files.
- **Others**: The general public cannot even enter the room.
- **Permissions Key**: Security badges specify permissions on doors.

### 5. Real World Example
- Deploying a python script on a server. Before you can execute it with `./app.py`, you must grant execute permission.

### 6. Architecture Diagram
```
Permission String Example: - rwx r-x r--
                           │  │   │   └── Others (Read only)
                           │  │   └────── Group (Read, Execute)
                           │  └────────── User/Owner (Read, Write, Execute)
                           └───────────── File Type (- = Regular, d = Directory)
```

### 7. Working Step by Step (Numeric Permission Codes)
1. Linux permissions use octal values: Read (4), Write (2), Execute (1).
2. Sum values for User, Group, and Others:
   - `rwx` = 4 + 2 + 1 = 7 (Full access)
   - `r-x` = 4 + 0 + 1 = 5 (Read and execute)
   - `r--` = 4 + 0 + 0 = 4 (Read only)
3. Combine sums to set permissions: `chmod 754 file.txt` (User: 7, Group: 5, Others: 4).
4. Run `ls -l` to verify the output permission block.

### 8. Advantages
- Simple, lightweight security model.
- Fine-grained control over executable scripts.

### 9. Disadvantages
- Can become complex to manage without structured User Groups.
- Standard permissions lack granular role configurations (resolved using ACLs - Access Control Lists).

### 10. Interview Explanation
"Linux permissions restrict file access to the Owner, Group, and Others. Every file has three basic permission flags: Read (r=4), Write (w=2), and Execute (x=1). We use the `chmod` command to change permissions (e.g. `chmod 755` makes a file readable/executable by everyone but writeable only by the owner) and `chown` to change owner/group variables."

### 11. Frequently Asked Interview Questions
1. *What does `chmod 777` mean, and is it recommended?*
   - It grants full Read, Write, and Execute rights to the Owner, Group, and all other users. It is highly discouraged in production because it is a security risk.
2. *What is the difference between `chmod` and `chown`?*
   - `chmod` changes read/write/execute permissions. `chown` changes the user or group owner of the file.
3. *What is `sudo`?*
   - "Superuser Do". It allows a permitted user to execute a command as the superuser (root).
4. *How do you make a shell script executable?*
   - Run `chmod +x script.sh` or `chmod 755 script.sh`.
5. *What is the `umask` command?*
   - A setting that defines the default file permissions for newly created files and directories.
6. *What does the `d` character at the beginning of an `ls -l` line indicate?*
   - It indicates the file is a Directory.
7. *What is a User Group in Linux?*
   - A collection of users grouped together to share access rights to files.
8. *What is the root user?*
   - The system administrator account with total, unrestricted access to all files and commands.
9. *What happens if you run `chown user:group file.txt`?*
   - It changes the owner of `file.txt` to `user` and updates its group association to `group`.
10. *Define sticky bit.*
    - A permission flag on directories that prevents users from deleting files owned by other users within that directory (commonly used on `/tmp`).

### 12. Common Mistakes
- Running `chmod -R 777 /var/www` when a web server fails due to access permissions. This is a massive security risk. Only grant minimum permissions.

### 13. Best Practices
- Use `chmod 600` for private SSH keys and database credentials configuration files to restrict read access to only the owner user.

### 14. Hands-on Lab
- Create a file, restrict all access from group and others, verify permissions, and restore access.

### 15. Commands
- `chmod 600 private.key` (Make key readable/writeable only by owner)
- `chown ubuntu:ubuntu app.py` (Change owner and group to `ubuntu`)
- `ls -l` (View permissions and owner files)

### 16. Code Examples
```bash
# Script to create a file and set strict permissions
touch secret_credentials.txt
echo "DB_PASSWORD=supersecret" > secret_credentials.txt
# Set: Owner = Read/Write (4+2=6), Group = None (0), Others = None (0)
chmod 600 secret_credentials.txt
# Verify
ls -l secret_credentials.txt
# Output: -rw------- 1 ubuntu ubuntu 24 secret_credentials.txt
```

### 17. Visual Memory Tricks
- **r-w-x = 4-2-1**: **r**ead (4 letters in word read), **w**rite (2 letters in "to"), e**x**ecute (1 letter in "run" / "do").

### 18. MCQs
1. What permission score represents read and write access only?
   - A) 5
   - B) 6 (Correct)
   - C) 7
2. Which command changes file ownership?
   - A) chmod
   - B) chown (Correct)
   - C) chgrp

### 19. Practical Scenario Questions
- *Scenario*: A developer deploys a shell script `deploy.sh` but gets "Permission denied" when typing `./deploy.sh`. How do you fix this?
  - *Answer*: Grant execute permissions to the script using `chmod +x deploy.sh` or `chmod 755 deploy.sh`.

### 20. Summary
- **Key Points**: Read (4), Write (2), Execute (1). Permissions divided into User, Group, Others. `chmod` alters rights; `chown` alters owners.
- **Cheat Sheet**: `chmod 755` = Executable. `chmod 600` = Private. `chown` = Change owner.

---

## 2. Process Management (ps / top / kill)

### 1. Definition
Process Management involves monitoring, managing, and controlling running programs (processes) inside the Linux operating system.

### 2. Why it Exists
Applications can consume too much memory, freeze, or loop indefinitely. Linux provides utilities to inspect active processes and terminate them safely.

### 3. Why it is Important
Ensures system stability. DevOps engineers must identify heavy processes (CPU/RAM hogs) and restart crashed or hung services to keep servers healthy.
- Fits in: Server monitoring and operations.

### 4. Real World Analogy
**Task Manager (Windows)**: When a program freezes on your computer, you open Task Manager, locate the application using 99% CPU, click "End Task", and the program shuts down instantly.

### 5. Real World Example
- An Nginx web server process is hung on port 80. You locate the Process ID (PID) and run `kill` to terminate it, clearing the port for a service reload.

### 6. Architecture Diagram
```
               [ Operating System Kernel ]
                 /         |          \
                v          v           v
           [ PID 1 ]   [ PID 254 ]   [ PID 890 ]  <-- Isolated Processes
          (systemd)      (nginx)       (node)
```

### 7. Working Step by Step
1. The kernel assigns a unique Process ID (PID) when an application runs.
2. Run `ps aux` to list all running processes, their PID, CPU%, and Memory%.
3. Run `top` (or `htop`) to view processes sorted by CPU usage in real-time.
4. If a process is hung, send a termination signal using `kill <PID>` (SIGTERM, code 15, allows graceful shutdown).
5. If the process refuses to stop, send a force termination signal using `kill -9 <PID>` (SIGKILL, forces instant shutdown).

### 8. Advantages
- Total control over resource allocation.
- Ability to troubleshoot unresponsive software without rebooting the server.

### 9. Disadvantages
- Force-killing database processes (`kill -9`) can lead to database corruption if write transactions are interrupted mid-flight.

### 10. Interview Explanation
"Linux assigns a PID to every running program. We monitor processes using `ps aux` or `top`. We terminate processes using the `kill` command. By default, `kill` sends a SIGTERM (signal 15) for graceful exit, but we can force exit using `kill -9` (SIGKILL) if a process is frozen."

### 11. Frequently Asked Interview Questions
1. *What is a PID?*
   - Process Identifier. A unique number assigned by the kernel to a running process.
2. *Difference between SIGTERM (15) and SIGKILL (9)?*
   - SIGTERM asks the program to clean up files and exit gracefully. SIGKILL forces the kernel to terminate the process immediately.
3. *What is a Zombie Process?*
   - A process that has completed execution but still has an entry in the process table because its parent has not read its exit status.
4. *What is PID 1 in Linux?*
   - The first process started during boot (usually `systemd` or `init`), acting as parent of all other processes.
5. *How do you run a process in the background?*
   - Append an ampersand (`&`) to the command, e.g. `python server.py &`.
6. *What does the `top` command show?*
   - A dynamic, real-time list of active processes sorted by resource consumption.
7. *How do you find a process using a specific port (like 80)?*
   - Run `lsof -i :80` or `netstat -tunlp | grep 80`.
8. *What is `nohup`?*
   - "No Hang Up". Runs a command that will keep running even after you log out of the SSH terminal.
9. *What is a daemon?*
   - A background process that runs continuously without user interaction (e.g. `sshd`, `cron`).
10. *Define nice value in Linux.*
    - A priority value from -20 (highest priority) to 19 (lowest priority) that affects how much CPU time a process receives.

### 12. Common Mistakes
- Blindly running `kill -9` on database engines without checking if data is currently writing, causing corruption.

### 13. Best Practices
- Always try graceful termination (`SIGTERM`) first. Use `htop` for visual process sorting if available.

### 14. Hands-on Lab
- Start a dummy sleep process in the background, find its PID, and kill it.

### 15. Commands
- `ps aux | grep node` (Find Node.js processes)
- `kill -15 <PID>` (Graceful kill)
- `kill -9 <PID>` (Force kill)

### 16. Code Examples
```bash
# Start a background process that sleeps for 500 seconds
sleep 500 &
# Output: [1] 2345 (Job number and PID)

# Find the PID using ps
ps aux | grep "sleep 500"

# Kill the process
kill 2345
```

### 17. Visual Memory Tricks
- **Kill -9**: The number 9 looks like a hangman's noose. It means absolute, immediate termination.

### 18. MCQs
1. Which signal code represents SIGKILL?
   - A) 15
   - B) 9 (Correct)
   - C) 2
2. What tool shows CPU usage of processes dynamically?
   - A) ls
   - B) top (Correct)
   - C) cat

### 19. Practical Scenario Questions
- *Scenario*: A script is stuck in an infinite loop, consuming 100% CPU. How do you locate and stop it?
  - *Answer*: Run `top` to locate the PID of the offending process, then run `kill -9 <PID>` to terminate the loop.

### 20. Summary
- **Key Points**: Processes are tracked by PIDs. View via `ps`/`top`. Terminate via `kill`.
- **Cheat Sheet**: Background = `&`. Monitor = `top`. Terminate = `kill -15` (soft), `kill -9` (hard).
