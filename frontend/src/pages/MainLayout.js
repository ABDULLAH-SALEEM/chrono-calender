import React, { useState } from "react";
import Box from "@mui/material/Box";
import Sidebar from "../components/Sidebar";
import CalendarPage from "./CalendarPage";
import Typography from "@mui/material/Typography";
import IconButton from "@mui/material/IconButton";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import useMediaQuery from "@mui/material/useMediaQuery";
import { useTheme } from "@mui/material/styles";
import SettingsPage from "./SettingsPage";
import InvitationsPage from "./InvitationsPage";

const SIDEBAR_WIDTH = 200;
const SIDEBAR_COLLAPSED_WIDTH = 68;

const pageComponents = [
  { component: <CalendarPage key="dashboard" />, title: "Calender" }, // Dashboard
  {
    component: (
      <Box key="profile" p={4}>
        <Typography variant="h4">Profile Page (Coming Soon)</Typography>
      </Box>
    ),
    title: "Profile",
  },
  {
    component: <InvitationsPage key="invitations" />,
    title: "Invitations",
  },
  {
    component: <SettingsPage key="settings" />,
    title: "Settings",
  },
];

export default function MainLayout() {
  const [selected, setSelected] = useState(0);
  const [collapsed, setCollapsed] = useState(false);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const handleSelect = (idx) => setSelected(idx);

  return (
    <Box
      sx={{
        display: "flex",
        minHeight: "100vh",
        bgcolor: "background.default",
        position: "relative",
      }}
    >
      <Sidebar
        selected={selected}
        onSelect={handleSelect}
        collapsed={collapsed}
        setCollapsed={setCollapsed}
      />
      {/* Collapse/Expand Button - only on desktop */}
      {!isMobile && (
        <IconButton
          onClick={() => setCollapsed((prev) => !prev)}
          sx={{
            position: "fixed",
            left: collapsed ? SIDEBAR_COLLAPSED_WIDTH - 22 : SIDEBAR_WIDTH - 22,
            top: 24,
            zIndex: 1301,
            bgcolor: "background.paper",
            "&:hover": {
              bgcolor: "background.paper",
            },
            border: `1px solid ${theme.palette.divider}`,

            transition:
              "left 0.2s cubic-bezier(.4,0,.2,1), transform 0.2s cubic-bezier(.4,0,.2,1)",
            transform: collapsed ? "rotate(180deg)" : "none",
          }}
        >
          <ChevronLeftIcon />
        </IconButton>
      )}
      <Box
        sx={{
          flex: 1,
          ml: {
            xs: "18px",
            sm: collapsed
              ? `${SIDEBAR_COLLAPSED_WIDTH + 25}px`
              : `${SIDEBAR_WIDTH + 25}px`,
          },

          mr: isMobile ? "18px" : "25px",
          my: isMobile ? 4 : 3,

          width: "100%",
          minHeight: "100vh",
          transition: "margin-left 0.2s cubic-bezier(.4,0,.2,1)",
        }}
      >
        {/* {!isMobile && ( */}
        <Typography mb={1} mt={0.7} variant="h5" fontWeight={510}>
          {pageComponents[selected].title}
        </Typography>
        {/* )} */}

        {pageComponents[selected].component}
      </Box>
    </Box>
  );
}
