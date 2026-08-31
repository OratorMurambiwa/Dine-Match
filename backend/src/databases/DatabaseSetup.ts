import { Database } from "./Database";


/**
 * Creates the PostgreSQL tables required by DineMatch.
 */
export class DatabaseSetup {

    /**
     * Creates every table if it does not already exist.
     */
    public async run(): Promise<void> {
        const database = Database.getPool();

        await database.query(`
            CREATE TABLE IF NOT EXISTS rooms (
                id SERIAL PRIMARY KEY,
                code VARCHAR(5) UNIQUE NOT NULL,
                name VARCHAR(100) NOT NULL,
                location VARCHAR(255) NOT NULL,
                radius_miles INTEGER NOT NULL,
                cuisine VARCHAR(100) NOT NULL,
                min_price INTEGER,
                max_price INTEGER,
                min_rating DECIMAL(2, 1),
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            );
        `);

        await database.query(`
            CREATE TABLE IF NOT EXISTS participants (
                id SERIAL PRIMARY KEY,
                room_id INTEGER NOT NULL,
                name VARCHAR(100) NOT NULL,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

                FOREIGN KEY (room_id)
                    REFERENCES rooms(id)
                    ON DELETE CASCADE
            );
        `);

        await database.query(`
            CREATE TABLE IF NOT EXISTS restaurants (
                id SERIAL PRIMARY KEY,
                external_id VARCHAR(255) UNIQUE NOT NULL,
                name VARCHAR(255) NOT NULL,
                address VARCHAR(255) NOT NULL,
                rating DECIMAL(2, 1),
                price_level INTEGER,
                latitude DECIMAL(10, 7),
                longitude DECIMAL(10, 7),
                image_url TEXT
            );
        `);

        await database.query(`
            CREATE TABLE IF NOT EXISTS room_restaurants (
                room_id INTEGER NOT NULL,
                restaurant_id INTEGER NOT NULL,

                PRIMARY KEY (
                    room_id,
                    restaurant_id
                ),

                FOREIGN KEY (room_id)
                    REFERENCES rooms(id)
                    ON DELETE CASCADE,

                FOREIGN KEY (restaurant_id)
                    REFERENCES restaurants(id)
                    ON DELETE CASCADE
            );
        `);

        await database.query(`
            CREATE TABLE IF NOT EXISTS votes (
                id SERIAL PRIMARY KEY,
                room_id INTEGER NOT NULL,
                participant_id INTEGER NOT NULL,
                restaurant_id INTEGER NOT NULL,
                vote BOOLEAN NOT NULL,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

                FOREIGN KEY (room_id)
                    REFERENCES rooms(id)
                    ON DELETE CASCADE,

                FOREIGN KEY (participant_id)
                    REFERENCES participants(id)
                    ON DELETE CASCADE,

                FOREIGN KEY (restaurant_id)
                    REFERENCES restaurants(id)
                    ON DELETE CASCADE,

                UNIQUE (
                    participant_id,
                    restaurant_id
                )
            );
        `);
    }
}