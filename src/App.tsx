import "./App.css";
import { Outlet, Route, Routes, useLocation } from "react-router-dom";
import { NavBar } from "./components/navbar/NavBar";
import { useSessionManager } from "./hooks/useSessionManager";
import { useEffect, useState } from "react";
import { Box, useMediaQuery } from "@mui/material";
import { Profile } from "./components/profile/Profile";
import { Library } from "./components/library/Library";
import { Book } from "./components/library/Book";
import { Books } from "./components/library/Books";
import { Club } from "./components/clubs/Club";
import { CreateClubForm } from "./components/clubs/CreateClubForm";
import { ClubDetails } from "./components/clubs/ClubDetails";
import { LoginCard } from "./components/login/LoginCard";
import { Dashboard } from "./components/dashboard/Dashboard";
import { CreateAccount } from "./components/createAccountDialog/CreateAccount";

const App = () => {
  const [user, setUser] = useState<number | null>(null);  
  const { getCurrentUserId, active, refreshSession } = useSessionManager()
  const location = useLocation(); 
  const isMedium = useMediaQuery(`(min-width:640px)`)

  // Checks if userSession is active, and if so, set's user
  useEffect(() => {
    if (active) {
      const userId = getCurrentUserId()
      setUser(userId)
    } 
  },[active])

  //Refreshes session when user navigates
  useEffect(() => {
    if (active) {
      refreshSession()
    }
  }, [location])

  return (
      <Routes>
        <Route
          path="/"
          element={
            <Box sx={{ display: 'flex', flexDirection: 'column', height: '100vh' }}>
              <NavBar user={user} setUser={setUser} />
              <Box 
                sx={{ 
                  flex: 1, 
                  m: isMedium ? 2 : 0,
                  borderRadius: isMedium ? 2 : 0,
                  bgcolor: 'background.default',
                  display: 'flex',
                  flexDirection: 'column',
                  overflow: 'hidden',
                }}
              >
                <Box 
                  sx={{ 
                    flex: 1, 
                    overflow: 'auto',
                    p: 2,
                    display: 'flex',
                    justifyContent: 'center',
                  }}
                >
                  <Outlet />
                </Box>
              </Box>
            </Box>
          }
        >
          <Route index element={ user ? <Dashboard user={user} /> : <LoginCard setUser={setUser}/>} />
          <Route path="clubs">
            <Route index element={<Club/>} />
            <Route path="myClubs/:userId" element={<Club />}/>
            <Route path="create" element={<CreateClubForm user={user} />}/>
            <Route path=":clubId" element={<ClubDetails user={user} />} />
          </Route>
          <Route path="library/:userId">
            <Route index element={<Library/>} />
          </Route>
          <Route path="books">
            <Route index element={<Books user={user}/>}/>
            <Route path="/books/:source/:bookId" element={<Book />}/>
            <Route path="/books/:clubId/change" element={<Books user={user}/>}/>
          </Route>
          <Route path="profile" element={<Profile user={user}/>} />
          <Route path="createAccount" element={<CreateAccount setUser={setUser}/>}/>
          <Route path="*" element={<Box sx={{ color: 'text.primary', textAlign: 'center', p: 4 }}>Page Not Found</Box>} />
        </Route>
      </Routes>
  );
};

export default App
