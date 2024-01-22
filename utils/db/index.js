
const {Client} = require('pg')

const client = new Client({
    host: process.env.PG_HOST,
    user: "postgres",
    port: 5432,
    password: "abc",
    database: "postgres"
})

module.exports = client
 
// export const query = (text, params) => pool.query(text, params);
// export const query = (text, params) => pool.query(text, params);
// host: process.env.PG_HOST,
// user: process.env.PG_USER,
// port: process.env.PG_PORT,
// password: process.env.PG_PASSWORD,
// database:  process.env.PG_DB_NAME