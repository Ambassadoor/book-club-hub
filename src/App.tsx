import "./App.css";
import { Outlet, Route, Routes, useLocation } from "react-router-dom";
import { NavBar } from "./components/navbar/NavBar";
import { SignUpButton } from "./components/profile/SignUpButton";
import { useSessionManager } from "./hooks/useSessionManager";
import { useEffect, useState } from "react";
import { Login } from "./components/login/Login";
import { Box } from "@mui/material";

const App = () => {
  const { getCurrentUserId } = useSessionManager()
  const [user, setUser] = useState<number | null>(null);

  const location = useLocation();

  useEffect(() => {
    const u = getCurrentUserId()
    if (u) setUser(u)
  }, [location])

  return (
    <Routes>
      <Route
        path="/"
        element={
          <Box className="flex flex-col h-dvh">
            <NavBar user={user} setUser={setUser}/>
            <Box className="flex flex-1 m-5 rounded-lg bg-primary flex-col justify-center" >
              <Outlet />
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
          <Route index element={<></>} />
        </Route>
        <Route path="books" element={<>Books</>}>
          <Route path="bookId" element={<>Book</>} />
        </Route>
        <Route path="profile" element={<><SignUpButton method="signup"/></>} />
      </Route>
    </Routes>
  );
};

export default App;
