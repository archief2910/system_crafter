# Benchmarking Read Replicas

This folder contains a simple benchmarking script using `autocannon` to demonstrate the throughput differences in our database architecture.

## How to run the benchmark

1. Ensure the Node.js application and both databases (Master and Replica) are running via `docker-compose up -d`.
2. Open a terminal in this `benchmark/` folder.
3. Install the dependencies:
   ```bash
   npm install
   ```
4. Run the benchmark script:
   ```bash
   npm test
   ```

## What it tests

The script hits the `GET /api/users` endpoint. In our custom Database Router, this `SELECT` query is automatically routed to the MySQL Replica.

## The Experiment

To truly see the value of the Read Replica, you should run the experiment twice:

**Phase 1: Testing the Read Replica (Default)**
1. Run the benchmark as is. The queries will be routed to the `mysql-replica` container.
2. Record the Requests/sec and p99 Latency.

**Phase 2: Testing a Single Database (Simulated)**
1. Open `backend/src/database/router.js`.
2. Comment out the logic that routes `SELECT` statements to the replica, forcing everything to the `masterPool`.
3. Restart the backend container: `docker restart social-backend`.
4. Run the benchmark again.
5. Record the results.

### Expected Results
You should observe that in a production-like environment with significant data and indexing, the Replica handles concurrent reads much faster than the Master, because the Master is simultaneously dealing with locks and IO from Write operations.

*(Note: In a local Docker environment with no actual write-load happening concurrently, the numbers might be very similar. To see a dramatic difference, you would need to simulate a script constantly writing to the Master while this read benchmark runs).*
