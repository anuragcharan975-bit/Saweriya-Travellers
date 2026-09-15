const Admin = require("../../model/admin")

const bcrypt = require("bcrypt")
const generateToken = require("../../utils/jwt")

const login = async (req, res) => {

    try {
        const { email, password } = req.body;

        const data = await Admin.findOne({
            email,
            role_id: 1
        });

        if (!data) {
            return res.status(401).json({
                message: "Invalid Email"
            });
        }

        const isMatch = await bcrypt.compare(password, data.password);

        if (!isMatch) {
            return res.status(401).json({
                message: "Invalid Password"
            });
        }

        const token = generateToken({
            id: data._id,
            role_id: data.role_id
        });

        res.status(200).json({
            message: "Login Successful",
            token,
            role_id: data.role_id,
            user_id: data._id
        });

    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
};

module.exports = {
    login

}
