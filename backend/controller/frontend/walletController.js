const wallet = require("../../model/wallet");

const addMoney = async (req, res) => {

    try {
        const data = await wallet.create({...req.body,balance:req.body.amount})

        res.status(201).json({
            message: "money added Successfully",
            data
        })

    } catch (error) {
        res.status(500).json({
            message: error
        })
    }
}

const walletDetails = async (req, res) => {

    try {
        const { id } = req.params
        const data = await wallet.findById(id)

        res.status(200).json({
            message: "wallet found Successfully ",
            data
        })
    } catch (error) {
        res.status(500).json({
            message: error
        })
    }
}

const walletHistory = async (req, res) => {

    try {
        const data = await wallet.find({userId:req.params.userId})

        res.status(200).json({
            message: "wallet history found Successfully", data
        })
    } catch (error) {
        res.status(500).json({
            message: error
        })
    }
}

const updateWallet = async (req, res) => {

    try {
        const { id } = req.params
        const data = await wallet.findByIdAndUpdate(id,req.body,{new:true})

        res.status(200).json({
            message: "wallet updated Successfully", data
        })

    } catch (error) {
        res.status(500).json({
            message: error
        })
    }
}

const deleteWallet = async (req, res) => {

    try {
        const { id } = req.params
        const data = await wallet.findByIdAndDelete(id)

        res.status(200).json({
            message: "wallet deleted Successfully", data
        })

    } catch (error) {
        res.status(500).json({
            message: error
        })
    }
}

module.exports = {
    addMoney,
    walletDetails,
    walletHistory,
    updateWallet,
    deleteWallet
}