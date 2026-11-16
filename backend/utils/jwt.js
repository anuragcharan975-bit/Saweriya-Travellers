const jwt = require("jsonwebtoken");

const JWT_SECRET = process.env.JWT_SECRET || "saweriya_jwt_default_secret_key";

const generateToken = (data) => {
    const id = data._id || data.user_id || data.id;
    return jwt.sign(
        {
            _id: id,
            id: id,
            user_id: id,
            email: data.email,
            role_id: data.role_id,
        },
        JWT_SECRET,
        {
            expiresIn: "1d",
        }
    );
};

module.exports = generateToken;
