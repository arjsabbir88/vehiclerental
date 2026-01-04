import { Pool } from "pg";
import config from ".";

export const pool = new Pool({
  connectionString: `${config.connection_str}`,
});

const initDB = async () => {
  await pool.query(`
        CREATE TABLE IF NOT EXISTS users(
        id SERIAL PRIMARY KEY,
        name VARCHAR(100) NOT NULL,
        email VARCHAR(150) NOT NULL UNIQUE,
        password VARCHAR(400) NOT NULL CHECK (length(password)>=6),
        phone VARCHAR(15) NOT NULL,
        role VARCHAR(20) NOT NULL CHECK (role IN ('admin', 'customer')),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
        `);

  await pool.query(`
    CREATE OR REPLACE VIEW public_users AS
    SELECT id, name, email, phone, role, created_at
    FROM users;
  `);

  await pool.query(`
CREATE TABLE IF NOT EXISTS vehicle (
  id SERIAL PRIMARY KEY,
  vehicle_name VARCHAR(250) NOT NULL,
  type VARCHAR(40) NOT NULL,
  registration_number VARCHAR(30) NOT NULL UNIQUE,
  daily_rent_price INT NOT NULL CHECK (daily_rent_price > 0),
  availability_status VARCHAR(30) NOT NULL CHECK (availability_status IN ('available', 'booked'))
);
`);
};

export default initDB;
