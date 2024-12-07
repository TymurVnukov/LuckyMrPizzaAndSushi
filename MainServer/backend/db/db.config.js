import sql from 'mssql';
import dotenv from 'dotenv'
dotenv.config()

const config = {
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    server: process.env.DB_HOST,
    database: process.env.DB_DATABASE,
    options: {
        encrypt: true, // for Azure, change to false if not using Azure
        trustServerCertificate: true // change to true if local dev / self-signed certs
    }
};

export const pool = new sql.ConnectionPool(config);
export const poolConnect = pool.connect();