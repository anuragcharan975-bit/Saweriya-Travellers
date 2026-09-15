const Offer = require("../../model/offer");

const findActiveOffers = async (req, res) => {

  try {
    const offers = await Offer.find({ status: true });

    res.status(200).json({
      success: true,
      data: offers,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

module.exports = {
  findActiveOffers,
};