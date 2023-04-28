import { styled, useTheme } from "@mui/material/styles";
import Box from "@mui/material/Box";
import Navbar from "../components/Navbar";
import Sidebar, { DrawerHeader } from "../components/Sidebar";
import { useContext, useState } from "react";
import { Navigate, Outlet } from "react-router-dom";
import { AuthContext } from "../../auth/context/AuthProvider";

export default function RootLayout() {
  const [open, setOpen] = useState(false);
  const { onLogout } = useContext(AuthContext);

  const handleDrawerOpen = () => {
    setOpen(true);
  };

  const handleDrawerClose = () => {
    setOpen(false);
  };

  return (
    <Box sx={{ display: "flex" }}>
      <Navbar open={open} onDrawerOpen={handleDrawerOpen} />
      <Sidebar open={open} onDrawerClose={handleDrawerClose} />
      <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
        <DrawerHeader />
        <Outlet />
      </Box>
    </Box>
  );
}
