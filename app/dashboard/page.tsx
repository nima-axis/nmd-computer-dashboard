import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export default function DashboardPage() {
  const adminCookie = cookies().get("admin_auth")?.value;
  if (!adminCookie) redirect("/login");

  return (
    <main style={{ minHeight: "100vh", background: "#050816", color: "#fff", padding: 32 }}>
      <h1>NMD COMPUTER Dashboard</h1>
      <p>Welcome. Use the admin tools to search emails and generate premium codes.</p>
      <form action="/api/admin/logout" method="post" style={{ marginTop: 24 }}>
        <button type="submit" style={{ padding: "10px 16px", borderRadius: 10, border: "none", background: "#151f38", color: "#fff" }}>
          Logout
        </button>
      </form>
      <hr style={{ margin: "24px 0" }} />

      <section style={{ display: "grid", gap: 16, maxWidth: 700 }}>
        <form action="/api/admin/search-email" method="post">
          <label htmlFor="email" style={{ display: "block", marginBottom: 8 }}>Search by email</label>
          <input id="email" name="email" type="email" placeholder="user@gmail.com" style={{ width: "100%", padding: 12, borderRadius: 10, border: "1px solid #334", background: "#0b1222", color: "#fff" }} />
          <button type="submit" style={{ marginTop: 12, padding: "10px 16px", borderRadius: 10, border: "none", background: "linear-gradient(90deg, #ff4d9d, #4ea5ff)", color: "#fff", fontWeight: 700 }}>
            Search
          </button>
        </form>

        <form action="/api/admin/generate-premium-code" method="post">
          <label htmlFor="emailGenerate" style={{ display: "block", marginBottom: 8 }}>Generate code for email</label>
          <input id="emailGenerate" name="email" type="email" placeholder="user@gmail.com" style={{ width: "100%", padding: 12, borderRadius: 10, border: "1px solid #334", background: "#0b1222", color: "#fff" }} />
          <button type="submit" style={{ marginTop: 12, padding: "10px 16px", borderRadius: 10, border: "none", background: "#141d39", color: "#fff" }}>
            Generate Premium Code
          </button>
        </form>
      </section>
    </main>
  );
}
