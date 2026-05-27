function Features() {

  const features = [

    {
      title: "Project Memory",
      text:
        "Store decisions, notes, and project context automatically."
    },

    {
      title: "Chat with Codebase",
      text:
        "Ask questions about your code and architecture instantly."
    },

    {
      title: "Bug & Fix Tracker",
      text:
        "Track recurring bugs and previous debugging solutions."
    },

    {
      title: "AI Documentation",
      text:
        "Generate architecture notes and technical docs automatically."
    },

    {
      title: "Developer Notes",
      text:
        "Save engineering thoughts linked with commits and files."
    },

    {
      title: "Team Collaboration",
      text:
        "Share project memory across your development team."
    }

  ]

  return (

    <div
  id="features"
  style={styles.container}
>

      <p style={styles.tag}>
        CORE FEATURES
      </p>

      <h1 style={styles.heading}>
        Everything a developer
        needs in one AI brain
      </h1>

      <div style={styles.grid}>

        {features.map((item, index) => (

          <div
  key={index}
  style={styles.card}

  onMouseEnter={(e) => {

    e.currentTarget.style.transform =
      "translateY(-10px)"

    e.currentTarget.style.border =
      "1px solid #7c3aed"

  }}

  onMouseLeave={(e) => {

    e.currentTarget.style.transform =
      "translateY(0px)"

    e.currentTarget.style.border =
      "1px solid #1e293b"

  }}
>

            <div style={styles.icon}></div>

            <h2 style={styles.cardTitle}>
              {item.title}
            </h2>

            <p style={styles.cardText}>
              {item.text}
            </p>

          </div>

        ))}

      </div>

    </div>

  )
}

const styles = {

  container: {
    padding: "120px 40px",
    backgroundColor: "#020617",
    color: "white"
  },

  tag: {
    color: "#818cf8",
    letterSpacing: "2px",
    marginBottom: "20px"
  },

  heading: {
    fontSize: "54px",
    maxWidth: "700px",
    lineHeight: "1.1",
    marginBottom: "70px"
  },

  grid: {
    display: "grid",
    gridTemplateColumns:
      "repeat(auto-fit, minmax(320px, 1fr))",
    gap: "25px"
  },

  card: {
    backgroundColor: "#0f172a",
    border: "1px solid #1e293b",
    borderRadius: "24px",
    padding: "35px",
    transition: "0.3s",
    cursor: "pointer"
  },

  icon: {
    width: "50px",
    height: "50px",
    borderRadius: "14px",
    marginBottom: "25px",
    background:
      "linear-gradient(to right, #7c3aed, #06b6d4)"
  },

  cardTitle: {
    marginBottom: "16px",
    fontSize: "24px"
  },

  cardText: {
    color: "#94a3b8",
    lineHeight: "1.7",
    fontSize: "16px"
  }

}

export default Features