# Module 3 — AWS Deep Dive

This module provides an in-depth guide to Amazon Web Services (AWS) compute, storage, database, networking, security, and monitoring services.

---

## 1. Amazon EC2 (Elastic Compute Cloud)

### 1. Definition
Amazon EC2 provides resizable virtual servers, known as Instances, running in AWS's data centers.

### 2. Why it Exists
It replaces physical servers, allowing users to rent server capacity on-demand and configure operating systems, storage, and networking packages within minutes.

### 3. Why it is Important
EC2 is the backbone of AWS compute infrastructure. Almost every service runs on top of virtual instances under the hood.
- Pricing: Billed per-second based on instance type, CPU, RAM, and region.

### 4. Real World Analogy
**Renting a Car**: Instead of buying a car and paying for maintenance, garage storage, and registration, you rent a car for the exact duration of your trip. You choose the car class (e.g. compact, SUV, truck) depending on your needs.

### 5. Real World Example
- **Airbnb** runs their application services on fleets of EC2 instances to handle user searches and host listings.

### 6. Architecture Diagram
```
        [ Client Request ]
                |
                v (Port 80/443)
      [ AWS VPC Security Group ]
                |
                v (Allowed)
+---------------------------------------+
|  AWS EC2 Instance                     |
|  - Guest OS (Linux/Windows)           |
|  - EBS Storage (Virtual Disk Root)    |
|  - Private IP & Elastic IP (Public)   |
+---------------------------------------+
```

### 7. Working Step by Step
1. Select an Amazon Machine Image (AMI) containing the base operating system.
2. Select an Instance Type (e.g. `t2.micro` for general utility, `c5.large` for compute-heavy tasks).
3. Configure networking (VPC, Subnet) and security rules (Security Groups).
4. Launch the instance. AWS locates a physical host, maps virtual hardware slices, and boots the guest OS.
5. Access the instance via SSH (Linux) or RDP (Windows) using SSH key pairs.

### 8. Advantages
- Total administrative access (root privileges).
- Elastic scale (easily change instance type size).
- Massive variety of hardware choices (including GPU and high-memory instances).

### 9. Disadvantages
- Administrative overhead (must manually update OS, patch security bugs, configure backups).
- Billed even if idle (if instance status is "running", billing continues regardless of CPU usage).

### 10. Interview Explanation
"Amazon EC2 is an Infrastructure as a Service (IaaS) offering that provides secure, resizable compute capacity in the cloud. You configure the OS, run applications, manage firewalls via Security Groups, and pay for the capacity consumed based on instance types and running hours."

### 11. Frequently Asked Interview Questions
1. *What is an AMI (Amazon Machine Image)?*
   - A template containing OS, software configuration, and application packages used to boot an EC2 instance.
2. *Difference between Spot, On-Demand, and Reserved instances?*
   - **On-Demand**: Fixed price per second, no commitment. **Reserved**: Commitment for 1-3 years for up to 72% discount. **Spot**: Rent spare capacity at up to 90% discount, but can be terminated by AWS with a 2-minute warning.
3. *What is a Security Group in EC2?*
   - A stateful virtual firewall that controls inbound and outbound traffic to an instance.
4. *What is the difference between stopping and terminating an instance?*
   - Stopping pauses the instance (keeps data on EBS, stops compute billing). Terminating deletes the instance and its EBS root volume permanently.
5. *What are EC2 Instance Metadata and User Data?*
   - **User Data**: A script executed once during the first boot of the instance. **Metadata**: Info about the running instance accessible via a local IP (`http://169.254.169.254/latest/meta-data/`).
6. *What is an Elastic IP address?*
   - A static, public IPv4 address that can be remapped to different instances within an AWS account.
7. *How do you choose between general-purpose (T/M) and compute-optimized (C) instances?*
   - Use T/M for web apps and code repositories. Use C for CPU-heavy tasks like machine learning inference or video encoding.
8. *What is a placement group?*
   - A logical grouping of instances to control physical placement (Cluster: low latency; Spread: high availability; Partition: group isolation).
9. *What is a Key Pair?*
   - A public/private key system used to securely authenticate SSH connections to EC2.
10. *Define EBS (Elastic Block Store).*
    - A block-level storage volume that acts as a virtual hard disk for EC2 instances.

### 12. Common Mistakes
- Storing important data directly in local ephemeral instance store disks. These disks wipe clean if the instance stops or fails. Use EBS instead.

### 13. Best Practices
- Keep security groups locked down to specific source IPs (especially port 22 for SSH). Never allow `0.0.0.0/0` on port 22.

### 14. Hands-on Lab
- Use the AWS CLI to launch a free-tier `t2.micro` instance running Amazon Linux.

### 15. Commands
- `aws ec2 run-instances --image-id ami-xxxxxx --instance-type t2.micro --key-name MyKeyPair` (Launch instance)
- `aws ec2 describe-instances --filters "Name=instance-state-name,Values=running"` (List active instances)

### 16. Code Examples
```bash
# Script to install Apache web server automatically via EC2 User Data
#!/bin/bash
yum update -y
yum install -y httpd
systemctl start httpd
systemctl enable httpd
echo "<h1>Hello from AWS EC2 Instance</h1>" > /var/www/html/index.html
```

### 17. Visual Memory Tricks
- **EC2 = Elastic Compute Cloud**: Two C's = **E**lastic **C**ompute **C**loud = Renting VM servers.

### 18. MCQs
1. Which EC2 pricing model is cheapest but offers no guarantee of availability?
   - A) Reserved Instances
   - B) Spot Instances (Correct)
   - C) On-Demand
2. How do you retrieve an instance's public IP from inside the running instance?
   - A) Read the file `/etc/ip`
   - B) Query `http://169.254.169.254/latest/meta-data/public-ipv4` (Correct)
   - C) Run `ipconfig /all`

### 19. Practical Scenario Questions
- *Scenario*: A company has a batch processing job that runs for 4 hours every night and can survive interruptions. How can they minimize AWS compute costs?
  - *Answer*: Run the workload on Spot Instances to save up to 90% compared to On-Demand rates.

### 20. Summary
- **Key Points**: Rentable virtual servers. Highly customizable. Stateful security groups.
- **Cheat Sheet**: Spot = Cheap/Interrupted. Reserved = Commited/Discounted. On-Demand = Flexible/Full price.

---

## 2. Amazon S3 (Simple Storage Service)

### 1. Definition
Amazon S3 is an object storage service offering industry-leading scalability, data availability, security, and performance.

### 2. Why it Exists
Traditional block storage (hard drives) is expensive and hard to share across multiple servers. S3 stores files as "objects" in a flat structure, making it ideal for hosting images, videos, logs, and backups globally.

### 3. Why it is Important
It provides virtually infinite storage capacity. You do not define disk size; you just upload files and pay for the storage space used.
- Pricing: Billed per GB stored per month, plus data retrieval and transfer out costs.

### 4. Real World Analogy
**Valet Parking**: Instead of driving your car into a complex multi-level garage and remembering the coordinates (block storage), you give your key to a valet. They hand you a ticket (URL key). When you return the ticket, they fetch your car.

### 5. Real World Example
- **Netflix** stores all its raw video assets and movie files in S3 buckets before processing them for streaming.

### 6. Architecture Diagram
```
[ User Upload ] ──► (HTTPS API Put) ──► [ S3 Bucket (Unique Name) ]
                                          ├── Object: video.mp4 (Data payload)
                                          ├── Key: /movies/video.mp4 (Path identifier)
                                          └── Metadata: Content-Type: video/mp4
```

### 7. Working Step by Step
1. Create a Bucket. The bucket name must be globally unique across all AWS accounts.
2. Select a Region. Files will be physically stored in the chosen region.
3. Upload objects (files up to 5 TB).
4. S3 copies the data across multiple physical devices in different AZs automatically for 11 nines of durability.
5. Retrieve objects via HTTP request (e.g. `https://bucket-name.s3.amazonaws.com/file-name.jpg`).

### 8. Advantages
- 11 Nines of Durability (99.999999999% guarantee that files won't be lost).
- Static Website Hosting capability.
- Lifecycle policies to automatically move old files to cheaper storage classes (like Glacier).

### 9. Disadvantages
- Object-level storage (you cannot run an OS or write database files directly onto S3; you must upload/replace entire files).
- Latency (slower read/write access times compared to local block storage EBS).

### 10. Interview Explanation
"Amazon S3 is a serverless object storage service that stores files as key-value pairs. It provides high durability by replicating data across multiple AZs. It is managed via REST API calls, supports bucket policies for access control, and is ideal for backups, static web hosting, and large data lakes."

### 11. Frequently Asked Interview Questions
1. *What is Durability vs Availability in S3?*
   - Durability is the guarantee that your data won't be lost (S3 offers 99.999999999%). Availability is the guarantee that you can access your data when you need it (S3 Standard offers 99.99%).
2. *What are the different S3 Storage Classes?*
   - **S3 Standard**: Active data. **S3 IA (Infrequent Access)**: Accessed less but needs instant retrieval. **S3 One Zone-IA**: Cheaper but stored in single AZ. **S3 Glacier**: Archive storage with retrieval times from minutes to hours.
3. *What is an S3 Bucket Policy?*
   - A resource-based IAM policy written in JSON to control public or private access to objects inside a bucket.
4. *How do you host a static website on S3?*
   - Enable "Static Website Hosting" in bucket properties, configure index and error documents, and make the bucket policy public-read.
5. *What is S3 Versioning?*
   - A setting that keeps multiple variants of an object in the same bucket, protecting against accidental deletions or overwrites.
6. *What is S3 Transfer Acceleration?*
   - A feature that uses AWS Edge Locations to route uploads over the AWS global network for faster uploads.
7. *How large can a single S3 object be?*
   - 5 Terabytes.
8. *What is S3 Object Lock?*
   - A feature that prevents objects from being deleted or overwritten for a specific retention period (WORM: Write Once, Read Many).
9. *What is S3 CORS?*
   - Configuration that allows web applications running in other domains to load assets from your S3 bucket.
10. *Define prefix in S3.*
    - A string identifier that mimics folder structures in S3 (e.g. `/uploads/images/` is a prefix, not a physical directory).

### 12. Common Mistakes
- Leaving an S3 bucket policy completely open to the public (`Principal: "*"`) when storing sensitive customer data, leading to breaches.

### 13. Best Practices
- Enable S3 Block Public Access at the account level unless the bucket is explicitly used for public assets. Use Versioning for backup buckets.

### 14. Hands-on Lab
- Write an AWS CLI script to create a private bucket and upload a text file.

### 15. Commands
- `aws s3 mb s3://my-unique-bucket-name-1992` (Make Bucket)
- `aws s3 cp my-file.txt s3://my-unique-bucket-name-1992/` (Copy file to bucket)

### 16. Code Examples
```json
// Bucket Policy that allows read-only access to public files
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Sid": "PublicReadGetObject",
      "Effect": "Allow",
      "Principal": "*",
      "Action": "s3:GetObject",
      "Resource": "arn:aws:s3:::my-unique-bucket-name-1992/*"
    }
  ]
}
```

### 17. Visual Memory Tricks
- **S3 = Simple Storage Service**: 3 S's = **S**imple **S**torage **S**ervice = Files storage.

### 18. MCQs
1. What is the maximum object size supported by S3?
   - A) 5 GB
   - B) 5 TB (Correct)
   - C) Unlimited
2. Which storage class has retrieval times of hours but is the cheapest?
   - A) S3 Standard
   - B) S3 Intelligent-Tiering
   - C) S3 Glacier (Correct)

### 19. Practical Scenario Questions
- *Scenario*: A web app stores user profile photos. Users complain that photos load slowly from another country. How should you design the storage?
  - *Answer*: Store photos in S3 and configure a CloudFront CDN distribution using the S3 bucket as origin to cache photos at Edge Locations globally.

### 20. Summary
- **Key Points**: Unlimited object storage. Structured by Key-Value. Replicated across AZs. Highly durable.
- **Cheat Sheet**: Static Site = S3. Heavy Logs = S3 IA. Archive = Glacier.

---

## 3. Amazon VPC (Virtual Private Cloud)

### 1. Definition
Amazon VPC lets you provision a logically isolated section of the AWS Cloud where you can launch AWS resources in a virtual network that you define.

### 2. Why it Exists
To provide secure isolation. You don't want other AWS customers accessing your servers or databases. A VPC gives you complete control over subnets, IP ranges, and gateways.

### 3. Why it is Important
VPC is the network foundation of AWS. All compute and database resources must reside in a VPC subnet to communicate.
- Fits in: Networking and isolation security.

### 4. Real World Analogy
**Gated Community**: AWS is a massive city. A VPC is a gated community within the city. You own the land inside, build fences (Security Groups/NACLs), decide who enters the gate (Internet Gateway), and establish internal streets (Subnets/Route Tables).

### 5. Real World Example
- **Capital One** runs banking databases inside private VPC subnets with no direct route to the internet, securing financial records.

### 6. Architecture Diagram
```
+-------------------------------------------------------------+
| AWS VPC (CIDR: 10.0.0.0/16)                                 |
|  [Internet Gateway] (IGW)                                   |
|        |                                                    |
|  +-----v----------------------+  +-----------------------+  |
|  | Public Subnet (10.0.1.0/24)|  | Private Subnet        |  |
|  | Route: 0.0.0.0/0 -> IGW    |  | Route: Local only     |  |
|  | [EC2 Web Server]           |  | [RDS Database]        |  |
|  +----------------------------+  +-----------------------+  |
+-------------------------------------------------------------+
```

### 7. Working Step by Step
1. Create a VPC and define an IP address range using CIDR notation (e.g. `10.0.0.0/16`).
2. Create Subnets inside Availability Zones. Assign subset IP ranges (e.g. Public: `10.0.1.0/24`, Private: `10.0.2.0/24`).
3. Attach an Internet Gateway (IGW) to the VPC to allow traffic to and from the internet.
4. Configure Route Tables. Route public subnet traffic to the IGW. Route private subnet traffic locally or to a NAT Gateway.
5. Deploy resources (like EC2) inside the subnets.

### 8. Advantages
- Network-level isolation and security.
- Custom routing control.
- Support for VPN connections to extend corporate on-premises networks to AWS.

### 9. Disadvantages
- Designing CIDR configurations requires networking knowledge (preventing overlapping IP blocks).
- NAT Gateway hourly costs can be expensive for small startups.

### 10. Interview Explanation
"Amazon VPC is a virtual network dedicated to your AWS account. It is isolated from other virtual networks. You control the IP address range, subnets, route tables, network gateways, and security policies using Security Groups and Network ACLs to build multi-tier secure applications."

### 11. Frequently Asked Interview Questions
1. *Difference between a Public Subnet and a Private Subnet?*
   - A public subnet has a route table entry pointing to an Internet Gateway (`0.0.0.0/0 -> IGW`). A private subnet does not.
2. *What is a NAT Gateway?*
   - Network Address Translation Gateway. Placed in a public subnet, it allows instances in a private subnet to connect to the internet (e.g. for updates) while blocking the internet from initiating direct connections to them.
3. *What is the difference between Security Groups and Network ACLs (NACLs)?*
   - **Security Groups**: Stateful (rules apply to inbound and outbound automatically), operate at the instance level, allow rules only. **NACLs**: Stateless (must define inbound and outbound explicitly), operate at the subnet level, support allow and deny rules.
4. *How many IP addresses are reserved by AWS in a subnet?*
   - 5 IP addresses (e.g. first 4 and last 1 IPs in a CIDR block).
5. *What is VPC Peering?*
   - A network connection that allows routing traffic between two VPCs privately using private IP addresses.
6. *What is a VPC Endpoint?*
   - A private connection from your VPC to supported AWS services (like S3 or DynamoDB) without going over the public internet.
7. *Explain CIDR.*
   - Classless Inter-Domain Routing. A method for allocating IP addresses and routing routing packets (e.g. `/16` represents 65,536 IPs, `/24` represents 256 IPs).
8. *What is a Route Table?*
   - A set of rules (routes) that determines where network traffic from your subnet or gateway is directed.
9. *What is a Bastion Host?*
   - A secure server in a public subnet used as a proxy to SSH into backend instances located in private subnets.
10. *Define Transit Gateway.*
    - A network transit hub used to interconnect multiple VPCs and on-premises networks.

### 12. Common Mistakes
- Allocating a small CIDR block (like `/28` which has only 16 IPs) for a main VPC, running out of IP addresses quickly as resources scale.

### 13. Best Practices
- Place databases and application backends in Private Subnets. Restrict inbound ports in Security Groups to the absolute minimum needed.

### 14. Hands-on Lab
- Write a Terraform configuration script to deploy a VPC with one public subnet.

### 15. Commands
- `aws ec2 create-vpc --cidr-block 10.0.0.0/16` (Create VPC)
- `aws ec2 create-subnet --vpc-id vpc-xxxxxx --cidr-block 10.0.1.0/24` (Create Subnet)

### 16. Code Examples
```tf
# Terraform code to provision a basic AWS VPC
resource "aws_vpc" "main" {
  cidr_block       = "10.0.0.0/16"
  instance_tenancy = "default"
  tags = {
    Name = "main-vpc"
  }
}
```

### 17. Visual Memory Tricks
- **VPC = Virtual Private Cage**: Keeps your servers locked inside your network boundaries.

### 18. MCQs
1. Which security layer is stateless?
   - A) Security Group
   - B) Network ACL (Correct)
   - C) IAM Policy
2. What is needed for a private subnet resource to download internet packages?
   - A) Internet Gateway
   - B) NAT Gateway (Correct)
   - C) VPC Peering

### 19. Practical Scenario Questions
- *Scenario*: A database server in a private subnet must download database software patches from the internet. How should the network routes be configured?
  - *Answer*: Create a NAT Gateway in the public subnet. Configure the private subnet's route table to route external traffic (`0.0.0.0/0`) through the NAT Gateway.

### 20. Summary
- **Key Points**: Custom network boundaries. Isolated subnets. State/Stateless firewalls (Security Groups / NACLs). NAT Gateway for private outbounds.
- **Cheat Sheet**: Public = route to IGW. Private = no route to IGW. NAT = private internet outbound.
