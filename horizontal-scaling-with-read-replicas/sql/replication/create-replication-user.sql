-- This script runs on the master to create a user dedicated to replication
CREATE USER 'replicator'@'%' IDENTIFIED WITH mysql_native_password BY 'replpassword';
GRANT REPLICATION SLAVE ON *.* TO 'replicator'@'%';
FLUSH PRIVILEGES;

-- We also need to make sure the app user is granted privileges
CREATE USER IF NOT EXISTS 'app_user'@'%' IDENTIFIED BY 'app_password';
GRANT ALL PRIVILEGES ON social_network.* TO 'app_user'@'%';
FLUSH PRIVILEGES;
