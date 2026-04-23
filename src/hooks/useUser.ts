"use client";

import { useEffect, useState } from "react";
import { getCurrentUser } from "../services/auth";

export default function useUser() {
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await getCurrentUser();
        setUser(res.data); // ✅ FIX
      } catch {
        setUser(null);
      }
    };

    fetchUser();
  }, []);

  return user;
}