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
  const [menuOpenId, setMenuOpenId] = useState(null)
  const [renamingId, setRenamingId] = useState(null)
  const [renameValue, setRenameValue] = useState("")
  const [activeTitle, setActiveTitle] = useState("New Chat")

  // Image upload state
  const [selectedImage, setSelectedImage] = useState(null)
  const [imagePreview, setImagePreview] = useState(null)
  const fileInputRef = useRef(null)

  const chatEndRef = useRef(null)

  useEffect(() => {
    fetchConversations()
    fetchProfile()
  }, [])

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [chat])

  useEffect(() => {
    function handleClick() { setMenuOpenId(null) }
    window.addEventListener("click", handleClick)
    return () => window.removeEventListener("click", handleClick)
  }, [])

  async function fetchProfile() {
    try {
      const response = await fetch(`${API_URL}/api/profile`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
      })
      const data = await response.json()
      setProfile(data)
    } catch (error) { console.log(error) }
  }

  async function fetchConversations() {
    try {
      const response = await fetch(`${API_URL}/api/chats`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
      })
      const data = await response.json()
      setConversations(data)
    } catch (error) { console.log(error) }
  }

  function openConversation(conversation) {
    setConversationId(conversation._id)
    setActiveConversation(conversation._id)
    setActiveTitle(conversation.title)
    setTypingIndex(null)
    setChat(conversation.messages.map((msg) => ({
      sender: msg.role === "assistant" ? "ai" : "user",
      text: msg.content,
      image: msg.image || null
    })))
  }

  function newChat() {
    setConversationId(null)
    setActiveConversation(null)
    setActiveTitle("New Chat")
    setTypingIndex(null)
    setChat([])
    setSelectedImage(null)
    setImagePreview(null)
  }

  // ==============================
  // IMAGE SELECTION
  // ==============================
  function handleImageSelect(e) {
    const file = e.target.files[0]
    if (!file) return
    if (file.size > 5 * 1024 * 1024) {
      alert("Image must be under 5MB")
      return
    }
    const reader = new FileReader()
    reader.onload = () => {
      setSelectedImage(reader.result) // base64
      setImagePreview(reader.result)
    }
    reader.readAsDataURL(file)
  }

  function removeImage() {
    setSelectedImage(null)
    setImagePreview(null)
    if (fileInputRef.current) fileInputRef.current.value = ""
  }

  // ==============================
  // EXPORT AS PDF
  // ==============================
  function exportPDF() {
    if (chat.length === 0) { alert("No conversation to export."); return }
    const printWindow = window.open("", "_blank")
    const htmlContent = `
      <!DOCTYPE html><html><head><meta charset="utf-8" />
      <title>${activeTitle} — DevMind AI</title>
      <style>
        body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; max-width: 800px; margin: 40px auto; padding: 0 20px; color: #0f172a; }
        h1 { font-size: 22px; color: #7c3aed; margin-bottom: 4px; }
        .meta { font-size: 13px; color: #64748b; margin-bottom: 32px; }
        .message { margin-bottom: 24px; }
        .label { font-size: 12px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.05em; margin-bottom: 6px; }
        .user .label { color: #2563eb; } .ai .label { color: #7c3aed; }
        .bubble { padding: 14px 18px; border-radius: 12px; line-height: 1.7; font-size: 14px; white-space: pre-wrap; word-break: break-word; }
        .user .bubble { background: #eff6ff; border: 1px solid #bfdbfe; }
        .ai .bubble { background: #f5f3ff; border: 1px solid #ddd6fe; }
        pre { background: #1e293b; color: #e2e8f0; padding: 14px; border-radius: 8px; overflow-x: auto; font-size: 13px; line-height: 1.6; }
        img { max-width: 300px; border-radius: 8px; margin-bottom: 8px; display: block; }
        .footer { margin-top: 40px; padding-top: 16px; border-top: 1px solid #e2e8f0; font-size: 12px; color: #94a3b8; text-align: center; }
        @media print { body { margin: 20px; } }
      </style></head><body>
      <h1>💬 ${activeTitle}</h1>
      <div class="meta">Exported from DevMind AI · ${new Date().toLocaleDateString("en-IN", { year: "numeric", month: "long", day: "numeric" })}</div>
      ${chat.map((msg) => `
        <div class="message ${msg.sender}">
          <div class="label">${msg.sender === "user" ? "You" : "DevMind AI"}</div>
          <div class="bubble">
            ${msg.image ? `<img src="${msg.image}" />` : ""}
            ${msg.text.replace(/```([\s\S]*?)```/g, "<pre>$1</pre>").replace(/\n/g, "<br/>")}
          </div>
        </div>
      `).join("")}
      <div class="footer">DevMind AI — Your Developer Intelligence Platform</div>
      </body></html>
    `
    printWindow.document.write(htmlContent)
    printWindow.document.close()
    printWindow.focus()
    setTimeout(() => { printWindow.print() }, 500)
  }

  async function renameConversation(id) {
    if (!renameValue.trim()) return
    try {
      await fetch(`${API_URL}/api/chats/${id}/rename`, {
        method: "PUT",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${localStorage.getItem("token")}` },
        body: JSON.stringify({ title: renameValue })
      })
      if (activeConversation === id) setActiveTitle(renameValue)
      setRenamingId(null)
      setRenameValue("")
      fetchConversations()
    } catch (error) { console.log(error) }
  }

  async function deleteConversation(id) {
    if (!window.confirm("Delete this conversation?")) return
    try {
      await fetch(`${API_URL}/api/chats/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
      })
      if (activeConversation === id) newChat()
      fetchConversations()
    } catch (error) { console.log(error) }
  }

  // ==============================
  // SEND MESSAGE (with optional image)
  // ==============================
  async function sendMessage() {
    if (!message.trim() && !selectedImage) return
    if (loading) return

    setLoading(true)
    const currentMessage = message || "What's in this image?"
    const currentImage = selectedImage

    setChat((prev) => [...prev, {
      sender: "user",
      text: currentMessage,
      image: currentImage
    }])
    setMessage("")
    setSelectedImage(null)
    setImagePreview(null)
    if (fileInputRef.current) fileInputRef.current.value = ""

    try {
      const response = await fetch(`${API_URL}/api/chat`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`
        },
        body: JSON.stringify({
          message: currentMessage,
          conversationId,
          useProfile,
          image: currentImage
        })
      })

      const data = await response.json()

      if (!conversationId && data.conversationId) {
        setConversationId(data.conversationId)
        setActiveConversation(data.conversationId)
      }

      if (data.reply) {
  setChat((prev) => {
    const updated = [...prev, { sender: "ai", text: data.reply }]
    setTypingIndex(updated.length - 1)
    return updated
  })
} else {
  setChat((prev) => [...prev, { sender: "ai", text: "Sorry, I couldn't analyze the image. Please try again." }])
}

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

        {profile && (
          <div style={{ ...styles.profileBox, borderColor: theme.border }}>
            <div style={styles.profileTop}>
              <span style={styles.profileIcon}>👤</span>
              <span style={{ color: theme.text, fontSize: "13px", fontWeight: "600" }}>Dev Profile</span>
              <button onClick={() => navigate("/setup")} style={styles.editProfileBtn}>Edit</button>
            </div>
            <div style={styles.profileStack}>
              {profile.stack.slice(0, 4).map((s) => (<span key={s} style={styles.stackTag}>{s}</span>))}
              {profile.stack.length > 4 && <span style={styles.stackTag}>+{profile.stack.length - 4}</span>}
            </div>
            <div style={styles.toggleRow}>
              <span style={{ color: theme.subtext, fontSize: "12px" }}>Use profile in chat</span>
              <button onClick={() => setUseProfile(!useProfile)} style={{ ...styles.toggleBtn, backgroundColor: useProfile ? "#7c3aed" : theme.border }}>
                {useProfile ? "ON" : "OFF"}
              </button>
            </div>
          </div>
        )}

        <div style={styles.history}>
          {conversations.map((conv) => (
            <div key={conv._id} style={{ position: "relative" }}>
              {renamingId === conv._id ? (
                <div style={styles.renameBox}>
                  <input autoFocus value={renameValue} onChange={(e) => setRenameValue(e.target.value)}
                    onKeyDown={(e) => { if (e.key === "Enter") renameConversation(conv._id); if (e.key === "Escape") { setRenamingId(null); setRenameValue("") } }}
                    style={{ ...styles.renameInput, backgroundColor: theme.inputBg, color: theme.text, border: "1px solid #7c3aed" }}
                  />
                  <div style={{ display: "flex", gap: "4px", marginTop: "6px" }}>
                    <button onClick={() => renameConversation(conv._id)} style={styles.renameSaveBtn}>Save</button>
                    <button onClick={() => { setRenamingId(null); setRenameValue("") }} style={styles.renameCancelBtn}>Cancel</button>
                  </div>
                </div>
              ) : (
                <div style={{ ...(activeConversation === conv._id ? styles.activeHistoryItem : { ...styles.historyItem, backgroundColor: theme.historyItem, color: theme.subtext }), display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <span onClick={() => openConversation(conv)} style={{ flex: 1, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{conv.title}</span>
                  <button onClick={(e) => { e.stopPropagation(); setMenuOpenId(menuOpenId === conv._id ? null : conv._id) }}
                    style={{ ...styles.menuDotBtn, color: activeConversation === conv._id ? "white" : theme.subtext }}>⋯</button>
                  {menuOpenId === conv._id && (
                    <div style={{ ...styles.dropdown, backgroundColor: theme.sidebar, border: `1px solid ${theme.border}` }}>
                      <button onClick={(e) => { e.stopPropagation(); setRenamingId(conv._id); setRenameValue(conv.title); setMenuOpenId(null) }} style={{ ...styles.dropdownItem, color: theme.text }}>✏️ Rename</button>
                      <button onClick={(e) => { e.stopPropagation(); deleteConversation(conv._id) }} style={{ ...styles.dropdownItem, color: "#ef4444" }}>🗑️ Delete</button>
                    </div>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* MAIN */}
      <div style={styles.main}>
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
            {chat.length > 0 && <button onClick={exportPDF} style={styles.exportBtn}>📄 Export PDF</button>}
            <button onClick={() => setDarkMode(!darkMode)} style={{ ...styles.modeBtn, borderColor: theme.border, color: theme.text }}>
              {darkMode ? "☀️ Light" : "🌙 Dark"}
            </button>
            <button onClick={onLogout} style={styles.logoutButton}>Logout</button>
          </div>
        </div>

        {chat.length === 0 && (
          <div style={styles.emptyState}>
            <h2 style={{ color: theme.text }}>Welcome to DevMind AI 🚀</h2>
            <p style={{ color: theme.subtext }}>
              {useProfile && profile ? `Chatting with your ${profile.experience} ${profile.preferredLanguage} profile active.` : "Start a new conversation and build something amazing."}
            </p>
            <p style={{ color: theme.subtext, fontSize: "13px", marginTop: "8px" }}>📎 You can also upload screenshots and images for AI to analyze</p>
          </div>
        )}

        <div style={styles.chatContainer}>
          {chat.map((msg, index) => (
            <div key={index} style={msg.sender === "ai"
              ? { ...styles.messageAi, backgroundColor: theme.msgAi, border: `1px solid ${theme.border}`, color: theme.text }
              : styles.messageUser
            }>
              {/* Show image if attached */}
              {msg.image && (
                <img src={msg.image} alt="uploaded" style={styles.chatImage} />
              )}
              {msg.sender === "ai"
                ? <MessageContent text={msg.text} isNew={index === typingIndex} onDone={() => setTypingIndex(null)} />
                : <span>{msg.text}</span>
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

        {/* IMAGE PREVIEW */}
        {imagePreview && (
          <div style={styles.imagePreviewBox}>
            <img src={imagePreview} alt="preview" style={styles.imagePreviewImg} />
            <button onClick={removeImage} style={styles.removeImageBtn}>✕</button>
          </div>
        )}

        {/* INPUT */}
        <div style={styles.inputArea}>
          {/* HIDDEN FILE INPUT */}
          <input
            type="file"
            accept="image/*"
            ref={fileInputRef}
            onChange={handleImageSelect}
            style={{ display: "none" }}
          />

          {/* IMAGE UPLOAD BUTTON */}
          <button
            onClick={() => fileInputRef.current.click()}
            style={{ ...styles.uploadBtn, borderColor: theme.border, color: selectedImage ? "#7c3aed" : theme.subtext }}
            title="Upload image"
          >
            📎
          </button>

          <input
            type="text"
            placeholder={selectedImage ? "Ask about the image..." : useProfile && profile ? `Ask anything — your ${profile.stack[0] || ""} stack is active...` : "Ask anything..."}
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

const dark = { bg: "#020617", sidebar: "#0f172a", border: "#1e293b", text: "white", subtext: "#94a3b8", msgAi: "#0f172a", historyItem: "#111827", inputBg: "#0f172a" }
const light = { bg: "#f8fafc", sidebar: "#ffffff", border: "#e2e8f0", text: "#0f172a", subtext: "#64748b", msgAi: "#ffffff", historyItem: "#f1f5f9", inputBg: "#ffffff" }

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
  renameBox: { padding: "8px" },
  renameInput: { width: "100%", padding: "8px 10px", borderRadius: "8px", fontSize: "13px", outline: "none", boxSizing: "border-box" },
  renameSaveBtn: { padding: "5px 12px", borderRadius: "6px", border: "none", background: "#7c3aed", color: "white", cursor: "pointer", fontSize: "12px" },
  renameCancelBtn: { padding: "5px 12px", borderRadius: "6px", border: "1px solid #334155", backgroundColor: "transparent", color: "#94a3b8", cursor: "pointer", fontSize: "12px" },
  menuDotBtn: { background: "transparent", border: "none", cursor: "pointer", fontSize: "18px", padding: "0 4px", lineHeight: 1, flexShrink: 0 },
  dropdown: { position: "absolute", right: 0, top: "100%", borderRadius: "10px", zIndex: 100, minWidth: "130px", boxShadow: "0 4px 20px rgba(0,0,0,0.3)", overflow: "hidden" },
  dropdownItem: { display: "block", width: "100%", padding: "10px 14px", border: "none", backgroundColor: "transparent", cursor: "pointer", fontSize: "13px", textAlign: "left" },
  main: { flex: 1, display: "flex", flexDirection: "column", padding: "30px", height: "100vh" },
  topBar: { display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "20px" },
  heading: { fontSize: "32px", fontWeight: "bold", margin: 0 },
  exportBtn: { padding: "10px 16px", borderRadius: "12px", border: "1px solid #7c3aed", backgroundColor: "#7c3aed22", color: "#a78bfa", cursor: "pointer", fontSize: "13px", fontWeight: "600" },
  modeBtn: { padding: "10px 16px", borderRadius: "12px", border: "1px solid", backgroundColor: "transparent", cursor: "pointer", fontSize: "13px" },
  logoutButton: { padding: "10px 20px", borderRadius: "12px", border: "none", background: "linear-gradient(to right, #ef4444, #dc2626)", color: "white", cursor: "pointer" },
  emptyState: { marginTop: "80px", textAlign: "center" },
  chatContainer: { flex: 1, overflowY: "auto", display: "flex", flexDirection: "column", gap: "20px", paddingBottom: "20px" },
  messageAi: { maxWidth: "750px", padding: "20px", borderRadius: "18px", lineHeight: "1.8", fontSize: "15px" },
  messageUser: { alignSelf: "flex-end", maxWidth: "550px", background: "linear-gradient(to right, #7c3aed, #2563eb)", color: "white", padding: "16px 20px", borderRadius: "18px", lineHeight: "1.7", fontSize: "15px" },
  chatImage: { maxWidth: "250px", borderRadius: "10px", marginBottom: "8px", display: "block" },
  imagePreviewBox: { display: "flex", alignItems: "center", gap: "10px", padding: "10px 0" },
  imagePreviewImg: { width: "60px", height: "60px", borderRadius: "8px", objectFit: "cover", border: "2px solid #7c3aed" },
  removeImageBtn: { padding: "4px 8px", borderRadius: "6px", border: "none", backgroundColor: "#ef4444", color: "white", cursor: "pointer", fontSize: "12px" },
  inputArea: { display: "flex", gap: "12px", marginTop: "8px", alignItems: "center" },
  uploadBtn: { padding: "16px", borderRadius: "14px", border: "1px solid", backgroundColor: "transparent", cursor: "pointer", fontSize: "18px", flexShrink: 0 },
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