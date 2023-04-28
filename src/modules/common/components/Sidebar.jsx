import { styled, useTheme } from "@mui/material/styles";
import MuiDrawer from "@mui/material/Drawer";
import List from "@mui/material/List";
import Divider from "@mui/material/Divider";
import IconButton from "@mui/material/IconButton";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import InboxIcon from "@mui/icons-material/MoveToInbox";
import DashboardIcon from "@mui/icons-material/Dashboard";
import CardGiftcardIcon from "@mui/icons-material/CardGiftcard";
import LocalMallIcon from "@mui/icons-material/LocalMall";
import PeopleIcon from "@mui/icons-material/People";
import { Button, Tooltip } from "@mui/material";
import { NavLink } from "react-router-dom";
import NavLinkBehavior from "./NavLinkBehavior";
import { useContext } from "react";
import { AuthContext } from "../../auth/context/AuthProvider";

const navOptions = [
  {
    label: "Dashboard",
    href: "/",
    icon: <DashboardIcon />,
  },
  {
    label: "Product",
    href: "/products",
    icon: <CardGiftcardIcon />,
  },
  {
    label: "Order",
    href: "/orders",
    icon: <LocalMallIcon />,
  },
  {
    label: "User",
    href: "/users",
    icon: <PeopleIcon />,
  },
];

export const drawerWidth = 240;

const openedMixin = (theme) => ({
  width: drawerWidth,
  transition: theme.transitions.create("width", {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.enteringScreen,
  }),
  overflowX: "hidden",
});

const closedMixin = (theme) => ({
  transition: theme.transitions.create("width", {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  overflowX: "hidden",
  width: `calc(${theme.spacing(7)} + 1px)`,
  [theme.breakpoints.up("sm")]: {
    width: `calc(${theme.spacing(8)} + 1px)`,
  },
});

export const DrawerHeader = styled("div")(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  justifyContent: "flex-end",
  padding: theme.spacing(0, 1),
  // necessary for content to be below app bar
  ...theme.mixins.toolbar,
}));

const Drawer = styled(MuiDrawer, {
  shouldForwardProp: (prop) => prop !== "open",
})(({ theme, open }) => ({
  width: drawerWidth,
  flexShrink: 0,
  whiteSpace: "nowrap",
  boxSizing: "border-box",
  ...(open && {
    ...openedMixin(theme),
    "& .MuiDrawer-paper": openedMixin(theme),
  }),
  ...(!open && {
    ...closedMixin(theme),
    "& .MuiDrawer-paper": closedMixin(theme),
  }),
}));

export default function Sidebar({ open, onDrawerClose }) {
  const theme = useTheme();
  const { onLogout } = useContext(AuthContext);
  return (
    <Drawer variant="permanent" open={open}>
      <DrawerHeader>
        <IconButton onClick={onDrawerClose}>
          {theme.direction === "rtl" ? (
            <ChevronRightIcon />
          ) : (
            <ChevronLeftIcon />
          )}
        </IconButton>
      </DrawerHeader>
      <Divider />
      <List>
        {navOptions.map((item) => (
          <ListItem key={item.href} disablePadding sx={{ display: "block" }}>
            <Tooltip title={!open && item.label} placement="right" arrow>
              <ListItemButton
                component={NavLinkBehavior}
                sx={{
                  minHeight: 48,
                  justifyContent: open ? "initial" : "center",
                  px: 2.5,
                }}
                to={item.href}
              >
                <ListItemIcon
                  sx={{
                    minWidth: 0,
                    mr: open ? 3 : "auto",
                    justifyContent: "center",
                  }}
                >
                  {item.icon}
                </ListItemIcon>
                <ListItemText
                  primary={item.label}
                  sx={{ opacity: open ? 1 : 0 }}
                />
              </ListItemButton>
            </Tooltip>
          </ListItem>
        ))}
      </List>
      <Button variant="outlined" onClick={onLogout}>
        Logout
      </Button>
    </Drawer>
  );
}
