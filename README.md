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

Em ambiente de desenvolvimento é preciso que remova o trecho comentado que importa biblioteca dotenv para que as variáveis de ambiente sejam importadas corretamente no projeto:

```js	
const {Client} = require("pg")

//Habilitar apenas em ambiente de desenvolvimento
//require("dotenv").config()

const app = require("./app")

const PORT = process.env.PORT || 4000
const connectionString = process.env.DATABASE_URL
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