require("dotenv").config()

const express = require("express")
const cors = require("cors")
const axios = require("axios")
const jwt = require("jsonwebtoken")

const connectDB =
  require("./config/db")

const authRoutes =
  require("./routes/authRoutes")

const Conversation =
  require("./models/Conversation")

const app = express()

// Connect MongoDB
connectDB()

// Middleware
app.use(cors())

app.use(express.json())

// Auth Routes
app.use(
  "/api/auth",
  authRoutes
)


// ==============================
// AI CHAT ROUTE
// ==============================

app.post(

  "/api/chat",

  async (req, res) => {

    try {

      const {
        message,
        conversationId
      } = req.body

      // Token Check
      const authHeader =
        req.headers.authorization

      if (!authHeader) {

        return res.status(401)
          .json({

            error:
              "No token provided"

          })

      }

      const token =
        authHeader.split(" ")[1]

      const decoded =
        jwt.verify(

          token,

          process.env.JWT_SECRET

        )

      // Build AI Memory
      let aiMessages = [

        {

          role: "system",

          content:
            "You are DevMind AI, an advanced AI assistant helping developers build projects, debug code, explain programming concepts, and manage software engineering tasks."

        }

      ]

      let conversation

      // Existing Conversation
      if (conversationId) {

        conversation =
          await Conversation.findById(

            conversationId

          )

        if (!conversation) {

          return res.status(404)
            .json({

              error:
                "Conversation not found"

            })

        }

        conversation.messages
          .forEach((msg) => {

            aiMessages.push({

              role: msg.role,

              content: msg.content

            })

          })

      }

      // Add latest user message
      aiMessages.push({

        role: "user",

        content: message

      })

      // AI Request
      const response =
        await axios.post(

          "https://openrouter.ai/api/v1/chat/completions",

          {

            model:
              "openai/gpt-3.5-turbo",

            messages: aiMessages

          },

          {

            headers: {

              Authorization:
                `Bearer ${process.env.OPENROUTER_API_KEY}`,

              "Content-Type":
                "application/json"

            }

          }

        )

      const aiReply =
        response.data.choices[0]
        .message.content

      // Existing Conversation Save
      if (conversationId) {

        conversation.messages.push({

          role: "user",

          content: message

        })

        conversation.messages.push({

          role: "assistant",

          content: aiReply

        })

        await conversation.save()

      }

      // New Conversation Create
      else {

        conversation =
          await Conversation.create({

            user: decoded.id,

            title:

              message
                .split(" ")
                .slice(0, 5)
                .join(" "),

            messages: [

              {

                role: "user",

                content: message

              },

              {

                role: "assistant",

                content: aiReply

              }

            ]

          })

      }

      res.json({

        reply: aiReply,

        conversationId:
          conversation._id

      })

    } catch (error) {

      console.log(error)

      res.status(500).json({

        error:
          "AI request failed"

      })

    }

  }

)


// ==============================
// GET CONVERSATIONS
// ==============================

app.get(

  "/api/chats",

  async (req, res) => {

    try {

      const authHeader =
        req.headers.authorization

      if (!authHeader) {

        return res.status(401)
          .json({

            error:
              "No token provided"

          })

      }

      const token =
        authHeader.split(" ")[1]

      const decoded =
        jwt.verify(

          token,

          process.env.JWT_SECRET

        )

      const conversations =
        await Conversation.find({

          user: decoded.id

        }).sort({

          createdAt: -1

        })

      res.json(conversations)

    } catch (error) {

      console.log(error)

      res.status(500).json({

        error:
          "Failed to fetch conversations"

      })

    }

  }

)


// ==============================
// TEST ROUTE
// ==============================

app.get("/", (req, res) => {

  res.json({

    message:
      "DevMind AI Backend Running"

  })

})


// ==============================
// START SERVER
// ==============================

const PORT =
  process.env.PORT || 5000

app.listen(PORT, () => {

  console.log(

    `Server running on port ${PORT}`

  )

})