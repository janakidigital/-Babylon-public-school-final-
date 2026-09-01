const express = require("express");

const userController = require("../controllers/user.controller");

const upload = require("../middleware/upload.middleware");

const { protect } = require("../middleware/auth");

const authorize = require("../middleware/authorize.middleware");

const router = express.Router();


// =====================================================
// PUBLIC AUTHENTICATION
// =====================================================

// Register normal user
// Public registration ALWAYS creates role: "user"
router.post(
    "/register",
    userController.registerUser
);


// Login
router.post(
    "/login",
    userController.loginUser
);


// Logout
router.post(
    "/logout",
    userController.logoutUser
);


// =====================================================
// USER PROFILE
// =====================================================

// Get currently logged-in user's profile
router.get(
    "/profile",
    protect,
    userController.getMe
);


// Update currently logged-in user's profile
router.put(
    "/profile",
    protect,
    userController.updateProfile
);


// Change password
router.put(
    "/change-password",
    protect,
    userController.changePassword
);


// Upload profile image
router.put(
    "/profile/image",
    protect,
    upload.single("image"),
    userController.uploadProfileImage
);


// Delete profile image
router.delete(
    "/profile/image",
    protect,
    userController.deleteProfileImage
);


// =====================================================
// SUPER ADMIN
// =====================================================

// Create Admin
//
// Only Super Admin can create Admin accounts.
//
// POST /api/v1/users/admin
router.post(
    "/admin",
    protect,
    authorize("superAdmin"),
    userController.createAdmin
);

// Get all admins
router.get(
    "/admins",
    protect,
    authorize("superAdmin"),
    userController.getAllAdmins
);

// Update admin
router.put(
    "/:id",
    protect,
    authorize("superAdmin"),
    userController.updateAdmin
);

// Delete admin
router.delete(
    "/:id",
    protect,
    authorize("superAdmin"),
    userController.deleteAdmin
);


module.exports = router;
