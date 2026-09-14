import { useEffect } from "react";
import { AppBar, Button, Toolbar, Typography, Box } from "@mui/material";
import { Outlet, useNavigate } from "react-router-dom";
import { useUser } from "./context/UserContext";

const API_URL = import.meta.env.VITE_API_URL;

export default function Home() {
  const navigate = useNavigate();
  const { user, isLoggedIn, isInitializing } = useUser();

  useEffect(() => {
    if (!isLoggedIn && !isInitializing) {
      navigate("/login");
    }
  }, [isLoggedIn, isInitializing, navigate]);

  if (isInitializing) return null;

  return (
    <div>
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h5" sx={{ flexGrow: 1 }}>
            My Frontend 1.0
          </Typography>
          <Button
            color="inherit"
            onClick={() => {
              navigate("/item");
            }}
          >
            Item
          </Button>
          
          {/* Only Admin user can see User menu */}
          {user && user._id == -1 && (
            <Button
              color="inherit"
              onClick={() => {
                navigate("/user");
              }}
            >
              User
            </Button>
          )}

          <Button
            color="inherit"
            onClick={async () => {
              const result = await fetch(`${API_URL}/api/auth/logout`, {
                credentials: "include",
              });
              if (result.ok) {
                window.location.reload(true);
              }
            }}
          >
            Logout
          </Button>
        </Toolbar>
      </AppBar>
      <Box sx={{ px: 2, pt: 2 }}>
        <Outlet />
      </Box>
    </div>
  );
}