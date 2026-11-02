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
        let data = await Schedule.find({
            route: req.params.id
        })
            .populate("bus")
            .populate("route")
            .sort({ createdAt: -1 });

        // If no schedule exists yet for this valid route, auto-provision one with an active bus
        if (data.length === 0) {
            const Route = require("../../model/route");
            const Bus = require("../../model/bus");
            const routeDoc = await Route.findById(req.params.id);
            if (routeDoc) {
                const busDoc = await Bus.findOne({ status: true }) || await Bus.findOne();
                if (busDoc) {
                    const newSched = await Schedule.create({
                        route: routeDoc._id,
                        bus: busDoc._id,
                        departure_time: "09:30 PM",
                        arrival_time: "05:00 AM",
                        trip_date: new Date(),
                        status: true
                    });
                    data = await Schedule.find({ _id: newSched._id })
                        .populate("bus")
                        .populate("route");
                }
            }
        }

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

        const source = (source_city || "").trim();
        const destination = (distance_city || "").trim();

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
        // FIND ROUTES (Smart Bidirectional & Keyword Match)
        // ==========================================

        const Route = require("../../model/route");
        const Bus = require("../../model/bus");

        const escapeRegex = (s) => s.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&");

        const srcRegex = new RegExp(escapeRegex(source), "i");
        const dstRegex = new RegExp(escapeRegex(destination), "i");

        const srcTokens = source.split(/\s+/).filter(Boolean);
        const dstTokens = destination.split(/\s+/).filter(Boolean);

        const conditions = [
            // 1. Forward match
            {
                source_city: { $regex: srcRegex },
                distance_city: { $regex: dstRegex }
            },
            // 2. Reverse match
            {
                source_city: { $regex: dstRegex },
                distance_city: { $regex: srcRegex }
            },
            // 3. Route name contains both
            {
                $and: [
                    { route_name: { $regex: srcRegex } },
                    { route_name: { $regex: dstRegex } }
                ]
            }
        ];

        // 4. Token combinations (e.g. 'saweriya' in 'saweriya seth')
        srcTokens.forEach((st) => {
            if (st.length > 2) {
                const sReg = new RegExp(escapeRegex(st), "i");
                dstTokens.forEach((dt) => {
                    if (dt.length > 2) {
                        const dReg = new RegExp(escapeRegex(dt), "i");
                        conditions.push({
                            source_city: { $regex: sReg },
                            distance_city: { $regex: dReg }
                        });
                        conditions.push({
                            source_city: { $regex: dReg },
                            distance_city: { $regex: sReg }
                        });
                        conditions.push({
                            $and: [
                                { route_name: { $regex: sReg } },
                                { route_name: { $regex: dReg } }
                            ]
                        });
                    }
                });
            }
        });

        let routes = await Route.find({ $or: conditions });

        // Fallback fuzzy search if still no routes found
        if (routes.length === 0) {
            const allRoutes = await Route.find();
            const sLower = source.toLowerCase();
            const dLower = destination.toLowerCase();

            routes = allRoutes.filter((r) => {
                const rSrc = (r.source_city || "").toLowerCase();
                const rDst = (r.distance_city || "").toLowerCase();
                const rName = (r.route_name || "").toLowerCase();

                const fwd = (rSrc.includes(sLower) || sLower.includes(rSrc)) &&
                            (rDst.includes(dLower) || dLower.includes(rDst));
                const rev = (rSrc.includes(dLower) || dLower.includes(rSrc)) &&
                            (rDst.includes(sLower) || sLower.includes(rDst));
                const name = (rName.includes(sLower) || sLower.includes(rName)) &&
                             (rName.includes(dLower) || dLower.includes(rName));

                return fwd || rev || name;
            });
        }

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
            if (!isNaN(start.getTime())) {
                start.setHours(0, 0, 0, 0);
                const end = new Date(start);
                end.setDate(end.getDate() + 1);

                filter.trip_date = {
                    $gte: start,
                    $lt: end
                };
            }
        }

        // ==========================================
        // FIND SCHEDULES
        // ==========================================

        let schedules = await Schedule.find(filter)
            .populate("bus")
            .populate("route")
            .sort({ createdAt: -1 });

        // If trip_date filter returned 0, try without trip_date filter so customer sees available buses
        if (schedules.length === 0 && trip_date) {
            schedules = await Schedule.find({ route: { $in: routeIds } })
                .populate("bus")
                .populate("route")
                .sort({ createdAt: -1 });
        }

        // If still no schedule exists for matched routes, auto-provision a schedule with an active bus!
        if (schedules.length === 0 && routes.length > 0) {
            const busDoc = await Bus.findOne({ status: true }) || await Bus.findOne();
            if (busDoc) {
                const autoSched = await Schedule.create({
                    route: routes[0]._id,
                    bus: busDoc._id,
                    departure_time: "09:30 PM",
                    arrival_time: "05:00 AM",
                    trip_date: trip_date ? new Date(trip_date) : new Date(),
                    status: true
                });
                schedules = await Schedule.find({ _id: autoSched._id })
                    .populate("bus")
                    .populate("route");
            }
        }

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