const express = require("express")
const router = express.Router()
const jwt = require("jsonwebtoken")
const DevProfile = require("../models/DevProfile")

// Middleware to verify token
function authMiddleware(req, res, next) {
  const authHeader = req.headers.authorization
  if (!authHeader) return res.status(401).json({ error: "No token provided" })
  const token = authHeader.split(" ")[1]
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET)
    req.userId = decoded.id
    next()
  } catch {
    res.status(401).json({ error: "Invalid token" })
  }
}

// ==============================
// SAVE / UPDATE PROFILE
// ==============================
router.post("/", authMiddleware, async (req, res) => {
  try {
    const { stack, experience, projectDescription, preferredLanguage, codingStyle } = req.body

    const profile = await DevProfile.findOneAndUpdate(
      { user: req.userId },
      { stack, experience, projectDescription, preferredLanguage, codingStyle },
      { new: true, upsert: true }
    )

    res.json({ message: "Profile saved", profile })

  } catch (error) {
    console.log(error)
    res.status(500).json({ error: "Failed to save profile" })
  }
})

// ==============================
// GET PROFILE
// ==============================
router.get("/", authMiddleware, async (req, res) => {
  try {
    const profile = await DevProfile.findOne({ user: req.userId })
    res.json(profile || null)
  } catch (error) {
    console.log(error)
    res.status(500).json({ error: "Failed to fetch profile" })
  }
})

// ==============================
// DELETE PROFILE
// ==============================
router.delete("/", authMiddleware, async (req, res) => {
  try {
    await DevProfile.findOneAndDelete({ user: req.userId })
    res.json({ message: "Profile deleted" })
  } catch (error) {
    console.log(error)
    res.status(500).json({ error: "Failed to delete profile" })
  }
})

module.exports = router