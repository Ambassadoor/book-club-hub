import {
  AppBar,
  Box,
  Button,
  IconButton,
  Toolbar,
  Typography,
  useColorScheme,
  useMediaQuery,
} from "@mui/material";

import { Book, DarkMode } from "@mui/icons-material";
import { useState, type JSX } from "react";
import { useNavigate } from "react-router-dom";

import { NavMenu } from "./NavMenu";
import { SearchBar1 } from "../shared/ReconfigSearchBar";
import { googleAdapter } from "../../services/searchAdapters/googleAdapter";
import { clubAdapter } from "../../services/searchAdapters/clubAdapter";
import { useBooksSearch } from "../../hooks/useBooksSearch";
import { useClubSearch } from "../../hooks/useClubSearch";

type NavBarProps = {
  user: number | null,
  setUser: React.Dispatch<React.SetStateAction<number | null>>,
}

// The NavBar for the app. 
export const NavBar = ({user, setUser}:NavBarProps): JSX.Element => {
  const [results, setResults] = useState<GoogleBook[]>([])
  const {mode, setMode} = useColorScheme()

  const isMedium = useMediaQuery(`(min-width:640px)`)

  const toggleTheme = () => {
    const newMode = mode === 'dark' ? 'light' : 'dark';
    setMode(newMode);
  }

  const pages = [
    {
      text: "Book Search",
      path: "books",
    },
    {
      text: "Clubs",
      path: "clubs"
    },
    {
      text: user && "My Clubs",
      path: user && `clubs/myClubs/${user}`,
    }
  ];

  const navigate = useNavigate();
  const {search: googleSearch} = useBooksSearch()
  const {search: clubSearch} = useClubSearch()

  const handleNavLinkClick = (path: string) => {
    navigate(path);
  };

  return (
    <Box sx={{ position: 'sticky', top: 0, zIndex: 50 }}>
      <AppBar position="static">
        <Toolbar sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Box 
              sx={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }} 
              onClick={() => handleNavLinkClick("/")}
            >
              <Book />
              <Typography variant="h6" sx={{ mx: 1, whiteSpace: 'nowrap' }}>
                {isMedium ? "Book Club Hub" : "BCH"}
              </Typography>
            </Box>
            <Box sx={{ display: { xs: 'none', md: 'flex' }, ml: 5, gap: 3 }}>
              {pages.map((page) => (
                <Button
                  key={page.text}
                  value={page.path}
                  sx={{ color: 'text.primary', whiteSpace: 'nowrap' }}
                  onClick={() => handleNavLinkClick(page.path)}
                >
                  {page.text}
                </Button>
              ))}
              {user && <Button
                value={`library/${user}`}
                sx={{ color: 'text.primary', whiteSpace: 'nowrap' }}
                onClick={() => handleNavLinkClick(`library/${user}`)}
              >My Library</Button>}
            </Box>
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <SearchBar1 adapters={[googleAdapter(googleSearch, navigate), clubAdapter(clubSearch, navigate)]} collapse limit={5} viewMore/>
            <IconButton onClick={toggleTheme} color="inherit">
              <DarkMode/>
            </IconButton>
            <NavMenu user={user} setUser={setUser} />
          </Box>
        </Toolbar>
      </AppBar>
    </Box>
  );
};
