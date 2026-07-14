# Read Replicas Deep Dive

A Read Replica is an exact, read-only copy of your primary database.

## How it Works

When your application writes data to the Master database, the Master records that change. The Replica constantly monitors the Master for changes and applies them to its own dataset. This happens asynchronously.

## When to Use Read Replicas

Read replicas are highly effective for:
1. **Read-Heavy Workloads**: Social media feeds, e-commerce product catalogs, or blog networks. If your ratio of reads to writes is high (e.g., 9:1 or more), replicas will drastically reduce the load on your primary database.
2. **Analytics and Reporting**: Running heavy `GROUP BY` and `JOIN` queries for reports can lock tables and consume massive amounts of CPU and memory. Running these on a replica ensures your primary transactional database is never affected.
3. **Geographical Distribution**: If your primary database is in New York, users in Tokyo will experience high latency. You can place a read replica in a Tokyo data center so Japanese users experience fast read times.
4. **Disaster Recovery**: If the master database fails, you can promote a read replica to become the new master, minimizing downtime.

## When NOT to Use Read Replicas

Do not use read replicas as a silver bullet. They are inappropriate for:
1. **Write-Heavy Workloads**: If your app is constantly writing (e.g., IoT sensor ingestion, high-frequency trading), read replicas won't help. The master will become a bottleneck, and the replicas will struggle to keep up, leading to massive replication lag. In these cases, you need **Sharding**.
2. **Strict Consistency Requirements**: If a user updates their password, they must be able to log in immediately with the new password. If the login check hits a replica that hasn't synchronized yet, the login will fail. This requires strong consistency, whereas replicas provide eventual consistency. (A common pattern is to route reads to the Master for 10 seconds after a user writes data, then switch back to Replicas).
