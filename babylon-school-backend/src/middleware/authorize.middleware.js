function authorize(...roles) {
    return (req, res, next) => {
        try {
            if (!req.user) {
                return res.status(401).json({
                    success: false,
                    message: "Unauthorized. Please login first.",
                });
            }

            if (!roles.includes(req.user.role)) {
                return res.status(403).json({
                    success: false,
                    message:
                        "Forbidden. You do not have permission to access this resource.",
                });
            }

            next();

        } catch (error) {
            console.error("authorize:", error.message);

            return res.status(500).json({
                success: false,
                message: "Internal Server Error",
            });
        }
    };
}

module.exports = authorize;