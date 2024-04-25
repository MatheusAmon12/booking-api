class AuthController{
    constructor(service){
        this.service = service
    }

    async index(request){
        const email = request.query.email
        const storedUser = await this.service.findUser(email)
        console.log(storedUser)
        return {code: 200, body: { storedUser }}
    }

    async register(request){
        const { name, email, password } = request.body

        if(!name || !email || !password){
            return { code: 400, body: { message: 'All fields are required!' }}
        }

        try{
            const user = await this.service.register(name, email, password)
            return { code: 201, body: { user } }
        } catch(error){
            return { code: 400, body: { message: error.message } }
        }       
    }

    async update(request){
        const { id, name, email, password } = request.body

        if(!name || !email || !password){
            return{ code: 400, body: { message: 'All field are required!' }}
        }

        try{
            const updateUser = await this.service.update(id, name, email, password)
            return{ code: 200, body: { updateUser }}
        } catch(error){
            return { code: 400, body: { message: error.message }}
        }
    }

    async login(request){
        const { email, password } = request.body

        if(!email || !password){
            return { code: 400, body: { message: 'All fields are required.' } }
        }
        
        try{
            const body = await this.service.login(email, password)
            return { code: 200, body }
        } catch(error){
            return { code: 400, body: { message: error.message } }
        }
    }
}

module.exports = AuthController