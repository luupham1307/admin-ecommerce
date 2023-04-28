import { Typography } from "@mui/material";

export default function FormErrorMessage({ children }) {
  return (
    <Typography color="red" mt={1}>
      {children}
    </Typography>
  );
}
