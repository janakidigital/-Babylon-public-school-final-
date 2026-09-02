const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");

const siteSettingRoutes = require("./routes/siteSetting.routes");
const homeRoutes = require("./routes/home.routes");
const aboutRoutes = require("./routes/about.routes");
const programRoutes = require("./routes/program.routes");
const newsRoutes = require("./routes/news.routes");
const eventRoutes = require("./routes/event.routes");
const noticeRoutes = require("./routes/notice.routes");
const testimonialRoutes = require("./routes/testimonial.routes");
const galleryRoutes = require("./routes/gallery.routes");
const facultyRoutes = require("./routes/faculty.routes");
const facilityRoutes = require("./routes/facility.routes");
const achievementRoutes = require("./routes/achievement.routes");
const faqRoutes = require("./routes/faq.routes");
const careerRoutes = require("./routes/career.routes");
const searchRoutes = require("./routes/search.routes");
const careerApplicationRoutes = require("./routes/careerApplication.routes");
const contactRoutes = require("./routes/contact.routes");
const admissionRoutes = require("./routes/admission.routes");
const userRoutes = require("./routes/user.routes");
const downloadRoutes = require("./routes/download.routes");
const errorHandler = require("./middleware/error.middleware");
const posterRoutes = require("./routes/poster.routes");
const ecaRoutes = require("./routes/eca.routes");

const app = express();

app.set("trust proxy", 1);

app.use(cors({
  origin: process.env.FRONTEND_URL || "http://localhost:5173",
  credentials: true,
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Routes
app.use("/api/v1/settings", siteSettingRoutes);
app.use("/api/v1/home", homeRoutes);
app.use("/api/v1/about", aboutRoutes);
app.use("/api/v1/programs", programRoutes);
app.use("/api/v1/news", newsRoutes);
app.use("/api/v1/events", eventRoutes);
app.use("/api/v1/notices", noticeRoutes);
app.use("/api/v1/testimonials", testimonialRoutes);
app.use("/api/v1/gallery", galleryRoutes);
app.use("/api/v1/faculty", facultyRoutes);
app.use("/api/v1/facility", facilityRoutes);
app.use("/api/v1/achievements", achievementRoutes);
app.use("/api/v1/faqs", faqRoutes);
app.use("/api/v1/careers", careerRoutes);
app.use("/api/v1/search", searchRoutes);
app.use("/api/v1/contacts", contactRoutes);
app.use("/api/v1/admissions", admissionRoutes);
app.use("/api/v1/users", userRoutes);
app.use("/api/v1/downloads", downloadRoutes);
// Career applications admin + public application submission
app.use("/api/v1/career-applications", careerApplicationRoutes);
app.use("/api/v1/posters", posterRoutes);
app.use("/api/v1/eca", ecaRoutes);
// Error handler (centralized)
app.use(errorHandler);

// Test route
app.get("/", (req, res) => {
    res.status(200).json({
        success: true,
        message: "Babylon School API is running"
    });
});

module.exports = app;
