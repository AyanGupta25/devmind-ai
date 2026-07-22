import { useState } from "react"
import { useNavigate } from "react-router-dom"

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000"

function Login({ onLogin }) {

  const navigate = useNavigate()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(false)

  async function handleLogin() {

    if (!email || !password) {
      alert("Please fill all fields")
      return
    }

    try {
      setLoading(true)

      const response = await fetch(`${API_URL}/api/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password })
      })

      const data = await response.json()

      if (!response.ok) {
        alert(data.message || "Login failed")
        return
      }

      onLogin(data.token)
      navigate("/dashboard")

    } catch (error) {
      console.log("Login error:", error)
      alert("Cannot connect to server. Make sure backend is running on port 5000.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={styles.container}>
      <div style={styles.card}>

        <div style={styles.logoArea}>
          <div style={styles.logoIcon}>🧠</div>
          <h1 style={styles.title}>DevMind AI</h1>
          <p style={styles.subtitle}>Login to your workspace</p>
        </div>

        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          onKeyDown={(e) => { if (e.key === "Enter") handleLogin() }}
          style={styles.input}
        />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          onKeyDown={(e) => { if (e.key === "Enter") handleLogin() }}
          style={styles.input}
        />

        <button
          onClick={handleLogin}
          style={{ ...styles.button, opacity: loading ? 0.7 : 1 }}
          disabled={loading}
        >
          {loading ? "Logging in..." : "Login"}
        </button>

        <p style={styles.text}>
          Don't have an account?{" "}
          <span onClick={() => navigate("/signup")} style={styles.link}>
            Sign up
          </span>
        </p>

      </div>
    </div>
  )
}

const styles = {
  container: {
    minHeight: "100vh",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#020617"
  },
  card: {
    backgroundColor: "#0f172a",
    padding: "40px",
    borderRadius: "20px",
    display: "flex",
    flexDirection: "column",
    gap: "16px",
    width: "100%",
    maxWidth: "400px",
    boxShadow: "0 0 40px rgba(124,58,237,0.15)",
    border: "1px solid #1e293b"
  },
  logoArea: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    marginBottom: "8px"
  },
  logoIcon: {
    fontSize: "40px",
    marginBottom: "10px"
  },
  title: {
    color: "white",
    textAlign: "center",
    margin: "0 0 6px 0",
    fontSize: "26px",
    fontWeight: "bold"
  },
  subtitle: {
    color: "#94a3b8",
    textAlign: "center",
    margin: 0,
    fontSize: "14px"
  },
  input: {
    padding: "14px 16px",
    borderRadius: "12px",
    border: "1px solid #334155",
    backgroundColor: "#020617",
    color: "white",
    fontSize: "15px",
    outline: "none"
  },
  button: {
    padding: "14px",
    borderRadius: "12px",
    border: "none",
    background: "linear-gradient(to right, #7c3aed, #2563eb)",
    color: "white",
    fontSize: "15px",
    cursor: "pointer",
    fontWeight: "bold",
    marginTop: "4px"
  },
  text: {
    color: "#94a3b8",
    textAlign: "center",
    fontSize: "14px",
    margin: 0
  },
  link: {
    color: "#8b5cf6",
    cursor: "pointer",
    fontWeight: "bold"
  }
}

export default Login