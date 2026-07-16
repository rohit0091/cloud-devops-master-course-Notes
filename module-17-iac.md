# Module 17 — Infrastructure as Code (IaC)

This module covers Infrastructure as Code principles, configuration management vs provisioning tools, Terraform architecture, state file management, and syntax configurations.

---

## 1. Terraform & State Files (Declarative vs Imperative IaC)

### 1. Definition
- **Infrastructure as Code (IaC)**: Managing and provisioning computer data centers through machine-readable definition files, rather than physical hardware configuration or interactive configuration tools.
- **Terraform**: An open-source, declarative IaC software tool created by HashiCorp that enables users to define cloud resources in a human-readable configuration language (HCL).
- **Terraform State File**: A JSON document (`terraform.tfstate`) that maps real-world cloud resources to your configuration files, tracking metadata and resource IDs.

### 2. Why it Exists
Manually clicking buttons in the AWS Console to create servers, networks, and databases is slow, cannot be version-controlled, and leads to human errors ("configuration drift"). IaC automates and standardizes infrastructure setups.

### 3. Why it is Important
Enables engineers to build, version, and destroy complete multi-cloud infrastructure environments using simple, repeatable commands.
- Fits in: Infrastructure provisioning.

### 4. Real World Analogy
- **Declarative IaC (Terraform) = Architect Blueprint**: You draw a blueprint showing: "There must be a 3-bedroom house with a red roof here." You give the blueprint to builders. They build it. If a storm destroys the roof, they look at the blueprint and rebuild a red roof.
- **Imperative IaC (Shell Scripting) = Recipe Directions**: A list of commands: "Walk 10 steps, lay a brick, mix cement, build walls, paint roof red." If a wall falls, re-running the script from the start can cause errors (e.g. attempting to build walls on top of existing ones).
- **Terraform State File = Land Registry Ledger**: A document tracking which parts of the blueprint have actually been built on the ground, keeping your blueprint in sync with reality.

### 5. Real World Example
- An SRE team uses Terraform to launch identical Staging, Testing, and Production environments across different AWS regions using variable files.

### 6. Architecture Diagram
```
[ Terraform Config (.tf) ] ──► [ Terraform Engine ] ◄──► [ State File (JSON) ]
                                      │
                                      v (API Calls)
                            [ Cloud Provider: AWS/Azure ]
```

### 7. Working Step by Step (Terraform Lifecycle)
1. **Write**: Dev writes configuration files (e.g., `main.tf`) in HashiCorp Configuration Language (HCL).
2. **Init**: Run `terraform init` to download provider plugins (like AWS API connectors).
3. **Plan**: Run `terraform plan`. Terraform compares files against the local state file, generating a preview of changes (Add, Change, Destroy).
4. **Apply**: Run `terraform apply`. Terraform makes API calls to AWS to create resources, and writes the resulting infrastructure IDs back to `terraform.tfstate`.
5. **State Sync**: Subsequent plans read the state file to check if any resources were modified manually in the AWS Console (detecting configuration drift).

### 8. Advantages
- Declarative model (define the target state, let the tool handle the "how").
- Multi-cloud compatibility (provision AWS, GCP, and Azure using one tool).
- Dry-run capability (`terraform plan`) to preview changes safely.

### 9. Disadvantages
- State file management is critical (leaking the state file can expose database passwords stored in plain text).
- Multiple developers modifying state simultaneously can corrupt it if remote locking is not configured.

### 10. Interview Explanation
"Terraform is a declarative Infrastructure as Code tool that manages resources by matching configuration files with real-world infrastructure using a State File. Unlike imperative tools which list execution commands, Terraform lets you define the final state, generating execution plans automatically. We use remote state storage with locking to collaborate safely."

### 11. Frequently Asked Interview Questions
1. *What is Declarative vs Imperative IaC?*
   - Declarative defines the final target state (e.g., Terraform). Imperative defines the exact sequence of steps to reach that state (e.g., Ansible, Bash scripts).
2. *Why is the State File important?*
   - It acts as Terraform's database, tracking resource mappings, metadata, and dependencies, enabling calculation of resource changes during plans.
3. *What is State Locking, and why is it needed?*
   - A mechanism preventing two team members from running `terraform apply` at the same time, preventing state corruption. Commonly implemented using AWS S3 (storage) and DynamoDB (locking).
4. *What is Configuration Drift?*
   - A situation where the actual cloud resources differ from the IaC configuration files due to manual modifications made in the web console.
5. *What does `terraform destroy` do?*
   - Deletes all infrastructure resources managed by the current Terraform configuration directory.
6. *What are Terraform Modules?*
   - Reusable container components grouping multiple resources together to enforce design standards (e.g., a standard VPC module).
7. *Difference between Terraform and Ansible?*
   - **Terraform**: Infrastructure provisioning tool (deploys VM, VPC, subnet). **Ansible**: Configuration management tool (installs packages, updates OS, deploys code inside running VMs).
8. *What is a Provider in Terraform?*
   - A plugin that translates HCL resource definitions into API calls for specific platforms (like AWS, Azure, Docker).
9. *What is `terraform import` used for?*
   - To bring existing, manually created cloud resources under Terraform management without recreating them.
10. *Define resource dependency.*
    - The order of resource creation (e.g. Terraform must create the VPC before it can create a Subnet inside it, handled automatically via resource links).

### 12. Common Mistakes
- Committing the `terraform.tfstate` file directly into public Git repositories. It contains sensitive passwords and credentials in plain text. Use remote state backends.

### 13. Best Practices
- Store state files in a secure remote backend (like S3) with encryption enabled at rest. Always write modular infrastructure blocks.

### 14. Hands-on Lab
- Write a basic Terraform config file to deploy an S3 bucket, apply it, and inspect the state file.

### 15. Commands
- `terraform init` (Initialize directory)
- `terraform plan` (Preview modifications)
- `terraform apply` (Execute plans)
- `terraform destroy` (Delete resources)

### 16. Code Examples
```tf
# Basic Terraform configuration (main.tf)
terraform {
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 4.0"
    }
  }
}

provider "aws" {
  region = "us-east-1"
}

# Provision an S3 bucket
resource "aws_s3_bucket" "my_bucket" {
  bucket = "rohit-master-course-bucket-1992"
  
  tags = {
    Environment = "Dev"
    CreatedBy   = "Terraform"
  }
}
```

### 17. Visual Memory Tricks
- **Plan-Apply-Destroy**: **P**review -> **A**ctivate -> **D**emolish (Like a building project).

### 18. MCQs
1. Which command initializes provider plugins in a Terraform directory?
   - A) terraform plan
   - B) terraform init (Correct)
   - C) terraform apply
2. Where should the state file be stored for team collaboration?
   - A) Local Git Repo
   - B) Remote secure backend with locking (Correct)
   - C) Developer desktop

### 19. Practical Scenario Questions
- *Scenario*: A developer accidentally deletes an EC2 instance manually from the AWS Console. How does Terraform handle this on the next run?
  - *Answer*: When `terraform plan` is run, Terraform refreshes state, notices the physical instance is missing (configuration drift), and plans to recreate it automatically to restore the desired state.

### 20. Summary
- **Key Points**: Terraform is declarative. State file maps HCL to cloud resources. Run init -> plan -> apply.
- **Cheat Sheet**: `init` = download plugins. `plan` = dry run. `apply` = execute. State = private database.
