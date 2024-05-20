const {Client} = require("pg")

//Habilitar apenas em ambiente de desenvolvimento
//require("dotenv").config()

const app = require("./app")

const PORT = process.env.PORT || 4000
const connectionString = process.env.DATABASE_URL

//Habilitar apenas em ambiente de produção
const sslEnabled = false
const sslOptions = {
    rejectUnauthorized: false,
}

const client = new Client({
    connectionString,
    ssl: sslEnabled ? sslOptions : false,
})

client.connect()
    .then(() => {
        console.log("Database connected")    
    })
    .catch((err) => console.error("Falha na conexão: ", err))

const start = async () => {
    try{
        app.listen({ port: PORT })
        app.log.info(`Server is running on http://localhost:${PORT}`)
    } catch(err){
        app.log.error(err)
        process.exit(1)
    }
}

start()