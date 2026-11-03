const schedule = require("../../model/schedule");
const Route = require("../../model/route");
const Bus = require("../../model/bus");
const { findMatchingRoutes } = require("../../utils/fuzzySearch");

// =====================================================
// SEARCH BUS
// =====================================================

const searchBus = async (req, res) => {
    try {
        const source_city = req.body?.source_city || req.query?.source_city;
        const distance_city = req.body?.distance_city || req.query?.distance_city;
        const trip_date = req.body?.trip_date || req.query?.trip_date;

        console.log("SEARCH PARAMS:", { source_city, distance_city, trip_date });

        // -----------------------------------------------
        // VALIDATION
        // -----------------------------------------------

        if (!source_city && !distance_city) {
            return res.status(400).json({
                success: false,
                message: "Source city or destination city is required"
            });
        }

        // -----------------------------------------------
        // FUZZY ROUTE MATCHING
        // -----------------------------------------------

        const allRoutes = await Route.find();
        const routes = findMatchingRoutes(allRoutes, source_city, distance_city);

        if (routes.length === 0) {
            return res.status(404).json({
                success: false,
                message: "No buses found for this route",
                data: []
            });
        }

        const routeIds = routes.map((r) => r._id);

        // -----------------------------------------------
        // GET SCHEDULES
        // -----------------------------------------------

        let filter = {
            route: { $in: routeIds }
        };

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

        let filteredData = await schedule
            .find(filter)
            .populate("route")
            .populate("bus")
            .sort({ createdAt: -1 });

        // Fallback if trip_date exact match returned 0
        if (filteredData.length === 0 && trip_date) {
            filteredData = await schedule
                .find({ route: { $in: routeIds } })
                .populate("route")
                .populate("bus")
                .sort({ createdAt: -1 });
        }

        // Preserve route relevance order (e.g. Saweriya Seth prioritized over Salasar)
        const routeRank = new Map();
        routes.forEach((r, idx) => routeRank.set(String(r._id), idx));
        filteredData.sort((a, b) => {
            const aId = String(a.route?._id || a.route);
            const bId = String(b.route?._id || b.route);
            const aRank = routeRank.has(aId) ? routeRank.get(aId) : 999;
            const bRank = routeRank.has(bId) ? routeRank.get(bId) : 999;
            return aRank - bRank;
        });

        // Auto-provision if route has no schedule yet
        if (filteredData.length === 0 && routes.length > 0) {
            const busDoc = await Bus.findOne({ status: true }) || await Bus.findOne();
            if (busDoc) {
                const autoSched = await schedule.create({
                    route: routes[0]._id,
                    bus: busDoc._id,
                    departure_time: "09:30 PM",
                    arrival_time: "05:00 AM",
                    trip_date: trip_date ? new Date(trip_date) : new Date(),
                    status: true
                });
                filteredData = await schedule
                    .find({ _id: autoSched._id })
                    .populate("bus")
                    .populate("route");
            }
        }

        if (filteredData.length === 0) {
            return res.status(404).json({
                success: false,
                message: "No buses found for this route",
                data: []
            });
        }

        return res.status(200).json({
            success: true,
            message: "Bus Found",
            data: filteredData,
            matchedRoutes: routes
        });

    } catch (error) {
        console.log("SEARCH BUS ERROR:", error);
        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// =====================================================
// SEARCH BY DATE
// =====================================================

const searchByDate = async (req, res) => {
    try {
        const { date } = req.query;
        const data = await schedule.find({
            journeyDate: date
        });
        return res.status(200).json({
            success: true,
            data: data
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// =====================================================
// SEARCH BY ROUTE
// =====================================================

const searchByRoute = async (req, res) => {
    try {
        const { routeId } = req.params;
        const data = await schedule
            .find({ routeId })
            .populate("route")
            .populate("bus");
        return res.status(200).json({
            success: true,
            data: data
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// =====================================================
// FILTER BUS
// =====================================================

const filterBus = async (req, res) => {
    try {
        const { busType, minFare, maxFare } = req.query;
        const data = await schedule.find({
            busType,
            fare: {
                $gte: minFare,
                $lte: maxFare
            }
        });
        return res.status(200).json({
            success: true,
            data: data
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// =====================================================
// EXPORT
// =====================================================

module.exports = {
    searchBus,
    searchByDate,
    searchByRoute,
    filterBus
};
