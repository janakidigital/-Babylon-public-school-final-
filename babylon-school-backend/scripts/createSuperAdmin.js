require("dotenv").config();

const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const User = require("../src/models/user.model");

const createSuperAdmin = async () => {
    try {
        // ==========================================
        // CONNECT DATABASE
        // ==========================================

        await mongoose.connect(
            process.env.MONGO_URI
        );

        console.log("MongoDB connected");

        // ==========================================
        // CHECK EXISTING SUPER ADMIN
        // ==========================================

        const existingSuperAdmin = await User.findOne({
            role: "superAdmin",
        });

        if (existingSuperAdmin) {
            console.log(
                "Super Admin already exists."
            );

            process.exit(0);
        }

        // ==========================================
        // SUPER ADMIN DETAILS
        // ==========================================

        const name = process.env.SUPERADMIN_NAME;
        const email =
            process.env.SUPERADMIN_EMAIL;
        const password =
            process.env.SUPERADMIN_PASSWORD;

        if (!name || !email || !password) {
            console.error(
                "Missing Super Admin environment variables."
            );

            process.exit(1);
        }

        // ==========================================
        // CHECK EMAIL
        // ==========================================

        const existingUser = await User.findOne({
            email: email.toLowerCase().trim(),
        });

        if (existingUser) {
            console.error(
                "A user with this email already exists."
            );

            process.exit(1);
        }

        // ==========================================
        // HASH PASSWORD
        // ==========================================

        const hashedPassword =
            await bcrypt.hash(password, 10);

        // ==========================================
        // CREATE SUPER ADMIN
        // ==========================================

        const superAdmin = await User.create({
            name: name.trim(),
            email: email.toLowerCase().trim(),
            password: hashedPassword,
            role: "superAdmin",
            isActive: true,
        });

        console.log(
            "===================================="
        );

        console.log(
            "Super Admin created successfully!"
        );

        console.log(
            "Name:",
            superAdmin.name
        );

        console.log(
            "Email:",
            superAdmin.email
        );

        console.log(
            "Role:",
            superAdmin.role
        );

        console.log(
            "===================================="
        );

        process.exit(0);

    } catch (error) {
        console.error(
            "createSuperAdmin:",
            error
        );

        process.exit(1);
    }
};

createSuperAdmin();