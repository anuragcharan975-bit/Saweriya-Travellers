const Subscribe = require("../../model/subscribe");

const addSubscribe = async (req, res) => {

  try {
    const { email } = req.body;

    const existing = await Subscribe.findOne({ email });

    if (existing) {
      return res.status(400).json({
        success: false,
        message: "Email already Subscribed.",
      });
    }

    await Subscribe.create({ email });

    res.status(201).json({
      success: true,
      message: "Subscription Added Successfully.",
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Something went wrong.",
    });
  }
};

module.exports = { addSubscribe };