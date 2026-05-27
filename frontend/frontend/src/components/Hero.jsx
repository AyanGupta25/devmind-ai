function Hero({ setShowDashboard }) {

  return (

    <div style={styles.hero}>

      <div style={styles.blurOne}></div>

      <div style={styles.blurTwo}></div>

      <div style={styles.glow}></div>

      <p style={styles.tag}>
        AI-powered developer memory
      </p>

      <h1 style={styles.title}>
        Everything your dev brain
        wishes it had
      </h1>

      <p style={styles.subtitle}>
        DevMind AI remembers your projects,
        debugging history, architecture decisions,
        and coding context automatically.
      </p>

      <div style={styles.buttons}>

        <button

          style={styles.primaryButton}

          onClick={() => setShowDashboard(true)}

          onMouseEnter={(e) => {

            e.currentTarget.style.transform =
              "scale(1.05)"

          }}

          onMouseLeave={(e) => {

            e.currentTarget.style.transform =
              "scale(1)"

          }}

        >
          Launch App
        </button>

        <button

          style={styles.secondaryButton}

          onMouseEnter={(e) => {

            e.currentTarget.style.border =
              "1px solid #7c3aed"

          }}

          onMouseLeave={(e) => {

            e.currentTarget.style.border =
              "1px solid #1e293b"

          }}

        >
          View Roadmap
        </button>

      </div>

    </div>

  )
}

const styles = {

  hero: {
    minHeight: "90vh",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    textAlign: "center",
    padding: "40px",
    position: "relative",
    overflow: "hidden",
    backgroundColor: "#020617"
  },

  glow: {
    width: "500px",
    height: "500px",
    background:
      "radial-gradient(circle, rgba(124,58,237,0.25), transparent)",
    position: "absolute",
    top: "-100px",
    zIndex: 0
  },

  blurOne: {
    width: "400px",
    height: "400px",
    borderRadius: "50%",
    background:
      "rgba(124,58,237,0.18)",
    filter: "blur(120px)",
    position: "absolute",
    top: "100px",
    left: "-100px"
  },

  blurTwo: {
    width: "350px",
    height: "350px",
    borderRadius: "50%",
    background:
      "rgba(37,99,235,0.18)",
    filter: "blur(120px)",
    position: "absolute",
    bottom: "50px",
    right: "-80px"
  },

  tag: {
    color: "#818cf8",
    marginBottom: "20px",
    letterSpacing: "2px",
    zIndex: 1,
    fontSize: "14px"
  },

  title: {
    fontSize: "clamp(42px, 8vw, 78px)",
    maxWidth: "900px",
    lineHeight: "1.05",
    marginBottom: "25px",
    zIndex: 1,
    fontWeight: "700"
  },

  subtitle: {
    maxWidth: "760px",
    color: "#94a3b8",
    fontSize: "20px",
    lineHeight: "1.8",
    marginBottom: "45px",
    zIndex: 1
  },

  buttons: {
    display: "flex",
    gap: "20px",
    zIndex: 1,
    flexWrap: "wrap",
    justifyContent: "center"
  },

  primaryButton: {
    padding: "16px 32px",
    border: "none",
    borderRadius: "14px",
    background:
      "linear-gradient(to right, #7c3aed, #2563eb)",
    color: "white",
    fontSize: "16px",
    cursor: "pointer",
    transition: "0.3s",
    boxShadow:
      "0 0 40px rgba(124,58,237,0.35)"
  },

  secondaryButton: {
    padding: "16px 32px",
    borderRadius: "14px",
    border: "1px solid #1e293b",
    backgroundColor: "transparent",
    color: "white",
    fontSize: "16px",
    cursor: "pointer",
    transition: "0.3s"
  }

}

export default Hero