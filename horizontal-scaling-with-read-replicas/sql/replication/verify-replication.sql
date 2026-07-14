-- Run this on the replica to check replication status
-- Look for:
-- Slave_IO_Running: Yes
-- Slave_SQL_Running: Yes
-- Seconds_Behind_Master: 0 (or a small number)

SHOW REPLICA STATUS\G
