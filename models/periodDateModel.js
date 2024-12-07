const mongoose = require("mongoose");

// Schema for PeriodDates collection
const periodDateSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User", // Reference to the Users collection
        required: true,
        index: true, // Index for faster queries
    },
    date: {
        type: Date,
        required: true,
        index: true, // Index for sorting and date range queries
    },
});

// Create the model
const PeriodDate = mongoose.model("PeriodDate", periodDateSchema);

module.exports = PeriodDate;
