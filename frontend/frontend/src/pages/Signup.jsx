import { useState } from "react"

import {
  useNavigate
} from "react-router-dom"

function Signup() {

  const navigate =
    useNavigate()

  const [name, setName] =
    useState("")

  const [email, setEmail] =
    useState("")

  const [password, setPassword] =
    useState("")

  async function handleSignup() {

    try {

      const response =
        await fetch(

          "http://localhost:5000/api/auth/signup",

          {

            method: "POST",

            headers: {

              "Content-Type":
                "application/json"

            },

            body: JSON.stringify({

              name,
              email,
              password

            })

          }

        )

      const data =
        await response.json()

      console.log(data)

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
          Signup
        </h1>

        <input

          type="text"

          placeholder="Name"

          value={name}

          onChange={(e) =>
            setName(e.target.value)
          }

          style={styles.input}

        />

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

          onClick={handleSignup}

          style={styles.button}

        >

          Signup

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

export default Signup