const mongoose = require("mongoose")

const devProfileSchema = new mongoose.Schema({

  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
    unique: true
  },

  stack: {
    type: [String],
    default: []
  },

  experience: {
    type: String,
    enum: ["Beginner", "Intermediate", "Expert"],
    default: "Intermediate"
  },

  projectDescription: {
    type: String,
    default: ""
  },

  preferredLanguage: {
    type: String,
    default: "JavaScript"
  },

  codingStyle: {
    type: String,
    enum: ["tabs", "spaces"],
    default: "spaces"
  },

  createdAt: {
    type: Date,
    default: Date.now
  }

})

module.exports = mongoose.model("DevProfile", devProfileSchema)