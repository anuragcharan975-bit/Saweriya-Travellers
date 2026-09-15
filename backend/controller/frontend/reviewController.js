const review = require("../../model/review");

const addReview = async (req, res) => {

    try {
        const data = await review.create(req.body)

        res.status(201).json({
            message: "review added Successfully",
            data
        })

    } catch (error) {
        res.status(500).json({
            message: error
        })
    }
}

const viewReview = async (req, res) => {

    try {
        const { id } = req.params
        const data = await review.findById(id)

        res.status(200).json({
            message: "review found Successfully ",
            data
        })
    } catch (error) {
        res.status(500).json({
            message: error
        })
    }
}

const viewAllReview = async (req, res) => {

    try {
        const data = await review.find()

        res.status(200).json({
            message: "All reviews found Successfully", data
        })
    } catch (error) {
        res.status(500).json({
            message: error
        })
    }
}

const updateReview = async (req, res) => {

    try {
        const { id } = req.params
        const data = await review.findByIdAndUpdate(id,req.body,{new:true})

        res.status(200).json({
            message: "review updated Successfully", data
        })

    } catch (error) {
        res.status(500).json({
            message: error
        })
    }
}

const deleteReview = async (req, res) => {

    try {
        const { id } = req.params
        const data = await review.findByIdAndDelete(id)

        res.status(200).json({
            message: "review deleted Successfully", data
        })

    } catch (error) {
        res.status(500).json({
            message: error
        })
    }
}

module.exports = {
    addReview,
    viewReview,
    viewAllReview,
    updateReview,
    deleteReview
}