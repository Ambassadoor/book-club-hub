import "./App.css";
import { Outlet, Route, Routes, useLocation } from "react-router-dom";
import { NavBar } from "./components/navbar/NavBar";
import { useSessionManager } from "./hooks/useSessionManager";
import { useEffect, useState } from "react";
import { Box, ThemeProvider, useColorScheme } from "@mui/material";
import { Profile } from "./components/profile/Profile";
import { Library } from "./components/library/Library";
import {theme} from "../theme"
import { Book } from "./components/library/Book";
import { Books } from "./components/library/Books";
import { Club } from "./components/clubs/Club";
import { CreateClubForm } from "./components/clubs/CreateClubForm";
import { ClubDetails } from "./components/clubs/ClubDetails";

const App = () => {
  const {mode, setMode, systemMode} = useColorScheme();
  const [user, setUser] = useState<number | null>(null);
  
  const location = useLocation();

  const { getCurrentUserId, active } = useSessionManager()


const toggleTheme = () => {
  const newMode = mode === 'dark' ? 'light' : 'dark';
  setMode(newMode);
}
  useEffect(() => {
    setMode("system")
  }, [])

  // Sync Tailwind's .dark class with MUI's resolved mode
  useEffect(() => {
    // When mode is 'system', use systemMode to get the actual resolved value
    const isDark = mode === 'system' ? systemMode === 'dark' : mode === 'dark';
    document.documentElement.classList.toggle('dark', isDark);
  }, [mode, systemMode])

  useEffect(() => {
    if (active) {
      const userId = getCurrentUserId()
      setUser(userId)
    } 
  },[active])

  useEffect(() => {
    if (active) {
    const u = getCurrentUserId()
    if (u) setUser(u) }
  }, [location])

  if (!mode) {
    return null
  }
  return (
      <Routes>
        <Route
          path="/"
          element={
            <Box className="flex flex-col h-screen">
              <NavBar user={user} setUser={setUser} toggleTheme={toggleTheme} />
              <Box className="flex-1 m-5 rounded-lg bg-primary dark:bg-primary-dark flex flex-col justify-center overflow-hidden h-[calc(100vh-(--spacing.10))]" >
                <Box className="flex-1 overflow-auto h-full p-4">
                  <Outlet />
                </Box>
              </Box>
            </Box>
          }
        >
          <Route index element={ <>Dashboard</>} />
          <Route path="clubs">
            <Route index element={<Club user={user}/>} />
            <Route path="create" element={<CreateClubForm user={user} />}/>
            <Route path=":clubId" element={<ClubDetails />} />
            {/* <Route path=":userId" element={<></>} /> */}
          </Route>
          <Route path="library/:userId">
            <Route index element={<Library/>} />
          </Route>
          <Route path="books">
            <Route index element={<Books user={user}/>}/>
            <Route path="/books/:source/:bookId" element={<Book />}/>
          </Route>
          <Route path="profile" element={<Profile user={user}/>} />
        </Route>
      </Routes>
  );
};


const ToggleColorMode = () => {
  return (
    <ThemeProvider theme={theme}>
      <App />
    </ThemeProvider>
  )
};

export default ToggleColorMode
