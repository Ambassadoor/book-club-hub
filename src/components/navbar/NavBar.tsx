import {
  AppBar,
  Box,
  Button,
  IconButton,
  Menu,
  MenuItem,
  Toolbar,
  Typography,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import { AccountCircle, Book } from "@mui/icons-material";
import { useState, type JSX } from "react";
import { useNavigate } from "react-router-dom";
import { useSessionManager } from "../../hooks/useSessionManager";
import { NavMenu } from "./NavMenu";

type NavBarProps = {
  user: number | null,
  setUser: React.Dispatch<React.SetStateAction<number | null>>
}

export const NavBar = ({user, setUser}:NavBarProps): JSX.Element => {
  const [anchorEl, setAnchorEl] = useState<null | Element>(null);
  const [profileAnchorEl, setProfileAnchorEl] = useState<null | Element>(null);
  const {logout} = useSessionManager()

  const pages = [
    {
      text: "Books",
      path: "books",
    },
    {
      text: "Clubs",
      path: "clubs",
    },
    {
      text: "My Library",
      path: `library/${user}`,
    },
  ];

  const navigate = useNavigate();

  const handleNavLinkClick = (path: string) => {
    navigate(path);
  };

  const handleOpenMenu = (event: React.MouseEvent) => {
    setAnchorEl(event.currentTarget);
  };

  const handleCloseMenu = () => {
    setAnchorEl(null);
  };

  const handleOpenProfileMenu = (event: React.MouseEvent) => {
    setProfileAnchorEl(event.currentTarget);
  }

  const handleCloseProfileMenu = () => {
    setProfileAnchorEl(null);
  }

  return (
    <Box className="bg-primary"sx={{ flexGrow: 0 }}>
      <AppBar className="bg-inherit" position="static">
        <Toolbar className="flex justify-between items-center">
          <Box className="flex items-center">
            <Box className="flex" onClick={() => handleNavLinkClick("/")}>
              <Book />
              <Typography className="mx-2 text-nowrap">
                Book Club Hub
              </Typography>
            </Box>
            <Box className="hidden md:flex md:ml-10 gap-10">
              {pages.map((page) => (
                <Button
                  key={page.text}
                  value={page.path}
                  className="text-white text-nowrap"
                  onClick={() => handleNavLinkClick(page.path)}
                >
                  {page.text}
                </Button>
              ))}
            </Box>
          </Box>
          {/* <Box className="flex md:hidden">
            <IconButton
              size="large"
              edge="start"
              color="inherit"
              aria-label="menu"
              onClick={handleOpenMenu}
            >
              <MenuIcon />
            </IconButton>
            <Menu
              className="mt-12"
              id="menu-appbar"
              anchorEl={anchorEl}
              anchorOrigin={{
                vertical: "top",
                horizontal: "right",
              }}
              keepMounted
              transformOrigin={{
                vertical: "top",
                horizontal: "right",
              }}
              open={Boolean(anchorEl)}
              onClose={handleCloseMenu}
            >
              <MenuItem onClick={() => navigate("profile")}>
                <Typography>Profile</Typography>
              </MenuItem>
              {pages.map((page) => (
                <MenuItem
                  key={page.text}
                  onClick={() => handleNavLinkClick(page.path)}
                >
                  <Typography>{page.text}</Typography>
                </MenuItem>
              ))}
              {user && <MenuItem onClick={() => {
                  logout()
                  setUser(null)
                  handleCloseMenu()
                  }}>
                  <Typography>Sign Out</Typography>
              </MenuItem>}
            </Menu>
          </Box>
          <Box className="hidden md:flex">
            <IconButton size="large" color="inherit" onClick={handleOpenProfileMenu}>
              <AccountCircle />
            </IconButton>
            <Menu
              className="mt-12"
              id="profile-appbar"
              anchorEl={profileAnchorEl}
              anchorOrigin={{
                vertical: "top",
                horizontal: "right"
              }}
              keepMounted
              transformOrigin={{
                vertical: "top",
                horizontal: "right",
              }}
              open={Boolean(profileAnchorEl)}
              onClose={handleCloseProfileMenu}
            >
              <MenuItem onClick={() => navigate("/profile")}>
                <Typography>Profile</Typography>
              </MenuItem>
              {user ? <MenuItem onClick={() => {
                  logout()
                  setUser(null)
                  handleCloseProfileMenu()
                  }}>
                  <Typography>Sign Out</Typography>
              </MenuItem>: <MenuItem onClick={() => navigate("/signin")}><Typography>Sign In</Typography></MenuItem>}
            </Menu>
          </Box> */}
          <NavMenu user={user} setUser={setUser} />
        </Toolbar>
      </AppBar>
    </Box>
  );
};
