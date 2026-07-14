# Replication Lag

Replication is asynchronous. When data is written to the master, it takes time for that data to reach and be applied to the replica. The difference in time between when a transaction was committed on the master and when it is committed on the replica is known as **Replication Lag**.

Under normal circumstances, replication lag is measured in milliseconds and is imperceptible to users. However, under heavy load, it can grow to seconds or even minutes.

## Causes of Replication Lag

1. **Network Latency**: If the master is in New York and the replica is in Tokyo, physics dictates a minimum lag.
2. **Heavy Master Writes**: If you run a massive `UPDATE` query that modifies millions of rows on the master, the master's Dump Thread has to send a massive amount of data, and the replica's SQL Thread has to apply it all. While the replica is processing this giant transaction, all subsequent transactions are queued up behind it.
3. **Single-Threaded Replica**: Historically, the replica's SQL Thread was single-threaded. Even if the master processed 100 concurrent writes using 100 threads, the replica had to apply them one by one. Modern MySQL supports Multi-Threaded Replication (MTS), but lock contention can still cause bottlenecks.
4. **Slow Replica Storage**: If the master uses high-end NVMe SSDs and the replica uses cheaper spinning HDDs, the replica simply cannot write data fast enough to keep up.

## Dealing with Replication Lag in the Application

How do you prevent a user from updating their profile, refreshing the page, and seeing their old profile because their read request hit a lagging replica?

1. **Read-Your-Writes Consistency (Session Consistency)**:
   - When a user performs a write operation, set a flag in their session (or a cookie) with a timestamp.
   - The Database Router checks this flag. If the user performed a write within the last 5-10 seconds, the Router sends ALL of their `SELECT` queries directly to the Master.
   - After 10 seconds, the flag expires, and their reads go back to the Replicas.

2. **Synchronous Replication**:
   - Technologies like MySQL Group Replication or Galera Cluster ensure that a write is not considered "committed" until it has been safely written to a quorum of nodes.
   - This eliminates lag entirely (from the application's perspective) but drastically reduces write throughput because every write now incurs network latency.
