const Seat = require("../../model/seat");


const addSeat = async (req, res) => {

  try {
    const existingSeat = await Seat.findOne({
      bus: req.body.bus,
      seat_number: req.body.seat_number,
    });

    if (existingSeat) {
      return res.status(409).json({
        success: false,
        message: "Seat number already exists for this bus.",
      });
    }
    const data = await Seat.create(req.body);

    res.status(201).json({
      success: true,
      message: "Seat created successfully",
      data: data
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
}

const findSeat = async (req, res) => {

  try {
    const { id } = req.params
    const data = await Seat.findOne({ _id: id });

    res.status(200).json({
      success: true,
      data: data
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
}

const updateSeat = async (req, res) => {

  try {
    const { id } = req.params
    const updateData = req.body
    const data = await Seat.updateOne({ _id: id }, updateData)
    res.status(201).json({
      success: "true",
      message: "Updated Seat Successfully",
      data: data
    })
  } catch (error) {
    console.log(error);
    res.status(409).json({
      success: false,
      message: "Internal Server Error",
      error: error.message
    });
  }
}

const updateSeatStatus = async (req, res) => {

  try {
    const { id } = req.params
    const { status } = req.body
    const data = await Seat.updateOne({ _id: id }, { status: status })
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

const deleteSeat = async (req, res) => {

  try {
    const { id } = req.params
    const data = await Seat.deleteOne({ _id: id })
    res.status(201).json({
      success: "true",
      message: "Deleted Seat Successfully",
      data: data
    })
  } catch (error) {
    console.log(error);
    res.status(409).json({
      success: false,
      message: "Internal Server Error",
      error: error.message
    });
  }
}

const findAllSeat = async (req, res) => {

  try {
    const page = Number(req.query.page);
    const limit = Number(req.query.limit);

    if (!page || !limit) {
      const data = await Seat.find()
        .populate("bus")
        .populate("bus_type")
        .sort({ createdAt: -1 });

      return res.status(200).json({
        success: true,
        message: "All seats found successfully",
        data: data,
      });
    }

    const skip = (page - 1) * limit;

    const totalRecords = await Seat.countDocuments();

    const data = await Seat.find()
      .populate("bus")
      .populate("bus_type")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    res.status(200).json({
      success: true,
      message: "All seats found successfully",
      data: data,
      currentPage: page,
      totalPages: Math.ceil(totalRecords / limit),
      totalRecords,
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

const findSeatByBus = async (req, res) => {

  try {
    const { busId } = req.params;

    const data = await Seat.find({ bus: busId })
      .populate("bus")
      .populate("bus_type")
      .sort({ seat_number: 1 });

    res.status(200).json({
      success: true,
      message: "Seats found successfully",
      data,
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

module.exports = {
  addSeat,
  findSeat,
  updateSeat,
  updateSeatStatus,
  deleteSeat,
  findAllSeat,
  findSeatByBus
}