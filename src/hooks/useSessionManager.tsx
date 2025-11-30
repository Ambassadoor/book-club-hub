import { useEffect, useRef, useCallback, useState } from "react";
import { type User } from "../services/userServices/userServices";
import { useNavigate } from "react-router-dom";

export const useSessionManager = () => {
  const [warning, setWarning] = useState(false);
  const [active, setActive] = useState(true);
  const navigate = useNavigate();
  const timerRef = useRef<number | null>(null);

  const getCurrentUserId = useCallback(() => {
    const token = localStorage.getItem("sessionToken");
    if (!token) return null;
    try {
        const { userId } = JSON.parse(token);
        return userId;
    } catch {
        return null;
    }
  }, [])

  const isSessionActive = useCallback(() => {
    const token = localStorage.getItem("sessionToken");
    if (!token) return false;
    const { expiresAt } = JSON.parse(token);
    return Date.now() < expiresAt;
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem("sessionToken");
    setActive(false);
    navigate("/login");
    if (timerRef.current) clearInterval(timerRef.current);
  }, [navigate]);

  const updateSessionToken = useCallback(() => {
    const token = localStorage.getItem("sessionToken");
    if (token) {
      const tokenObj = JSON.parse(token);
      tokenObj.expiresAt = Date.now() + 3600000;
      const updatedToken = JSON.stringify(tokenObj);
      localStorage.setItem("sessionToken", updatedToken);
      return tokenObj;
    } else {
      throw new Error("No session token found");
    }
  }, []);

  const refreshSession = useCallback(() => {
    updateSessionToken();
    setWarning(false);
    setActive(true);
  }, [updateSessionToken]);

  const signIn = useCallback(async (email: string) => {
    const user = await fetch(`http://localhost:8088/users?email=${email}`);
    if (user.ok) {
      const res: User[] = await user.json();
      const sessionToken = JSON.stringify({
        userId: res[0].id,
        expiresAt: Date.now() + 3600000,
      });
      localStorage.setItem("sessionToken", sessionToken);
      return res[0].id;
    } else {
      throw new Error("User not found");
    }
  }, []);

  const startSessionTimer = useCallback(() => {
    if (timerRef.current) clearInterval(timerRef.current);

    timerRef.current = window.setInterval(() => {
      const token = localStorage.getItem("sessionToken");
      if (!token) {
        logout();
        return;
      }
      const { expiresAt } = JSON.parse(token);
      const timeLeft = expiresAt - Date.now();

      if (timeLeft <= 0) {
        logout();
      } else if (timeLeft <= 900000) {
        setWarning(true);
      } else {
        setWarning(false);
      }
    }, 60000);
  }, [logout]);

  useEffect(() => {
    if (isSessionActive()) {
      startSessionTimer();
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isSessionActive, startSessionTimer]);

  return {
    warning,
    active,
    getCurrentUserId,
    refreshSession,
    logout,
    signIn,
  };
};