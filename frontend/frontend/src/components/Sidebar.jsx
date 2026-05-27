function Sidebar() {

  return (
    <div style={styles.sidebar}>

      <h2 style={styles.logo}>
        DevMind
      </h2>

      <button style={styles.newChat}>
        + New Chat
      </button>

      <div style={styles.menu}>

        <p>AI Chats</p>
        <p>Saved Notes</p>
        <p>Projects</p>
        <p>Settings</p>
        <p>profile</p>

      </div>

    </div>
  )
}

const styles = {

  sidebar: {
    width: "260px",
    height: "100vh",
    backgroundColor: "linear-gradient(to bottom, #581c87, #312e81)",
    color: "white",
    padding: "25px",
    display: "flex",
    flexDirection: "column",
    borderRight: "1px solid #1e293b"
  },

  logo: {
    marginBottom: "30px",
    fontSize: "30px"
  },

  newChat: {
    padding: "14px",
    border: "none",
    borderRadius: "12px",
    backgroundColor: "#2563eb",
    color: "white",
    fontSize: "16px",
    cursor: "pointer",
    marginBottom: "30px"
  },

  menu: {
    display: "flex",
    flexDirection: "column",
    gap: "20px",
    color: "#cbd5e1",
    fontSize: "17px"
  }

}

export default Sidebar