  import React, { useState, useEffect } from "react";
  import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
  import MenuIcon from "@mui/icons-material/Menu";
  import CloseIcon from "@mui/icons-material/Close";
  import {
    AppBar,
    Avatar,
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
  } from "@mui/material";
  import { useNavigate } from "react-router-dom";

  type NavItem = {
    label: string;
    path: string;
  };

  type User = {
    name: string;
    role: "Student" | "Teacher" | "Admin"; // Specify the possible roles
    avatarUrl?: string;
  };

  interface NavbarProps {
    logoText?: string;
    navItems?: NavItem[];
    user: User;
  }

  const defaultNavItems: NavItem[] = [
    { label: "Home", path: "#" },
    { label: "Playground", path: "#" },
  ];

  const Navbar: React.FC<NavbarProps> = ({
    logoText = "VISEMO",
    navItems = defaultNavItems,
    user,
  }) => {
    const [currentDate, setCurrentDate] = useState<string>("");
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('md'));
    const navigate = useNavigate();

    const handleNavigation = (label: string) => {
      if (label === "Home") {
      switch (user.role) {
        case "Student":
          navigate("/student-dashboard");
          break;
        case "Teacher":
          navigate("/teacher-dashboard");
          break;
        case "Admin":
          navigate("/admin-dashboard");
          break;
        default:
          navigate("/");
      }
    } else if (label === "Playground") {
      navigate("/playground");
    }

      // Close sidebar if on mobile
      if (isMobile) {
        setIsSidebarOpen(false);
      }
    };

    

    const updateDate = () => {
      const date = new Date();
      const formattedDate = `${date.getMonth() + 1}/${date.getDate()}/${date.getFullYear()}`;
      setCurrentDate(formattedDate);
    };

    useEffect(() => {
      updateDate();
      const interval = setInterval(updateDate, 1000);
      return () => clearInterval(interval);
    }, []);

    const toggleSidebar = () => {
      setIsSidebarOpen(!isSidebarOpen);
    };

    const UserProfile = () => (
      <Stack direction="row" spacing={1} alignItems="center">
        <Avatar
          sx={{
            width: 36,
            height: 36,
            bgcolor: "#d9d9d9",
          }}
        >
          {user.avatarUrl ? (
            <img src={user.avatarUrl} alt="User Avatar" />
          ) : null}
        </Avatar>
        <Box>
          <Typography
            variant="body2"
            sx={{
              fontWeight: 700,
              fontFamily: "'Inter-Bold', Helvetica",
              fontSize: "14px",
            }}
          >
            {user.name}
          </Typography>
          <Typography
            variant="body2"
            sx={{
              fontWeight: 500,
              fontFamily: "'Inter-Medium', Helvetica",
              fontSize: "12px",
              color: "#fff",
            }}
          >
            {user.role}
          </Typography>
        </Box>
      </Stack>
    );

    const SidebarContent = () => (
      <Box
        sx={{
          width: 250,
          bgcolor: "#1e5631",
          height: "100%",
          color: "white",
        }}
      >
        <Box sx={{ p: 2, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
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
            <ListItem 
              key={item.label}
              disablePadding
            >
              <ButtonBase
              onClick={() => handleNavigation(item.label)}
                sx={{
                  width: '100%',
                  textAlign: 'left',
                  py: 1,
                  px: 2,
                  '&:hover': {
                    backgroundColor: 'rgba(255, 255, 255, 0.1)'
                  }
                }}
              >
                <ListItemText 
                  primary={item.label}
                  sx={{ 
                    '& .MuiTypography-root': { 
                      fontWeight: 500,
                      color: 'white' 
                    } 
                  }}
                />
              </ButtonBase>
            </ListItem>
          ))}
        </List>

        <Box sx={{ p: 2, mt: 'auto' }}>
          <Typography variant="body2" sx={{ fontWeight: 700 }}>
            {currentDate}
          </Typography>
        </Box>
      </Box>
    );

    return (
      <>
        <AppBar
          position="static"
          sx={{
            bgcolor: "#1e5631",
            height: "64px",
            justifyContent: "center",
          }}
        >
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
                <Typography
                  variant="h6"
                  component="div"
                  sx={{
                    fontWeight: 700,
                    fontFamily: "'Inter-Bold', Helvetica",
                    ml: "20px",
                  }}
                >
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
                      fontFamily: "'Inter-SemiBold', Helvetica",
                      cursor: "pointer",
                      '&:hover': { opacity: 0.8 },
                      transition: 'opacity 0.2s',
                      }}
                    >
                      {item.label}
                    </Typography>
                  ))}
                </Stack>

                <Stack
                  direction="row"
                  spacing={2}
                  alignItems="center"
                  sx={{ mr: "16px" }}
                >
                  <Typography
                    variant="body2"
                    sx={{
                      fontWeight: 700,
                      fontFamily: "'Inter-Bold', Helvetica",
                      color: "#fff",
                    }}
                  >
                    {currentDate}
                  </Typography>

                  <UserProfile />

                  <IconButton color="inherit" edge="end">
                    <KeyboardArrowDownIcon />
                  </IconButton>
                </Stack>
              </>
            )}
          </Toolbar>
        </AppBar>

        <Drawer
          anchor="left"
          open={isSidebarOpen}
          onClose={toggleSidebar}
        >
          <SidebarContent />
        </Drawer>
      </>
    );
  };

  export default Navbar;