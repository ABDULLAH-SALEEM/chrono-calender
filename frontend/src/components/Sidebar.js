import React from "react";
import {
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  IconButton,
  Box,
  Typography,
  useTheme,
  useMediaQuery,
  Divider,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import DashboardIcon from "@mui/icons-material/Dashboard";
import PersonIcon from "@mui/icons-material/Person";
import SettingsIcon from "@mui/icons-material/Settings";
import LogoutIcon from "@mui/icons-material/Logout";
import MailIcon from "@mui/icons-material/Mail";
import { useAuth } from "../hooks/useAuth";

const menuItems = [
  { text: "Dashboard", icon: <DashboardIcon /> },
  { text: "Profile", icon: <PersonIcon /> },
  { text: "Invitations", icon: <MailIcon /> },
  { text: "Settings", icon: <SettingsIcon /> },
];

const SIDEBAR_WIDTH = 200;
const SIDEBAR_COLLAPSED_WIDTH = 68;

export default function Sidebar({
  selected = 0,
  onSelect,
  collapsed,
  setCollapsed,
}) {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const [open, setOpen] = React.useState(false);
  const { logout } = useAuth();

  const blackBg = theme.palette.grey[900];
  const white = theme.palette.common.white;
  const black = theme.palette.common.black;

  // App logo and name
  const appName = "Chrono";
  const appLogo = (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        justifyContent: collapsed ? "center" : "flex-start",
        px: collapsed ? 0 : 2,
        py: 2,
        minHeight: 56,
        width: "100%",
      }}
    >
      {!collapsed && (
        <>
          <img
            src="/logo192.png"
            alt="Chrono Logo"
            style={{
              width: 32,
              height: 32,
              objectFit: "contain",
              marginRight: collapsed ? 0 : 8,
              display: "block",
            }}
          />
          <Typography
            variant="h6"
            fontWeight={800}
            sx={{ color: theme.palette.primary.main, letterSpacing: 1, ml: 1 }}
          >
            {appName}
          </Typography>
        </>
      )}
    </Box>
  );

  const drawerContent = (
    <Box
      sx={{
        width: collapsed ? SIDEBAR_COLLAPSED_WIDTH : SIDEBAR_WIDTH,
        height: "100vh",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        bgcolor: "background.default",
        borderRight: `1px solid ${theme.palette.divider}`,
        pt: 0,
        pb: 0,
        position: "relative",
        transition: "width 0.2s cubic-bezier(.4,0,.2,1)",
      }}
    >
      {/* App logo/name at the top */}
      {appLogo}
      <Box
        sx={{
          flex: 1,
          mt: 0,
          display: "flex",
          flexDirection: "column",
          justifyContent: "flex-start",
        }}
      >
        <List>
          {menuItems.map((item, idx) => {
            const isSelected = selected === idx;
            return (
              <ListItem
                key={item.text}
                disablePadding
                sx={{ display: "block" }}
              >
                <ListItemButton
                  sx={{
                    borderRadius: 2,
                    bgcolor: isSelected ? blackBg : "transparent",
                    color: isSelected ? white : black,
                    mb: 1,
                    mx: 1,
                    minHeight: 48,
                    justifyContent: collapsed ? "center" : "flex-start",
                    px: collapsed ? 0 : 2,
                    "&:hover": {
                      bgcolor: isSelected
                        ? blackBg
                        : theme.palette.action.hover,
                    },
                    transition: "all 0.2s cubic-bezier(.4,0,.2,1)",
                  }}
                  onClick={() => {
                    onSelect && onSelect(idx);
                    setOpen(false);
                  }}
                >
                  <ListItemIcon
                    sx={{
                      color: isSelected ? white : black,
                      minWidth: 0,
                      mr: collapsed ? 0 : 2,
                      justifyContent: "center",
                    }}
                  >
                    {item.icon}
                  </ListItemIcon>
                  {!collapsed && (
                    <ListItemText
                      primary={
                        <Typography
                          fontWeight={isSelected ? 700 : 500}
                          fontSize={16}
                        >
                          {item.text}
                        </Typography>
                      }
                    />
                  )}
                </ListItemButton>
              </ListItem>
            );
          })}
        </List>
      </Box>
      <Box sx={{ width: "100%", pb: 0 }}>
        <Divider />
        <ListItemButton
          sx={{
            borderRadius: 2,
            color: theme.palette.error.main,
            justifyContent: collapsed ? "center" : "flex-start",
            px: collapsed ? 0 : 2,
            minHeight: 48,
            width: "100%",

            transition: "all 0.2s cubic-bezier(.4,0,.2,1)",
          }}
          onClick={logout}
        >
          <ListItemIcon
            sx={{
              color: theme.palette.error.main,
              minWidth: 0,
              mr: collapsed ? 0 : 2,
              justifyContent: "center",
            }}
          >
            <LogoutIcon />
          </ListItemIcon>
          {!collapsed && (
            <ListItemText
              primary={
                <Typography fontWeight={700} fontSize={16}>
                  Sign Out
                </Typography>
              }
            />
          )}
        </ListItemButton>
      </Box>
    </Box>
  );

  return (
    <>
      {isMobile ? (
        <>
          {!open && (
            <IconButton
              onClick={() => setOpen(true)}
              sx={{ position: "fixed", top: 0, left: 13, zIndex: 1300 }}
              size="small"
              color="primary"
            >
              <MenuIcon />
            </IconButton>
          )}
          <Drawer
            anchor="left"
            open={open}
            onClose={() => setOpen(false)}
            PaperProps={{
              sx: { width: SIDEBAR_WIDTH, bgcolor: "background.default" },
            }}
          >
            {drawerContent}
          </Drawer>
        </>
      ) : (
        <Box
          sx={{
            width: collapsed ? SIDEBAR_COLLAPSED_WIDTH : SIDEBAR_WIDTH,
            height: "100vh",
            position: "fixed",
            left: 0,
            top: 0,
            bgcolor: "background.default",
            borderRight: `1px solid ${theme.palette.divider}`,
            zIndex: 1200,
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            pt: 0,
            pb: 0,
            transition: "width 0.2s cubic-bezier(.4,0,.2,1)",
          }}
        >
          {drawerContent}
        </Box>
      )}
    </>
  );
}
