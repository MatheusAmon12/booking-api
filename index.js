const app = require("./src/app")

const PORT = process.env.PORT || 10001

const start = async () => {
    try{
        app.listen({ port: PORT })
        app.log.info(`Server is running on https://localhost:${PORT}`)
    } catch(err){
        app.log.error(err)
        process.exit(1)
    }
}

start()