import { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { UserContext } from "./context/authContext";
import { Container, Typography, Button, Box } from "@mui/material";

export default function Home() {
  const context = useContext(UserContext);
  const navigate = useNavigate();

  // Fallback if context is somehow null
  const user = context ? context.user : null;
  const setUser = context ? context.setUser : () => {};
  const API_URL = context ? context.API_URL : "http://localhost:3000";

  const handleLogout = async () => {
    try {
      await fetch(`${API_URL}/api/auth/logout`, {
        method: "POST",
        credentials: "include",
      });
    } catch (e) {
      console.error(e);
    }
    setUser(null);
    navigate("/login");
  };

  return (
    <Container maxWidth="sm">
      <Box sx={{ mt: 8, textAlign: "center" }}>
        <Typography variant="h4" gutterBottom>Dashboard</Typography>
        {user ? (
          <>
            <Typography variant="h6" color="primary" gutterBottom>
              Welcome back, {user?.username || user?.name || "User"}!
            </Typography>
            <Button variant="outlined" color="error" onClick={handleLogout} sx={{ mt: 3 }}>
              Logout
            </Button>
          </>
        ) : (
          <>
            <Typography variant="body1" gutterBottom>You are not logged in.</Typography>
            <Button variant="contained" onClick={() => navigate("/login")} sx={{ mt: 3 }}>
              Go to Login
            </Button>
          </>
        )}
      </Box>
    </Container>
  );
}