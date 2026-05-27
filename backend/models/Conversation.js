const mongoose =
  require("mongoose")

const messageSchema =
  new mongoose.Schema({

    role: {

      type: String,

      required: true

    },

    content: {

      type: String,

      required: true

    }

  })

const conversationSchema =
  new mongoose.Schema({

    user: {

      type:
        mongoose.Schema.Types.ObjectId,

      ref: "User",

      required: true

    },

    title: {

      type: String,

      default: "New Chat"

    },

    messages: [

      messageSchema

    ],

    createdAt: {

      type: Date,

      default: Date.now

    }

  })

module.exports =
  mongoose.model(

    "Conversation",

    conversationSchema

  )