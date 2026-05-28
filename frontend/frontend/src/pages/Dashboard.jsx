import { useState, useEffect } from "react"

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000"

function Dashboard() {

  const [message, setMessage] = useState("")
  const [chat, setChat] = useState([])
  const [loading, setLoading] = useState(false)
  const [conversationId, setConversationId] = useState(null)
  const [conversations, setConversations] = useState([])
  const [activeConversation, setActiveConversation] = useState(null)

  useEffect(() => {
    fetchConversations()
  }, [])

  async function fetchConversations() {
    try {
      const response = await fetch(`${API_URL}/api/chats`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`
        }
      })
      const data = await response.json()
      setConversations(data)
    } catch (error) {
      console.log(error)
    }
  }

  function openConversation(conversation) {
    setConversationId(conversation._id)
    setActiveConversation(conversation._id)
    const formatted = []
    conversation.messages.forEach((msg) => {
      formatted.push({
        sender: msg.role === "assistant" ? "ai" : "user",
        text: msg.content
      })
    })
    setChat(formatted)
  }

  function newChat() {
    setConversationId(null)
    setActiveConversation(null)
    setChat([])
  }

  async function sendMessage() {
    if (!message.trim()) return
    if (loading) return

    setLoading(true)
    const currentMessage = message
    const userMessage = { sender: "user", text: currentMessage }
    setChat((prev) => [...prev, userMessage])
    setMessage("")

    try {
      const response = await fetch(`${API_URL}/api/chat`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`
        },
        body: JSON.stringify({ message: currentMessage, conversationId })
      })

      const data = await response.json()

      if (!conversationId && data.conversationId) {
        setConversationId(data.conversationId)
        setActiveConversation(data.conversationId)
      }

      const aiMessage = { sender: "ai", text: data.reply }
      setChat((prev) => [...prev, aiMessage])
      fetchConversations()

    } catch (error) {
      console.log(error)
      alert("Something went wrong")
    }

    setLoading(false)
  }

  return (
    <div style={styles.dashboard}>

      {/* SIDEBAR */}
      <div style={styles.sidebar}>
        <h2 style={styles.logo}>DevMind AI</h2>
        <button onClick={newChat} style={styles.newChatButton}>
          + New Chat
        </button>
        <div style={styles.history}>
          {conversations.map((conv) => (
            <div
              key={conv._id}
              onClick={() => openConversation(conv)}
              style={activeConversation === conv._id ? styles.activeHistoryItem : styles.historyItem}
            >
              {conv.title}
            </div>
          ))}
        </div>
      </div>

      {/* MAIN */}
      <div style={styles.main}>

        {/* TOP BAR */}
        <div style={styles.topBar}>
          <h1 style={styles.heading}>AI Workspace</h1>
          <button
            onClick={() => {
              localStorage.removeItem("token")
              window.location.href = "/"
            }}
            style={styles.logoutButton}
          >
            Logout
          </button>
        </div>

        {/* EMPTY STATE */}
        {chat.length === 0 && (
          <div style={styles.emptyState}>
            <h2>Welcome to DevMind AI 🚀</h2>
            <p>Start a new conversation and build something amazing.</p>
          </div>
        )}

        {/* CHAT AREA */}
        <div style={styles.chatContainer}>
          {chat.map((msg, index) => (
            <div
              key={index}
              style={msg.sender === "ai" ? styles.messageAi : styles.messageUser}
            >
              {msg.text}
            </div>
          ))}
        </div>

        {/* INPUT */}
        <div style={styles.inputArea}>
          <input
            type="text"
            placeholder="Ask anything..."
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyDown={(e) => { if (e.key === "Enter") sendMessage() }}
            style={styles.input}
          />
          <button onClick={sendMessage} style={styles.sendButton} disabled={loading}>
            {loading ? "Thinking..." : "Send"}
          </button>
        </div>

      </div>
    </div>
  )
}

const styles = {
  dashboard: {
    minHeight: "100vh",
    display: "flex",
    backgroundColor: "#020617",
    color: "white"
  },
  sidebar: {
    width: "320px",
    backgroundColor: "#0f172a",
    borderRight: "1px solid #1e293b",
    padding: "25px",
    display: "flex",
    flexDirection: "column"
  },
  logo: {
    marginBottom: "25px"
  },
  newChatButton: {
    padding: "15px",
    borderRadius: "14px",
    border: "none",
    background: "linear-gradient(to right, #7c3aed, #2563eb)",
    color: "white",
    cursor: "pointer",
    marginBottom: "25px",
    fontSize: "15px"
  },
  history: {
    display: "flex",
    flexDirection: "column",
    gap: "12px",
    overflowY: "auto"
  },
  historyItem: {
    padding: "14px",
    backgroundColor: "#111827",
    borderRadius: "12px",
    cursor: "pointer",
    color: "#cbd5e1"
  },
  activeHistoryItem: {
    padding: "14px",
    background: "linear-gradient(to right, #7c3aed, #2563eb)",
    borderRadius: "12px",
    cursor: "pointer",
    color: "white"
  },
  main: {
    flex: 1,
    display: "flex",
    flexDirection: "column",
    padding: "35px",
    height: "100vh"
  },
  topBar: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "25px"
  },
  heading: {
    fontSize: "40px"
  },
  logoutButton: {
    padding: "14px 22px",
    borderRadius: "14px",
    border: "none",
    background: "linear-gradient(to right, #ef4444, #dc2626)",
    color: "white",
    cursor: "pointer"
  },
  emptyState: {
    marginTop: "100px",
    textAlign: "center",
    color: "#94a3b8"
  },
  chatContainer: {
    flex: 1,
    overflowY: "auto",
    display: "flex",
    flexDirection: "column",
    gap: "20px",
    paddingBottom: "20px"
  },
  messageAi: {
    maxWidth: "750px",
    backgroundColor: "#0f172a",
    border: "1px solid #1e293b",
    padding: "20px",
    borderRadius: "18px",
    lineHeight: "1.7"
  },
  messageUser: {
    alignSelf: "flex-end",
    maxWidth: "550px",
    background: "linear-gradient(to right, #7c3aed, #2563eb)",
    padding: "20px",
    borderRadius: "18px",
    lineHeight: "1.7"
  },
  inputArea: {
    display: "flex",
    gap: "15px",
    marginTop: "20px"
  },
  input: {
    flex: 1,
    padding: "18px",
    borderRadius: "14px",
    border: "1px solid #334155",
    backgroundColor: "#0f172a",
    color: "white",
    fontSize: "16px",
    outline: "none"
  },
  sendButton: {
    padding: "18px 30px",
    borderRadius: "14px",
    border: "none",
    background: "linear-gradient(to right, #7c3aed, #2563eb)",
    color: "white",
    cursor: "pointer",
    fontSize: "15px"
  }
}

export default Dashboard
