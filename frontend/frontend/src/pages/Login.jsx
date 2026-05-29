import { useState } from "react"
import { useNavigate } from "react-router-dom"

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

      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/auth/login`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, password })
        }
      )

      const data = await response.json()

      if (!response.ok) {
        alert(data.message || "Login failed")
        setLoading(false)
        return
      }

      onLogin(data.token)
      navigate("/dashboard")

    } catch (error) {
      console.log(error)
      alert("Server error")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={styles.container}>
      <div style={styles.card}>

        <h1 style={styles.title}>DevMind AI</h1>
        <p style={styles.subtitle}>Login to continue</p>

        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
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

        <button onClick={handleLogin} style={styles.button} disabled={loading}>
          {loading ? "Loading..." : "Login"}
        </button>

        <p style={styles.text}>
          Don't have an account?{" "}
          <span onClick={() => navigate("/signup")} style={styles.link}>
            Signup
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
    gap: "20px",
    width: "400px",
    boxShadow: "0 0 30px rgba(0,0,0,0.5)"
  },
  title: { color: "white", textAlign: "center", marginBottom: "0px" },
  subtitle: { color: "#94a3b8", textAlign: "center", marginTop: "-10px" },
  input: {
    padding: "16px",
    borderRadius: "12px",
    border: "1px solid #334155",
    backgroundColor: "#020617",
    color: "white",
    fontSize: "16px",
    outline: "none"
  },
  button: {
    padding: "16px",
    borderRadius: "12px",
    border: "none",
    background: "linear-gradient(to right, #7c3aed, #2563eb)",
    color: "white",
    fontSize: "16px",
    cursor: "pointer",
    fontWeight: "bold"
  },
  text: { color: "white", textAlign: "center" },
  link: { color: "#8b5cf6", cursor: "pointer", fontWeight: "bold" }
}

export default Login