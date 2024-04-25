const db = require("../database")
const Booking = require("./Booking")

class BookingPostgreRepository{
    constructor(){
        //armazenar reservas em db
        this.db = db
    }

    async findAll(){
        const storedBookings = await this.db.manyOrNone('SELECT id, room_id AS "roomId", guest_name AS "guestName", check_in_date AS "checkInDate", check_out_date AS "checkOutDate", user_id AS "userId" FROM bookings')

        return storedBookings.map((booking) => new Booking(booking))
    }

    async create(booking){
        try{
            await this.db.none("INSERT INTO bookings(id, room_id, guest_name, check_in_date, check_out_date, user_id) VALUES(${id}, ${roomId}, ${guestName}, ${checkInDate}, ${checkOutDate}, ${userId})", { 
                id: booking.id,
                roomId: booking.roomId,
                guestName: booking.guestName,
                checkInDate: booking.checkInDate,
                checkOutDate: booking.checkOutDate,
                userId: booking.userId
            })
        } catch(error){
            console.log(error, "Error to insert into the table!")
        }
    }
}

module.exports = BookingPostgreRepository