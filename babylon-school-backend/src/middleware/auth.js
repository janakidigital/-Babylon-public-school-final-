const jwt = require("jsonwebtoken");


// ==========================================
// PROTECT MIDDLEWARE
// ==========================================

async function protect(req, res, next) {
    try {
        const token = req.cookies?.token;

        if (!token) {
            return res.status(401).json({
                success: false,
                message: "Unauthorized. Please login first.",
            });
        }

        const decoded = jwt.verify(
            token,
            process.env.JWT_SECRET ||
            process.env.JWT_secret
        );

        req.user = decoded;

        next();

    } catch (error) {
        console.error("protect:", error.message);

        return res.status(401).json({
            success: false,
            message: "Invalid or expired token",
        });
    }
}


async function optionalProtect(req, res, next) {
    try {
        const token = req.cookies?.token;
        if (!token) return next();
        req.user = jwt.verify(
            token,
            process.env.JWT_SECRET || process.env.JWT_secret
        );
    } catch {
        req.user = undefined;
    }
    next();
}

module.exports = {
    protect,
    optionalProtect,
};