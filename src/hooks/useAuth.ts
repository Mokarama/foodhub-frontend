"use client";

import { useEffect, useState } from "react";
import { getToken } from "../utils/auth";


export default function useAuth() {
  const [isAuth, setIsAuth] = useState(false);

  useEffect(() => {
    const token = getToken();
    setIsAuth(!!token);
  }, []);

  return isAuth;
}