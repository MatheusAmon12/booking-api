const { v4: uuidv4} = require('uuid')

//definindo a reserva
class Booking{
    constructor({ id, userId, roomId, guestName, checkInDate, checkOutDate }){
        this.id = id ?? uuidv4()
        this.userId = userId
        this.roomId = roomId
        this.guestName = guestName
        //O JS não lida com o formato de data que não seja um objeto data, por isso é necessário essa instância
        this.checkInDate = new Date(checkInDate)
        this.checkOutDate = new Date(checkOutDate)
    }
}

module.exports = Booking