import "./App.css";
import { Outlet, Route, Routes, useLocation } from "react-router-dom";
import { NavBar } from "./components/navbar/NavBar";
import { useSessionManager } from "./hooks/useSessionManager";
import { useEffect, useState } from "react";
import { Box } from "@mui/material";
import { CreateAccountDialog } from "./components/createAccountDialog/CreateAccountDialog";
import { Profile } from "./components/profile/Profile";
import { Library } from "./components/library/Library";

const App = () => {
  const { getCurrentUserId, active } = useSessionManager()
  const [user, setUser] = useState<number | null>(null);

  const location = useLocation();

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

  return (
    <Routes>
      <Route
        path="/"
        element={
          <Box className="flex flex-col h-screen">
            <NavBar user={user} setUser={setUser}/>
            <Box className="flex-1 m-5 rounded-lg bg-primary flex flex-col justify-center overflow-hidden h-[calc(100vh-(--spacing.10))]" >
              <Box className="flex-1 overflow-auto h-full p-4">
                <Outlet />
              </Box>
            </Box>
          </Box>
        }
      >
        <Route index element={ <>Dashboard</>} />
        <Route path="clubs">
          <Route index element={<></>} />
          <Route path=":clubId" element={<></>} />
          <Route path=":userId" element={<></>} />
        </Route>
        <Route path="library/:userId">
          <Route index element={<Library/>} />
        </Route>
        <Route path="books" element={<>Books</>}>
          <Route path="bookId" element={<>Book</>} />
        </Route>
        <Route path="profile" element={<Profile user={user}/>} />
      </Route>
    </Routes>
  );
};

export default App;
