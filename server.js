// ==========================================
// 1. IMPORT PACKAGES AND MODELS
// ==========================================

require("dotenv").config();

const express = require("express");
const mongoose = require("mongoose");
const path = require("path");

const Profile = require("./models/profile");
const Feedback = require("./models/feedback");
const Contact = require("./models/contact");


// ==========================================
// 2. INITIALIZE EXPRESS
// ==========================================

const app = express();

const PORT = Number(process.env.PORT) || 3006;
const PUBLIC_DIR = path.join(__dirname, "public");


// ==========================================
// 3. MIDDLEWARE
// ==========================================

app.use(express.json());
app.use(express.urlencoded({ extended: true }));


// ==========================================
// 4. HEALTH CHECK API
// ==========================================

app.get("/api/health", (req, res) => {
    res.status(200).json({
        status: "OK",
        message: "Alfin Portfolio backend is running.",
        database:
            mongoose.connection.readyState === 1
                ? "Connected"
                : "Disconnected"
    });
});


// ==========================================
// 5. PROFILE API
// ==========================================

// Save or update profile
app.post("/api/profile", async (req, res) => {
    try {
        const body = req.body || {};

        const textFields = [
            "fullName",
            "email",
            "phone",
            "linkedin",
            "github",
            "course",
            "institution",
            "university",
            "studyYear",
            "headline",
            "summary",
            "languages",
            "interests",
            "skills",
            "projects",
            "certification"
        ];

        const profileData = {};

        textFields.forEach((field) => {
            profileData[field] =
                typeof body[field] === "string"
                    ? body[field].trim()
                    : "";
        });

        const requiredFields = [
            "fullName",
            "email",
            "course",
            "institution",
            "studyYear",
            "headline",
            "summary",
            "languages",
            "interests",
            "skills",
            "projects"
        ];

        const missingFields = requiredFields.filter(
            (field) => !profileData[field]
        );

        if (missingFields.length > 0) {
            return res.status(400).json({
                message:
                    "Please complete all required fields: " +
                    missingFields.join(", ")
            });
        }

        const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if (!emailPattern.test(profileData.email)) {
            return res.status(400).json({
                message: "Please enter a valid email address."
            });
        }

        if (
            body.graduationYear !== "" &&
            body.graduationYear !== undefined &&
            body.graduationYear !== null
        ) {
            const year = Number(body.graduationYear);

            if (!Number.isInteger(year) || year < 1900 || year > 2200) {
                return res.status(400).json({
                    message: "Please enter a valid graduation year."
                });
            }

            profileData.graduationYear = year;
        }

        const profile = await Profile.findOneAndUpdate(
            {},
            { $set: profileData },
            {
                new: true,
                upsert: true,
                runValidators: true,
                setDefaultsOnInsert: true
            }
        );

        res.status(200).json({
            message: "Profile saved successfully!",
            profile: profile
        });

    } catch (error) {
        console.error("PROFILE ERROR:", error.message);

        res.status(500).json({
            message: "Unable to save profile.",
            error: error.message
        });
    }
});


// Get saved profile
app.get("/api/profile", async (req, res) => {
    try {
        const profile = await Profile.findOne()
            .sort({ updatedAt: -1 })
            .lean();

        if (!profile) {
            return res.status(404).json({
                message: "No profile found. Please create your profile first."
            });
        }

        res.status(200).json(profile);

    } catch (error) {
        console.error("GET PROFILE ERROR:", error.message);

        res.status(500).json({
            message: "Unable to retrieve profile."
        });
    }
});


// ==========================================
// 6. FEEDBACK API
// ==========================================

// Submit feedback
app.post("/api/feedback", async (req, res) => {
    try {
        const name = String(req.body?.name || "").trim();
        const message = String(req.body?.message || "").trim();

        if (!name || !message) {
            return res.status(400).json({
                message: "Name and feedback message are required."
            });
        }

        const feedback = await Feedback.create({
            name,
            message
        });

        res.status(201).json({
            message: "Feedback submitted successfully!",
            feedback: feedback
        });

    } catch (error) {
        console.error("FEEDBACK ERROR:", error.message);

        res.status(500).json({
            message: "Unable to submit feedback."
        });
    }
});


// Get all feedback
app.get("/api/feedback", async (req, res) => {
    try {
        const feedback = await Feedback.find()
            .sort({ createdAt: -1 })
            .lean();

        res.status(200).json(feedback);

    } catch (error) {
        console.error("GET FEEDBACK ERROR:", error.message);

        res.status(500).json({
            message: "Unable to retrieve feedback."
        });
    }
});


// ==========================================
// 7. CONTACT API
// ==========================================

// Submit contact message
app.post("/api/contact", async (req, res) => {
    try {
        const name = String(req.body?.name || "").trim();
        const email = String(req.body?.email || "").trim();
        const message = String(req.body?.message || "").trim();

        if (!name || !email || !message) {
            return res.status(400).json({
                message: "Please complete all contact fields."
            });
        }

        const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if (!emailPattern.test(email)) {
            return res.status(400).json({
                message: "Please enter a valid email address."
            });
        }

        const contact = await Contact.create({
            name,
            email,
            message
        });

        res.status(201).json({
            message: "Your message has been sent successfully!",
            contact: contact
        });

    } catch (error) {
        console.error("CONTACT ERROR:", error.message);

        res.status(500).json({
            message: "Unable to send contact message."
        });
    }
});


// ==========================================
// 8. API NOT FOUND
// ==========================================

app.use("/api", (req, res) => {
    res.status(404).json({
        message: "API route not found."
    });
});


// ==========================================
// 9. SERVE FRONTEND PAGES
// ==========================================

app.get("/", (req, res) => {
    res.sendFile(path.join(PUBLIC_DIR, "index.html"));
});

app.use(express.static(PUBLIC_DIR));


// ==========================================
// 10. PAGE NOT FOUND
// ==========================================

app.use((req, res) => {
    res.status(404).send("Page not found.");
});


// ==========================================
// 11. ERROR HANDLER
// ==========================================

app.use((error, req, res, next) => {
    console.error("SERVER ERROR:", error.message);

    if (res.headersSent) {
        return next(error);
    }

    res.status(500).json({
        message: "An internal server error occurred."
    });
});


// ==========================================
// 12. CONNECT DATABASE AND START SERVER
// ==========================================

async function startServer() {
    try {
        console.log("-----------------------------------");
        console.log("Starting Alfin Portfolio...");
        console.log("-----------------------------------");

        const mongoURI = process.env.MONGODB_URI?.trim();

        if (!mongoURI) {
            throw new Error("MONGODB_URI is missing from .env.");
        }

        if (!/^mongodb(\+srv)?:\/\//i.test(mongoURI)) {
            throw new Error(
                "Invalid MongoDB URI. It must start with mongodb:// or mongodb+srv://"
            );
        }

        console.log("Connecting to MongoDB...");

        await mongoose.connect(mongoURI, {
            serverSelectionTimeoutMS: 10000
        });

        console.log("MongoDB connected successfully!");

        await new Promise((resolve, reject) => {
            const server = app.listen(PORT,"0.0.0.0");

            server.once("error", reject);

            server.once("listening", () => {
                console.log("-----------------------------------");
                console.log("Alfin Portfolio server is running!");
                console.log(`Website: http://localhost:${PORT}`);
                console.log(`Health: http://localhost:${PORT}/api/health`);
                console.log("-----------------------------------");

                resolve();
            });
        });

    } catch (error) {
        console.error("-----------------------------------");
        console.error("SERVER STARTUP ERROR:");
        console.error(error.message);
        console.error("-----------------------------------");

        process.exit(1);
    }
}


// Start application
startServer();