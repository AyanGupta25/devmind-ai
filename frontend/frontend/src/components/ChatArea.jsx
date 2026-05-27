import { useState, useEffect, useRef } from "react"
import MessageBubble from "./MessageBubble"

function ChatArea() {

  const [input, setInput] = useState("")

  const [messages, setMessages] = useState([
    {
      text: "Hello Ayan 👋",
      sender: "ai"
    },

  {
    text: "Ask me anything about coding 🚀",
    sender: "ai"
  }
  ])

  const [loading, setLoading] = useState(false)

  const messagesEndRef = useRef(null)

  useEffect(() => {

    messagesEndRef.current?.scrollIntoView({
      behavior: "smooth"
    })

  }, [messages, loading])

  function sendMessage() {

    if(input.trim() === "") {
      return
    }

    const currentInput = input

    const userMessage = {
      text: currentInput,
      sender: "user"
    }

    setMessages((prev) => [
      ...prev,
      userMessage
    ])

    setInput("")

    setLoading(true)

    setTimeout(() => {

     let aiText = ""

const question = currentInput.toLowerCase()

if(question.includes("react")) {

  aiText =
    "React is a JavaScript library used for building dynamic user interfaces."

}
else if(question.includes("javascript")) {

  aiText =
    "JavaScript adds interactivity and dynamic behavior to websites."

}
else if(question.includes("html")) {

  aiText =
    "HTML provides the structure of webpages."

}
else if(question.includes("css")) {

  aiText =
    "CSS is used for styling and layout design."

}
else if(question.includes("state")) {

  aiText =
    "State allows React components to store dynamic changing data."

}
else if(question.includes("virtual dom")) {

  aiText =
    "Virtual DOM is a lightweight copy of the real DOM used for efficient updates."

}
else if(question.includes("frontend")) {

  aiText =
    "Frontend development focuses on user interfaces and browser interaction."

}
else if(question.includes("backend")) {

  aiText =
    "Backend handles servers, databases, APIs, and application logic."

}
else if(question.includes("api")) {

  aiText =
    "APIs allow communication between frontend and backend systems."

}
else {

  aiText =
    "DevMind AI is still learning this topic 🚀"
}

      const aiReply = {
        text: aiText,
        sender: "ai"
      }

      setMessages((prev) => [
        ...prev,
        aiReply
      ])

      setLoading(false)

    }, 1500)
  }

  function handleKeyDown(e) {

    if(e.key === "Enter") {
      sendMessage()
    }
  }

  return (

    <div style={styles.chatArea}>

      <div style={styles.topBar}>
        DevMind AI Assistant
      </div>

      <div style={styles.messages}>

        {messages.map((msg, index) => (

          <MessageBubble
            key={index}
            text={msg.text}
            sender={msg.sender}
          />

        ))}

        {loading && (

          <div style={styles.typing}>
            AI is typing...
          </div>

        )}

        <div ref={messagesEndRef}></div>

      </div>

      <div style={styles.inputArea}>

        <input
          style={styles.input}
          placeholder="Ask DevMind AI..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
        />

        <button
  style={styles.sendButton}
  onMouseEnter={(e) => {
    e.target.style.background =
      "linear-gradient(to right, #7c3aed, #2563eb)"

    e.target.style.transform = "scale(1.05)"
  }}

  onMouseLeave={(e) => {
    e.target.style.background =
      "linear-gradient(to right, #2563eb, #7c3aed)"

    e.target.style.transform = "scale(1)"
  }}

  onClick={sendMessage}
>
          {loading ? "Wait..." : "Send"}
        </button>

      </div>

    </div>
  )
}

const styles = {

  chatArea: {
    flex: 1,
    backgroundColor: "#111827",
    height: "100vh",
    display: "flex",
    flexDirection: "column",
    color: "white"
  },

  topBar: {
    height: "70px",
    borderBottom: "1px solid #1e293b",
    display: "flex",
    alignItems: "center",
    paddingLeft: "30px",
    fontSize: "22px",
    fontWeight: "bold"
  },

  messages: {
    flex: 1,
    padding: "30px",
    display: "flex",
    flexDirection: "column",
    gap: "20px",
    overflowY: "auto"
  },

  typing: {
    color: "#94a3b8",
    fontStyle: "italic"
  },

  inputArea: {
    height: "90px",
    borderTop: "1px solid #1e293b",
    display: "flex",
    alignItems: "center",
    padding: "0 20px",
    gap: "15px"
  },

  input: {
    flex: 1,
    height: "50px",
    borderRadius: "12px",
    border: "none",
    paddingLeft: "15px",
    fontSize: "16px",
    outline: "none",
    backgroundColor: "#1e293b",
    color: "white"
  },

  sendButton: {
    width: "110px",
    height: "50px",
    border: "none",
    borderRadius: "12px",
    background:
      "linear-gradient(to right, #2563eb, #7c3aed)",
    color: "white",
    fontSize: "16px",
    cursor: "pointer",
    transition: "0.3s"
  },

  disabledButton: {
    width: "110px",
    height: "50px",
    border: "none",
    borderRadius: "12px",
    backgroundColor: "#475569",
    color: "white",
    fontSize: "16px",
    cursor: "not-allowed"
  }

}

export default ChatArea