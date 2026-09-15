const schedule = require("../../model/schedule");

// =====================================================
// SEARCH BUS
// =====================================================

const searchBus = async (req, res) => {
    try {

        const {
            source_city,
            distance_city,
            trip_date
        } = req.body;

        console.log("SEARCH BODY:", req.body);

        // -----------------------------------------------
        // VALIDATION
        // -----------------------------------------------

        if (!source_city || !distance_city) {
            return res.status(400).json({
                success: false,
                message: "Source city and destination city are required"
            });
        }

        // -----------------------------------------------
        // SEARCH CONDITION
        // -----------------------------------------------

        const searchCondition = {};

        // Agar date select ki hai
        if (trip_date) {

            searchCondition.$or = [
                {
                    journey_date: trip_date
                },
                {
                    journeyDate: trip_date
                },
                {
                    trip_date: trip_date
                }
            ];

        }

        // -----------------------------------------------
        // GET SCHEDULES
        // -----------------------------------------------

        const data = await schedule
            .find(searchCondition)
            .populate({
                path: "route",
                match: {
                    source_city: {
                        $regex: `^${source_city.trim()}$`,
                        $options: "i"
                    },

                    distance_city: {
                        $regex: `^${distance_city.trim()}$`,
                        $options: "i"
                    }
                }
            })
            .populate("bus")
            .sort({ createdAt: -1 });

        // -----------------------------------------------
        // REMOVE SCHEDULES WHERE ROUTE DID NOT MATCH
        // -----------------------------------------------

        const filteredData = data.filter(
            item => item.route !== null
        );

        console.log("SEARCH RESULT:", filteredData);

        // -----------------------------------------------
        // NO BUS
        // -----------------------------------------------

        if (filteredData.length === 0) {

            return res.status(404).json({
                success: false,
                message: "No buses found for this route",
                data: []
            });

        }

        // -----------------------------------------------
        // SUCCESS
        // -----------------------------------------------

        return res.status(200).json({
            success: true,
            message: "Bus Found",
            data: filteredData
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

        const {
            busType,
            minFare,
            maxFare
        } = req.query;

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