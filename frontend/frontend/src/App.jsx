import { useState, useEffect } from "react"
import { Routes, Route, Navigate } from "react-router-dom"

import Login from "./pages/Login"
import Signup from "./pages/Signup"
import Dashboard from "./pages/Dashboard"
import DevProfileSetup from "./pages/DevProfileSetup"
import LandingPage from "./pages/LandingPage"

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000"

function App() {

  const [token, setToken] = useState(localStorage.getItem("token"))
  const [hasProfile, setHasProfile] = useState(null)

  useEffect(() => {
    if (token) checkProfile()
  }, [token])

  async function checkProfile() {
    try {
      const response = await fetch(`${API_URL}/api/profile`, {
        headers: { Authorization: `Bearer ${token}` }
      })
      const data = await response.json()
      setHasProfile(!!data)
    } catch {
      setHasProfile(false)
    }
  }

  function handleLogin(newToken) {
    localStorage.setItem("token", newToken)
    setToken(newToken)
    setHasProfile(null)
  }

  function handleLogout() {
    localStorage.removeItem("token")
    setToken(null)
    setHasProfile(null)
  }

  function handleProfileDone() {
    setHasProfile(true)
  }

  if (token && hasProfile === null) {
    return (
      <div style={{ minHeight: "100vh", backgroundColor: "#020617", display: "flex", justifyContent: "center", alignItems: "center" }}>
        <p style={{ color: "#94a3b8", fontSize: "16px" }}>Loading...</p>
      </div>
    )
  }

  return (
    <Routes>

      {/* LANDING PAGE — shown to non-logged-in users */}
      <Route
        path="/home"
        element={token ? <Navigate to="/dashboard" /> : <LandingPage />}
      />

      <Route
        path="/"
        element={token ? <Navigate to="/dashboard" /> : <Login onLogin={handleLogin} />}
      />

      <Route
        path="/signup"
        element={token ? <Navigate to="/dashboard" /> : <Signup onLogin={handleLogin} />}
      />

      <Route
        path="/setup"
        element={
          !token ? <Navigate to="/" />
            : hasProfile ? <Navigate to="/dashboard" />
            : <DevProfileSetup onDone={handleProfileDone} />
        }
      />

      <Route
        path="/dashboard"
        element={
          !token ? <Navigate to="/" />
            : !hasProfile ? <Navigate to="/setup" />
            : <Dashboard onLogout={handleLogout} />
        }
      />

    </Routes>
  )
}

export default App