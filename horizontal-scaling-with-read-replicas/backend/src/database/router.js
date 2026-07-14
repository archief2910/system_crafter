const masterPool = require('./master');
const replicaPool = require('./replica');

/**
 * Custom Database Router
 * 
 * This module intercepts all queries and decides which database to send them to.
 * 
 * Routing Rules:
 * 1. SELECT queries go to the Replica (unless they have FOR UPDATE).
 * 2. INSERT, UPDATE, DELETE queries go to the Master.
 * 3. Transactions should ideally be handled explicitly on the Master, 
 *    but for simplicity, we route based on the first word of the query.
 */
class DatabaseRouter {
    
    /**
     * Executes a query on the appropriate database based on the SQL statement.
     * @param {string} sql - The SQL query to execute
     * @param {Array} params - The query parameters
     * @returns {Promise<Array>} - [rows, fields]
     */
    static async query(sql, params = []) {
        // Simple heuristic: check the first word of the query
        const command = sql.trim().toUpperCase().split(' ')[0];

        // If it's a SELECT statement (and not locking rows), route to replica
        if (command === 'SELECT' && !sql.toUpperCase().includes('FOR UPDATE')) {
            console.log(`[ROUTER] Routing to REPLICA: ${sql}`);
            return replicaPool.query(sql, params);
        }

        // Otherwise (INSERT, UPDATE, DELETE, etc.), route to master
        console.log(`[ROUTER] Routing to MASTER: ${sql}`);
        return masterPool.query(sql, params);
    }
}

module.exports = DatabaseRouter;
