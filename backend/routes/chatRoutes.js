const express = require("express")

const router = express.Router()

router.post("/chat", async (req, res) => {

  try {

    const userMessage =
      req.body.message

    const model =
      req.app.locals.model

    const result =
      await model.generateContent(
        userMessage
      )

    const response =
      await result.response

    const text =
      response.text()

    res.json({

      reply: text

    })

  } catch (error) {

    console.log(error)

    res.status(500).json({

      error:
        "AI request failed"

    })

  }

})

module.exports = router