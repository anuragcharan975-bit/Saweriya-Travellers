const jwt = require("jsonwebtoken");

const optionalToken = (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;
        if (!authHeader) {
            req.user = null;
            return next();
        }

        const token = authHeader.startsWith("Bearer ")
            ? authHeader.split(" ")[1]
            : authHeader;

        if (!token || token === "null" || token === "undefined" || token.trim() === "") {
            req.user = null;
            return next();
        }

        const decoded = jwt.verify(token, "mysecretkey");
        req.user = decoded;
        next();
    } catch (error) {
        // Token invalid or expired - gracefully continue without crashing or blocking
        req.user = null;
        next();
    }
};

module.exports = optionalToken;
