const Route = require("../../model/route")


const addRoute = async (req, res) => {

    try {
        const data = await Route.create(req.body);
        res.status(201).json({
            success: "true",
            message: "Route added successfully",
            data: data
        });

    } catch (error) {
        console.log(error);
        res.status(409).json({
            success: false,
            message: "Internal Server Error",
            error: error.message
        });
    }

}

const findRoute = async (req, res) => {

    try {
        const { id } = req.params
        const data = await Route.findOne({ _id: id })
        res.json({
            success: "true",
            message: "found Route successfully",
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

const updateRoute = async (req, res) => {

    try {
        const { id } = req.params
        const updateData = req.body
        const data = await Route.updateOne({ _id: id }, updateData)
        res.status(201).json({
            success: "true",
            message: "updated Route successfully",
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

const updateRouteStatus = async (req, res) => {

    try {
        const { id } = req.params
        const { status } = req.body
        const data = await Route.updateOne({ _id: id }, { status: status })
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

const deleteRoute = async (req, res) => {

    try {
        const { id } = req.params
        const data = await Route.deleteOne({ _id: id })
        res.status(201).json({
            success: "true",
            message: "Deleted Route successfully",
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

const findAllRoute = async (req, res) => {

    try {
        const page = Number(req.query.page);
        const limit = Number(req.query.limit);

        if (!page || !limit) {
            const data = await Route.find()
                .sort({ createdAt: -1 });

            return res.status(200).json({
                success: true,
                message: "All routes found successfully",
                data: data,
            });
        }

        const skip = (page - 1) * limit;

        const totalRecords = await Route.countDocuments();

        const data = await Route.find()
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit);

        res.status(200).json({
            success: true,
            message: "All routes found successfully",
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
}

const ViewPopularRoutes = async (req, res) => {

    try {

        const routes = await Route.find()
            .sort({ createdAt: -1 })
            .limit(4);


        res.status(200).json({
            success: true,
            data: routes
        })


    } catch (error) {

        res.status(500).json({
            success: false,
            message: error.message
        })

    }

}



module.exports = {
    addRoute,
    findRoute,
    updateRoute,
    updateRouteStatus,
    deleteRoute,
    findAllRoute,
    ViewPopularRoutes

}
