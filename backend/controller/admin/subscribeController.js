const Subscribe = require("../../model/subscribe");

const viewAllSubscribe = async (req, res) => {

  try {
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 5;

    const totalRecords = await Subscribe.countDocuments();

    const data = await Subscribe.find()
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit);

    res.status(200).json({
      success: true,
      message: "Subscribe subscribers fetched successfully.",
      data,
      currentPage: page,
      totalPages: Math.ceil(totalRecords / limit),
      totalRecords,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Something went wrong.",
      error: error.message,
    });
  }
};

module.exports = {
  viewAllSubscribe,
};