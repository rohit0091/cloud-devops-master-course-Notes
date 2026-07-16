# Module 6 — Docker & Containerization

This module covers Docker architecture, image creation, multi-container deployments, data persistence, container networks, and Docker commands.

---

## 1. Dockerfile & Image Creation

### 1. Definition
A Dockerfile is a text document containing all the commands a user could call on the command line to assemble a Docker Image. A Docker Image is a read-only template used to run container instances.

### 2. Why it Exists
Traditionally, developers struggled with the "works on my machine" problem due to conflicting operating system library versions. A Dockerfile packages the code, runtime, system tools, and libraries together, guaranteeing identical behavior everywhere.

### 3. Why it is Important
It is the standard unit of software deployment in modern cloud architecture. Images are pushed to registries (like Docker Hub or AWS ECR) and pulled for scaling.
- Fits in: Container application packaging.

### 4. Real World Analogy
**Recipe vs Cake**:
- **Dockerfile = Cake Recipe**: A text document detailing instructions (take flour, add eggs, bake at 350F).
- **Docker Image = Frozen Cake**: A read-only snapshot of the baked cake. You can distribute this frozen cake to shops worldwide.
- **Docker Container = Eating the Cake**: Defrosting the cake and eating it. You can spin up as many copies of the cake as you want from the same image template.

### 5. Real World Example
- A Node.js developer writes a Dockerfile containing: download Node.js Alpine base, copy local package.json, run npm install, expose port 3000, run npm start.

### 6. Architecture Diagram
```
[ Dockerfile ] ──(docker build)──► [ Docker Image ] ──(docker run)──► [ Container Instance ]
```

### 7. Working Step by Step (Image Layers)
1. **Base Image**: Read the `FROM` instruction (e.g. Ubuntu) as Layer 1.
2. **Commands**: Read `RUN` instruction (e.g. install packages) to create Layer 2.
3. **Copy Files**: Read `COPY` instruction (e.g. copy code) to create Layer 3.
4. Each instruction creates a read-only layer cache. If files don't change, Docker reuses cached layers to speed up builds.
5. **Entrypoint**: `CMD` defines the default executable process to launch when container boots.

### 8. Advantages
- Build caching (super fast builds on code updates).
- Lightweight footprint (reuses common base layers).
- Infrastructure as code (version control the Dockerfile alongside code).

### 9. Disadvantages
- Large image sizes if base images are not chosen carefully.
- Misconfiguring layers can leave security secrets stored permanently inside read-only caches.

### 10. Interview Explanation
"A Dockerfile is a configuration script used to build Docker Images. It executes instructions sequentially, where each command (FROM, RUN, COPY) generates a read-only layer. The build output is a lightweight, immutable image template containing everything the application needs to run."

### 11. Frequently Asked Interview Questions
1. *What is the difference between CMD and ENTRYPOINT?*
   - `ENTRYPOINT` sets the command that will always run when the container starts. `CMD` provides default arguments that can be overridden by the command line interface when launching the container.
2. *What is a Multi-stage build?*
   - A method using multiple `FROM` instructions in a single Dockerfile to separate the build environment (compilers, dependencies) from the final execution environment, shrinking image sizes.
3. *Why should you put COPY package.json before COPY .?*
   - To leverage Docker's build cache. If dependencies haven't changed, Docker reuses the cached output of `npm install`, avoiding slow redownloads.
4. *What is Docker Hub?*
   - A public registry hosting prebuilt official Docker images (Node, Python, Nginx).
5. *Explain Image Layers.*
   - Read-only filesystem modifications stacked on top of each other. The final container adds a temporary writeable layer on top.
6. *What does the `.dockerignore` file do?*
   - Prevents local files (like node_modules, logs, env files) from being copied into the Docker image, shrinking build sizes and protecting secrets.
7. *How do you reduce Docker image size?*
   - Use Alpine or distroless base images, combine RUN commands (using `&&`), and use multi-stage builds.
8. *What is an alpine image?*
   - A lightweight Linux distribution (based on musl libc and busybox) measuring only ~5MB in size.
9. *What happens to files inside a container when it is deleted?*
   - Any modifications made inside the container's writeable layer are lost permanently, unless saved in Volumes.
10. *Define Docker host.*
    - The physical or virtual machine running the Docker daemon.

### 12. Common Mistakes
- Storing API keys or DB passwords inside Dockerfile `ENV` variables. These variables are visible to anyone who pulls the image.

### 13. Best Practices
- Run applications inside containers as a non-root user (using the `USER` instruction) to prevent host access exploits.

### 14. Hands-on Lab
- Write a Dockerfile for a Python API, build the image, and run it locally.

### 15. Commands
- `docker build -t my-app:v1 .` (Build image from local Dockerfile)
- `docker run -d -p 8080:8000 my-app:v1` (Run container in background mapping port 8888 -> 8000)
- `docker images` (List local images)

### 16. Code Examples
```dockerfile
# Multi-stage Dockerfile for a Go API application
# Stage 1: Build binary
FROM golang:1.20-alpine AS builder
WORKDIR /app
COPY go.mod go.sum ./
RUN go mod download
COPY . .
RUN CGO_ENABLED=0 GOOS=linux go build -o main .

# Stage 2: Final minimal run environment
FROM alpine:3.18
WORKDIR /root/
COPY --from=builder /app/main .
EXPOSE 8080
CMD ["./main"]
```

### 17. Visual Memory Tricks
- **D-I-C**: **D**ockerfile -> **I**mage -> **C**ontainer (Developers Inspire Code).

### 18. MCQs
1. Which Dockerfile instruction defines the default starting command?
   - A) RUN
   - B) CMD (Correct)
   - C) EXPOSE
2. How do you copy files from a build stage to a final stage?
   - A) COPY --from (Correct)
   - B) ADD
   - C) RUN cp

### 19. Practical Scenario Questions
- *Scenario*: A developer updates a line of CSS, but building the Docker image takes 10 minutes because it runs `npm install` from scratch. How do you fix the Dockerfile?
  - *Answer*: Separate dependency copies. Copy `package.json` first, run `npm install`, then copy the rest of the source code. This caches the dependency layer.

### 20. Summary
- **Key Points**: Dockerfiles compile code and system libraries into immutable Images. CMD sets entry commands. Layer caches speed up builds.
- **Cheat Sheet**: Use alpine/distroless. Cache dependencies. Run as non-root.

---

## 2. Docker Volumes & Data Persistence

### 1. Definition
Docker Volumes are directory mapping abstractions that bypass the container's temporary filesystem to persist data directly on the host machine.

### 2. Why it Exists
By design, containers are ephemeral (temporary). If a database container crashes or is updated, all its data is deleted. Volumes keep data separate from the container lifecycles.

### 3. Why it is Important
Crucial for databases, file storage, and cache servers.
- Fits in: Storage management.

### 4. Real World Analogy
**External Hard Drive**: If you rent a computer (container) to write a report, you plug in your USB flash drive (Volume) to save your work. When you return the computer, your data is safe on the flash drive in your pocket.

### 5. Real World Example
- Running a **PostgreSQL** container and mapping its data folder `/var/lib/postgresql/data` to a Docker Volume named `pg_data`.

### 6. Architecture Diagram
```
+------------------------------------+
|  Docker Host                       |
|  [ Host Directory: /var/lib/docker]|
|         |                          |
|         v (Volume Mount)           |
|  +------v-----------------------+  |
|  | Container                    |  |
|  | - App Code                   |  |
|  | - Writeable path: /app/data  |  |
|  +------------------------------+  |
+------------------------------------+
```

### 7. Working Step by Step
1. Create a Docker Volume using the CLI.
2. Launch a container using the `-v` or `--mount` flag.
3. The container's target directory is mapped directly to the host's protected Docker storage directory.
4. Any writes inside the container's mapped path write directly to the host.
5. If the container is deleted, the data folder on the host remains unchanged.
6. A new container can mount the same volume to resume work.

### 8. Advantages
- Data survives container destruction.
- Faster disk read/write performance than container storage layers.
- Share volumes among multiple concurrent containers.

### 9. Disadvantages
- Bind mounts rely on the host's directory structure, breaking absolute container portability if the host path is missing.

### 10. Interview Explanation
"Docker containers are ephemeral, meaning their internal state is lost upon deletion. To persist data, we use Volumes. Docker Volumes are managed directories on the host filesystem mapped into the container, ensuring that data like database files survive container updates."

### 11. Frequently Asked Interview Questions
1. *Difference between a Volume and a Bind Mount?*
   - **Volume**: Managed entirely by Docker in host storage (`/var/lib/docker/volumes`). Safe from host interference. **Bind Mount**: Maps any arbitrary folder on the host (e.g. `/home/user/code`) into the container.
2. *How do you share a volume between two containers?*
   - Mount the same named volume to both containers during launch.
3. *What is a Named Volume vs Anonymous Volume?*
   - **Named Volume**: You assign a name during creation (e.g., `db_data`). **Anonymous**: Docker assigns a random hash name. Deleted automatically if container runs with `--rm` flag.
4. *What happens to data on the host when a container is deleted?*
   - The data in the volume is preserved on the host. It is not deleted.
5. *How do you delete unused volumes?*
   - Run `docker volume prune` to clear all orphaned volumes.
6. *Where are volumes physically stored on Linux hosts?*
   - Under `/var/lib/docker/volumes/`.
7. *Can you mount a single file as a volume?*
   - Yes, using bind mounts (e.g., mapping a local `nginx.conf` file into the container).
8. *What does the `ro` flag mean in mounts?*
   - Read-only. The container can read files from the mount but cannot modify them.
9. *What is tmpfs mount?*
   - A mount stored in host system memory (RAM), never written to disk (useful for high-speed temporary secrets).
10. *Define backup of Docker Volume.*
    - Copying host volume directory data using standard tar/zip tools to back up application data.

### 12. Common Mistakes
- Modifying files inside managed Docker volume directories directly from the host terminal, which can cause file permission synchronization bugs.

### 13. Best Practices
- Always use Named Volumes for databases. Use Bind Mounts for local development environments to sync live code updates.

### 14. Hands-on Lab
- Start a MySQL container with a named volume, create a database, delete the container, spin up a new container, and verify the data exists.

### 15. Commands
- `docker volume create my-vol` (Create volume)
- `docker volume ls` (List volumes)
- `docker run -d -v my-vol:/data alpine` (Mount volume)

### 16. Code Examples
```yaml
# Docker Compose showing persistent DB volume config
version: '3.8'
services:
  db:
    image: postgres:15
    environment:
      POSTGRES_PASSWORD: mysecretpassword
    volumes:
      - pgdata:/var/lib/postgresql/data

volumes:
  pgdata: # Named volume definition
```

### 17. Visual Memory Tricks
- **Volume = Vault**: Keeps data locked away safely even if the house (container) gets demolished.

### 18. MCQs
1. Where does Docker store managed volumes?
   - A) /tmp
   - B) /var/lib/docker/volumes (Correct)
   - C) /opt
2. What mount type links an arbitrary host path directly to a container?
   - A) Volume
   - B) Bind Mount (Correct)
   - C) tmpfs

### 19. Practical Scenario Questions
- *Scenario*: A database container is updated from MySQL 5.7 to 8.0. How do you prevent database records from being deleted during the migration?
  - *Answer*: Run the MySQL containers with their data path mapped to a named Docker volume. Delete the 5.7 container and point the new 8.0 container to the same volume.

### 20. Summary
- **Key Points**: Containers are ephemeral. Volumes provide data persistence. Volumes are managed by Docker; Bind Mounts map arbitrary host paths.
- **Cheat Sheet**: Database = Volume. Local Hot-Reload = Bind Mount.
