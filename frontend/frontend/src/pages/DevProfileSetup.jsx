import { useState } from "react"
import { useNavigate } from "react-router-dom"

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000"

const STACKS = [
  "React", "Vue", "Angular", "Next.js", "Node.js",
  "Express", "Python", "Django", "FastAPI", "MongoDB",
  "PostgreSQL", "MySQL", "TypeScript", "GraphQL", "Docker",
  "AWS", "Firebase", "Tailwind CSS", "React Native", "Flutter"
]

function DevProfileSetup({ onDone }) {

  const navigate = useNavigate()
  const [selectedStack, setSelectedStack] = useState([])
  const [experience, setExperience] = useState("Intermediate")
  const [preferredLanguage, setPreferredLanguage] = useState("JavaScript")
  const [codingStyle, setCodingStyle] = useState("spaces")
  const [projectDescription, setProjectDescription] = useState("")
  const [loading, setLoading] = useState(false)

  function toggleStack(item) {
    setSelectedStack((prev) =>
      prev.includes(item)
        ? prev.filter((s) => s !== item)
        : [...prev, item]
    )
  }

  async function saveProfile() {
    if (selectedStack.length === 0) {
      alert("Please select at least one technology")
      return
    }

    try {
      setLoading(true)
      const response = await fetch(`${API_URL}/api/profile`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`
        },
        body: JSON.stringify({
          stack: selectedStack,
          experience,
          preferredLanguage,
          codingStyle,
          projectDescription
        })
      })

      if (response.ok) {
        onDone()
        navigate("/dashboard")
      } else {
        alert("Failed to save profile")
      }
    } catch (error) {
      console.log(error)
      alert("Server error")
    } finally {
      setLoading(false)
    }
  }

  function skipProfile() {
    onDone()
    navigate("/dashboard")
  }

  return (
    <div style={styles.container}>
      <div style={styles.card}>

        <div style={styles.header}>
          <h1 style={styles.title}>DevMind AI</h1>
          <p style={styles.subtitle}>Set up your Dev Profile</p>
          <p style={styles.desc}>This helps DevMind AI give you answers tailored to your exact stack. You can change this anytime.</p>
        </div>

        {/* STACK SELECTION */}
        <div style={styles.section}>
          <label style={styles.label}>Your Tech Stack <span style={styles.required}>*</span></label>
          <p style={styles.hint}>Select all technologies you work with</p>
          <div style={styles.stackGrid}>
            {STACKS.map((tech) => (
              <button
                key={tech}
                onClick={() => toggleStack(tech)}
                style={selectedStack.includes(tech) ? styles.stackBtnActive : styles.stackBtn}
              >
                {tech}
              </button>
            ))}
          </div>
        </div>

        {/* EXPERIENCE */}
        <div style={styles.section}>
          <label style={styles.label}>Experience Level</label>
          <div style={styles.optionRow}>
            {["Beginner", "Intermediate", "Expert"].map((level) => (
              <button
                key={level}
                onClick={() => setExperience(level)}
                style={experience === level ? styles.optionBtnActive : styles.optionBtn}
              >
                {level === "Beginner" && "🌱 "}
                {level === "Intermediate" && "⚡ "}
                {level === "Expert" && "🚀 "}
                {level}
              </button>
            ))}
          </div>
        </div>

        {/* PREFERRED LANGUAGE */}
        <div style={styles.section}>
          <label style={styles.label}>Preferred Language</label>
          <div style={styles.optionRow}>
            {["JavaScript", "TypeScript", "Python", "Go", "Rust"].map((lang) => (
              <button
                key={lang}
                onClick={() => setPreferredLanguage(lang)}
                style={preferredLanguage === lang ? styles.optionBtnActive : styles.optionBtn}
              >
                {lang}
              </button>
            ))}
          </div>
        </div>

        {/* CODING STYLE */}
        <div style={styles.section}>
          <label style={styles.label}>Indentation Style</label>
          <div style={styles.optionRow}>
            {["spaces", "tabs"].map((style) => (
              <button
                key={style}
                onClick={() => setCodingStyle(style)}
                style={codingStyle === style ? styles.optionBtnActive : styles.optionBtn}
              >
                {style === "spaces" ? "⎵ Spaces" : "⇥ Tabs"}
              </button>
            ))}
          </div>
        </div>

        {/* PROJECT DESCRIPTION */}
        <div style={styles.section}>
          <label style={styles.label}>Current Project <span style={styles.optional}>(optional)</span></label>
          <textarea
            placeholder="e.g. Building an AI-powered chat app with React and Node.js..."
            value={projectDescription}
            onChange={(e) => setProjectDescription(e.target.value)}
            style={styles.textarea}
            rows={3}
          />
        </div>

        {/* BUTTONS */}
        <div style={styles.btnRow}>
          <button onClick={skipProfile} style={styles.skipBtn}>
            Skip for now
          </button>
          <button onClick={saveProfile} style={styles.saveBtn} disabled={loading}>
            {loading ? "Saving..." : "Save Profile & Continue →"}
          </button>
        </div>

      </div>
    </div>
  )
}

const styles = {
  container: { minHeight: "100vh", backgroundColor: "#020617", display: "flex", justifyContent: "center", alignItems: "flex-start", padding: "40px 20px", overflowY: "auto" },
  card: { backgroundColor: "#0f172a", borderRadius: "24px", padding: "40px", width: "100%", maxWidth: "680px", border: "1px solid #1e293b" },
  header: { marginBottom: "32px", textAlign: "center" },
  title: { color: "white", fontSize: "28px", fontWeight: "bold", margin: "0 0 8px" },
  subtitle: { color: "#7c3aed", fontSize: "18px", margin: "0 0 12px" },
  desc: { color: "#94a3b8", fontSize: "14px", margin: 0, lineHeight: "1.6" },
  section: { marginBottom: "28px" },
  label: { color: "white", fontSize: "15px", fontWeight: "600", display: "block", marginBottom: "8px" },
  hint: { color: "#64748b", fontSize: "13px", margin: "0 0 12px" },
  required: { color: "#ef4444" },
  optional: { color: "#64748b", fontWeight: "normal", fontSize: "13px" },
  stackGrid: { display: "flex", flexWrap: "wrap", gap: "8px" },
  stackBtn: { padding: "8px 14px", borderRadius: "10px", border: "1px solid #334155", backgroundColor: "transparent", color: "#94a3b8", cursor: "pointer", fontSize: "13px" },
  stackBtnActive: { padding: "8px 14px", borderRadius: "10px", border: "1px solid #7c3aed", backgroundColor: "#7c3aed22", color: "#a78bfa", cursor: "pointer", fontSize: "13px", fontWeight: "600" },
  optionRow: { display: "flex", gap: "10px", flexWrap: "wrap" },
  optionBtn: { padding: "10px 18px", borderRadius: "12px", border: "1px solid #334155", backgroundColor: "transparent", color: "#94a3b8", cursor: "pointer", fontSize: "14px" },
  optionBtnActive: { padding: "10px 18px", borderRadius: "12px", border: "1px solid #7c3aed", backgroundColor: "#7c3aed22", color: "#a78bfa", cursor: "pointer", fontSize: "14px", fontWeight: "600" },
  textarea: { width: "100%", padding: "14px", borderRadius: "12px", border: "1px solid #334155", backgroundColor: "#020617", color: "white", fontSize: "14px", outline: "none", resize: "vertical", boxSizing: "border-box", lineHeight: "1.6" },
  btnRow: { display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: "8px" },
  skipBtn: { padding: "12px 20px", borderRadius: "12px", border: "1px solid #334155", backgroundColor: "transparent", color: "#64748b", cursor: "pointer", fontSize: "14px" },
  saveBtn: { padding: "14px 28px", borderRadius: "12px", border: "none", background: "linear-gradient(to right, #7c3aed, #2563eb)", color: "white", cursor: "pointer", fontSize: "15px", fontWeight: "bold" }
}

export default DevProfileSetup