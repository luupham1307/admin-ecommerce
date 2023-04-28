import { IconButton, Tooltip } from "@mui/material";
import DeleteModal from "./DeleteModal";
import DeleteIcon from "@mui/icons-material/Delete";
import { useState } from "react";

export default function DeleteAction({ id }) {
  const [open, setOpen] = useState(false);

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };
  return (
    <div>
      <Tooltip title="Delete" placement="top">
        <IconButton aria-label="Delete" onClick={handleOpen}>
          <DeleteIcon />
        </IconButton>
      </Tooltip>
      <DeleteModal open={open} onClose={handleClose} id={id} />
    </div>
  );
}
