const jwt = require("jsonwebtoken");

const generateToken = (data) => {

    return jwt.sign(

        {
            user_id: data._id,
            email: data.email,
            role_id: data.role_id
        },

        "mysecretkey",

        {
            expiresIn: "1d"
        }
    );
};

module.exports = generateToken;