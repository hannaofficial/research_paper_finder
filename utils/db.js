// utils/db.js
import { Pool } from "pg";

const pool = new Pool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  port: 5432,
  ssl: {
    rejectUnauthorized: false, 
  },
  connectionTimeoutMillis: 5000,
  idleTimeoutMillis: 30000,
});

const connectDB = async () => {
  try {
    const client = await pool.connect();
    console.log("Connected to AWS RDS PostgreSQL");
    return client;
  } catch (err) {
    console.error("Error connecting to the database:", err);
    throw err;
  }
};

// Add event listeners for pool errors
pool.on('error', (err) => {
  console.error('Unexpected error on idle client', err);
  process.exit(-1);
});

export default connectDB;