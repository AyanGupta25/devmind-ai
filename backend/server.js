require("dotenv").config()

const express = require("express")
const cors = require("cors")
const axios = require("axios")
const jwt = require("jsonwebtoken")

const connectDB = require("./config/db")
const authRoutes = require("./routes/authRoutes")
const profileRoutes = require("./routes/profileRoutes")
const Conversation = require("./models/Conversation")
const DevProfile = require("./models/DevProfile")

const app = express()

// Connect MongoDB
connectDB()

// Middleware
app.use(cors({
  origin: process.env.FRONTEND_URL || "http://localhost:5173",
  credentials: true
}))
app.use(express.json())

// Routes
app.use("/api/auth", authRoutes)
app.use("/api/profile", profileRoutes)


// ==============================
// AI CHAT ROUTE
// ==============================
app.post("/api/chat", async (req, res) => {
  try {
    const { message, conversationId, useProfile } = req.body

    const authHeader = req.headers.authorization
    if (!authHeader) return res.status(401).json({ error: "No token provided" })

    const token = authHeader.split(" ")[1]
    const decoded = jwt.verify(token, process.env.JWT_SECRET)

    // Build system prompt
    let systemPrompt = "You are DevMind AI, an advanced AI assistant helping developers build projects, debug code, explain programming concepts, and manage software engineering tasks."

    // If user wants profile-based responses, inject their profile
    if (useProfile) {
      const profile = await DevProfile.findOne({ user: decoded.id })
      if (profile) {
        systemPrompt += `\n\nDev Profile of this user:
- Stack: ${profile.stack.join(", ")}
- Experience Level: ${profile.experience}
- Preferred Language: ${profile.preferredLanguage}
- Coding Style: ${profile.codingStyle}
- Current Project: ${profile.projectDescription}

Always tailor your answers to this developer's stack and experience level. Use ${profile.preferredLanguage} by default unless they ask for something else. Use ${profile.codingStyle} for indentation.`
      }
    }

    let aiMessages = [{ role: "system", content: systemPrompt }]

    let conversation

    if (conversationId) {
      conversation = await Conversation.findById(conversationId)
      if (!conversation) return res.status(404).json({ error: "Conversation not found" })
      conversation.messages.forEach((msg) => {
        aiMessages.push({ role: msg.role, content: msg.content })
      })
    }

    aiMessages.push({ role: "user", content: message })

    const response = await axios.post(
      "https://openrouter.ai/api/v1/chat/completions",
      { model: "openai/gpt-3.5-turbo", messages: aiMessages },
      {
        headers: {
          Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
          "Content-Type": "application/json"
        }
      }
    )

    const aiReply = response.data.choices[0].message.content

    if (conversationId) {
      conversation.messages.push({ role: "user", content: message })
      conversation.messages.push({ role: "assistant", content: aiReply })
      await conversation.save()
    } else {
      conversation = await Conversation.create({
        user: decoded.id,
        title: message.split(" ").slice(0, 5).join(" "),
        messages: [
          { role: "user", content: message },
          { role: "assistant", content: aiReply }
        ]
      })
    }

    res.json({ reply: aiReply, conversationId: conversation._id })

  } catch (error) {
    console.log(error)
    res.status(500).json({ error: "AI request failed" })
  }
})


// ==============================
// GET CONVERSATIONS
// ==============================
app.get("/api/chats", async (req, res) => {
  try {
    const authHeader = req.headers.authorization
    if (!authHeader) return res.status(401).json({ error: "No token provided" })

    const token = authHeader.split(" ")[1]
    const decoded = jwt.verify(token, process.env.JWT_SECRET)

    const conversations = await Conversation.find({ user: decoded.id }).sort({ createdAt: -1 })
    res.json(conversations)

  } catch (error) {
    console.log(error)
    res.status(500).json({ error: "Failed to fetch conversations" })
  }
})


// ==============================
// TEST ROUTE
// ==============================
app.get("/", (req, res) => {
  res.json({ message: "DevMind AI Backend Running" })
})


// ==============================
// START SERVER
// ==============================
const PORT = process.env.PORT || 5000
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})