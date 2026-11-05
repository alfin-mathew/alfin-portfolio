const mongoose = require("mongoose");

const profileSchema = new mongoose.Schema({

    fullName: {
        type: String,
        required: true,
        trim: true
    },

    email: {
        type: String,
        required: true,
        trim: true
    },

    phone: {
        type: String,
        default: ""
    },

    linkedin: {
        type: String,
        default: ""
    },

    github: {
        type: String,
        default: ""
    },

    course: {
        type: String,
        required: true
    },

    institution: {
        type: String,
        required: true
    },

    university: {
        type: String,
        default: ""
    },

    studyYear: {
        type: String,
        required: true
    },

    graduationYear: {
        type: Number,
        default: null
    },

    headline: {
        type: String,
        required: true
    },

    summary: {
        type: String,
        required: true
    },

    languages: {
        type: String,
        required: true
    },

    interests: {
        type: String,
        required: true
    },

    skills: {
        type: String,
        required: true
    },

    projects: {
        type: String,
        required: true
    },

    certification: {
        type: String,
        default: ""
    }

}, {
    timestamps: true
});

module.exports = mongoose.model("Profile", profileSchema);