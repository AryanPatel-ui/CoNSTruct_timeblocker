// Reference: javascript_log_in_with_replit integration
import { useQuery } from "@tanstack/react-query";
import { useState, useEffect } from "react";

export function useAuth() {
  // Support a local demo user stored in localStorage so the app can run without server auth.
  const [demoUser, setDemoUser] = useState<any>(null);

  useEffect(() => {
    try {
      const raw = localStorage.getItem("demoUser");
      if (raw) setDemoUser(JSON.parse(raw));
    } catch (e) {
      // ignore
    }
  }, []);

  // If demo user exists, skip network auth check
  const { data: user, isLoading } = useQuery({
    queryKey: ["/api/auth/user"],
    retry: false,
    enabled: !demoUser,
  });

  const effectiveUser = demoUser || user;

  return {
    user: effectiveUser,
    isLoading: isLoading && !demoUser,
    isAuthenticated: !!effectiveUser,
    setDemoUser: (u: any) => {
      setDemoUser(u);
      try {
        if (u) localStorage.setItem("demoUser", JSON.stringify(u));
        else localStorage.removeItem("demoUser");
      } catch (e) {
        /* ignore */
      }
    },
  };
}
