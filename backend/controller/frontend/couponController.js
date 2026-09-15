const coupon = require("../../model/coupon");

const addCoupon = async (req, res) => {

    try {
        const data = await coupon.create(req.body)

        res.status(201).json({
            message: "coupon added Successfully",
            data
        })

    } catch (error) {
        res.status(500).json({
            message: error
        })
    }
}

const viewCoupon = async (req, res) => {

    try {
        const { id } = req.params
        const data = await coupon.findById(id)

        res.status(200).json({
            message: "coupon found Successfully ",
            data
        })
    } catch (error) {
        res.status(500).json({
            message: error
        })
    }
}

const viewAllCoupon = async (req, res) => {

    try {
        const data = await coupon.find()

        res.status(200).json({
            message: "All coupons found Successfully", data
        })
    } catch (error) {
        res.status(500).json({
            message: error
        })
    }
}

const updateCoupon = async (req, res) => {

    try {
        const { id } = req.params
        const data = await coupon.findByIdAndUpdate(id,req.body,{new:true})

        res.status(200).json({
            message: "coupon updated Successfully", data
        })

    } catch (error) {
        res.status(500).json({
            message: error
        })
    }
}

const deleteCoupon = async (req, res) => {

    try {
        const { id } = req.params
        const data = await coupon.findByIdAndDelete(id)

        res.status(200).json({
            message: "coupon deleted Successfully", data
        })

    } catch (error) {
        res.status(500).json({
            message: error
        })
    }
}

module.exports = {
    addCoupon,
    viewCoupon,
    viewAllCoupon,
    updateCoupon,
    deleteCoupon
}