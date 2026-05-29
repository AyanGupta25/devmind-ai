import { useState } from "react"
import { Routes, Route, Navigate } from "react-router-dom"

import Login from "./pages/Login"
import Signup from "./pages/Signup"
import Dashboard from "./pages/Dashboard"

function App() {

  const [token, setToken] = useState(
    localStorage.getItem("token")
  )

  function handleLogin(newToken) {
    localStorage.setItem("token", newToken)
    setToken(newToken)
  }

  function handleLogout() {
    localStorage.removeItem("token")
    setToken(null)
  }

  return (
    <Routes>

      <Route
        path="/"
        element={
          token
            ? <Navigate to="/dashboard" />
            : <Login onLogin={handleLogin} />
        }
      />

      <Route
        path="/signup"
        element={
          token
            ? <Navigate to="/dashboard" />
            : <Signup onLogin={handleLogin} />
        }
      />

      <Route
        path="/dashboard"
        element={
          token
            ? <Dashboard onLogout={handleLogout} />
            : <Navigate to="/" />
        }
      />

    </Routes>
  )
}

export default App