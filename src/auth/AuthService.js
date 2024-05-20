const User = require("./User")
const bcrypt = require("bcryptjs")
const jwt = require("jsonwebtoken")
require("dotenv").config()

const secretKey = process.env.SECRET_KEY_JWT

class AuthService{
    constructor(repository){
        this.repository = repository
    }

    async findUser(email){
        return await this.repository.findByEmail(email)
    }

    async register(name, email, password){
        const userExists = await this.repository.findByEmail(email)
        if(userExists) throw new Error ('This email was already by another user!')

        const newUser = new User({name, email, password})
        //gerando hash
        newUser.password = bcrypt.hashSync(newUser.password, 10)
        await this.repository.save(newUser)
        return newUser
    }

    async update(id, name, email, password){
        //método criado apenas para acompanhar o andamento
        const storedUser = await this.repository.findById(id)
        //console.log("Usuário encontrado pelo id", storedUser)

        const updateUser = new User({id, name, email, password})
        
        updateUser.password = bcrypt.hashSync(updateUser.password, 10)
        await this.repository.update(updateUser)
        return updateUser
    }

    async login(email, password){
        const user = await this.repository.findByEmail(email)
        if(!user) throw new Error('User not found!')

        const isSamePassword = bcrypt.compareSync(password, user.password)
        if(!isSamePassword) throw new Error('Wrong password!')

        if(!secretKey) throw new Error('Invalid secret key!')
        const token = jwt.sign({ id: user.id, email: user.email }, secretKey, { expiresIn: '1d' })
        return{ token, user }
    }

    async verifyToken(token){
        //decoficando o jwt com o método verify que recebe o token vindo na requisição e a secretKey
        const decodedToken = jwt.verify(token, secretKey)
        const user = await this.repository.findByEmail(decodedToken.email)
        return user
    }
}

module.exports = AuthService