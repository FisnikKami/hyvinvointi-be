import mysql from 'mysql2';
import 'dotenv/config';

const pool = mysql.createPool(process.env.DB_URL);
const promisePool = pool.promise();
export default promisePool;
