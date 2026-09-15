const Report = require("../../model/report");


const addReport = async (req, res) => {
  try {
    const { reportId } = req.body;

    const existingReport = await Report.findOne({ reportId });

    if (existingReport) {
      return res.status(400).json({
        success: false,
        message: "Report already exists"
      });
    }

    const report = await Report.create(req.body);

    res.status(201).json({
      success: true,
      message: "Report created successfully",
      data: report
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

const findReport = async (req, res) => {
  try {
    const report = await Report.findOne(req.params.id)

    if (!report) {
      return res.status(404).json({
        success: false,
        message: "Report not found",
      });
    }

    res.json({
      success: true,
      data: report,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const updateReport = async (req, res) => {
  try {
    const report = await Report.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

    if (!report) {
      return res.status(404).json({
        success: false,
        message: "Report not found",
      });
    }

    res.json({
      success: true,
      message: "Report updated successfully",
      data: report,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const updateReportStatus = async (req, res) => {

  try {
    const { id } = req.params
    const { status } = req.body
    const data = await Report.updateOne({ _id: id }, { status: status })
    res.status(201).json({
      success: true,
      message: "status updated successfully",
      data: data
    })
  } catch (error) {
    console.log(error);
    res.status(409).json({
      success: false,
      message: "Internal Server Error",
      error: error.message
    })
  }
}

const deleteReport = async (req, res) => {
  try {
    const report = await Report.findByIdAndDelete(req.params.id);

    if (!report) {
      return res.status(404).json({
        success: false,
        message: "Report not found",
      });
    }

    res.json({
      success: true,
      message: "Report deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const findAllReport = async (req, res) => {

  try {
    const data = await Report.find();
    res.json({
      success: true,
      data: data,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

module.exports = {
  addReport,
  findReport,
  updateReportStatus,
  updateReport,
  deleteReport,
  findAllReport,


}