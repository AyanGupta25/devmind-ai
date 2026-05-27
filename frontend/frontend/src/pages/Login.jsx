import { useState } from "react"

import {
  useNavigate
} from "react-router-dom"

function Login() {

  const navigate =
    useNavigate()

  const [email, setEmail] =
    useState("")

  const [password, setPassword] =
    useState("")

  async function handleLogin() {

    try {

      const response =
        await fetch(

          "http://localhost:5000/api/auth/login",

          {

            method: "POST",

            headers: {

              "Content-Type":
                "application/json"

            },

            body: JSON.stringify({

              email,
              password

            })

          }

        )

      const data =
        await response.json()

      console.log(data)

      alert(data.message)

      localStorage.setItem(

        "token",

        data.token

      )

      navigate("/dashboard")

    } catch (error) {

      console.log(error)

    }

  }

  return (

    <div style={styles.container}>

      <div style={styles.card}>

        <h1>
          Login
        </h1>

        <input

          type="email"

          placeholder="Email"

          value={email}

          onChange={(e) =>
            setEmail(e.target.value)
          }

          style={styles.input}

        />

        <input

          type="password"

          placeholder="Password"

          value={password}

          onChange={(e) =>
            setPassword(e.target.value)
          }

          style={styles.input}

        />

        <button

          onClick={handleLogin}

          style={styles.button}

        >

          Login

        </button>

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

    width: "400px"

  },

  input: {

    padding: "16px",

    borderRadius: "12px",

    border: "1px solid #334155",

    backgroundColor: "#020617",

    color: "white",

    fontSize: "16px"

  },

  button: {

    padding: "16px",

    borderRadius: "12px",

    border: "none",

    background:
      "linear-gradient(to right, #7c3aed, #2563eb)",

    color: "white",

    fontSize: "16px",

    cursor: "pointer"

  }

}

export default Login