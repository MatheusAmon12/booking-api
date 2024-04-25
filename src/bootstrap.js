const BookingService = require('./bookings/BookingService')
const BookingController = require('./bookings/BookingController')
const AuthService = require("./auth/AuthService")
const AuthController = require("./auth/AuthController")
const UserPostgreRepository = require("./auth/UserPostgreRepository")
const BookingPostgreRepository = require("./bookings/BookingPostgreRepository")

//instanciando classes da reserva e herdando classes
const bookingPostgreRepository = new BookingPostgreRepository()
const bookingService = new BookingService(bookingPostgreRepository)
const bookingController = new BookingController(bookingService)

//instanciando classes do usuário e herdando classes
const userRepository = new UserPostgreRepository()
const authService = new AuthService(userRepository)
const authController = new AuthController(authService)

module.exports = {
    bookingPostgreRepository,
    bookingService,
    bookingController,
    userRepository,
    authService,
    authController
}