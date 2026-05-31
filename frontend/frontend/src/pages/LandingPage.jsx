import { useNavigate } from "react-router-dom"

function LandingPage() {
  const navigate = useNavigate()

  return (
    <div style={styles.page}>

      {/* NAVBAR */}
      <nav style={styles.nav}>
        <span style={styles.navLogo}>DevMind AI</span>
        <div style={styles.navLinks}>
          <button onClick={() => navigate("/")} style={styles.loginBtn}>Login</button>
          <button onClick={() => navigate("/signup")} style={styles.signupBtn}>Get Started Free</button>
        </div>
      </nav>

      {/* HERO */}
      <section style={styles.hero}>
        <div style={styles.badge}>🚀 AI for Developers</div>
        <h1 style={styles.heroTitle}>
          The AI That Knows<br />
          <span style={styles.heroGradient}>Your Tech Stack</span>
        </h1>
        <p style={styles.heroSubtitle}>
          DevMind AI is not just another chatbot. It remembers your stack,
          tailors every answer to your experience level, and helps you
          build faster than ever before.
        </p>
        <div style={styles.heroBtns}>
          <button onClick={() => navigate("/signup")} style={styles.heroPrimaryBtn}>
            Start for Free →
          </button>
          <button onClick={() => navigate("/")} style={styles.heroSecondaryBtn}>
            Login
          </button>
        </div>
      </section>

      {/* FEATURES */}
      <section style={styles.features}>
        <h2 style={styles.sectionTitle}>Everything you need to code smarter</h2>
        <div style={styles.featureGrid}>
          {[
            { icon: "🧠", title: "Dev Profile Memory", desc: "Set your stack once. Every AI answer is tailored to your exact technologies and experience level." },
            { icon: "💬", title: "Real-time AI Chat", desc: "Chat with AI in real time. Get instant answers, code snippets, and explanations." },
            { icon: "📋", title: "Copy & Export", desc: "Copy any response with one click. Export full conversations as PDF." },
            { icon: "🎨", title: "Code Highlighting", desc: "AI responses with syntax-highlighted code blocks. Read code like a pro." },
            { icon: "📁", title: "Chat History", desc: "All your conversations saved. Rename, delete, and organize your chats." },
            { icon: "🌙", title: "Dark & Light Mode", desc: "Easy on the eyes. Switch between dark and light mode anytime." },
          ].map((f) => (
            <div key={f.title} style={styles.featureCard}>
              <span style={styles.featureIcon}>{f.icon}</span>
              <h3 style={styles.featureTitle}>{f.title}</h3>
              <p style={styles.featureDesc}>{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section style={styles.howSection}>
        <h2 style={styles.sectionTitle}>How it works</h2>
        <div style={styles.steps}>
          {[
            { num: "01", title: "Create your account", desc: "Sign up for free in seconds. No credit card required." },
            { num: "02", title: "Set up your Dev Profile", desc: "Tell DevMind your stack, experience, and current project." },
            { num: "03", title: "Get personalized AI answers", desc: "Every response is tailored to your exact tech stack and level." },
          ].map((s) => (
            <div key={s.num} style={styles.step}>
              <div style={styles.stepNum}>{s.num}</div>
              <h3 style={styles.stepTitle}>{s.title}</h3>
              <p style={styles.stepDesc}>{s.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section style={styles.cta}>
        <h2 style={styles.ctaTitle}>Ready to code smarter?</h2>
        <p style={styles.ctaSubtitle}>Join developers who use DevMind AI to build faster.</p>
        <button onClick={() => navigate("/signup")} style={styles.ctaBtn}>
          Get Started Free →
        </button>
      </section>

      {/* FOOTER */}
      <footer style={styles.footer}>
        <span style={styles.footerLogo}>DevMind AI</span>
        <span style={styles.footerText}>© 2025 DevMind AI. Built for developers.</span>
      </footer>

    </div>
  )
}

const styles = {
  page: { minHeight: "100vh", backgroundColor: "#020617", color: "white", fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif", overflowX: "hidden" },

  // NAV
  nav: { display: "flex", justifyContent: "space-between", alignItems: "center", padding: "20px 60px", borderBottom: "1px solid #1e293b", position: "sticky", top: 0, backgroundColor: "#020617", zIndex: 100 },
  navLogo: { fontSize: "20px", fontWeight: "bold", background: "linear-gradient(to right, #7c3aed, #2563eb)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" },
  navLinks: { display: "flex", gap: "12px", alignItems: "center" },
  loginBtn: { padding: "10px 20px", borderRadius: "10px", border: "1px solid #334155", backgroundColor: "transparent", color: "#94a3b8", cursor: "pointer", fontSize: "14px" },
  signupBtn: { padding: "10px 20px", borderRadius: "10px", border: "none", background: "linear-gradient(to right, #7c3aed, #2563eb)", color: "white", cursor: "pointer", fontSize: "14px", fontWeight: "600" },

  // HERO
  hero: { textAlign: "center", padding: "100px 40px 80px", maxWidth: "800px", margin: "0 auto" },
  badge: { display: "inline-block", padding: "6px 16px", borderRadius: "20px", border: "1px solid #7c3aed44", backgroundColor: "#7c3aed11", color: "#a78bfa", fontSize: "13px", marginBottom: "24px" },
  heroTitle: { fontSize: "clamp(36px, 6vw, 64px)", fontWeight: "800", lineHeight: 1.15, margin: "0 0 24px", color: "white" },
  heroGradient: { background: "linear-gradient(to right, #7c3aed, #2563eb)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" },
  heroSubtitle: { fontSize: "18px", color: "#94a3b8", lineHeight: 1.7, margin: "0 0 40px", maxWidth: "600px", marginLeft: "auto", marginRight: "auto" },
  heroBtns: { display: "flex", gap: "16px", justifyContent: "center", flexWrap: "wrap" },
  heroPrimaryBtn: { padding: "16px 32px", borderRadius: "14px", border: "none", background: "linear-gradient(to right, #7c3aed, #2563eb)", color: "white", cursor: "pointer", fontSize: "16px", fontWeight: "700" },
  heroSecondaryBtn: { padding: "16px 32px", borderRadius: "14px", border: "1px solid #334155", backgroundColor: "transparent", color: "#94a3b8", cursor: "pointer", fontSize: "16px" },

  // FEATURES
  features: { padding: "80px 60px", maxWidth: "1200px", margin: "0 auto" },
  sectionTitle: { textAlign: "center", fontSize: "32px", fontWeight: "700", marginBottom: "48px", color: "white" },
  featureGrid: { display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "20px" },
  featureCard: { backgroundColor: "#0f172a", border: "1px solid #1e293b", borderRadius: "16px", padding: "28px", transition: "border-color 0.2s" },
  featureIcon: { fontSize: "28px", marginBottom: "14px", display: "block" },
  featureTitle: { fontSize: "17px", fontWeight: "700", marginBottom: "10px", color: "white" },
  featureDesc: { fontSize: "14px", color: "#94a3b8", lineHeight: 1.7, margin: 0 },

  // HOW IT WORKS
  howSection: { padding: "80px 60px", backgroundColor: "#0a0f1e", maxWidth: "100%" },
  steps: { display: "flex", gap: "40px", justifyContent: "center", flexWrap: "wrap", maxWidth: "900px", margin: "0 auto" },
  step: { flex: "1", minWidth: "220px", maxWidth: "260px", textAlign: "center" },
  stepNum: { fontSize: "40px", fontWeight: "800", background: "linear-gradient(to right, #7c3aed, #2563eb)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", marginBottom: "16px" },
  stepTitle: { fontSize: "17px", fontWeight: "700", marginBottom: "10px", color: "white" },
  stepDesc: { fontSize: "14px", color: "#94a3b8", lineHeight: 1.7, margin: 0 },

  // CTA
  cta: { textAlign: "center", padding: "100px 40px", maxWidth: "600px", margin: "0 auto" },
  ctaTitle: { fontSize: "36px", fontWeight: "800", marginBottom: "16px", color: "white" },
  ctaSubtitle: { fontSize: "16px", color: "#94a3b8", marginBottom: "36px" },
  ctaBtn: { padding: "18px 40px", borderRadius: "14px", border: "none", background: "linear-gradient(to right, #7c3aed, #2563eb)", color: "white", cursor: "pointer", fontSize: "17px", fontWeight: "700" },

  // FOOTER
  footer: { display: "flex", justifyContent: "space-between", alignItems: "center", padding: "24px 60px", borderTop: "1px solid #1e293b", flexWrap: "wrap", gap: "12px" },
  footerLogo: { fontSize: "16px", fontWeight: "700", background: "linear-gradient(to right, #7c3aed, #2563eb)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" },
  footerText: { fontSize: "13px", color: "#475569" },
}

export default LandingPage