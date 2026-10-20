export const dynamic = "force-dynamic";

export default function LoginPage() {
  return (
    <main style={{ display: "grid", placeItems: "center", minHeight: "100vh", background: "#050816", color: "#fff" }}>
      <div style={{ width: 420, padding: 28, borderRadius: 16, background: "#0e152d", border: "1px solid #24314d" }}>
        <h1 style={{ marginBottom: 20, textAlign: "center" }}>NMD COMPUTER</h1>
        <form action="/api/admin/login" method="post">
          <label htmlFor="password" style={{ display: "block", marginBottom: 8 }}>Password</label>
          <input
            id="password"
            name="password"
            type="password"
            required
            style={{ width: "100%", padding: 12, borderRadius: 10, border: "1px solid #335", background: "#0b1222", color: "#fff" }}
          />
          <button
            type="submit"
            style={{ marginTop: 18, width: "100%", padding: 12, borderRadius: 10, border: "none", background: "linear-gradient(90deg, #ff4d9d, #4ea5ff)", color: "#fff", fontWeight: 700 }}
          >
            Log In
          </button>
        </form>
      </div>
    </main>
  );
}
