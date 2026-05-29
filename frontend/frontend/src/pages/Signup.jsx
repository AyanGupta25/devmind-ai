import { useState } from "react"
import { useNavigate } from "react-router-dom"

function Signup({ onLogin }) {

  const navigate = useNavigate()
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(false)

  async function handleSignup() {

    if (!name || !email || !password) {
      alert("Please fill all fields")
      return
    }

    try {
      setLoading(true)

      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/auth/signup`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ name, email, password })
        }
      )

      const data = await response.json()

      if (!response.ok) {
        alert(data.message || "Signup failed")
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
        <p style={styles.subtitle}>Create your account</p>

        <input
          type="text"
          placeholder="Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          style={styles.input}
        />

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
          onKeyDown={(e) => { if (e.key === "Enter") handleSignup() }}
          style={styles.input}
        />

        <button onClick={handleSignup} style={styles.button} disabled={loading}>
          {loading ? "Loading..." : "Signup"}
        </button>

        <p style={styles.text}>
          Already have an account?{" "}
          <span onClick={() => navigate("/")} style={styles.link}>
            Login
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

export default Signup