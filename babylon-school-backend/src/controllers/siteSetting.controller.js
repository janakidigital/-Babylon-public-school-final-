const SiteSetting = require("../models/siteSetting.model");

// Get site settings
const getSiteSettings = async (req, res) => {
    try {
        const settings = await SiteSetting.findOne();

        if (!settings) {
            return res.status(404).json({
                success: false,
                message: "Site settings not found"
            });
        }

        res.status(200).json({
            success: true,
            data: settings
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Failed to get site settings",
            error: error.message
        });
    }
};


// Create site settings
const createSiteSettings = async (req, res) => {
    try {
        const existingSettings = await SiteSetting.findOne();

        if (existingSettings) {
            return res.status(400).json({
                success: false,
                message: "Site settings already exist"
            });
        }

        const settings = await SiteSetting.create(req.body);

        res.status(201).json({
            success: true,
            message: "Site settings created successfully",
            data: settings
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Failed to create site settings",
            error: error.message
        });
    }
};


// Update site settings
const updateSiteSettings = async (req, res) => {
    try {
        const settings = await SiteSetting.findOne();

        if (!settings) {
            return res.status(404).json({
                success: false,
                message: "Site settings not found"
            });
        }

        const updatedSettings = await SiteSetting.findByIdAndUpdate(
            settings._id,
            req.body,
            {
                new: true,
                runValidators: true
            }
        );

        res.status(200).json({
            success: true,
            message: "Site settings updated successfully",
            data: updatedSettings
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Failed to update site settings",
            error: error.message
        });
    }
};


module.exports = {
    getSiteSettings,
    createSiteSettings,
    updateSiteSettings
};