const Schedule = require("../../model/schedule");

const addSchedule = async (req, res) => {

    try {
        const data = await Schedule.create(req.body);

        return res.status(201).json({
            success: true,
            message: "Schedule added successfully",
            data: data
        });

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Internal Server Error",
            error: error.message
        });
    }
};

const findSchedule = async (req, res) => {

    try {
        const data = await Schedule.findById(req.params.id)
            .populate("bus")
            .populate("route");

        if (!data) {
            return res.status(404).json({
                success: false,
                message: "Schedule not found"
            });
        }

        return res.status(200).json({
            success: true,
            message: "Schedule found successfully",
            data: data
        });

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Internal Server Error",
            error: error.message
        });
    }
};

const updateSchedule = async (req, res) => {
    try {
        const data = await Schedule.findByIdAndUpdate(
            req.params.id,
            req.body,
            {
                returnDocument: "after",
                runValidators: true
            }
        );

        if (!data) {
            return res.status(404).json({
                success: false,
                message: "Schedule not found"
            });
        }

        return res.status(200).json({
            success: true,
            message: "Schedule updated successfully",
            data: data
        });

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Internal Server Error",
            error: error.message
        });
    }
};

const updateScheduleStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const { status } = req.body;

        const data = await Schedule.findByIdAndUpdate(
            id,
            { status: status },
            {
                returnDocument: "after",
                runValidators: true
            }
        );

        if (!data) {
            return res.status(404).json({
                success: false,
                message: "Schedule not found"
            });
        }

        return res.status(200).json({
            success: true,
            message: "Status updated successfully",
            data: data
        });

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Internal Server Error",
            error: error.message
        });
    }
};

const deleteSchedule = async (req, res) => {

    try {
        const data = await Schedule.findByIdAndDelete(req.params.id);

        if (!data) {
            return res.status(404).json({
                success: false,
                message: "Schedule not found"
            });
        }

        return res.status(200).json({
            success: true,
            message: "Schedule deleted successfully",
            data: data
        });

    } catch (error) {

        return res.status(500).json({
            success: false,
            message: "Internal Server Error",
            error: error.message
        });
    }
};

const findAllSchedule = async (req, res) => {

    try {
        const page = Number(req.query.page);
        const limit = Number(req.query.limit);

        if (!page || !limit) {
            const data = await Schedule.find()
                .populate("bus")
                .populate("route")
                .sort({ createdAt: -1 });

            return res.status(200).json({
                success: true,
                message: "All schedules found successfully",
                data: data
            });
        }

        const skip = (page - 1) * limit;

        const totalRecords = await Schedule.countDocuments();

        const data = await Schedule.find()
            .populate("bus")
            .populate("route")
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit);

        return res.status(200).json({
            success: true,
            message: "All schedules found successfully",
            data: data,
            currentPage: page,
            totalPages: Math.ceil(totalRecords / limit),
            totalRecords: totalRecords
        });

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Internal Server Error",
            error: error.message
        });
    }
};

const viewScheduleByRoute = async (req, res) => {

    try {
        const data = await Schedule.find({
            route: req.params.id
        })
            .populate("bus")
            .populate("route")
            .sort({ createdAt: -1 });

        if (data.length === 0) {
            return res.status(404).json({
                success: false,
                message: "No schedules found for this route"
            });
        }

        return res.status(200).json({
            success: true,
            message: "Schedules found successfully",
            data: data
        });

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Internal Server Error",
            error: error.message
        });
    }
};

const searchSchedule = async (req, res) => {

    try {

        const {
            source_city,
            distance_city,
            trip_date
        } = req.body;

        const source = source_city?.trim() || "";
        const destination = distance_city?.trim() || "";

        // ==========================================
        // VALIDATION
        // ==========================================

        if (!source || !destination) {
            return res.status(400).json({
                success: false,
                message: "Source city and destination city are required"
            });
        }

        // ==========================================
        // FIND ROUTES
        // ==========================================

        const Route = require("../../model/route");

        const routes = await Route.find({
            source_city: {
                $regex: `^${source}$`,
                $options: "i"
            },
            distance_city: {
                $regex: `^${destination}$`,
                $options: "i"
            }
        });

        // ==========================================
        // NO ROUTE FOUND
        // ==========================================

        if (routes.length === 0) {
            return res.status(404).json({
                success: false,
                message: "No route found",
                data: []
            });
        }

        const routeIds = routes.map((route) => route._id);

        // ==========================================
        // SCHEDULE FILTER
        // ==========================================

        const filter = {
            route: { $in: routeIds }
        };

        // ==========================================
        // DATE FILTER
        // ==========================================

        if (trip_date) {

            const start = new Date(trip_date);

            if (isNaN(start.getTime())) {
                return res.status(400).json({
                    success: false,
                    message: "Invalid trip date"
                });
            }

            start.setHours(0, 0, 0, 0);

            const end = new Date(start);
            end.setDate(end.getDate() + 1);

            filter.trip_date = {
                $gte: start,
                $lt: end
            };
        }

        // ==========================================
        // FIND SCHEDULES
        // ==========================================

        const schedules = await Schedule.find(filter)
            .populate("bus")
            .populate("route")
            .sort({ createdAt: -1 });

        // ==========================================
        // NO SCHEDULE FOUND
        // ==========================================

        if (schedules.length === 0) {
            return res.status(404).json({
                success: false,
                message: "No buses found for this route",
                data: []
            });
        }

        // ==========================================
        // SUCCESS
        // ==========================================

        return res.status(200).json({
            success: true,
            message: "Buses found successfully",
            data: schedules
        });

    } catch (error) {

        console.log("Search Schedule Error:", error);

        return res.status(500).json({
            success: false,
            message: "Internal Server Error",
            error: error.message
        });
    }
};

module.exports = {
    addSchedule,
    findSchedule,
    updateSchedule,
    updateScheduleStatus,
    deleteSchedule,
    findAllSchedule,
    viewScheduleByRoute,
    searchSchedule
};