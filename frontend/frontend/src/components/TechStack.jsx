function TechStack() {

  const tech = [

    "React",
    "Node.js",
    "Express",
    "MongoDB",
    "Redis",
    "OpenAI API",
    "JWT Auth",
    "Vector Search"

  ]

  return (

    <div
  id="stack"
  style={styles.container}
>

      <p style={styles.tag}>
        TECH STACK
      </p>

      <h1 style={styles.heading}>
        Built to learn,
        built to ship
      </h1>

      <p style={styles.text}>
        Every layer maps to a real engineering
        concept worth understanding deeply.
      </p>

      <div style={styles.stackContainer}>

        {tech.map((item, index) => (

          <div
            key={index}
            style={styles.techCard}
          >
            <div style={styles.dot}></div>

            {item}
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
    marginBottom: "20px"
  },

  text: {
    color: "#94a3b8",
    fontSize: "18px",
    maxWidth: "700px",
    lineHeight: "1.7",
    marginBottom: "50px"
  },

  stackContainer: {
    display: "flex",
    flexWrap: "wrap",
    gap: "16px"
  },

  techCard: {
    display: "flex",
    alignItems: "center",
    gap: "10px",
    padding: "14px 22px",
    borderRadius: "14px",
    backgroundColor: "#0f172a",
    border: "1px solid #1e293b",
    color: "#e2e8f0"
  },

  dot: {
    width: "10px",
    height: "10px",
    borderRadius: "50%",
    background:
      "linear-gradient(to right, #7c3aed, #06b6d4)"
  }

}

export default TechStack