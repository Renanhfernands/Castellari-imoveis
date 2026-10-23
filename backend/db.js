const mysql = require("mysql2/promise");
require("dotenv").config();

const db = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  port: Number(process.env.DB_PORT),
  charset: "utf8mb4",

  ssl: {
    minVersion: "TLSv1.2",
    rejectUnauthorized: true,
  },
});

module.exports = db;