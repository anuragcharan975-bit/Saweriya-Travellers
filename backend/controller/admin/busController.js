const Bus = require("../../model/bus")
const Staff = require("../../model/staff")

const addBus = async (req, res) => {

    try {
        const { register_number } = req.body;

        const existingBus = await Bus.findOne({ register_number });

        if (existingBus) {
            return res.status(409).json({
                success: false,
                message: "Bus with this register number already exists."
            });
        }

        const data = await Bus.create({
            ...req.body,
            bus_image: req.file ? req.file.filename : ""
        });

        res.status(201).json({
            success: true,
            message: "Bus added successfully.",
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

const findBus = async (req, res) => {

    try {
        const { id } = req.params
        const data = await Bus.findOne({ _id: id })

        res.status(201).json({
            success: true,
            message: "Bus found successfully",
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

const updateBus = async (req, res) => {

    try {
        const { id } = req.params
        const updateData = { ...req.body }

        if (req.file) {
            updateData.bus_image = req.file.filename
        }

        console.log(req.body);

        const data = await Bus.updateOne({ _id: id }, updateData)

        res.status(200).json({
            success: true,
            message: "Bus updated successfully",
            data: data
        });

    } catch (error) {
        console.log(error);
        res.status(409).json({
            success: false,
            message: "Internal Server Error",
            error: error.message
        })
    }
};

const updateBusStatus = async (req, res) => {

    try {
        const { id } = req.params
        const { status } = req.body
        const data = await Bus.updateOne({ _id: id }, { status: status })
        res.status(201).json({
            success: true,
            message: "Bus status updated successfully",
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

const deleteBus = async (req, res) => {

    try {
        const { id } = req.params
        const data = await Bus.deleteOne({ _id: id })
        res.status(201).json({
            success: true,
            message: "Bus deleted successfully",
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

const SeachData = async (req, res) => {

    try {
        const { RegisterNumber, BusName } = req.body || {};
        const page = Number(req.query.page);
        const limit = Number(req.query.limit);
        const filter = {};

        if (RegisterNumber) {
            filter.register_number = {
                $regex: RegisterNumber,
                $options: "i",
            };
        }

        if (BusName) {
            filter.bus_name = {
                $regex: BusName,
                $options: "i",
            };
        }
        if (!page || !limit) {
            const data = await Bus.find(filter)
                .populate("bus_type")
                .sort({ createdAt: -1 });

            return res.status(200).json({
                success: true,
                message: "All buses found successfully",
                data: data,
            });
        }

        const skip = (page - 1) * limit;

        const totalRecords = await Bus.countDocuments(filter);

        const data = await Bus.find(filter)
            .populate("bus_type")
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit);

        res.status(200).json({
            success: true,
            message: "All buses found successfully",
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
};

const findAllStaff = async (req, res) => {

    try {
        const data = await Staff.find({
            role_id: { $in: [2, 3] }
        })
            .populate("bus")
            .sort({ createdAt: -1 });

        return res.status(200).json({
            success: true,
            message: "All staff found successfully",
            data: data,
        });
    }
    catch (error) {
        console.log(error);

        res.status(500).json({
            success: false,
            message: "Internal Server Error",
            error: error.message,
        });
    }
};

const assignBus = async (req, res) => {
    try {

        const { bus, driver, conductor } = req.body;

        if (!bus || !driver || !conductor) {
            return res.status(400).json({
                success: false,
                message: "Bus, Driver and Conductor are required."
            });
        }

        // Check Driver
        const driverExists = await Staff.findOne({
            _id: driver,
            bus: { $ne: null }
        });

        if (driverExists) {
            return res.status(400).json({
                success: false,
                message: "Driver is already assigned to another bus."
            });
        }

        // Check Conductor
        const conductorExists = await Staff.findOne({
            _id: conductor,
            bus: { $ne: null }
        });

        if (conductorExists) {
            return res.status(400).json({
                success: false,
                message: "Conductor is already assigned to another bus."
            });
        }

        // Assign Bus to Driver
        await Staff.findByIdAndUpdate(driver, {
            bus: bus
        });

        // Assign Bus to Conductor
        await Staff.findByIdAndUpdate(conductor, {
            bus: bus
        });

        return res.status(200).json({
            success: true,
            message: "Bus assigned successfully."
        });

    } catch (error) {
        console.log(error);

        return res.status(500).json({
            success: false,
            message: "Internal Server Error",
            error: error.message
        });
    }
};

const findAllBus = async (req, res) => {

    try {
        const { RegisterNumber, BusName } = req.body || {};
        const page = Number(req.query.page);
        const limit = Number(req.query.limit);
        const filter = {};

        if (RegisterNumber) {
            filter.register_number = {
                $regex: RegisterNumber,
                $options: "i",
            };
        }

        if (BusName) {
            filter.bus_name = {
                $regex: BusName,
                $options: "i",
            };
        }
        if (!page || !limit) {
            const data = await Bus.find(filter)
                .populate("bus_type")
                .sort({ createdAt: -1 });

            return res.status(200).json({
                success: true,
                message: "All buses found successfully",
                data: data,
            });
        }

        const skip = (page - 1) * limit;

        const totalRecords = await Bus.countDocuments(filter);

        const data = await Bus.find(filter)
            .populate("bus_type")
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit);

        res.status(200).json({
            success: true,
            message: "All buses found successfully",
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
};

module.exports = {
    addBus,
    findBus,
    updateBus,
    updateBusStatus,
    deleteBus,
    findAllBus,
    findAllStaff,
    assignBus,
    SeachData,

}