const Settings = require("../../model/settings");

const createSettings = async (req, res) => {
  try {
    // check if settings already exists
    const existingSettings = await Settings.findOne();

    if (existingSettings) {
      return res.status(400).json({
        success: false,
        message: "Settings already exist. You can only update it."
      });
    }

    const settings = await Settings.create(req.body);

    res.status(201).json({
      success: true,
      message: "Settings created successfully",
      data: settings
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};
const getSettings = async (req, res) => {
  try {
    const settings = await Settings.findOne();

    if (!settings) {
      return res.status(404).json({
        success: false,
        message: "Settings not found"
      });
    }

    res.status(200).json({
      success: true,
      data: settings
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};
const updateSettings = async (req, res) => {
  try {
    const settings = await Settings.findOne();

    if (!settings) {
      return res.status(404).json({
        success: false,
        message: "Settings not found"
      });
    }

    const updated = await Settings.findByIdAndUpdate(
      settings._id,
      req.body,
      { new: true, runValidators: true }
    );

    res.status(200).json({
      success: true,
      message: "Settings updated successfully",
      data: updated
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};
module.exports={
createSettings,
getSettings,
updateSettings



}