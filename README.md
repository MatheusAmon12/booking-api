# Bookings

## Sobre o projeto

O projeto Back-End em questão é uma API para gerenciar reservas de hotel, além de usuários que podem executar as tarefas relacionadas a criação e exclusão de reservas. Está integrado com o PostgreSQL e utiliza o framework `fastify`

## Entendendo a estrutura do projeto

## Setup inicial:

- [NodeJS LTS](https://nodejs.org/en)
- [Fastify LTS](https://fastify.dev)
- [jsonwebtoken LTS](https://www.npmjs.com/package/jsonwebtoken)
- [pg-promise v11.5.5](https://www.npmjs.com/package/pg-promise/v/11.5.5)
- [uuid LTS](https://www.npmjs.com/package/uuid)

## Como rodar na minha máquina?

- Clone o projeto [https://github.com/MatheusAmon12/booking-api.git](https://github.com/MatheusAmon12/booking-api.git)
- Tenha instalado o [PostgreSQL](https://www.postgresql.org/download/) de acordo com o seu SO
- Crie um usuário e um banco de dados utilizando a dashboard do pgAdmin 4
- Rode `npm install` ou `npm i`
- Instale todas depências citadas no setup inicial
- Configure um arquivo `.env` contendo as seguintes variáveis:
    -   `SECRET_KEY_JWT`: chave secreta ao seu critério para ser usada no gerenciamento do jwt
    -   `PORT`: porta em que rodará o servidor, recomedo a porta 3333
    -   `DATABASE_URL`: a url de conexão deve ser do tipo:
        -   `postgres://{user}:{password}@localhost:5432/{database}`
- Rode `npm run dev`
- Finalizado!

## Observação

Esse projeto back-end é uma parte de um todo, ou seja, existe um front-end já desenvolvido para consumir todos os endpoints presentes. Recomenda-se a porta 3333 para rodar o servidor porque no projeto front-end a url base para as requisições é `http://localhost:3333/api`. Mas nada impede de alterar também. Desenvolva o seu Front-End para consumir essa API ou acesse o já desenvolvido [bookings-front](https://github.com/MatheusAmon12/booking). Caso não queira um Front-End recomendo o [Postman](https://www.postman.com) para interagir e testar os endpoints.

Em ambiente de desenvolvimento é preciso ajustar alguns pontos:

```js	
const {Client} = require("pg")

//Habilitar apenas em ambiente de desenvolvimento
//require("dotenv").config()

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
        //Aplique essa abordagem apenas em ambiente de desenvolvimento
        //app.listen({ port: PORT })
        app.log.info(`Server is running on ${PORT}`)
    } catch(err){
        app.log.error(err)
        process.exit(1)
    }
}

start()
```


## Booking

### Estrutura do projeto

- `./src` contém todos os arquivos que compõe o projeto
- `./src/auth` contém todas as classes que envolvem o usuário e os serviços de autenticação via `jwt`
    - `AuthController.js` contém a classe controller
    - `AuthService.js` contém os serviços relacionados a registro, atualização e login de usuário
    - `User.js` define a entidade usuário
    - `UserPostgreRepository.js` gerencia a interação com a tabela de `users`
    - `UserRepository.js` repositório local utilizado para testes
- `./src/bookings` contém todas as classes que envolvem as reservas
    - `Booking.js` define a entidade `booking`
    - `BookingController.js` contém a classe controller
    - `BookingPostgreRepository.js` gerencia a interação com a tabela de `bookings`
    - `BookingRepository.js` repositório local utilizado para testes
    - `BookingService.js` contém os serviços relacionados a criação e captura de reservas
- `./src/database` contém o gerenciamento das tabelas do banco de dados automaticamente
    - `create-tables.sql` instruções sql para criar as tabelas `users` e `bookings`
    - `index.js` roda o comando sql do arquivo `create-tables.sql`
- `./src/routes` contém todas os endpoints do projeto
    - `index.js` define as rotas da API
        - obs.: a `const authRoutes` é responsável por proteger as rotas, atibuindo necessidade de autorização com o token `jwt`. É uma funcionaldidade do framework `fastify`, para utilizá-la inserir entre a definição da rota e a função da request:

        ```js
        //preHandler
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
        ```
        ```js
        //exemplo de rota com o preHandler
        app.get('/hello', authRoutes, (request, reply) => {
            reply.send({ message: 'Hello, world!' })
        })
        ```
- `./src/app.js` inicia o `fastify`
- `./src/bootstrap.js` intancia todas as classes que serão utilizadas
- `./src/index.js` inicia o servidor

## API

### POST

- `http://localhost:1000/api/auth/login`
    - realiza o login de um usuário registrado
    - recebe um json com os campos `email` e `password`, conforme o exemplo abaixo:

        ```json
        {
            "email": "user@email.com",
            "password": "password"
        }
        ```

    - retorna um json com os campos o `token` e os dados do usuário logado, com os campos `id`, `name`, `email` e `password` ( a senha já estará criptografada ), conforme o exemplo abaixo:

        ```json
        {
            "token": "nHUbBiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6Ijk3ZjgzOWU3LWRjMWYtNDNmMi1hYjgyLTM3N2VmZGZiNzFhMiIsImVtYWlsIjoidXNlckBlbWFpbC5jb20iLCJpYXQiOjE3MTYyMzE1NTIsImV4cCI6MTcxNjMxNzk1Mn0.0kCXVQSzyE3HiFdYpBpSagrIK9tbyaL4C2yxOSM897g",
            "user": {
                "id": "97f839e7-dc1f-43f2-ab82-377efdfb71a2",
                "name": "User",
                "email": "user@email.com",
                "password": "$2a$10$mb.1C/PBBbjbbbLJvuÇBiUvyvlmJ0VYbV2Qvk6.17pOsqrzW.S8ig0K"
            }
        }
        ```
- `http://localhost:1000/api/auth/user?email=user@email.com`
    - encontra um usuário pelo email
    - exemplo de Front-End para consumir esse endpoint:

        ```js
        const userEmail = session.user.email

        useEffect(() => {
            api.get(`/auth/user?email=${userEmail}`)
                .then(response => {
                    const user = response.data.storedUser
                    setUser(user)
                    
                    setUserLoaded(true)
                })
                .catch(error => console.log(error))
        }, [])
        ```	

    - retorna um json com os campos `id`, `name`, `email` e `password` ( a senha será criptografada ), conforme o exemplo abaixo:

        ```json
        {
            "storedUser": {
                "id": "97f839e7-dc1f-43f2-ab82-377efdfb71a2",
                "name": "User",
                "email": "user@email.com",
                "password": "$2a$10$mb.1C/PBBbjbbbLJvuÇBiUvyvlmJ0VYbV2Qvk6.17pOsqrzW.S8ig0K"
            }
        }
        ```

- `http://localhost:1000/api/auth/register`
    - registra um usuário
    - recebe um json com os campos `name`, `email` e `password`, conforme o exemplo abaixo:

        ```json
        {
            "name": "User",
            "email": "user@email.com",
            "password": "password"
        }
        ```

    - retorna um json com os campos `id`, `name`, `email` e `password` ( a senha já estará criptografada ), conforme o exemplo abaixo:

        ```json
        {
            "user": {
                "id": "97f839e7-dc1f-43f2-ab82-377efdfb71a2",
                "name": "User",
                "email": "user@email.com",
                "password": "$2a$10$mb.1C/PBBbjbbbLJvuÇBiUvyvlmJ0VYbV2Qvk6.17pOsqrzW.S8ig0K"
            }
        }
        ```

- `http://localhost:1000/api/bookings`
    - cria uma reserva
    - recebe um json com os campos `roomId`, `guestName`, `checkInDate` e `checkOutDate`, conforme o exemplo abaixo:

        ```json
        {
            "roomId": "202",
            "guestName": "Guest",
            "checkInDate": "2024-09-29",
            "checkOutDate": "2024-10-20"
        }
        ```

    - retorna uma mensagem de sucesso ou erro

### GET

- `http://localhost:1000/api/bookings`
    - retorna todas as reservas
    - retorna um json com os campos `id`, `userId`, `roomId`, `guestName`, `checkInDate` e `checkOutDate`, conforme o exemplo abaixo:

        ```json
        {
            "id": "0d9a4be7-42af-4e5d-af34-bc0edcaa05a5",
            "userId": null,
            "roomId": "202",
            "guestName": "Guest",
            "checkInDate": "2024-09-29T00:00:00.000Z",
            "checkOutDate": "2024-10-20T00:00:00.000Z"
        }
        ```

- preHandler
    - essa é a cara do preHandler, responsável por proteger as rotas: 

        ```js
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
        ```

    - Para proteger as rotas com exigência de autorização com o token `jwt` você pode incluir o preHandler da seguinte forma em todas as rotas que deseja proteger:

        ```js
        app.get('/hello', authRoutes, (request, reply) => {
            reply.send({ message: 'Hello, world!' })
        })
        ``` 

### PUT

- `http://localhost:1000/api/auth/update`
    - atualiza os dados de um usuário
    - recebe um json com os campos `id`, `name`, `email` e `password`, conforme o exemplo abaixo:

        ```json
        {
            "id": "97f839e7-dc1f-43f2-ab82-377efdfb71a2",
            "name": "New User",
            "email": "new_user@email.com",
            "password": "new_password"
        }
        ```

    - retorna um json com os campos `id`, `name`, `email` e `password` ( a senha será criptografada ), conforme o exemplo abaixo:

        ```json
        {
            "updateUser": {
                "id": "97f839e7-dc1f-43f2-ab82-377efdfb71a2",
                "name": "New User",
                "email": "new_user@email.com",
                "password": "$2a$10$L1P1mgWizTVQu.KFiTSU3ODqsuHjz1.auL8w.A0yDy0S.HjgqnQUS"
            }
        }
        ```