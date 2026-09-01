import { Pool } from "pg";


/**
 * Manages the PostgreSQL connection used by the backend.
 */
export class Database {

    private static pool: Pool;


    /**
     * Returns the existing database pool or creates one.
     */
    public static getPool(): Pool {
        if (!Database.pool) {
            Database.pool = new Pool({
                connectionString: process.env.DATABASE_URL,
            });
        }

        return Database.pool;
    }


    /**
     * Checks that the backend can connect to PostgreSQL.
     */
    public static async testConnection(): Promise<void> {
        const pool = Database.getPool();

        await pool.query("SELECT NOW();");
    }


    /**
     * Closes all active PostgreSQL connections.
     */
    public static async close(): Promise<void> {
        if (Database.pool) {
            await Database.pool.end();
        }
    }
}