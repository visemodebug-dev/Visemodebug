import React, { useState, useEffect } from "react";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import MenuIcon from "@mui/icons-material/Menu";
import CloseIcon from "@mui/icons-material/Close";
import {
  AppBar,
  Box,
  IconButton,
  Stack,
  Toolbar,
  Typography,
  Drawer,
  List,
  ListItem,
  ListItemText,
  useMediaQuery,
  useTheme,
  ButtonBase,
  CircularProgress,
  Menu,
  MenuItem,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Button,
} from "@mui/material";
import { useNavigate } from "react-router-dom";

type NavItem = {
  label: string;
  path: string;
};

type User = {
  firstName: string;
  lastName: string;
  role: "Student" | "Teacher";
};

interface NavbarProps {
  logoText?: string;
  navItems?: NavItem[];
}

const defaultNavItems: NavItem[] = [
  { label: "Home", path: "#" },
  { label: "Playground", path: "#" },
];

const Navbar: React.FC<NavbarProps> = ({
  logoText = "VISEMO",
  navItems = defaultNavItems,
}) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [currentDate, setCurrentDate] = useState<string>("");
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null); // 🔷 anchor for menu dropdown
  const [showLogoutModal, setShowLogoutModal] = useState(false);      // 🔷 modal state
  const open = Boolean(anchorEl);

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const navigate = useNavigate();

  useEffect(() => {
    const savedUser = localStorage.getItem("user");

    if (!savedUser) {
      console.error("No user found in localStorage.");
      setLoading(false);
      // 🚩 originally redirects to login
      navigate("/loginauth");
      return;
    }

    const parsedUser: User = JSON.parse(savedUser);
    setUser(parsedUser);

    const isOnTeacherPage = window.location.pathname.includes("teacher");
    const isOnStudentPage = window.location.pathname.includes("student");

    // 🚩 Commented out role-enforcement logic for testing both roles
    
    if (isOnTeacherPage && parsedUser.role !== "Teacher") {
      console.warn("Redirecting Student to their dashboard.");
      navigate("/student-dashboard");
      return;
    }

    if (isOnStudentPage && parsedUser.role !== "Student") {
      console.warn("Redirecting Teacher to their dashboard.");
      navigate("/teacher-dashboard");
      return;
    }
    

    setLoading(false);
  }, [navigate]);

  const handleNavigation = (label: string) => {
    if (!user) return;

    if (label === "Home") {
      switch (user.role) {
        case "Student":
          navigate("/student-dashboard");
          break;
        case "Teacher":
          navigate("/teacher-dashboard");
          break;
        default:
          navigate("/");
      }
    } else if (label === "Playground") {
      navigate("/playground");
    }

    if (isMobile) setIsSidebarOpen(false);
  };

  const updateDate = () => {
    const date = new Date();
    const formattedDate = `${date.getMonth() + 1}/${date.getDate()}/${date.getFullYear()}`;
    setCurrentDate(formattedDate);
  };

  useEffect(() => {
    updateDate();
    const interval = setInterval(updateDate, 60000);
    return () => clearInterval(interval);
  }, []);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const handleMenuClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget); 
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    localStorage.clear(); 
    navigate("/");        
  };

  const confirmLogout = () => {
    handleLogout();
    setShowLogoutModal(false);
  };

  const UserProfile = () => {
    if (loading) return <CircularProgress size={20} color="inherit" />;
    if (!user) return null;

    return (
      <Stack spacing={0} alignItems="flex-end">
        <Typography
          variant="body2"
          sx={{ fontWeight: 700, fontSize: "14px", color: "#fff", lineHeight: 1.2 }}
        >
          {user.firstName} {user.lastName}
        </Typography>
        <Typography
          variant="body2"
          sx={{ fontWeight: 500, fontSize: "12px", color: "#fff", lineHeight: 1.2 }}
        >
          {user.role}
        </Typography>
      </Stack>
    );
  };

  const SidebarContent = () => (
    <Box sx={{ width: 250, bgcolor: "#1e5631", height: "100%", color: "white" }}>
      <Box
        sx={{ p: 2, display: "flex", justifyContent: "space-between", alignItems: "center" }}
      >
        <Typography variant="h6" sx={{ fontWeight: 700 }}>
          {logoText}
        </Typography>
        <IconButton color="inherit" onClick={toggleSidebar}>
          <CloseIcon />
        </IconButton>
      </Box>

      <Box sx={{ p: 2 }}>
        <UserProfile />
      </Box>

      <List>
        {navItems.map((item) => (
          <ListItem key={item.label} disablePadding>
            <ButtonBase
              onClick={() => handleNavigation(item.label)}
              sx={{
                width: "100%",
                textAlign: "left",
                py: 1,
                px: 2,
                "&:hover": { backgroundColor: "rgba(255, 255, 255, 0.1)" },
              }}
            >
              <ListItemText
                primary={item.label}
                sx={{ "& .MuiTypography-root": { fontWeight: 500, color: "white" } }}
              />
            </ButtonBase>
          </ListItem>
        ))}
      </List>

      <Box sx={{ p: 2, mt: "auto" }}>
        <Typography variant="body2" sx={{ fontWeight: 700 }}>
          {currentDate}
        </Typography>
      </Box>
    </Box>
  );

  return (
    <>
      <AppBar position="static" sx={{ bgcolor: "#1e5631", height: "64px", justifyContent: "center" }}>
        <Toolbar sx={{ justifyContent: "space-between" }}>
          {isMobile ? (
            <>
              <IconButton color="inherit" onClick={toggleSidebar}>
                <MenuIcon />
              </IconButton>
              <Typography variant="h6" sx={{ fontWeight: 700 }}>
                {logoText}
              </Typography>
            </>
          ) : (
            <>
              <Typography variant="h6" sx={{ fontWeight: 700, ml: "20px" }}>
                {logoText}
              </Typography>

              <Stack
                direction="row"
                spacing={4}
                sx={{
                  position: "absolute",
                  left: "50%",
                  transform: "translateX(-50%)",
                }}
              >
                {navItems.map((item) => (
                  <Typography
                    key={item.label}
                    variant="body1"
                    onClick={() => handleNavigation(item.label)}
                    sx={{
                      fontWeight: 600,
                      cursor: "pointer",
                      "&:hover": { opacity: 0.8 },
                      transition: "opacity 0.2s",
                    }}
                  >
                    {item.label}
                  </Typography>
                ))}
              </Stack>

              <Stack direction="row" spacing={2} alignItems="center" sx={{ mr: "16px" }}>
                <Typography
                  variant="body2"
                  sx={{ fontWeight: 700, color: "#fff" }}
                >
                  {currentDate}
                </Typography>

                <UserProfile />

                <IconButton color="inherit" onClick={handleMenuClick}>
                  <KeyboardArrowDownIcon />
                </IconButton>

                {/* 🔷 Dropdown Menu for Logout */}
                <Menu
                  anchorEl={anchorEl}
                  open={open}
                  onClose={handleMenuClose}
                  anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
                  transformOrigin={{ vertical: "top", horizontal: "right" }}
                >
                  <MenuItem onClick={() => { handleMenuClose(); setShowLogoutModal(true); }}>
                    Logout
                  </MenuItem>
                </Menu>
              </Stack>
            </>
          )}
        </Toolbar>
      </AppBar>

      <Drawer anchor="left" open={isSidebarOpen} onClose={toggleSidebar}>
        <SidebarContent />
      </Drawer>

      {/* 🔷 Logout Confirmation Modal */}
      <Dialog
        open={showLogoutModal}
        onClose={() => setShowLogoutModal(false)}
      >
        <DialogTitle>Confirm Logout</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to logout?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowLogoutModal(false)} color="primary">
            Cancel
          </Button>
          <Button onClick={confirmLogout} color="error">
            Logout
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default Navbar;
