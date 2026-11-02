const Booking = require("../../model/booking");
const Schedule = require("../../model/schedule");

// =====================================================
// VIEW ALL BOOKINGS (Admin)
// =====================================================

const viewAllBookings = async (req, res) => {
    try {
        const bookings = await Booking.find({})
            .populate({
                path: "schedule_id",
                populate: [{ path: "bus" }, { path: "route" }]
            })
            .populate("user_id", "full_name email mobile_no")
            .sort({ createdAt: -1 });

        const validBookings = (bookings || []).filter(
            (b) =>
                b &&
                (b.bus_name ||
                    b.busName ||
                    (Array.isArray(b.seat_number) && b.seat_number.length > 0) ||
                    (Array.isArray(b.seats) && b.seats.length > 0) ||
                    b.total_amount > 0)
        );

        return res.status(200).json({
            success: true,
            message: "All bookings fetched successfully",
            total: validBookings.length,
            data: validBookings
        });
    } catch (error) {
        console.error("Admin view all bookings error:", error);
        return res.status(500).json({
            success: false,
            message: "Failed to fetch bookings",
            error: error.message
        });
    }
};

// =====================================================
// UPDATE BOOKING STATUS (Confirm / Cancel / Complete)
// =====================================================

const updateBookingStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const { status } = req.body;

        if (!status) {
            return res.status(400).json({
                success: false,
                message: "Status is required"
            });
        }

        const updated = await Booking.findByIdAndUpdate(
            id,
            { booking_status: status },
            { new: true }
        );

        if (!updated) {
            return res.status(404).json({
                success: false,
                message: "Booking not found"
            });
        }

        return res.status(200).json({
            success: true,
            message: `Booking status updated to ${status}`,
            data: updated
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

module.exports = {
    viewAllBookings,
    updateBookingStatus
};
