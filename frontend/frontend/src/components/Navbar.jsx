function Navbar() {

  return (

    <div style={styles.navbar}>

      <div style={styles.left}>

        <div style={styles.logoBox}></div>

        <h2 style={styles.logoText}>
          DevMind
        </h2>

      </div>

      <div style={styles.links}>

  <a href="#features" style={styles.link}>
    Features
  </a>

  <a href="#stack" style={styles.link}>
    Stack
  </a>

  <a href="#roadmap" style={styles.link}>
    Roadmap
  </a>

  <a href="#" style={styles.link}>
    Docs
  </a>


      </div>

      <button style={styles.button}>
        Get Early Access
      </button>

    </div>

  )
}

const styles = {

  navbar: {
    height: "80px",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    padding: "0 40px",
    borderBottom: "1px solid #111827",
    position: "sticky",
    top: 0,
    backgroundColor: "#020617",
    zIndex: 100
  },

  left: {
    display: "flex",
    alignItems: "center",
    gap: "12px"
  },

  logoBox: {
    width: "22px",
    height: "22px",
    borderRadius: "8px",
    background:
      "linear-gradient(to right, #7c3aed, #06b6d4)"
  },

  logoText: {
    fontSize: "22px"
  },

  links: {
    display: "flex",
    gap: "35px",
    color: "#94a3b",
    fontSize: "15px",
    textDecoration: "none",
  transition: "0.3s"
  },

  button: {
    padding: "12px 22px",
    borderRadius: "12px",
    border: "1px solid #1e293b",
    backgroundColor: "transparent",
    color: "white",
    cursor: "pointer"
  }

}

export default Navbar