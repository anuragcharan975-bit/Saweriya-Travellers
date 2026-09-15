const Faq = require("../../model/faq");

const findActiveFaq = async (req, res) => {
    try {
        const data = await Faq.find({ status: true }).sort({ createdAt: -1 });

        res.status(200).json({
            success: true,
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

module.exports = {
    findActiveFaq,
};