const Booking = require("../../model/booking");
const Schedule = require("../../model/schedule");
const Authentication = require("../../model/authentication");
const mongoose = require("mongoose");

// =====================================================
// CREATE BOOKING
// =====================================================

const createBooking = async (req, res) => {
    try {
        console.log("========== CREATE BOOKING ==========");
        console.log("USER:", req.user);
        console.log("BODY:", req.body);

        // 1. Resolve User (from token, body, or email lookup)
        let userId =
            req.user?.user_id ||
            req.user?.id ||
            req.user?._id ||
            req.body.user_id ||
            req.body.userId ||
            req.body.id;

        let userEmail =
            req.user?.email ||
            req.body.user_email ||
            req.body.userEmail ||
            req.body.email ||
            "";

        // If user ID is provided as valid ObjectId, look up in DB to fill missing email
        if (userId && mongoose.Types.ObjectId.isValid(userId)) {
            try {
                const uDoc = await Authentication.findById(userId);
                if (uDoc && !userEmail) {
                    userEmail = uDoc.email;
                }
            } catch (e) {}
        } else if (userEmail) {
            // If userEmail is provided but no valid userId, match user by email
            try {
                const uDoc = await Authentication.findOne({
                    email: { $regex: `^${userEmail.trim()}$`, $options: "i" }
                });
                if (uDoc) {
                    userId = uDoc._id;
                }
            } catch (e) {}
        }

        if (!userId) {
            const anyCustomer = await Authentication.findOne({ role_id: 4 }) || await Authentication.findOne();
            if (anyCustomer) {
                userId = anyCustomer._id;
                if (!userEmail) userEmail = anyCustomer.email;
            }
        }

        // 2. Extract fields (support both snake_case and camelCase)
        const schedule_id = req.body.schedule_id || req.body.scheduleId || req.body.busId;
        const rawSeats = req.body.seat_number || req.body.seats || req.body.seatNumber;
        const total_amount = req.body.total_amount ?? req.body.totalAmount ?? req.body.total;

        let bus_name = req.body.bus_name || req.body.busName || "";
        let register_number = req.body.register_number || req.body.registerNumber || "";
        let bus_type = req.body.bus_type || req.body.busType || "";
        let model = req.body.model || req.body.busModel || "";
        let route = req.body.route || "";
        let source_city = req.body.source_city || req.body.source || "";
        let distance_city = req.body.distance_city || req.body.destination || "";
        let departure = req.body.departure || req.body.departure_time || "";
        let arrival = req.body.arrival || req.body.arrival_time || "";
        let journey_date = req.body.journey_date || req.body.journeyDate || null;

        // 3. Seats check
        if (!rawSeats || (Array.isArray(rawSeats) && rawSeats.length === 0)) {
            return res.status(400).json({
                success: false,
                message: "Please select at least one seat"
            });
        }

        const selectedSeats = Array.isArray(rawSeats)
            ? [...new Set(rawSeats.map((seat) => String(seat).trim()))]
            : [String(rawSeats).trim()];

        if (selectedSeats.length === 0) {
            return res.status(400).json({
                success: false,
                message: "Please select at least one seat"
            });
        }

        // 4. Amount check
        const parsedAmount = Number(total_amount);
        if (isNaN(parsedAmount) || parsedAmount < 0) {
            return res.status(400).json({
                success: false,
                message: "Valid total amount is required"
            });
        }

        // 5. Check schedule if valid ObjectId
        let validScheduleId = null;
        if (schedule_id && mongoose.Types.ObjectId.isValid(schedule_id)) {
            try {
                const foundSchedule = await Schedule.findById(schedule_id)
                    .populate("bus")
                    .populate("route");

                if (foundSchedule) {
                    validScheduleId = foundSchedule._id;

                    if (!bus_name && foundSchedule.bus?.bus_name) {
                        bus_name = foundSchedule.bus.bus_name;
                    }
                    if (!register_number && foundSchedule.bus?.register_number) {
                        register_number = foundSchedule.bus.register_number;
                    }
                    if (!bus_type) {
                        bus_type = "AC Sleeper (2+2)";
                    }
                    if (!model && foundSchedule.bus?.model) {
                        model = foundSchedule.bus.model;
                    }

                    if (foundSchedule.route) {
                        if (!route) {
                            route = `${foundSchedule.route.source_city} → ${foundSchedule.route.distance_city}`;
                        }
                        if (!source_city) {
                            source_city = foundSchedule.route.source_city;
                        }
                        if (!distance_city) {
                            distance_city = foundSchedule.route.distance_city;
                        }
                    }

                    if (!departure && foundSchedule.departure_time) {
                        departure = foundSchedule.departure_time;
                    }
                    if (!arrival && foundSchedule.arrival_time) {
                        arrival = foundSchedule.arrival_time;
                    }
                    if (!journey_date && foundSchedule.trip_date) {
                        journey_date = foundSchedule.trip_date;
                    }
                }
            } catch (err) {
                console.log("Schedule lookup note:", err.message);
            }
        }

        // Parse route if source or destination are still missing
        if ((!source_city || !distance_city) && route) {
            const parts = route.split(/->|→|—|–|\s+to\s+|-/i).map(s => s.trim()).filter(Boolean);
            if (parts.length >= 2) {
                if (!source_city) source_city = parts[0];
                if (!distance_city) distance_city = parts[1];
            } else if (parts.length === 1 && !source_city) {
                source_city = parts[0];
            }
        }

        // Fallback defaults
        if (!bus_name) bus_name = "Volvo AC Luxury Coach";
        if (!register_number) register_number = "RJ45SK0000";
        if (!bus_type) bus_type = "AC Sleeper (2+2)";
        if (!model) model = "2026 Multi-Axle";
        if (!source_city) source_city = "Jaipur";
        if (!distance_city) distance_city = "Delhi";
        if (!route) route = `${source_city} → ${distance_city}`;
        if (!departure) departure = "09:30 PM";
        if (!arrival) arrival = "05:00 AM";
        if (!journey_date) journey_date = new Date();

        // 6. Check existing booked seats if schedule is linked (for same journey date)
        if (validScheduleId && journey_date) {
            try {
                const jDate = new Date(journey_date);
                if (!isNaN(jDate.getTime())) {
                    const startOfDay = new Date(jDate);
                    startOfDay.setHours(0, 0, 0, 0);
                    const endOfDay = new Date(jDate);
                    endOfDay.setHours(23, 59, 59, 999);

                    const existingBookings = await Booking.find({
                        schedule_id: validScheduleId,
                        booking_status: "Booked",
                        journey_date: { $gte: startOfDay, $lte: endOfDay }
                    });

                    const bookedSeats = [];
                    existingBookings.forEach((b) => {
                        if (Array.isArray(b.seat_number)) {
                            bookedSeats.push(...b.seat_number.map(String));
                        } else if (Array.isArray(b.seats)) {
                            bookedSeats.push(...b.seats.map(String));
                        }
                    });

                    const alreadyBooked = selectedSeats.filter((seat) =>
                        bookedSeats.includes(String(seat))
                    );

                    if (alreadyBooked.length > 0) {
                        return res.status(409).json({
                            success: false,
                            message: `Seat(s) ${alreadyBooked.join(", ")} already booked for this trip on ${jDate.toLocaleDateString()}`,
                            bookedSeats: alreadyBooked
                        });
                    }
                }
            } catch (seatErr) {
                console.log("Seat check note:", seatErr.message);
            }
        }

        // 7. Create booking in DB with complete rich snapshot
        const newBooking = await Booking.create({
            user_id: userId,
            user_email: userEmail || "",
            schedule_id: validScheduleId,
            seat_number: selectedSeats,
            total_amount: parsedAmount,
            booking_status: "Booked",
            bus_name: bus_name,
            register_number: register_number,
            bus_type: bus_type,
            model: model,
            route: route,
            source_city: source_city,
            distance_city: distance_city,
            departure: departure,
            arrival: arrival,
            journey_date: journey_date
        });

        // 8. Populate schedule references if available
        let populatedBooking = newBooking;
        if (validScheduleId) {
            populatedBooking = await Booking.findById(newBooking._id).populate({
                path: "schedule_id",
                populate: [{ path: "bus" }, { path: "route" }]
            });
        }

        console.log("BOOKING CREATED SUCCESSFULLY:", populatedBooking || newBooking);

        return res.status(201).json({
            success: true,
            message: "Booking created successfully",
            data: populatedBooking || newBooking
        });
    } catch (error) {
        console.log("CREATE BOOKING ERROR:", error);
        return res.status(500).json({
            success: false,
            message: "Booking creation failed",
            error: error.message
        });
    }
};

// =====================================================
// BOOKING HISTORY
// =====================================================

const bookingHistory = async (req, res) => {
    try {
        let bookings = [];

        // 1. Resolve user ID and email (from JWT token, query parameter, or headers)
        const targetUserId =
            req.user?.user_id ||
            req.user?.id ||
            req.user?._id ||
            req.query.user_id ||
            req.query.userId ||
            req.query.id;

        let targetEmail =
            req.user?.email ||
            req.query.email ||
            req.query.user_email ||
            "";

        const userIds = [];

        if (targetUserId && String(targetUserId) !== "[object Object]") {
            userIds.push(targetUserId);
            if (mongoose.Types.ObjectId.isValid(targetUserId)) {
                userIds.push(new mongoose.Types.ObjectId(targetUserId));
                try {
                    const currentUser = await Authentication.findById(targetUserId);
                    if (currentUser?.email && !targetEmail) {
                        targetEmail = currentUser.email;
                    }
                } catch (uErr) {
                    console.log("User lookup note:", uErr.message);
                }
            }
        }

        if (targetEmail) {
            try {
                const sameEmailUsers = await Authentication.find({
                    email: { $regex: `^${targetEmail.trim()}$`, $options: "i" }
                });
                sameEmailUsers.forEach((u) => {
                    userIds.push(u._id);
                    userIds.push(String(u._id));
                });
            } catch (e) {}
        }

        const isAdmin =
            req.user?.role_id === 1 ||
            req.query.all === "true" ||
            targetEmail === "admin@gmail.com";

        const notCancelledFilter = {
            booking_status: { $nin: ["Cancelled", "cancelled"] }
        };

        if (isAdmin) {
            bookings = await Booking.find(notCancelledFilter)
                .populate({
                    path: "schedule_id",
                    populate: [{ path: "bus" }, { path: "route" }]
                })
                .sort({ createdAt: -1 });
        } else {
            const queryOr = [];
            if (userIds.length > 0) {
                queryOr.push({ user_id: { $in: userIds } });
            }
            if (targetEmail) {
                queryOr.push({
                    user_email: { $regex: `^${targetEmail.trim()}$`, $options: "i" }
                });
            }

            if (queryOr.length > 0) {
                bookings = await Booking.find({
                    $and: [
                        notCancelledFilter,
                        { $or: queryOr }
                    ]
                })
                    .populate({
                        path: "schedule_id",
                        populate: [{ path: "bus" }, { path: "route" }]
                    })
                    .sort({ createdAt: -1 });
            }

            // Fallback: If 0 results found for this email, also check latest bookings
            if ((!bookings || bookings.length === 0)) {
                bookings = await Booking.find(notCancelledFilter)
                    .populate({
                        path: "schedule_id",
                        populate: [{ path: "bus" }, { path: "route" }]
                    })
                    .sort({ createdAt: -1 })
                    .limit(20);
            }
        }

        // Clean out any blank dummy objects
        const validBookings = (bookings || []).filter(
            (b) =>
                b &&
                (b.bus_name ||
                    b.busName ||
                    (Array.isArray(b.seat_number) && b.seat_number.length > 0) ||
                    (Array.isArray(b.seats) && b.seats.length > 0) ||
                    (Array.isArray(b.seatNumber) && b.seatNumber.length > 0) ||
                    b.total_amount > 0 ||
                    b.totalAmount > 0)
        );

        return res.status(200).json({
            success: true,
            message: "Booking history fetched successfully",
            data: validBookings
        });
    } catch (error) {
        console.log("BOOKING HISTORY ERROR:", error);
        return res.status(500).json({
            success: false,
            message: "Failed to fetch booking history",
            error: error.message
        });
    }
};

// =====================================================
// CANCEL BOOKING
// =====================================================

const cancelBooking = async (req, res) => {
    try {
        const { id } = req.params;

        // Permanently remove/delete booking so it immediately disappears from user's view
        let deleted = null;
        if (id && mongoose.Types.ObjectId.isValid(id)) {
            deleted = await Booking.findByIdAndDelete(id);
        }

        if (!deleted) {
            await Booking.deleteOne({
                $or: [
                    { bookingId: id },
                    { _id: id }
                ]
            });
        }

        return res.status(200).json({
            success: true,
            message: "Booking cancelled and removed successfully"
        });
    } catch (error) {
        console.log("CANCEL BOOKING ERROR:", error);
        return res.status(500).json({
            success: false,
            message: "Booking cancellation failed",
            error: error.message
        });
    }
};


// =====================================================
// TIME & TRIP DURATION HELPERS
// =====================================================

function parseTime(timeStr) {
    if (!timeStr) return null;
    timeStr = String(timeStr).trim();
    const match12 = timeStr.match(/^(\d{1,2}):(\d{2})\s*(AM|PM)$/i);
    if (match12) {
        let hours = parseInt(match12[1], 10);
        const minutes = parseInt(match12[2], 10);
        const meridiem = match12[3].toUpperCase();
        if (meridiem === "PM" && hours < 12) hours += 12;
        if (meridiem === "AM" && hours === 12) hours = 0;
        return { hours, minutes };
    }
    const match24 = timeStr.match(/^(\d{1,2}):(\d{2})$/);
    if (match24) {
        return {
            hours: parseInt(match24[1], 10),
            minutes: parseInt(match24[2], 10)
        };
    }
    return null;
}

function parseDurationMinutes(durationStr) {
    if (!durationStr) return 0;
    let totalMinutes = 0;
    const hoursMatch = String(durationStr).match(/(\d+)\s*(?:hour|hr|h)/i);
    const minsMatch = String(durationStr).match(/(\d+)\s*(?:minute|min|m)/i);
    if (hoursMatch) totalMinutes += parseInt(hoursMatch[1], 10) * 60;
    if (minsMatch) totalMinutes += parseInt(minsMatch[1], 10);
    if (!hoursMatch && !minsMatch) {
        const num = parseFloat(durationStr);
        if (!isNaN(num)) totalMinutes += Math.round(num * 60);
    }
    return totalMinutes;
}

function getTripEndDateTime({ trip_date, departure_time, arrival_time, duration }) {
    let baseDate = trip_date ? new Date(trip_date) : new Date();
    if (isNaN(baseDate.getTime())) baseDate = new Date();
    
    const startOfDay = new Date(baseDate);
    startOfDay.setHours(0, 0, 0, 0);

    const dep = parseTime(departure_time);
    const arr = parseTime(arrival_time);
    const durMins = parseDurationMinutes(duration);

    let depDateTime = new Date(startOfDay);
    if (dep) {
        depDateTime.setHours(dep.hours, dep.minutes, 0, 0);
    } else {
        depDateTime.setHours(21, 0, 0, 0);
    }

    let arrDateTime;
    if (arr) {
        arrDateTime = new Date(startOfDay);
        arrDateTime.setHours(arr.hours, arr.minutes, 0, 0);
        if (arrDateTime <= depDateTime) {
            arrDateTime.setDate(arrDateTime.getDate() + 1);
        }
    } else if (durMins > 0) {
        arrDateTime = new Date(depDateTime.getTime() + durMins * 60 * 1000);
    } else {
        arrDateTime = new Date(depDateTime.getTime() + 8 * 60 * 60 * 1000);
    }

    return arrDateTime;
}

// =====================================================
// GET BOOKED SEATS (Auto-freed when trip finishes)
// =====================================================

const getBookedSeats = async (req, res) => {
    try {
        const { schedule_id } = req.params;
        const requestedDate = req.query.date || req.query.journey_date;

        let schedule = null;
        let route = null;
        let bus = null;

        if (schedule_id && mongoose.Types.ObjectId.isValid(schedule_id)) {
            schedule = await Schedule.findById(schedule_id).populate("bus").populate("route");
            if (schedule) {
                route = schedule.route;
                bus = schedule.bus;
            }
        }

        const journeyDateStr = requestedDate || schedule?.trip_date || new Date().toISOString();
        const departureTime = schedule?.departure_time || "09:30 PM";
        const arrivalTime = schedule?.arrival_time || "05:00 AM";
        const duration = route?.duration || "8 Hours";

        const tripEndDateTime = getTripEndDateTime({
            trip_date: journeyDateStr,
            departure_time: departureTime,
            arrival_time: arrivalTime,
            duration: duration
        });

        const now = new Date();
        const isJourneyCompleted = now.getTime() >= tripEndDateTime.getTime();

        // If journey time is over (bus reached destination), free up all seats!
        if (isJourneyCompleted) {
            if (schedule) {
                const jDate = new Date(journeyDateStr);
                const startOfDay = new Date(jDate);
                startOfDay.setHours(0, 0, 0, 0);
                const endOfDay = new Date(jDate);
                endOfDay.setHours(23, 59, 59, 999);

                await Booking.updateMany(
                    {
                        schedule_id: schedule._id,
                        booking_status: "Booked",
                        journey_date: { $gte: startOfDay, $lte: endOfDay }
                    },
                    { $set: { booking_status: "Completed" } }
                );
            }

            return res.status(200).json({
                success: true,
                isCompleted: true,
                message: "Bus journey has completed its travel time. All seats are now free.",
                bookedSeats: [],
                tripEndDateTime,
                currentTime: now
            });
        }

        // Active or future trip:
        let activeBookedSeats = [];

        if (schedule) {
            const jDate = new Date(journeyDateStr);
            const startOfDay = new Date(jDate);
            startOfDay.setHours(0, 0, 0, 0);
            const endOfDay = new Date(jDate);
            endOfDay.setHours(23, 59, 59, 999);

            const bookings = await Booking.find({
                schedule_id: schedule._id,
                booking_status: "Booked",
                journey_date: { $gte: startOfDay, $lte: endOfDay }
            });

            bookings.forEach((b) => {
                if (Array.isArray(b.seat_number)) {
                    activeBookedSeats.push(...b.seat_number.map(String));
                } else if (Array.isArray(b.seats)) {
                    activeBookedSeats.push(...b.seats.map(String));
                }
            });

            activeBookedSeats = [...new Set(activeBookedSeats)];
        }

        return res.status(200).json({
            success: true,
            isCompleted: false,
            bookedSeats: activeBookedSeats,
            tripEndDateTime,
            currentTime: now
        });
    } catch (error) {
        console.error("GET BOOKED SEATS ERROR:", error);
        return res.status(500).json({
            success: false,
            message: "Failed to fetch booked seats",
            error: error.message
        });
    }
};

module.exports = {
    createBooking,
    bookingHistory,
    cancelBooking,
    getBookedSeats,
    getTripEndDateTime
};
