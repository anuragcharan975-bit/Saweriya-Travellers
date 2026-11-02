const Staff = require("../../model/staff");

const addStaff = async (req, res) => {
  try {
    const { email } = req.body;

    const existingStaff = await Staff.findOne({ email });

    if (existingStaff) {
      return res.status(409).json({
        success: false,
        message: "Staff with this email already exists.",
      });
    }

    const staffData = { ...req.body };

    // Clean bus reference if empty
    if (
      !staffData.bus ||
      staffData.bus === "" ||
      staffData.bus === "null" ||
      staffData.bus === "undefined"
    ) {
      delete staffData.bus;
    }

    if (req.file) {
      staffData.photo = req.file.filename;
    }

    const data = await Staff.create(staffData);

    res.status(201).json({
      success: true,
      message: "Staff added successfully",
      data: data,
    });
  } catch (error) {
    console.log(error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const findStaff = async (req, res) => {
  try {
    const { id } = req.params;

    const data = await Staff.findOne({ _id: id }).populate("bus");

    res.status(200).json({
      success: true,
      message: "Staff Found Successfully",
      data: data,
    });
  } catch (error) {
    console.log(error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const updateStaff = async (req, res) => {
  try {
    const { id } = req.params;

    const updateData = { ...req.body };

    // Clean bus reference if empty
    if (
      !updateData.bus ||
      updateData.bus === "" ||
      updateData.bus === "null" ||
      updateData.bus === "undefined"
    ) {
      updateData.bus = null;
    }

    if (req.file) {
      updateData.photo = req.file.filename;
    }

    const data = await Staff.findByIdAndUpdate(id, updateData, { new: true });

    res.status(200).json({
      success: true,
      message: "Staff Updated Successfully",
      data: data,
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

const updateStaffStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    const data = await Staff.updateOne({ _id: id }, { status: status });

    res.status(200).json({
      success: true,
      message: "Status Updated Successfully",
      data: data,
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

const deleteStaff = async (req, res) => {
  try {
    const { id } = req.params;
    const data = await Staff.deleteOne({ _id: id });

    res.status(200).json({
      success: true,
      message: "Staff Deleted Successfully",
      data: data,
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

const findAllStaff = async (req, res) => {
  try {
    const page = Number(req.query.page);
    const limit = Number(req.query.limit);

    const filter = {
      role_id: { $in: [2, 3] }, // Driver & Conductor only
    };

    // Without Pagination
    if (!page || !limit) {
      const data = await Staff.find(filter)
        .populate("bus")
        .sort({ createdAt: -1 });

      return res.status(200).json({
        success: true,
        message: "All staff found successfully",
        data,
      });
    }

    // With Pagination
    const skip = (page - 1) * limit;

    const totalRecords = await Staff.countDocuments(filter);

    const data = await Staff.find(filter)
      .populate("bus")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    return res.status(200).json({
      success: true,
      message: "All staff found successfully",
      data,
      currentPage: page,
      totalPages: Math.ceil(totalRecords / limit),
      totalRecords,
    });
  } catch (error) {
    console.log(error);

    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
      error: error.message,
    });
  }
};

module.exports = {
  addStaff,
  findStaff,
  updateStaff,
  updateStaffStatus,
  deleteStaff,
  findAllStaff,
};
