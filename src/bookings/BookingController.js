class BookingController{
    constructor(service){
        this.service = service
    }

    async index(){
        const bookings = await this.service.findAllBookings()
        return {
            code: 200,
            body: {
                bookings
            }
        }
    }

    async save(request){
        const { roomId, guestName, checkInDate, checkOutDate } = request.body
        //user que faz login com o token
        // const user = request.user

        if(!roomId || !guestName || !checkInDate || !checkOutDate){
            return {
                code: 400,
                body: { message: 'All fields are required!'}
            }
        }

        const booking = await this.service.createBooking({ roomId, guestName, checkInDate, checkOutDate })

        return {
            code: 201,
            body: { message: 'New booking created with success!', booking }
        }
    }
}

module.exports = BookingController