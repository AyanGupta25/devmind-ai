function Roadmap() {

  const roadmap = [

    {
      step: "1",
      title: "Authentication System",
      text:
        "Secure login and signup using JWT authentication."
    },

    {
      step: "2",
      title: "Project Memory Engine",
      text:
        "Store project context, notes, and debugging history."
    },

    {
      step: "3",
      title: "Codebase AI Chat",
      text:
        "Upload repositories and ask AI questions about code."
    },

    {
      step: "4",
      title: "Bug Tracker + AI Analysis",
      text:
        "Track recurring bugs and get AI-generated fixes."
    },

    {
      step: "5",
      title: "Realtime Collaboration",
      text:
        "Shared team memory and live engineering discussions."
    }

  ]

  return (

    <div
  id="roadmap"
  style={styles.container}
>

      <p style={styles.tag}>
        ROADMAP
      </p>

      <h1 style={styles.heading}>
        Build → Learn → Ship
      </h1>

      <div style={styles.timeline}>

        {roadmap.map((item, index) => (

          <div
            key={index}
            style={styles.card}
          >

            <div style={styles.number}>
              {item.step}
            </div>

            <div>

              <h2 style={styles.title}>
                {item.title}
              </h2>

              <p style={styles.text}>
                {item.text}
              </p>

            </div>

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
    marginBottom: "70px"
  },

  timeline: {
    display: "flex",
    flexDirection: "column",
    gap: "30px"
  },

  card: {
    display: "flex",
    gap: "25px",
    alignItems: "flex-start",
    backgroundColor: "#0f172a",
    border: "1px solid #1e293b",
    padding: "30px",
    borderRadius: "24px"
  },

  number: {
    minWidth: "55px",
    height: "55px",
    borderRadius: "50%",
    background:
      "linear-gradient(to right, #7c3aed, #2563eb)",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    fontWeight: "bold",
    fontSize: "20px"
  },

  title: {
    marginBottom: "10px",
    fontSize: "24px"
  },

  text: {
    color: "#94a3b8",
    lineHeight: "1.7",
    fontSize: "16px"
  }

}

export default Roadmap