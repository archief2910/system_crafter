-- This script should be run manually or via a script on the replica AFTER the master is up.
-- In a real environment, you'd get the exact MASTER_LOG_FILE and MASTER_LOG_POS from `SHOW MASTER STATUS;` on the master.
-- Since this is an educational lab spinning up from scratch with no prior data, 
-- we can often start from the beginning or use GTID (Global Transaction Identifiers).
-- However, for simplicity in this lab, we configure it this way:

STOP REPLICA;

CHANGE REPLICATION SOURCE TO
  SOURCE_HOST='mysql-master',
  SOURCE_USER='replicator',
  SOURCE_PASSWORD='replpassword',
  SOURCE_PORT=3306,
  GET_SOURCE_PUBLIC_KEY=1;

START REPLICA;
