//a biblioteca pg-promise retorna uma função, por isso já importamos e executamos simultaneamente
const pgp = require('pg-promise')()
const { join } = require('node:path')

const db = pgp("postgres://postgres:1701@localhost:5432/bookings_api_dev")

//db.query("SELECT 1 + 1 AS result").then(result => console.log(result))

const filePath = join(__dirname, "create-tables.sql")
const query = new pgp.QueryFile(filePath)
db.query(query)

module.exports = db