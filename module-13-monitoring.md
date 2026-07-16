# Module 13 — Monitoring & Observability

This module covers the core concepts of infrastructure monitoring, the three pillars of observability (logs, metrics, and traces), monitoring tools (Prometheus, Grafana), and logging aggregation (ELK stack).

---

## 1. Logs, Metrics & Traces (The Three Pillars of Observability)

### 1. Definition
Observability is the ability to infer the internal states of a system based on its external outputs. The three pillars are:
- **Logs**: A discrete, chronological record of events that happened inside an application (e.g. error stack traces).
- **Metrics**: Aggregated, numeric measurements representing system behavior over time (e.g. CPU load, memory utilization, request counts).
- **Traces**: A request lifecycle map showing the path and latency of a single request as it travels through a distributed system.

### 2. Why it Exists
When an application is distributed across dozens of microservices, identifying the root cause of a failure becomes difficult. Logs tell you *what* happened, Metrics tell you *when* performance degraded, and Traces tell you *where* latency occurred.

### 3. Why it is Important
Ensures site reliability and facilitates rapid troubleshooting of complex cloud systems.
- Fits in: System stability operations.

### 4. Real World Analogy
**Hospital Patient Monitoring**:
- **Metrics = Heart Rate Monitor**: Numeric readings updated every second showing vital stats. If heart rate spikes (metric alert), a doctor is notified.
- **Logs = Patient Chart**: Notes written by nurses detailing specific events (e.g., "10:15 AM - Patient took medicine").
- **Traces = Contrast Dye Scan**: Dye is injected into a patient's veins to trace blood flow through organs to locate blocks (distributed trace showing request bottleneck).

### 5. Real World Example
- **Uber** uses distributed tracing (Jaeger) to track taxi booking requests as they travel from the customer app through routing, payment, and driver matching microservices.

### 6. Architecture Diagram
```
Observability Stack:
[ User Request ] ──► [ Frontend ] ──► [ Payment Service ] ──► [ DB ]
                          │                 │                  │
                          └───────(Traced via TraceID)─────────┘
                                            │
                                            v
            +───────────────────────────────────────────────────+
            |  Observability Collector                          |
            |  - Metrics (Prometheus): CPU, Request rate        |
            |  - Logs (Elasticsearch): Error stack traces       |
            |  - Traces (Jaeger): Latency graphs                |
            +───────────────────────────────────────────────────+
```

### 7. Working Step by Step (Observability Workflow)
1. **Metrics Collection**: Prometheus scrapes node metrics (e.g. Memory usage) every 15 seconds, storing them in a Time-Series Database (TSDB).
2. **Log Forwarding**: A log shipper (like Filebeat or Fluentd) reads local app log files and sends them to Elasticsearch.
3. **Tracing**: OpenTelemetry library injects a unique `Trace ID` into the incoming request header.
4. **Trace propagation**: The `Trace ID` is forwarded down the call stack to secondary services. Each service reports execution time (span) to a collector.
5. **Dashboarding**: Grafana connects to Prometheus and Elasticsearch to render real-time graphs.
6. **Alerting**: Alertmanager triggers a Slack notification if metric threshold rules are violated.

### 8. Advantages
- Deep visibility into distributed cloud systems.
- Faster MTTR (Mean Time to Resolution) during system incidents.
- Performance tuning based on tracing latency profiles.

### 9. Disadvantages
- High storage cost for massive log data streams.
- CPU/Memory overhead from profiling libraries and agents running on host servers.

### 10. Interview Explanation
"Observability is built on three pillars: Logs, Metrics, and Traces. Logs record specific events, metrics monitor numeric system performance indicators over time, and traces map request execution paths across microservices. We use tools like Prometheus and Grafana for metrics, and the ELK stack for log centralization."

### 11. Frequently Asked Interview Questions
1. *What is a Time-Series Database (TSDB)?*
   - A database optimized for storing numeric data points indexed by timestamps (e.g., Prometheus, InfluxDB).
2. *What is the ELK Stack?*
   - **Elasticsearch** (Search index), **Logstash** (Log parser/shipper), and **Kibana** (Visual log dashboard).
3. *What is the difference between push and pull models in metrics monitoring?*
   - **Push Model**: Servers push metrics to a central collector (e.g. CloudWatch, Datadog). **Pull Model**: The central collector scrapes metrics endpoints exposed by servers (e.g. Prometheus).
4. *What is a Span in distributed tracing?*
   - A single segment of work representing a start time, duration, and metadata inside a distributed trace lifecycle.
5. *What are the Golden Signals of SRE?*
   - Latency, Traffic (throughput), Errors (error rate), and Saturation (system resource limits).
6. *What does Prometheus scrape do?*
   - Querying target endpoints (like `/metrics`) over HTTP to fetch metric values in text formats.
7. *What is Grafana used for?*
   - To query, visualize, and alert on metrics and log stores using customizable dashboards.
8. *What is OpenTelemetry (OTel)?*
   - An open-source standard framework containing SDKs, APIs, and tools to collect metrics, logs, and traces.
9. *What is Alert fatigue?*
   - A condition where engineers ignore notifications because the monitoring system generates too many false or low-priority alerts.
10. *Define structured logging.*
    - Writing logs in machine-readable formats (typically JSON) instead of plain text, allowing easy querying and parsing.

### 12. Common Mistakes
- Writing logs without timestamps or logging sensitive user information (like credit cards) in plain text files.

### 13. Best Practices
- Define actionable alerts (e.g. notify on high user-facing error rates, not just transient CPU spikes). Use JSON for all application log outputs.

### 14. Hands-on Lab
- Write a Prometheus metric scraping configuration and launch Grafana using Docker Compose.

### 15. Commands
- `curl http://localhost:9090/metrics` (Verify Prometheus node exporter is exposing stats)

### 16. Code Examples
```yaml
# Docker Compose setting up Prometheus and Grafana
version: '3.8'
services:
  prometheus:
    image: prom/prometheus:v2.30.3
    volumes:
      - ./prometheus.yml:/etc/prometheus/prometheus.yml
    ports:
      - "9090:9090"
  grafana:
    image: grafana/grafana:8.2.2
    ports:
      - "3000:3000"
    environment:
      - GF_SECURITY_ADMIN_PASSWORD=admin
```

### 17. Visual Memory Tricks
- **M-L-T**: **M**etrics (Numbers), **L**ogs (Text), **T**races (Paths) (Monitoring Lives Today).

### 18. MCQs
1. Which observability pillar monitors system resource utilization over time?
   - A) Logs
   - B) Metrics (Correct)
   - C) Traces
2. Which tool is commonly used to query and visualize metrics?
   - A) Logstash
   - B) Kibana
   - C) Grafana (Correct)

### 19. Practical Scenario Questions
- *Scenario*: Users report that checkout transactions are slow. CPU and Memory metrics are normal. How do you find the bottleneck?
  - *Answer*: Inspect distributed traces for the checkout endpoint. Look for spans that show high latency (e.g., waiting for external payment gateway responses).

### 20. Summary
- **Key Points**: Observability uses metrics, logs, and traces. Prometheus uses a pull model. Grafana visualizes metrics. ELK centralizes logs.
- **Cheat Sheet**: Logs = what happened. Metrics = general system health. Traces = execution pathways.
