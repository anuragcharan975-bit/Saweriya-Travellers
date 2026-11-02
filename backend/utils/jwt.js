const jwt = require("jsonwebtoken");

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
        "mysecretkey",
        {
            expiresIn: "1d",
        }
    );
};

module.exports = generateToken;
