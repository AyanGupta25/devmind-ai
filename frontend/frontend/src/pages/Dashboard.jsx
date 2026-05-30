import { useState, useEffect, useRef } from "react"
import { useNavigate } from "react-router-dom"

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000"

function TypingMessage({ text, onDone }) {
  const [displayed, setDisplayed] = useState("")
  const index = useRef(0)

  useEffect(() => {
    index.current = 0
    setDisplayed("")
    const interval = setInterval(() => {
      if (index.current < text.length) {
        setDisplayed(text.slice(0, index.current + 1))
        index.current++
      } else {
        clearInterval(interval)
        if (onDone) onDone()
      }
    }, 12)
    return () => clearInterval(interval)
  }, [text])

  return <span style={{ whiteSpace: "pre-wrap" }}>{displayed}</span>
}

function CopyButton({ text, small }) {
  const [copied, setCopied] = useState(false)
  function copy() {
    navigator.clipboard.writeText(text)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }
  return (
    <button onClick={copy} style={small ? styles.codeTopCopyBtn : styles.copyBtn}>
      {copied ? "✅ Copied" : "📋 Copy"}
    </button>
  )
}

function MessageContent({ text, isNew, onDone }) {
  const parts = text.split(/(```[\s\S]*?```)/g)

  const rendered = parts.map((part, i) => {
    if (part.startsWith("```") && part.endsWith("```")) {
      const lines = part.slice(3, -3).split("\n")
      const lang = lines[0].trim()
      const code = lines.slice(1).join("\n")
      return (
        <div key={i} style={styles.codeBlock}>
          <div style={styles.codeHeader}>
            <span style={styles.codeLang}>{lang || "code"}</span>
            <CopyButton text={code} small />
          </div>
          <pre style={styles.codePre}><code>{code}</code></pre>
        </div>
      )
    }
    return <span key={i} style={{ whiteSpace: "pre-wrap" }}>{part}</span>
  })

  return (
    <div>
      {isNew ? <TypingMessage text={text} onDone={onDone} /> : <div>{rendered}</div>}
      <CopyButton text={text} />
    </div>
  )
}

function Dashboard({ onLogout }) {

  const navigate = useNavigate()
  const [message, setMessage] = useState("")
  const [chat, setChat] = useState([])
  const [loading, setLoading] = useState(false)
  const [conversationId, setConversationId] = useState(null)
  const [conversations, setConversations] = useState([])
  const [activeConversation, setActiveConversation] = useState(null)
  const [typingIndex, setTypingIndex] = useState(null)
  const [darkMode, setDarkMode] = useState(true)
  const [useProfile, setUseProfile] = useState(true)
  const [profile, setProfile] = useState(null)
  const chatEndRef = useRef(null)

  useEffect(() => {
    fetchConversations()
    fetchProfile()
  }, [])

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [chat])

  async function fetchProfile() {
    try {
      const response = await fetch(`${API_URL}/api/profile`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
      })
      const data = await response.json()
      setProfile(data)
    } catch (error) {
      console.log(error)
    }
  }

  async function fetchConversations() {
    try {
      const response = await fetch(`${API_URL}/api/chats`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
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
    setTypingIndex(null)
    setChat(conversation.messages.map((msg) => ({
      sender: msg.role === "assistant" ? "ai" : "user",
      text: msg.content
    })))
  }

  function newChat() {
    setConversationId(null)
    setActiveConversation(null)
    setTypingIndex(null)
    setChat([])
  }

  async function sendMessage() {
    if (!message.trim() || loading) return

    setLoading(true)
    const currentMessage = message
    setChat((prev) => [...prev, { sender: "user", text: currentMessage }])
    setMessage("")

    try {
      const response = await fetch(`${API_URL}/api/chat`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`
        },
        body: JSON.stringify({ message: currentMessage, conversationId, useProfile })
      })

      const data = await response.json()

      if (!conversationId && data.conversationId) {
        setConversationId(data.conversationId)
        setActiveConversation(data.conversationId)
      }

      setChat((prev) => {
        const updated = [...prev, { sender: "ai", text: data.reply }]
        setTypingIndex(updated.length - 1)
        return updated
      })

      fetchConversations()

    } catch (error) {
      console.log(error)
      alert("Something went wrong")
    }

    setLoading(false)
  }

  const theme = darkMode ? dark : light

  return (
    <div style={{ ...styles.dashboard, backgroundColor: theme.bg, color: theme.text }}>

      {/* SIDEBAR */}
      <div style={{ ...styles.sidebar, backgroundColor: theme.sidebar, borderRight: `1px solid ${theme.border}` }}>
        <h2 style={{ ...styles.logo, color: theme.text }}>DevMind AI</h2>

        <button onClick={newChat} style={styles.newChatButton}>+ New Chat</button>

        {/* PROFILE TOGGLE */}
        {profile && (
          <div style={{ ...styles.profileBox, borderColor: theme.border }}>
            <div style={styles.profileTop}>
              <span style={styles.profileIcon}>👤</span>
              <span style={{ color: theme.text, fontSize: "13px", fontWeight: "600" }}>Dev Profile</span>
              <button
                onClick={() => navigate("/setup")}
                style={styles.editProfileBtn}
              >
                Edit
              </button>
            </div>
            <div style={styles.profileStack}>
              {profile.stack.slice(0, 4).map((s) => (
                <span key={s} style={styles.stackTag}>{s}</span>
              ))}
              {profile.stack.length > 4 && (
                <span style={styles.stackTag}>+{profile.stack.length - 4}</span>
              )}
            </div>
            <div style={styles.toggleRow}>
              <span style={{ color: theme.subtext, fontSize: "12px" }}>Use profile in chat</span>
              <button
                onClick={() => setUseProfile(!useProfile)}
                style={{ ...styles.toggleBtn, backgroundColor: useProfile ? "#7c3aed" : theme.border }}
              >
                {useProfile ? "ON" : "OFF"}
              </button>
            </div>
          </div>
        )}

        {/* HISTORY */}
        <div style={styles.history}>
          {conversations.map((conv) => (
            <div
              key={conv._id}
              onClick={() => openConversation(conv)}
              style={activeConversation === conv._id
                ? styles.activeHistoryItem
                : { ...styles.historyItem, backgroundColor: theme.historyItem, color: theme.subtext }
              }
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
          <div>
            <h1 style={{ ...styles.heading, color: theme.text }}>AI Workspace</h1>
            {useProfile && profile && (
              <p style={{ color: "#7c3aed", fontSize: "13px", margin: "4px 0 0" }}>
                ✦ Responding as {profile.experience} {profile.preferredLanguage} developer
              </p>
            )}
          </div>
          <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
            <button onClick={() => setDarkMode(!darkMode)} style={{ ...styles.modeBtn, borderColor: theme.border, color: theme.text }}>
              {darkMode ? "☀️ Light" : "🌙 Dark"}
            </button>
            <button onClick={onLogout} style={styles.logoutButton}>Logout</button>
          </div>
        </div>

        {/* EMPTY STATE */}
        {chat.length === 0 && (
          <div style={styles.emptyState}>
            <h2 style={{ color: theme.text }}>Welcome to DevMind AI 🚀</h2>
            <p style={{ color: theme.subtext }}>
              {useProfile && profile
                ? `Chatting with your ${profile.experience} ${profile.preferredLanguage} profile active.`
                : "Start a new conversation and build something amazing."
              }
            </p>
          </div>
        )}

        {/* CHAT */}
        <div style={styles.chatContainer}>
          {chat.map((msg, index) => (
            <div
              key={index}
              style={msg.sender === "ai"
                ? { ...styles.messageAi, backgroundColor: theme.msgAi, border: `1px solid ${theme.border}`, color: theme.text }
                : styles.messageUser
              }
            >
              {msg.sender === "ai"
                ? <MessageContent text={msg.text} isNew={index === typingIndex} onDone={() => setTypingIndex(null)} />
                : msg.text
              }
            </div>
          ))}

          {loading && (
            <div style={{ ...styles.messageAi, backgroundColor: theme.msgAi, border: `1px solid ${theme.border}` }}>
              <span style={{ color: theme.subtext, fontSize: "14px" }}>DevMind is thinking...</span>
            </div>
          )}

          <div ref={chatEndRef} />
        </div>

        {/* INPUT */}
        <div style={styles.inputArea}>
          <input
            type="text"
            placeholder={useProfile && profile ? `Ask anything — your ${profile.stack[0] || ""} stack is active...` : "Ask anything..."}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyDown={(e) => { if (e.key === "Enter") sendMessage() }}
            style={{ ...styles.input, backgroundColor: theme.inputBg, color: theme.text, border: `1px solid ${theme.border}` }}
          />
          <button onClick={sendMessage} style={styles.sendButton} disabled={loading}>
            {loading ? "Thinking..." : "Send"}
          </button>
        </div>

      </div>
    </div>
  )
}

const dark = {
  bg: "#020617", sidebar: "#0f172a", border: "#1e293b",
  text: "white", subtext: "#94a3b8", msgAi: "#0f172a",
  historyItem: "#111827", inputBg: "#0f172a"
}

const light = {
  bg: "#f8fafc", sidebar: "#ffffff", border: "#e2e8f0",
  text: "#0f172a", subtext: "#64748b", msgAi: "#ffffff",
  historyItem: "#f1f5f9", inputBg: "#ffffff"
}

const styles = {
  dashboard: { minHeight: "100vh", display: "flex" },
  sidebar: { width: "300px", padding: "25px", display: "flex", flexDirection: "column" },
  logo: { marginBottom: "20px", fontSize: "22px", fontWeight: "bold" },
  newChatButton: { padding: "14px", borderRadius: "14px", border: "none", background: "linear-gradient(to right, #7c3aed, #2563eb)", color: "white", cursor: "pointer", marginBottom: "16px", fontSize: "15px" },
  profileBox: { border: "1px solid", borderRadius: "14px", padding: "14px", marginBottom: "16px" },
  profileTop: { display: "flex", alignItems: "center", gap: "8px", marginBottom: "10px" },
  profileIcon: { fontSize: "16px" },
  editProfileBtn: { marginLeft: "auto", padding: "4px 10px", borderRadius: "8px", border: "1px solid #334155", backgroundColor: "transparent", color: "#94a3b8", cursor: "pointer", fontSize: "12px" },
  profileStack: { display: "flex", flexWrap: "wrap", gap: "6px", marginBottom: "10px" },
  stackTag: { padding: "3px 8px", borderRadius: "6px", backgroundColor: "#7c3aed22", color: "#a78bfa", fontSize: "11px", fontWeight: "600" },
  toggleRow: { display: "flex", justifyContent: "space-between", alignItems: "center" },
  toggleBtn: { padding: "4px 10px", borderRadius: "8px", border: "none", color: "white", cursor: "pointer", fontSize: "12px", fontWeight: "bold" },
  history: { display: "flex", flexDirection: "column", gap: "8px", overflowY: "auto", flex: 1 },
  historyItem: { padding: "12px 14px", borderRadius: "12px", cursor: "pointer", fontSize: "13px" },
  activeHistoryItem: { padding: "12px 14px", background: "linear-gradient(to right, #7c3aed, #2563eb)", borderRadius: "12px", cursor: "pointer", color: "white", fontSize: "13px" },
  main: { flex: 1, display: "flex", flexDirection: "column", padding: "30px", height: "100vh" },
  topBar: { display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "20px" },
  heading: { fontSize: "32px", fontWeight: "bold", margin: 0 },
  modeBtn: { padding: "10px 16px", borderRadius: "12px", border: "1px solid", backgroundColor: "transparent", cursor: "pointer", fontSize: "13px" },
  logoutButton: { padding: "10px 20px", borderRadius: "12px", border: "none", background: "linear-gradient(to right, #ef4444, #dc2626)", color: "white", cursor: "pointer" },
  emptyState: { marginTop: "80px", textAlign: "center" },
  chatContainer: { flex: 1, overflowY: "auto", display: "flex", flexDirection: "column", gap: "20px", paddingBottom: "20px" },
  messageAi: { maxWidth: "750px", padding: "20px", borderRadius: "18px", lineHeight: "1.8", fontSize: "15px" },
  messageUser: { alignSelf: "flex-end", maxWidth: "550px", background: "linear-gradient(to right, #7c3aed, #2563eb)", color: "white", padding: "16px 20px", borderRadius: "18px", lineHeight: "1.7", fontSize: "15px" },
  inputArea: { display: "flex", gap: "12px", marginTop: "20px" },
  input: { flex: 1, padding: "16px 20px", borderRadius: "14px", fontSize: "16px", outline: "none" },
  sendButton: { padding: "16px 28px", borderRadius: "14px", border: "none", background: "linear-gradient(to right, #7c3aed, #2563eb)", color: "white", cursor: "pointer", fontSize: "15px", fontWeight: "bold" },
  copyBtn: { marginTop: "10px", padding: "5px 12px", borderRadius: "8px", border: "1px solid #334155", backgroundColor: "transparent", color: "#94a3b8", cursor: "pointer", fontSize: "12px" },
  codeBlock: { backgroundColor: "#0d1117", borderRadius: "12px", overflow: "hidden", margin: "10px 0" },
  codeHeader: { display: "flex", justifyContent: "space-between", alignItems: "center", padding: "8px 16px", backgroundColor: "#161b22", borderBottom: "1px solid #30363d" },
  codeLang: { color: "#8b949e", fontSize: "12px", fontFamily: "monospace" },
  codeTopCopyBtn: { padding: "4px 10px", borderRadius: "6px", border: "1px solid #30363d", backgroundColor: "transparent", color: "#8b949e", cursor: "pointer", fontSize: "12px" },
  codePre: { padding: "16px", margin: 0, overflowX: "auto", color: "#e6edf3", fontSize: "14px", lineHeight: "1.6", fontFamily: "monospace" }
}

export default Dashboard