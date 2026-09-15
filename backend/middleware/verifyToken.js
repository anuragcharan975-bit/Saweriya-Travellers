const jwt = require("jsonwebtoken");

const verifyToken = (req, res, next) => {

    try {

        const authHeader = req.headers.authorization;

        if (!authHeader) {

            return res.status(401).json({

                success: false,

                message: "Authorization token is required"

            });

        }


        const token = authHeader.startsWith("Bearer ")

            ? authHeader.split(" ")[1]

            : authHeader;


        if (!token) {

            return res.status(401).json({

                success: false,

                message: "Token is missing"

            });

        }


        const decoded = jwt.verify(
            token,
            "mysecretkey"
        );


        req.user = decoded;


        next();

    }
    catch (error) {

        console.log(
            "JWT Verify Error:",
            error
        );


        return res.status(401).json({

            success: false,

            message: "Invalid or expired token"

        });

    }

};


module.exports = verifyToken;