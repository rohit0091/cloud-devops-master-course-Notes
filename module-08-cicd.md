# Module 8 — CI/CD Automation

This module covers Continuous Integration (CI), Continuous Deployment (CD), automated delivery pipelines, deployment strategies, and orchestration platforms.

---

## 1. CI/CD Pipelines & Deployment Strategies (Blue-Green / Canary)

### 1. Definition
- **Continuous Integration (CI)**: Automating the building, testing, and merging of code changes into a shared repository.
- **Continuous Deployment (CD)**: Automatically releasing successfully tested code changes directly to production servers.
- **Blue-Green Deployment**: A release strategy using two identical production environments (Blue is active, Green is idle/new version) to achieve zero downtime during rollouts.
- **Canary Deployment**: Releasing code updates to a small fraction of users first (e.g. 5%) to verify stability before rolling it out to everyone.

### 2. Why it Exists
Historically, software deployments were manual, slow, error-prone events. Developers committed code monthly, leading to huge integration conflicts ("merge hell") and outages. CI/CD automates this process to push updates multiple times a day safely.

### 3. Why it is Important
Accelerates feature delivery, reduces manual errors, and guarantees that every change is validated by automated test suites.
- Fits in: DevOps automation lifecycle.

### 4. Real World Analogy
- **CI/CD = Car Factory Assembly Line**: Robots automatically weld, paint, and crash-test every car chassis (code commit) as it moves down the line. Only cars that pass all inspections roll out to the dealership.
- **Blue-Green = Switching Bridges**: You build a new bridge (Green) next to the old active one (Blue). Once the new bridge is inspected and ready, you reroute traffic to the new bridge in seconds. If it collapses, you immediately steer cars back onto the old bridge (Blue).
- **Canary = Coal Mine Canary**: Miners carry a canary bird into deep mines. If toxic gas levels rise, the bird reacts first, warning miners to exit before the gas hurts them. Similarly, a canary deployment exposes bugs to only 5% of traffic first.

### 5. Real World Example
- **Netflix** uses automated canary analysis. When deploying updates, they spin up a small group of instances running the new version alongside the old version, routing a fraction of user requests and evaluating performance metrics.

### 6. Architecture Diagram
```
Blue-Green Deployment:
                   [ Load Balancer (Router) ]
                          /          \
                  (Active)            (Idle / Testing)
                         /            \
        [ Blue Environment (v1.0) ]  [ Green Environment (v2.0) ]

Canary Deployment:
                    [ Load Balancer ]
                       /         \
                 (95% traffic)  (5% traffic)
                     /             \
        [ Production Nodes v1.0 ]  [ Canary Nodes v2.0 ]
```

### 7. Working Step by Step (CI/CD Flow)
1. **Developer Push**: Dev pushes code to GitHub branch.
2. **CI Trigger**: GitHub Actions starts a runner container.
3. **Build & Test**: Runner runs linter, compiles binary, and runs unit tests.
4. **Artifact Build**: If tests pass, runner builds a Docker image and pushes it to a container registry.
5. **CD Release**: Deployment engine triggers a rollout.
6. **Blue-Green Switch**: Deploy v2 to the idle Green group -> verify health -> route load balancer to Green -> set Blue to idle.
7. **Rollback**: If error rate spikes, instantly switch load balancer back to Blue.

### 8. Advantages
- Zero-downtime deployments.
- Fast, automated recovery from production bugs.
- Consistent, reproducible build states.

### 9. Disadvantages
- High infrastructure cost for Blue-Green (requires double the server capacity during deploy).
- Complexity in database schema migrations (database must support both old and new code versions simultaneously).

### 10. Interview Explanation
"CI/CD is the practice of automating code compilation, testing, and deployment. Continuous Integration ensures code is automatically tested on merge. Continuous Deployment pushes changes to production automatically. To reduce risk, we use Blue-Green deployments to switch traffic instantly between environment groups, or Canary deployments to route a small slice of users to the new version to verify stability."

### 11. Frequently Asked Interview Questions
1. *What is the difference between Continuous Delivery and Continuous Deployment?*
   - Continuous Delivery automatically prepares code for release, requiring a manual button click to deploy. Continuous Deployment deploys every change automatically without manual intervention.
2. *How does Blue-Green deployment handle database schema changes?*
   - By implementing backward-compatible schema changes (e.g. add new columns but do not delete old ones until the v2 deployment is complete).
3. *What is a Canary release, and how do you monitor it?*
   - Deploying updates to a small group of nodes and monitoring error rates, CPU usage, and response latencies against baseline nodes.
4. *What is a webhook in CI/CD?*
   - An HTTP POST notification sent by a repository provider (like GitHub) to trigger a build server (like Jenkins) when code is pushed.
5. *Explain GitOps.*
   - A DevOps practice where Git repositories act as the single source of truth for infrastructure and application configurations (e.g., ArgoCD).
6. *What is a CI/CD Runner/Agent?*
   - A virtual machine or container running the build execution steps defined in the pipeline config.
7. *What is automated rollback?*
   - An automated pipeline action that re-deploys the last known stable build version if monitoring metrics detect anomalies.
8. *What is a build artifact?*
   - The compiled output file (e.g. a jar, zip, or Docker image) generated during the CI stage.
9. *How do lint tests fit into CI?*
   - Linters inspect code syntax and style rules, failing the build early if code style guidelines are violated.
10. *Define pipeline orchestration.*
    - Defining and executing the dependency order of pipeline jobs (e.g., Build first, then Test, then Deploy).

### 12. Common Mistakes
- Pushing secrets (API keys) directly into the code repository. Use GitHub Secrets or environment injection.

### 13. Best Practices
- Keep pipeline runtimes under 10 minutes by caching dependencies. Ensure all code commits are validated by unit tests.

### 14. Hands-on Lab
- Write a GitHub Actions YAML file that runs tests and builds a docker image on every git push.

### 15. Commands
- `git push origin main` (Trigger pipeline hook)
- `docker build -t app:latest .` (CI step command)

### 16. Code Examples
```yaml
# GitHub Actions Pipeline Manifest Example (.github/workflows/deploy.yml)
name: CI/CD Pipeline

on:
  push:
    branches: [ main ]

jobs:
  build-and-test:
    runs-on: ubuntu-latest
    steps:
    - name: Checkout Code
      uses: actions/checkout@v3

    - name: Set up Node.js
      uses: actions/setup-node@v3
      with:
        node-size: '16'
        cache: 'npm'

    - name: Install Dependencies
      run: npm ci

    - name: Run Unit Tests
      run: npm test

    - name: Build Docker Image
      run: |
        docker build -t my-app:${{ github.sha }} .
```

### 17. Visual Memory Tricks
- **Blue-Green = Bridge-Gateway**: Two physical entities.
- **Canary = Care-Alert**: Small bird goes first to test safety.

### 18. MCQs
1. Which pipeline model requires manual approval to release code to production?
   - A) Continuous Integration
   - B) Continuous Delivery (Correct)
   - C) Continuous Deployment
2. Which deployment strategy routes a small percentage of user traffic to a new version?
   - A) Blue-Green
   - B) Rolling Update
   - C) Canary (Correct)

### 19. Practical Scenario Questions
- *Scenario*: A new software update goes live. Immediately, error rates for login API calls spike to 30%. How does a Blue-Green routing setup help resolve this?
  - *Answer*: We instantly update the router or load balancer configuration to point traffic back to the old, active Blue environment, restoring service in seconds.

### 20. Summary
- **Key Points**: CI automates building and testing. CD automates deployment. Blue-Green switches traffic groups. Canary exposes updates slowly.
- **Cheat Sheet**: CI = Test early. CD = Ship fast. Blue-Green = Zero-downtime backup. Canary = Safe test slice.
