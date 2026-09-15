const Bustype = require("../../model/busType")


const addBusType = async (req, res) => {

    try {

        const  {bus_type}  = req.body;

        const existingBusType = await Bustype.findOne( {bus_type} );

        if (existingBusType) {
            return res.status(409).json({
                success: false,
                message: "BusType already exists."
            });
        }

        const data = await Bustype.create(req.body);

        res.status(201).json({
            success: true,
            message: "BusType added successfully.",
            data: data
        });

    } catch (error) {

        console.log(error);

        res.status(500).json({
            success: false,
            message: "Internal Server Error",
            error: error.message
        });

    }

}

const findBusType = async (req, res) => {

    try {
        const { id } = req.params
        const data = await Bustype.findOne({ _id: id })

        res.status(201).json({
            success: true,
            message: "BusType found successfully",
            data: data
        })
    } catch (error) {
        console.log(error);
        res.status(409).json({
            success: false,
            message: "Internal Server Error",
            error: error.message
        })
    }
}

const updateBusType = async (req, res) => {

    try {
        const { id } = req.params
        const updateData = req.body
        const data = await Bustype.updateOne({ _id: id }, updateData)

        res.status(201).json({
            success: true,
            message: "BusType updated successfully",
            data: data
        })
    } catch (error) {
        console.log(error);
        res.status(409).json({
            success: false,
            message: "Internal Server Error",
            error: error.message
        })
    }
}

const updateBusTypeStatus = async (req, res) => {

    try {
        const { id } = req.params
        const { status } = req.body
        const data = await Bustype.updateOne({ _id: id }, { status: status })
        res.status(201).json({
            success: true,
            message: "status updated successfully",
            data: data
        })
    } catch (error) {
        console.log(error);
        res.status(409).json({
            success: false,
            message: "Internal Server Error",
            error: error.message
        })
    }
}

const deleteBusType = async (req, res) => {

    try {
        const { id } = req.params
        const data = await Bustype.deleteOne({ _id: id })
        res.status(201).json({
            success: true,
            message: "BusType deleted successfully",
            data: data
        })
    } catch (error) {
        console.log(error);
        res.status(409).json({
            success: false,
            message: "Internal Server Error",
            error: error.message
        })
    }
}

const findAllBusType = async (req, res) => {

    try {
        const page = Number(req.query.page);
        const limit = Number(req.query.limit);

        if (!page || !limit) {
            const data = await Bustype.find()
                .sort({ createdAt: -1 });

            return res.status(200).json({
                success: true,
                message: "All Bustypes found successfully",
                data: data,
            });
        }

        const skip = (page - 1) * limit;

        const totalRecords = await Bustype.countDocuments();

        const data = await Bustype.find()
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit);

        res.status(200).json({
            success: true,
            message: "All Bustypes found successfully",
            data: data,
            currentPage: page,
            totalPages: Math.ceil(totalRecords / limit),
            totalRecords,
        });

    } catch (error) {
        console.log(error);

        res.status(500).json({
            success: false,
            message: "Internal Server Error",
            error: error.message,
        });
    }
}


module.exports = {
    addBusType,
    findBusType,
    updateBusType,
    updateBusTypeStatus,
    deleteBusType,
    findAllBusType
}