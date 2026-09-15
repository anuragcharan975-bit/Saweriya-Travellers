const Offer = require("../../model/offer");

const addOffer = async (req, res) => {
    try {
        const { title, description, discount } = req.body;

        const existingOffer = await Offer.findOne({
            title: title.trim(),
        });

        if (existingOffer) {
            return res.status(409).json({
                success: false,
                message: "Offer already exists.",
            });
        }

        const data = await Offer.create({
            title,
            description,
            discount,
        });

        res.status(201).json({
            success: true,
            message: "Offer Added Successfully.",
            data,
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Internal Server Error",
            error: error.message,
        });
    }
};

const findAllOffer = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 5;
        const skip = (page - 1) * limit;

        const totalRecords = await Offer.countDocuments();

        const data = await Offer.find()
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit);

        res.status(200).json({
            success: true,
            message: "All Offers found successfully.",
            data,
            currentPage: page,
            totalPages: Math.ceil(totalRecords / limit),
            totalRecords,
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Internal Server Error",
            error: error.message,
        });
    }
};

const findOffer = async (req, res) => {
    try {
        const { id } = req.params;

        const data = await Offer.findById(id);

        if (!data) {
            return res.status(404).json({
                success: false,
                message: "Offer not found.",
            });
        }

        res.status(200).json({
            success: true,
            message: "Offer found successfully.",
            data,
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Internal Server Error",
            error: error.message,
        });
    }
};

const updateOffer = async (req, res) => {
    try {
        const { id } = req.params;

        const data = await Offer.findByIdAndUpdate(
            id,
            req.body,
            {
                new: true,
                runValidators: true,
            }
        );

        if (!data) {
            return res.status(404).json({
                success: false,
                message: "Offer not found.",
            });
        }

        res.status(200).json({
            success: true,
            message: "Offer updated successfully.",
            data,
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Internal Server Error",
            error: error.message,
        });
    }
};

const deleteOffer = async (req, res) => {
    try {
        const { id } = req.params;

        const data = await Offer.findById(id);

        if (!data) {
            return res.status(404).json({
                success: false,
                message: "Offer not found.",
            });
        }

        await Offer.findByIdAndDelete(id);

        res.status(200).json({
            success: true,
            message: "Offer deleted successfully.",
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Internal Server Error",
            error: error.message,
        });
    }
};

const updateOfferStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const { status } = req.body;

        const data = await Offer.updateOne(
            { _id: id },
            { status: status }
        );

        res.status(201).json({
            success: true,
            message: "Status updated successfully.",
            data,
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
    addOffer,
    findAllOffer,
    findOffer,
    updateOffer,
    deleteOffer,
    updateOfferStatus,
};