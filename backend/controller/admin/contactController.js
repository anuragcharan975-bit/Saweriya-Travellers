const Contact = require("../../model/contact");

const addContact = async (req, res) => {

    try {
        const data = await Contact.create(req.body)

        res.status(201).json({
            message: "Message Added Successfully",
            data:data
        })

    } catch (error) {
        res.status(500).json({
            message: error
        })
    }
}

const viewAllContact = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 5;
    const skip = (page - 1) * limit;

    const totalRecords = await Contact.countDocuments();

    const data = await Contact.find()
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    res.status(200).json({
      message: "All Contacts Found Successfully",
      data,
      currentPage: page,
      totalPages: Math.ceil(totalRecords / limit),
      totalRecords,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

const deleteContact = async (req, res) => {

    try {
        const { id } = req.params
        const data = await Contact.findByIdAndDelete(id)

        res.status(200).json({
            message: "Contact deleted Successfully", data
        })

    } catch (error) {
        res.status(500).json({
            message: error
        })
    }
}

module.exports = {
    addContact,
    viewAllContact,
    deleteContact
}