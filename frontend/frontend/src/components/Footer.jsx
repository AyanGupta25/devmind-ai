function Footer() {

  return (

    <div style={styles.footer}>

      <p style={styles.left}>
        built by you • devmind.ai • v1.0.0
      </p>

      <div style={styles.right}>

        <p>github</p>
        <p>changelog</p>
        <p>contact</p>

      </div>

    </div>

  )
}

const styles = {

  footer: {
    height: "100px",
    borderTop: "1px solid #111827",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "0 40px",
    backgroundColor: "#020617",
    color: "#94a3b8",
    fontSize: "14px"
  },

  right: {
    display: "flex",
    gap: "30px"
  },

  left: {
    letterSpacing: "1px"
  }

}

export default Footer