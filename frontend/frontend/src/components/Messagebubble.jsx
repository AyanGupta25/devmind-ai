function MessageBubble({ text, sender }) {

  return (

    <div
      style={
        sender === "user"
        ? styles.userMessage
        : styles.aiMessage
      }
    >
      {text}
    </div>

  )
}

const styles = {

  userMessage: {
    alignSelf: "flex-end",
    background: "linear-gradient(to right, #2563eb, #7c3aed)",
    padding: "15px",
    borderRadius: "15px",
    maxWidth: "60%",
    color: "white"
  },

  aiMessage: {
    alignSelf: "flex-start",
    backgroundColor: "#1e293b",
    padding: "15px",
    borderRadius: "15px",
    maxWidth: "60%",
    color: "white"
  }

}

export default MessageBubble