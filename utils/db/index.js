 
const {Client} = require('pg')

const client = new Client({
    host: "localhost",
    user: "postgres",
    port: 5432,
    password: "123",
    database: "postgres"
})

module.exports = client
 
// export const query = (text, params) => pool.query(text, params);