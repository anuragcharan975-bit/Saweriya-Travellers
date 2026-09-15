const Faq = require("../../model/faq");

const addFaq = async (req, res) => {

    try {
        const { question, answer } = req.body;

        const existingFaq = await Faq.findOne({
            question: question.trim(),
        });

        if (existingFaq) {
            return res.status(409).json({
                success: false,
                message: "Question already exists.",
            });
        }

        const data = await Faq.create({
            question,
            answer,
        });

        res.status(201).json({
            success: true,
            message: "FAQ Added Successfully.",
            data: data,
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Internal Server Error",
            error: error.message,
        });
    }
};

const findAllFaq = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 5;
        const skip = (page - 1) * limit;

        const totalRecords = await Faq.countDocuments();

        const data = await Faq.find()
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit);

        res.status(200).json({
            success: true,
            message: "All FAQ found successfully.",
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

const findFaq = async (req, res) => {
    try {
        const { id } = req.params;

        const data = await Faq.findById(id);

        if (!data) {
            return res.status(404).json({
                success: false,
                message: "FAQ not found.",
            });
        }

        res.status(200).json({
            success: true,
            message: "FAQ found successfully.",
            data: data,
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Internal Server Error",
            error: error.message,
        });
    }
};

const updateFaq = async (req, res) => {
    try {
        const { id } = req.params;

        const data = await Faq.findByIdAndUpdate(
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
                message: "FAQ not found.",
            });
        }

        res.status(200).json({
            success: true,
            message: "FAQ updated successfully.",
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

const deleteFaq = async (req, res) => {

    try {
        const { id } = req.params;

        const data = await Faq.findById(id);

        if (!data) {
            return res.status(404).json({
                success: false,
                message: "FAQ not found.",
            });
        }

        await Faq.findByIdAndDelete(id);

        res.status(200).json({
            success: true,
            message: "FAQ deleted successfully.",
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Internal Server Error",
            error: error.message,
        });
    }
};

const updateFaqStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const { status } = req.body;

        const data = await Faq.updateOne(
            { _id: id },
            { status: status }
        );

        res.status(201).json({
            success: true,
            message: "Status updated successfully.",
            data: data,
        });

    } catch (error) {
        console.log(error);

        res.status(409).json({
            success: false,
            message: "Internal Server Error",
            error: error.message,
        });
    }
};

module.exports = {
    addFaq,
    findAllFaq,
    findFaq,
    updateFaq,
    deleteFaq,
    updateFaqStatus,
};