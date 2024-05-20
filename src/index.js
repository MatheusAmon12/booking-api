const {Client} = require("pg")

const app = require("./app")

const PORT = process.env.PORT || 4000
const connectionString = process.env.DATABASE_URL

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
        app.listen({ port: PORT, host: "0.0.0.0" })
        app.log.info(`Server is running on ${PORT}`)
    } catch(err){
        app.log.error(err)
        process.exit(1)
    }
}

start()