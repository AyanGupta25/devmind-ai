import {

  Routes,
  Route,
  Navigate

} from "react-router-dom"

import Login from "./pages/Login"

import Signup from "./pages/Signup"

import Dashboard from "./components/Dashboard"

function App() {

  const token =
    localStorage.getItem(
      "token"
    )

  return (

    <Routes>

      <Route

        path="/login"

        element={<Login />}

      />

      <Route

        path="/signup"

        element={<Signup />}

      />

      <Route

        path="/dashboard"

        element={

          token
            ? <Dashboard />
            : <Navigate to="/login" />

        }

      />

      <Route

        path="*"

        element={
          <Navigate to="/login" />
        }

      />

    </Routes>

  )

}

export default App