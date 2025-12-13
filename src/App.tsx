import "./App.css";
import { Outlet, Route, Routes, useLocation } from "react-router-dom";
import { NavBar } from "./components/navbar/NavBar";
import { useSessionManager } from "./hooks/useSessionManager";
import { useEffect, useState } from "react";
import { Box } from "@mui/material";
import { Profile } from "./components/profile/Profile";
import { Library } from "./components/library/Library";
import { Book } from "./components/library/Book";
import { Books } from "./components/library/Books";
import { Club } from "./components/clubs/Club";
import { CreateClubForm } from "./components/clubs/CreateClubForm";
import { ClubDetails } from "./components/clubs/ClubDetails";
import { Login } from "./components/login/Login";
import { LoginCard } from "./components/login/LoginCard";

const App = () => {
  const [user, setUser] = useState<number | null>(null);  
  const { getCurrentUserId, active, refreshSession } = useSessionManager()
  const location = useLocation(); 

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
            <Box className="flex flex-col h-screen">
              <NavBar user={user} setUser={setUser} />
              <Box className="flex-1 m-5 rounded-lg bg-primary dark:bg-primary-dark flex flex-col justify-center overflow-hidden h-[calc(100vh-(--spacing.10))]" >
                <Box className="flex-1 overflow-auto h-full p-4 ">
                  <Outlet />
                </Box>
              </Box>
            </Box>
          }
        >
          <Route index element={ user ? <>Dashboard</> : <LoginCard setUser={setUser}/>} />
          <Route path="clubs">
            <Route index element={<Club/>} />
            <Route path="myClubs/:userId" element={<Club />}/>
            <Route path="create" element={<CreateClubForm user={user} />}/>
            <Route path=":clubId" element={<ClubDetails user={user} />} />
            {/* <Route path=":userId" element={<></>} /> */}
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
        </Route>
      </Routes>
  );
};

export default App
