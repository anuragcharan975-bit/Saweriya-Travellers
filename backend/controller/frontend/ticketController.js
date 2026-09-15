const ticket = require("../../model/ticket");

const generateTicket = async (req, res) => {

    try {
        const ticketNumber = "TKT" + Date.now()
        const data = await ticket.create({ bookingId: req.body.bookingId, ticketNumber, qrCode: ticketNumber })

        res.status(201).json({
            message: "ticket generated Successfully",
            data
        })

    } catch (error) {
        res.status(500).json({
            message: error
        })
    }
}

const viewTicket = async (req, res) => {

    try {
        const { id } = req.params
        const data = await ticket.findById(id)

        res.status(200).json({
            message: "Ticket found Successfully ",
            data
        })
    } catch (error) {
        res.status(500).json({
            message: error
        })
    }
}

const viewAllTicket = async (req, res) => {

    try {
        const data = await ticket.find()

        res.status(200).json({
            message: "All tickets found Successfully", data
        })
    } catch (error) {
        res.status(500).json({
            message: error
        })
    }
}

const cancelTicket = async (req, res) => {

    try {
        const { id } = req.params
        const data = await ticket.findByIdAndUpdate(id,{ticketStatus:"Cancelled"},{new:true})

        res.status(200).json({
            message: "ticket cancelled Successfully", data
        })

    } catch (error) {
        res.status(500).json({
            message: error
        })
    }
}


module.exports = {
    generateTicket,
    viewTicket,
    viewAllTicket,
    cancelTicket
}