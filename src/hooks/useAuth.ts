"use client";

import { useEffect, useState } from "react";
import { getToken } from "../utils/auth";
import { getCurrentUser } from "../services/auth";

export default function useAuth() {
  const [isAuth, setIsAuth] = useState(false);

  useEffect(() => {
    const checkAuth = async () => {
      const token = getToken();

      if (!token) {
        setIsAuth(false);
        return;
      }

      try {
        await getCurrentUser();
        setIsAuth(true);
      } catch {
        setIsAuth(false);
      }
    };

    checkAuth();
  }, []);

  return isAuth;
}