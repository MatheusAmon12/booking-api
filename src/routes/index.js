const { authService, bookingController, authController } = require("../bootstrap")
const app = require("../app")

//preHandle para adicionar verificação de autorização via jwt
const authRoutes = {
    preHandler: async (request, reply) => {
        //o header contem o termo Bearer seguido do token, então retirando-o resta apenas o token
        const token = request.headers.authorization?.replace(/^Bearer /, "")
        if(!token) reply.code(401).send({ message: 'Unauthorized: token invalid!' })

        //capturando o usuário que está enviando a requisição
        const user = await authService.verifyToken(token)
        if(!user) reply.code(404).send({ message: 'Unauthorized: invalid token!' })
        request.user = user
    }
}

function setupRoutes(app){   
    app.get('/hello', (request, reply) => {
        reply.send({ message: 'Hello, world!' })
    })

    app.get('/api/bookings', async (request, reply) => {
        const { code, body } = await bookingController.index(request)
        reply.code(code).send(body)
    })

    app.post('/api/bookings', async (request, reply) => {
        const { code, body } = await bookingController.save(request)
        reply.code(code).send(body.message)
    })

    app.get('/api/auth/user', async (request, reply) => {
        const { code, body } = await authController.index(request)
        reply.code(code).send(body)
    })

    app.post('/api/auth/register', async (request, reply) => {
        const { code, body } = await authController.register(request)
        reply.code(code).send(body)
    })

    app.put('/api/auth/update', async (request, reply) => {
        const { code, body } = await authController.update(request)
        reply.code(code).send(body)
    })

    app.post('/api/auth/login', async (request, reply) => {
        const { code, body } = await authController.login(request)
        reply.code(code).send(body)
    })
}

module.exports = { setupRoutes }