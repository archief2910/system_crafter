# Strong vs Eventual Consistency

When designing distributed systems, you must choose between Strong Consistency and Eventual Consistency. This trade-off is often summarized by the CAP Theorem.

## Strong Consistency

In a strongly consistent system, once a write is acknowledged as successful, every subsequent read, regardless of which node it hits, is guaranteed to return that updated value.

- **Example**: Your bank account balance. If you deposit $100, the next millisecond you check your balance, it absolutely must reflect that $100.
- **Cost**: To guarantee this, the system must either route all traffic to a single node, or force every node to synchronize before acknowledging the write. This destroys write throughput and adds latency.

## Eventual Consistency

In an eventually consistent system, if no new updates are made to a given piece of data, eventually all reads to that item will return the last updated value. There is a window of time where reads might return stale data.

- **Example**: Likes on a YouTube video. When you like a video, the counter might instantly update on your screen, but a user in another country might see the old counter for a few minutes. It doesn't matter; the system will eventually converge on the correct number.
- **Cost**: The application developer must design the UI and UX to hide this reality from the user, often through caching or Session Consistency (Read-Your-Writes).

## Read Replicas and Consistency

Standard MySQL asynchronous replication provides **Eventual Consistency**.

When our `DatabaseRouter` sends a `SELECT` query to a replica, it accepts the fact that the data returned might be slightly out of date. For a social network's home feed, this is usually perfectly acceptable, allowing the system to scale massively.
