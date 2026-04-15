import mysql from "mysql2/promise";
import env from "./env.js";

const pool = mysql.createPool({
  host: env.db.host,
  port: env.db.port,
  database: env.db.database,
  user: env.db.user,
  password: env.db.password,
  connectionLimit: env.db.connectionLimit,
  waitForConnections: true,
  queueLimit: 0,
  namedPlaceholders: true
});

export const testConnection = async () => {
  const connection = await pool.getConnection();
  connection.release();
};

export default pool;
