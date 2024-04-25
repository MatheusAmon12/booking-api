//a biblioteca pg-promise retorna uma função, por isso já importamos e executamos simultaneamente
const pgp = require('pg-promise')()
const { join } = require('node:path')

const USER = process.env.POSTGRESQL_USER
const PASSWORD = process.env.DB_PASSWORD
const DATABASE = process.env.DATABASE
const db = pgp(`postgres://${USER}:${PASSWORD}@localhost:5432/${DATABASE}`)

//db.query("SELECT 1 + 1 AS result").then(result => console.log(result))

const filePath = join(__dirname, "create-tables.sql")
const query = new pgp.QueryFile(filePath)
db.query(query)

module.exports = db