const notification = require("../../model/notification");

const createNotification = async (req, res) => {

    try {
        const data = await notification.create(req.body)

        res.status(201).json({
            message: "notification created Successfully",
            data
        })

    } catch (error) {
        res.status(500).json({
            message: error
        })
    }
}

const viewNotification = async (req, res) => {

    try {
        const { id } = req.params
        const data = await notification.findById(id)

        res.status(200).json({
            message: "notification found Successfully ",
            data
        })
    } catch (error) {
        res.status(500).json({
            message: error
        })
    }
}

const viewAllNotification = async (req, res) => {

    try {
        const data = await notification.find()

        res.status(200).json({
            message: "All notifications found Successfully", data
        })
    } catch (error) {
        res.status(500).json({
            message: error
        })
    }
}

const markAsRead = async (req, res) => {

    try {
        const { id } = req.params
        const data = await notification.findByIdAndUpdate(id,{status:"Read"},{new:true})

        res.status(200).json({
            message: "notification read Successfully", data
        })

    } catch (error) {
        res.status(500).json({
            message: error
        })
    }
}

const deleteNotification = async (req, res) => {

    try {
        const { id } = req.params
        const data = await notification.findByIdAndDelete(id)

        res.status(200).json({
            message: "notification deleted Successfully", data
        })

    } catch (error) {
        res.status(500).json({
            message: error
        })
    }
}

module.exports = {
    createNotification,
    viewNotification,
    viewAllNotification,
    markAsRead,
    deleteNotification
}