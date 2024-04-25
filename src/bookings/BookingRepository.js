class BookingRepository{
    constructor(){
        //armazenar reservas em array
        this.bookings = []
    }

    findAll(){
        return this.bookings
    }

    create(booking){
        //adicionando reserva no array
        this.bookings.push(booking)
    }
}

module.exports = BookingRepository