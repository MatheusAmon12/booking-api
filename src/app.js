const fastify = require("fastify")
const cors = require("@fastify/cors")
const { setupRoutes } = require("./routes/index")

const app = fastify({ logger: true})

app.register(cors, {
    origin: "*"
})

setupRoutes(app)

module.exports = app