import {
  AppBar,
  Box,
  Button,
  IconButton,
  Toolbar,
  Typography,
} from "@mui/material";

import { Book, DarkMode } from "@mui/icons-material";
import { type JSX } from "react";
import { useNavigate } from "react-router-dom";

import { NavMenu } from "./NavMenu";

type NavBarProps = {
  user: number | null,
  setUser: React.Dispatch<React.SetStateAction<number | null>>,
  toggleTheme: () => void
}

export const NavBar = ({user, setUser, toggleTheme}:NavBarProps): JSX.Element => {

  const pages = [
    {
      text: "Books",
      path: "books",
    },
    {
      text: "Clubs",
      path: "clubs",
    }
  ];

  const navigate = useNavigate();

  const handleNavLinkClick = (path: string) => {
    navigate(path);
  };

  return (
    <Box className="bg-primary dark:bg-primary-dark sticky top-0 z-50"sx={{ flexGrow: 0 }}>
      <AppBar position="static">
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
              {user && <Button
                value={`library/${user}`}
                className="text-white text-nowrap"
                onClick={() => handleNavLinkClick(`library/${user}`)}
              >My Library</Button>}
            </Box>
          </Box>
          <IconButton onClick={toggleTheme}>
            <DarkMode/>
          </IconButton>
          <NavMenu user={user} setUser={setUser} />
        </Toolbar>
      </AppBar>
    </Box>
  );
};
