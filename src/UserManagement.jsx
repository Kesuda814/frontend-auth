import { useState } from "react";

const API_URL = import.meta.env.VITE_API_URL;

export default function UserManagement() {
  const [password, setPassword] = useState("");
  const [targetUserId, setTargetUserId] = useState("");
  const [message, setMessage] = useState("");

  const handlePasswordChange = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`${API_URL}/api/user/password`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({
          password: password,
          targetUserId: targetUserId ? Number(targetUserId) : undefined,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setMessage("Password changed successfully!");
        setPassword("");
        setTargetUserId("");
      } else {
        setMessage(data.message || "Failed to change password.");
      }
    } catch (error) {
      console.error("Error:", error);
      setMessage("An error occurred connecting to the server.");
    }
  };

  return (
    <div style={{ padding: "20px", maxWidth: "400px", margin: "0 auto" }}>
      <h2>User Management</h2>
      <h3>Change Password</h3>
      <form onSubmit={handlePasswordChange}>
        <div style={{ marginBottom: "10px" }}>
          <label style={{ display: "block", marginBottom: "5px" }}>Target User ID (Leave blank for yourself):</label>
          <input
            type="number"
            value={targetUserId}
            onChange={(e) => setTargetUserId(e.target.value)}
            style={{ width: "100%", padding: "8px" }}
          />
        </div>
        <div style={{ marginBottom: "10px" }}>
          <label style={{ display: "block", marginBottom: "5px" }}>New Password:</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            style={{ width: "100%", padding: "8px" }}
          />
        </div>
        <button type="submit" style={{ padding: "10px 15px", width: "100%" }}>
          Update Password
        </button>
      </form>
      {message && <p style={{ marginTop: "15px", color: "blue" }}>{message}</p>}
    </div>
  );
}