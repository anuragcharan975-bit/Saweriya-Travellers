const payment = require("../../model/payment");

const createPayment = async (req, res) => {

    try {
        const transactionId = "TXN" + Date.now()
        const data = await payment.create({...req.body,transactionId})

        res.status(201).json({
            message: "payment created Successfully",
            data
        })

    } catch (error) {
        res.status(500).json({
            message: error
        })
    }
}

const viewPayment = async (req, res) => {

    try {
        const { id } = req.params
        const data = await payment.findById(id)

        res.status(200).json({
            message: "payment found Successfully ",
            data
        })
    } catch (error) {
        res.status(500).json({
            message: error
        })
    }
}

const viewAllPayment = async (req, res) => {

    try {
        const data = await payment.find({userId:req.params.userId})

        res.status(200).json({
            message: "all payment found Successfully", data
        })
    } catch (error) {
        res.status(500).json({
            message: error
        })
    }
}

const verifyPayment = async (req, res) => {

    try {
        const { id } = req.params
        const data = await payment.findByIdAndUpdate(id,req.body,{paymentStatus:"Success"})

        res.status(200).json({
            message: "payment verified Successfully", data
        })

    } catch (error) {
        res.status(500).json({
            message: error
        })
    }
}

const refundPayment = async (req, res) => {

    try {
        const { id } = req.params
        const data = await payment.findByIdAndUpdate(id,req.body,{paymentStatus:"Refunded"})

        res.status(200).json({
            message: "Payment Refunded Successfully", data
        })

    } catch (error) {
        res.status(500).json({
            message: error
        })
    }
}

module.exports = {
    createPayment,
    viewPayment,
    viewAllPayment,
    verifyPayment,
    refundPayment
}