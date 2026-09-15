const User = require("../../model/user");

const addUser = async (req, res) => {

    try {
        const image = req?.file?.filename || "";

        const data = await User.create({
            ...req.body,
            photo: image,
        });

        return res.status(201).json({
            success: true,
            message: "User added successfully",
            data,
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

const findUser = async (req, res) => {
    try {
        const data = await User.findOne({ _id: req.params.id });

        if (!data) {
            return res.status(404).json({
                success: false,
                message: "User not found",
            });
        }

        return res.status(200).json({
            success: true,
            message: "User found successfully",
            data,
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

const updateUser = async (req, res) => {

    try {
        const data = await User.findOne({ _id: req.params.id });

        if (!data) {
            return res.status(404).json({
                success: false,
                message: "User not found",
            });
        }

        const updateData = { ...req.body };

        if (req.file) {
            updateData.photo = req.file.filename;
        }

        await User.updateOne(
            { _id: req.params.id },
            { $set: updateData }
        );

        const updatedData = await User.findOne({ _id: req.params.id });

        return res.status(200).json({
            success: true,
            message: "User updated successfully",
            data: updatedData,
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

const deleteUser = async (req, res) => {
    try {
        const data = await User.findOne({ _id: req.params.id });

        if (!data) {
            return res.status(404).json({
                success: false,
                message: "User not found",
            });
        }

        await User.deleteOne({ _id: req.params.id });

        return res.status(200).json({
            success: true,
            message: "User deleted successfully",
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

const findallUser = async (req, res) => {
    try {
        const page = Number(req.query.page) || 1;
        const limit = Number(req.query.limit) || 5;

        const skip = (page - 1) * limit;

        const filter = { role_id: 4 };

        const totalRecords = await User.countDocuments(filter);

        const data = await User.find(filter)
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit);

        return res.status(200).json({
            success: true,
            message: "Users found successfully",
            data,
            currentPage: page,
            totalPages: Math.ceil(totalRecords / limit),
            totalRecords,
        });

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

const updateUserStatus = async (req, res) => {
    try {
        const { id } = req.params;

        const checkUser = await User.findOne({ _id: id });

        if (!checkUser) {
            return res.status(404).json({
                success: false,
                message: "User not found",
            });
        }

        await User.updateOne(
            { _id: id },
            { $set: req.body }
        );

        const data = await User.findOne({ _id: id });

        return res.status(200).json({
            success: true,
            message: "User status updated successfully",
            data,
        });

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};
const searchUser=async(req,res)=>{
     try {
        const { email } = req.body || {};
        const page = Number(req.query.page);
        const limit = Number(req.query.limit);
        const filter = {};

        if (email) {
            filter.email = {
                $regex: email,
                $options: "i",
            };
        }

       
        if (!page || !limit) {
            const data = await User.find(filter)
                .populate("bus_type")
                .sort({ createdAt: -1 });

            return res.status(200).json({
                success: true,
                message: " user found successfully",
                data: data,
            });
        }

        const skip = (page - 1) * limit;

        const totalRecords = await User.countDocuments(filter);

        const data = await User.find(filter)
            // .populate("bus_type")
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit);

        res.status(200).json({
            success: true,
            message: "All buses found successfully",
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


module.exports = {
    addUser,
    findUser,
    updateUser,
    deleteUser,
    findallUser,
    updateUserStatus,
    searchUser
};