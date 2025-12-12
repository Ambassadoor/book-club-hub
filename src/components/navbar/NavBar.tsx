import {
  AppBar,
  Box,
  Button,
  IconButton,
  Toolbar,
  Typography,
} from "@mui/material";

import { Book, DarkMode } from "@mui/icons-material";
import { useState, type JSX } from "react";
import { useNavigate } from "react-router-dom";

import { NavMenu } from "./NavMenu";
import { SearchBar } from "../shared/SearchBar";

type NavBarProps = {
  user: number | null,
  setUser: React.Dispatch<React.SetStateAction<number | null>>,
  toggleTheme: () => void
}

export const NavBar = ({user, setUser, toggleTheme}:NavBarProps): JSX.Element => {
  const [results, setResults] = useState<UserBook[] | GoogleBook[]>([])

  const pages = [
    {
      text: "Book Search",
      path: "books",
    },
    {
      text: !user ? "Clubs" : "My Clubs",
      path: !user ? "clubs" : `clubs/myClubs/${user}`,
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
          <Box className="flex flex-row flex-nowrap align-middle gap-2">
            <SearchBar className="self-center max-[480px]:hidden" targets={['googleBooks']} results={results} setResults={setResults} expanding select/>
            <IconButton onClick={toggleTheme}>
              <DarkMode/>
            </IconButton>
            <NavMenu user={user} setUser={setUser} />
          </Box>
        </Toolbar>
      </AppBar>
    </Box>
  );
};
