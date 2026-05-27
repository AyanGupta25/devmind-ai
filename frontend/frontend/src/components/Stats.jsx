function Stats() {

  const stats = [

    {
      number: "8+",
      label: "Core Modules"
    },

    {
      number: "MERN",
      label: "Full Stack"
    },

    {
      number: "AI",
      label: "Powered"
    },

    {
      number: "JWT",
      label: "Secure Auth"
    }

  ]

  return (

    <div style={styles.container}>

      <div style={styles.grid}>

        {stats.map((item, index) => (

          <div

            key={index}

            style={styles.card}

            onMouseEnter={(e) => {

              e.currentTarget.style.transform =
                "translateY(-8px)"

              e.currentTarget.style.border =
                "1px solid #7c3aed"

              e.currentTarget.style.boxShadow =
                "0 0 25px rgba(124,58,237,0.25)"

            }}

            onMouseLeave={(e) => {

              e.currentTarget.style.transform =
                "translateY(0px)"

              e.currentTarget.style.border =
                "1px solid #1e293b"

              e.currentTarget.style.boxShadow =
                "none"

            }}

          >

            <h1 style={styles.number}>
              {item.number}
            </h1>

            <p style={styles.label}>
              {item.label}
            </p>

          </div>

        ))}

      </div>

    </div>

  )
}

const styles = {

  container: {
    padding: "70px 40px",
    backgroundColor: "#020617"
  },

  grid: {
    display: "grid",
    gridTemplateColumns:
      "repeat(auto-fit, minmax(240px, 1fr))",
    gap: "25px"
  },

  card: {
    backgroundColor: "#0f172a",
    border: "1px solid #1e293b",
    borderRadius: "28px",
    padding: "60px 30px",
    textAlign: "center",
    transition: "0.3s",
    cursor: "pointer",
    minHeight: "180px",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center"
  },

  number: {
    fontSize: "48px",
    margin: "0",
    marginBottom: "16px",
    fontWeight: "700",
    lineHeight: "1.1",
    background:
      "linear-gradient(to right, #7c3aed, #06b6d4)",
    WebkitBackgroundClip: "text",
    WebkitTextFillColor: "transparent"
  },

  label: {
    color: "#94a3b8",
    fontSize: "20px",
    letterSpacing: "0.5px"
  }

}

export default Stats