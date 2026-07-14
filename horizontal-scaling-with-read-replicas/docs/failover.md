# Failover and High Availability

What happens if the server hosting the Master database catches fire?

In a single-database architecture, your application experiences a catastrophic outage until you can restore a backup onto a new server, resulting in hours of downtime and potential data loss.

In a replication architecture, you can perform a **Failover**.

## The Failover Process

1. **Detection**: Monitoring tools (like ProxySQL, Orchestrator, or a cloud provider's health checks) detect that the Master is unresponsive.
2. **Fencing (STONITH)**: To prevent a "split-brain" scenario (where a partitioned master suddenly wakes up and thinks it's still in charge), the old master is forcibly isolated or shut down (Shoot The Other Node In The Head).
3. **Promotion**: One of the Replicas is selected to become the new Master. 
   - `read_only=1` is removed from its configuration.
   - It is instructed to stop acting as a replica.
4. **Re-routing**: The application's Database Router (or a proxy layer like ProxySQL/HAProxy) is updated to point all Master traffic to the newly promoted server.
5. **Reconfiguration**: All other existing replicas are reconfigured to point to the new Master and resume replication from the correct position in the new Master's binary log.

## Planned vs Unplanned Failover

- **Planned Failover**: You need to upgrade the RAM on your Master server. You intentionally promote a Replica to Master, point traffic to it, take the old Master offline, upgrade it, and bring it back online as a Replica. This results in zero downtime.
- **Unplanned Failover**: The Master dies unexpectedly. There will be a brief period of downtime (seconds to minutes) while the monitoring tools detect the failure and execute the promotion process. Data that was written to the old Master but hadn't yet replicated to the promoted Replica is lost (unless synchronous replication is used).
