# How MySQL Replication Works Internally

Replication in MySQL is fundamentally driven by the **Binary Log (binlog)**.

## The Three Threads of Replication

MySQL replication relies on three main threads running across the master and replica servers:

### 1. Binlog Dump Thread (Master)
When the master executes a transaction that modifies data (INSERT, UPDATE, DELETE), it writes that event to its local Binary Log (`mysql-bin.000001`). When a replica connects, the master creates a dedicated "Binlog Dump Thread" for that specific replica. This thread reads the binlog and sends the events over the network to the replica.

### 2. IO Thread (Replica)
The replica runs an IO Thread. Its only job is to connect to the master, receive the binlog events sent by the Dump Thread, and write them to a local file on the replica called the **Relay Log**. 

### 3. SQL Thread (Replica)
The replica also runs an SQL Thread. This thread continuously reads the Relay Log and executes the events on the replica's own database engine. This is what actually modifies the data on the replica to match the master.

## Statement-Based vs Row-Based Replication

In the `master.cnf` configuration file in this repository, you will see `binlog-format=ROW`.

- **Statement-Based Replication (SBR)**: The master logs the exact SQL query (e.g., `DELETE FROM users WHERE created_at < NOW()`). The replica executes the exact same query. This can lead to inconsistencies if non-deterministic functions (like `NOW()` or `RAND()`) are used, because `NOW()` on the replica will be evaluated at a different time than on the master.
- **Row-Based Replication (RBR)**: The master logs the actual changes to the individual rows. Instead of logging the query, it logs "Row ID 5 was changed from X to Y". This is safer and guarantees consistency, which is why it is the modern default, though it can result in much larger binary logs if a single statement modifies a million rows.
