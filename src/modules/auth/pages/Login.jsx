import { Box, Button } from "@mui/material";
import { useContext } from "react";
import { AuthContext } from "../context/AuthProvider";

export default function Login() {
  const { onLogin } = useContext(AuthContext);
  return (
    <Box>
      <Button variant="contained" onClick={onLogin}>
        Sign in with Google
      </Button>
    </Box>
  );
}
