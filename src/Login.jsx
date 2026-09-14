import { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { UserContext } from "./context/UserContext";
import { Container, TextField, Button, Typography, Box, Paper, Alert } from "@mui/material";

const API_URL = import.meta.env.VITE_API_URL;

export default function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const { setUser, setIsLoggedIn } = useContext(UserContext);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");

    if (!username || !password) {
      setError("Please enter your username and password");
      return;
    }

    try {
      const res = await fetch(`${API_URL}/api/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: username, password }),
        credentials: "include",
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Invalid email or password");
      }

      setUser(data.user || { email: username, _id: username === "admin" ? "-1" : "1" });
      setIsLoggedIn(true);
      navigate("/");
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <Container maxWidth="xs">
      <Box sx={{ mt: 10, display: "flex", flexDirection: "column", alignItems: "center" }}>
        <Paper elevation={3} sx={{ p: 4, width: "100%", borderRadius: 3, backgroundColor: "#ffffff", color: "#333" }}>
          <Typography component="h1" variant="h4" align="center" gutterBottom sx={{ fontWeight: "bold", color: "#1976d2" }}>
            Welcome Back
          </Typography>
          <Typography variant="body2" align="center" color="textSecondary" sx={{ mb: 3 }}>
            Please sign in to your dashboard
          </Typography>

          {error && (
            <Alert severity="error" sx={{ width: "100%", mb: 2 }}>
              {error}
            </Alert>
          )}

          <Box component="form" onSubmit={handleLogin} sx={{ mt: 1 }}>
            <TextField
              margin="normal"
              required
              fullWidth
              label="Username / Email"
              autoComplete="username"
              autoFocus
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              sx={{
                backgroundColor: "#f9f9f9",
                borderRadius: 1,
                input: { color: "#000" },
              }}
            />
            <TextField
              margin="normal"
              required
              fullWidth
              label="Password"
              type="password"
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              sx={{
                backgroundColor: "#f9f9f9",
                borderRadius: 1,
                input: { color: "#000" },
              }}
            />
            <Button
              type="submit"
              fullWidth
              variant="contained"
              size="large"
              sx={{ mt: 3, mb: 2, py: 1.5, fontWeight: "bold", borderRadius: 2 }}
            >
              Sign In
            </Button>
          </Box>
        </Paper>
      </Box>
    </Container>
  );
}