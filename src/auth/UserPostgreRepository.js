const db = require("../database")
const User = require("./User")

class UserPostgreRepository{
    constructor(){
        this.db = db
    }

    async findByEmail(email){
        const storedUser = await this.db.oneOrNone("SELECT * FROM users WHERE email = $1", [email])
        return storedUser ? new User(storedUser) : null
    }

    //método criado apenas para acompanhar o andamento
    async findById(id){
        const storedUser = await this.db.oneOrNone("SELECT * FROM users WHERE id = $1", [id])
        return storedUser ? new User(storedUser) : null
    }

    async save(user){
        try{
            await this.db.none('INSERT INTO users(id, name, email, password) VALUES($1, $2, $3, $4)', [
                user.id,
                user.name,
                user.email,
                user.password
            ])
            console.log("Added with sucess!")
        }catch(error){
            console.log('Insert user error')
        }
    }

    async update(updateUser){
        try{
            await this.db.none('UPDATE users SET name = $1, email = $2, password = $3 WHERE id = $4', [
                updateUser.name,
                updateUser.email,
                updateUser.password,
                updateUser.id
            ])
            console.log("Success update")
            return true
        }catch(error){
            console.log("Update error!")
            return false
        }
    }
}
module.exports = UserPostgreRepository