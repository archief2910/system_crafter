# Horizontal vs Vertical Scaling

When an application grows, its database will eventually become a bottleneck. There are two primary ways to solve this: **Vertical Scaling** and **Horizontal Scaling**.

## Vertical Scaling (Scaling Up)

Vertical scaling means buying a bigger, more powerful machine. If your database server has 16GB of RAM, you upgrade it to 64GB. If it has 8 CPU cores, you upgrade it to 32 cores.

### Pros:
- **Simple**: No code changes required. The application just connects to a faster machine.
- **Consistent**: All data is still in one place, so transactions and joins work as expected.

### Cons:
- **Hardware Limits**: You can only buy a server so big. Eventually, you hit a hard limit on RAM, CPU, or disk IO.
- **Cost**: High-end enterprise servers are exponentially more expensive than commodity hardware.
- **Single Point of Failure**: If that one massive server goes down, the entire application goes down.

## Horizontal Scaling (Scaling Out)

Horizontal scaling means adding *more* machines rather than bigger ones. Instead of one massive database server, you distribute the load across many smaller, cheaper servers.

### The Read Replica Pattern
The most common first step into horizontal scaling for relational databases is the **Primary-Replica (Master-Slave) Architecture**.
- One server is designated as the **Primary (Master)**. It handles all writes (INSERT, UPDATE, DELETE).
- Several servers are designated as **Replicas**. They constantly copy data from the Master and handle read queries (SELECT).

Since most web applications (like a social network) are extremely read-heavy (90% reads, 10% writes), offloading the reads to replicas dramatically increases total system throughput.

### Pros:
- **Infinite Scalability (for Reads)**: Need to handle more traffic? Just spin up another replica.
- **Cost-Effective**: Can use standard commodity servers.
- **High Availability**: If a replica dies, you route traffic to another one. If the master dies, you can promote a replica to become the new master.

### Cons:
- **Complexity**: The application now has to know about multiple databases and route queries correctly.
- **Eventual Consistency**: Replicas take a few milliseconds (or sometimes seconds) to catch up to the master. A user might write data and immediately read it back before the replica has it, seeing stale data.
- **Write Bottlenecks**: All writes still go to a single master. (To scale writes, you would need Sharding, which is much more complex).
