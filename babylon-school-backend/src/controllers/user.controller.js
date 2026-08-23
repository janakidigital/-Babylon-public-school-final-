const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const User = require("../models/user.model");

const {
    uploadToCloudinary,
    deleteFromCloudinary,
} = require("../services/storage.service");


// ==========================================
// GENERATE JWT
// ==========================================

const generateToken = (userId, role) => {
    return jwt.sign(
        {
            id: userId,
            role: role,
        },
        process.env.JWT_SECRET || process.env.JWT_secret,
        {
            expiresIn: "7d",
        }
    );
};


// ==========================================
// REGISTER USER
// ==========================================
// Public registration.
//
// IMPORTANT:
// Public registration can ONLY create "user".
// It cannot create:
// - admin
// - superAdmin
// ==========================================

const registerUser = async (req, res) => {
    try {
        const { name, email, password } = req.body;

        // ==========================================
        // VALIDATION
        // ==========================================

        if (!name || !email || !password) {
            return res.status(400).json({
                success: false,
                message: "Name, email and password are required",
            });
        }

        if (name.trim().length < 2) {
            return res.status(400).json({
                success: false,
                message: "Name must be at least 2 characters",
            });
        }

        if (password.length < 6) {
            return res.status(400).json({
                success: false,
                message: "Password must be at least 6 characters",
            });
        }

        // ==========================================
        // NORMALIZE EMAIL
        // ==========================================

        const normalizedEmail = email
            .toLowerCase()
            .trim();

        // ==========================================
        // CHECK EXISTING USER
        // ==========================================

        const existingUser = await User.findOne({
            email: normalizedEmail,
        });

        if (existingUser) {
            return res.status(409).json({
                success: false,
                message: "User with this email already exists",
            });
        }

        // ==========================================
        // HASH PASSWORD
        // ==========================================

        const hashedPassword = await bcrypt.hash(
            password,
            10
        );

        // ==========================================
        // CREATE USER
        // ==========================================
        // IMPORTANT:
        // Never take role from req.body.
        //
        // Even if someone sends:
        //
        // {
        //     "role": "superAdmin"
        // }
        //
        // it will be ignored.
        //
        // Public registration ALWAYS creates "user".
        // ==========================================

        const user = await User.create({
            name: name.trim(),
            email: normalizedEmail,
            password: hashedPassword,
            role: "user",
            isActive: true,
        });

        // ==========================================
        // GENERATE JWT
        // ==========================================

        const token = generateToken(
            user._id,
            user.role
        );

        // ==========================================
        // STORE JWT IN HTTP-ONLY COOKIE
        // ==========================================

        res.cookie("token", token, {
            httpOnly: true,
            secure:
                process.env.NODE_ENV === "production",
            sameSite: "lax",
            maxAge: 7 * 24 * 60 * 60 * 1000,
        });

        // ==========================================
        // RESPONSE
        // ==========================================

        return res.status(201).json({
            success: true,
            message: "User registered successfully",

            data: {
                user: {
                    id: user._id,
                    name: user.name,
                    email: user.email,
                    role: user.role,
                    profileImage: user.profileImage,
                    isActive: user.isActive,
                },
            },
        });

    } catch (error) {
        console.error("registerUser:", error);

        // Duplicate email
        if (error.code === 11000) {
            return res.status(409).json({
                success: false,
                message: "User with this email already exists",
            });
        }

        return res.status(500).json({
            success: false,
            message: "Internal Server Error",
        });
    }
};


// ==========================================
// LOGIN USER
// ==========================================
// Works for:
// - user
// - admin
// - superAdmin
// ==========================================

const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;

        // ==========================================
        // VALIDATION
        // ==========================================

        if (!email || !password) {
            return res.status(400).json({
                success: false,
                message: "Email and password are required",
            });
        }

        const normalizedEmail = email
            .toLowerCase()
            .trim();

        // ==========================================
        // FIND USER
        // ==========================================

        const user = await User.findOne({
            email: normalizedEmail,
        });

        if (!user) {
            return res.status(401).json({
                success: false,
                message: "Invalid email or password",
            });
        }

        // ==========================================
        // CHECK ACCOUNT STATUS
        // ==========================================

        if (!user.isActive) {
            return res.status(403).json({
                success: false,
                message: "Your account is inactive",
            });
        }

        // ==========================================
        // CHECK PASSWORD
        // ==========================================

        const isPasswordMatch = await bcrypt.compare(
            password,
            user.password
        );

        if (!isPasswordMatch) {
            return res.status(401).json({
                success: false,
                message: "Invalid email or password",
            });
        }

        // ==========================================
        // GENERATE JWT
        // ==========================================

        const token = generateToken(
            user._id,
            user.role
        );

        // ==========================================
        // STORE TOKEN IN COOKIE
        // ==========================================

        res.cookie("token", token, {
            httpOnly: true,
            secure:
                process.env.NODE_ENV === "production",
            sameSite: "lax",
            maxAge: 7 * 24 * 60 * 60 * 1000,
        });

        // ==========================================
        // RESPONSE
        // ==========================================

        return res.status(200).json({
            success: true,
            message: "Login successful",

            data: {
                user: {
                    id: user._id,
                    name: user.name,
                    email: user.email,
                    role: user.role,
                    profileImage: user.profileImage,
                    isActive: user.isActive,
                },
            },
        });

    } catch (error) {
        console.error("loginUser:", error);

        return res.status(500).json({
            success: false,
            message: "Internal Server Error",
        });
    }
};


// ==========================================
// LOGOUT USER
// ==========================================

const logoutUser = async (req, res) => {
    try {
        res.clearCookie("token", {
            httpOnly: true,
            secure:
                process.env.NODE_ENV === "production",
            sameSite: "lax",
        });

        return res.status(200).json({
            success: true,
            message: "Logout successful",
        });

    } catch (error) {
        console.error("logoutUser:", error);

        return res.status(500).json({
            success: false,
            message: "Internal Server Error",
        });
    }
};


// ==========================================
// GET CURRENT USER
// ==========================================

const getMe = async (req, res) => {
    try {
        const user = await User.findById(
            req.user.id
        ).select("-password");

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found",
            });
        }

        return res.status(200).json({
            success: true,
            data: user,
        });

    } catch (error) {
        console.error("getMe:", error);

        return res.status(500).json({
            success: false,
            message: "Internal Server Error",
        });
    }
};


// ==========================================
// UPDATE PROFILE
// ==========================================

const updateProfile = async (req, res) => {
    try {
        const { name, email } = req.body;

        // ==========================================
        // FIND CURRENT USER
        // ==========================================

        const user = await User.findById(
            req.user.id
        );

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found",
            });
        }

        // ==========================================
        // UPDATE NAME
        // ==========================================

        if (name) {
            if (name.trim().length < 2) {
                return res.status(400).json({
                    success: false,
                    message:
                        "Name must be at least 2 characters",
                });
            }

            user.name = name.trim();
        }

        // ==========================================
        // UPDATE EMAIL
        // ==========================================

        if (
            email &&
            email.toLowerCase().trim() !== user.email
        ) {
            const normalizedEmail = email
                .toLowerCase()
                .trim();

            const existingUser = await User.findOne({
                email: normalizedEmail,
                _id: { $ne: user._id },
            });

            if (existingUser) {
                return res.status(409).json({
                    success: false,
                    message: "Email already in use",
                });
            }

            user.email = normalizedEmail;
        }

        // ==========================================
        // SAVE
        // ==========================================

        await user.save();

        return res.status(200).json({
            success: true,
            message: "Profile updated successfully",

            data: {
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
                profileImage: user.profileImage,
                isActive: user.isActive,
            },
        });

    } catch (error) {
        console.error("updateProfile:", error);

        if (error.code === 11000) {
            return res.status(409).json({
                success: false,
                message: "Email already in use",
            });
        }

        return res.status(500).json({
            success: false,
            message: "Internal Server Error",
        });
    }
};


// ==========================================
// CHANGE PASSWORD
// ==========================================

const changePassword = async (req, res) => {
    try {
        const {
            currentPassword,
            newPassword,
        } = req.body;

        // ==========================================
        // VALIDATION
        // ==========================================

        if (!currentPassword || !newPassword) {
            return res.status(400).json({
                success: false,
                message:
                    "Current password and new password are required",
            });
        }

        if (newPassword.length < 6) {
            return res.status(400).json({
                success: false,
                message:
                    "New password must be at least 6 characters",
            });
        }

        // ==========================================
        // FIND USER
        // ==========================================

        const user = await User.findById(
            req.user.id
        );

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found",
            });
        }

        // ==========================================
        // VERIFY CURRENT PASSWORD
        // ==========================================

        const isPasswordMatch =
            await bcrypt.compare(
                currentPassword,
                user.password
            );

        if (!isPasswordMatch) {
            return res.status(401).json({
                success: false,
                message:
                    "Current password is incorrect",
            });
        }

        // ==========================================
        // HASH NEW PASSWORD
        // ==========================================

        user.password = await bcrypt.hash(
            newPassword,
            10
        );

        await user.save();

        return res.status(200).json({
            success: true,
            message:
                "Password changed successfully",
        });

    } catch (error) {
        console.error("changePassword:", error);

        return res.status(500).json({
            success: false,
            message: "Internal Server Error",
        });
    }
};


// ==========================================
// UPLOAD PROFILE IMAGE
// ==========================================

const uploadProfileImage = async (req, res) => {
    try {
        // ==========================================
        // CHECK FILE
        // ==========================================

        if (!req.file) {
            return res.status(400).json({
                success: false,
                message: "Please upload an image",
            });
        }

        // ==========================================
        // FIND USER
        // ==========================================

        const user = await User.findById(
            req.user.id
        );

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found",
            });
        }

        // ==========================================
        // DELETE OLD CLOUDINARY IMAGE
        // ==========================================

        if (user.profileImage?.publicId) {
            await deleteFromCloudinary(
                user.profileImage.publicId
            );
        }

        // ==========================================
        // UPLOAD NEW IMAGE
        // ==========================================

        const image = await uploadToCloudinary(
            req.file.buffer,
            "babylon/users"
        );

        // ==========================================
        // SAVE IMAGE INFORMATION
        // ==========================================

        user.profileImage = {
            url: image.url,
            publicId: image.publicId,
        };

        await user.save();

        return res.status(200).json({
            success: true,
            message:
                "Profile image uploaded successfully",

            data: {
                profileImage: user.profileImage,
            },
        });

    } catch (error) {
        console.error(
            "uploadProfileImage:",
            error
        );

        return res.status(500).json({
            success: false,
            message:
                "Profile image upload failed",
        });
    }
};


// ==========================================
// DELETE PROFILE IMAGE
// ==========================================

const deleteProfileImage = async (req, res) => {
    try {
        // ==========================================
        // FIND USER
        // ==========================================

        const user = await User.findById(
            req.user.id
        );

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found",
            });
        }

        // ==========================================
        // CHECK IMAGE
        // ==========================================

        if (!user.profileImage?.publicId) {
            return res.status(404).json({
                success: false,
                message: "No profile image found",
            });
        }

        // ==========================================
        // DELETE FROM CLOUDINARY
        // ==========================================

        await deleteFromCloudinary(
            user.profileImage.publicId
        );

        // ==========================================
        // REMOVE FROM DATABASE
        // ==========================================

        user.profileImage = {
            url: null,
            publicId: null,
        };

        await user.save();

        return res.status(200).json({
            success: true,
            message:
                "Profile image deleted successfully",
        });

    } catch (error) {
        console.error(
            "deleteProfileImage:",
            error
        );

        return res.status(500).json({
            success: false,
            message: "Internal Server Error",
        });
    }
};


// ==========================================
// CREATE ADMIN
// ==========================================
// Only SUPER ADMIN can access this controller.
//
// Route:
// POST /api/.../users/admin
//
// Middleware:
// protect
// authorize("superAdmin")
// ==========================================

const createAdmin = async (req, res) => {
    try {
        const { name, email, password } = req.body;

        // ==========================================
        // VALIDATION
        // ==========================================

        if (!name || !email || !password) {
            return res.status(400).json({
                success: false,
                message:
                    "Name, email and password are required",
            });
        }

        if (name.trim().length < 2) {
            return res.status(400).json({
                success: false,
                message:
                    "Name must be at least 2 characters",
            });
        }

        if (password.length < 6) {
            return res.status(400).json({
                success: false,
                message:
                    "Password must be at least 6 characters",
            });
        }

        // ==========================================
        // NORMALIZE EMAIL
        // ==========================================

        const normalizedEmail = email
            .toLowerCase()
            .trim();

        // ==========================================
        // CHECK EXISTING USER
        // ==========================================

        const existingUser = await User.findOne({
            email: normalizedEmail,
        });

        if (existingUser) {
            return res.status(409).json({
                success: false,
                message:
                    "User with this email already exists",
            });
        }

        // ==========================================
        // HASH PASSWORD
        // ==========================================

        const hashedPassword =
            await bcrypt.hash(password, 10);

        // ==========================================
        // CREATE ADMIN
        // ==========================================
        // IMPORTANT:
        // Role is NEVER taken from req.body.
        //
        // This endpoint ALWAYS creates "admin".
        // ==========================================

        const admin = await User.create({
            name: name.trim(),
            email: normalizedEmail,
            password: hashedPassword,
            role: "admin",
            isActive: true,
        });

        // ==========================================
        // RESPONSE
        // ==========================================

        return res.status(201).json({
            success: true,
            message:
                "Admin account created successfully",

            data: {
                user: {
                    id: admin._id,
                    name: admin.name,
                    email: admin.email,
                    role: admin.role,
                    profileImage:
                        admin.profileImage,
                    isActive: admin.isActive,
                },
            },
        });

    } catch (error) {
        console.error("createAdmin:", error);

        if (error.code === 11000) {
            return res.status(409).json({
                success: false,
                message:
                    "User with this email already exists",
            });
        }

        return res.status(500).json({
            success: false,
            message: "Internal Server Error",
        });
    }
};


// ==========================================
// EXPORT CONTROLLERS
// ==========================================

module.exports = {
    registerUser,
    loginUser,
    logoutUser,
    getMe,
    updateProfile,
    changePassword,
    uploadProfileImage,
    deleteProfileImage,
    createAdmin,
};