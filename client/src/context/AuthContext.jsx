import { createContext, useContext, useEffect, useState } from "react";
import { getToken, clearToken, setToken } from "../utils/Token.js";
import { useNavigate } from "react-router-dom";
import { Verify } from "../services/AuthService.js";

export const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    setToken("eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjoxLCJpYXQiOjE3NzU1NDgwNjIsImV4cCI6MTc3NjE1Mjg2Mn0.tajJL2zOsIaqWKsOAf5za1ECQPk2TdsLQTVTRtMgQtY");
    const token = getToken();

    if (token) {
      Verify()
        .then((res) => {
          setUser(res.data);
        })
        .catch((err) => {
          clearToken();
        })
        .finally(() => {
          setLoading(false);
        });
    } else {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const handleStorageChange = (e) => {
      // this event listener has triggereing "re-render" capabilities
      if (e.key === "token") {
        const newToken = e.newValue;
        const currentToken = getToken();

        // If token changed in another tab
        if (newToken !== currentToken) {
          clearToken();
          setUser(null);
          navigate("/login");
        }
      }
    };

    window.addEventListener("storage", handleStorageChange);

    return () => {
      window.removeEventListener("storage", handleStorageChange);
    };
  }, [navigate]);

  if (loading) {
    return null; // or a loader component
  } else {
    return (
      <AuthContext.Provider value={{ user, setUser, loading }}>
        {children}
      </AuthContext.Provider>
    );
  }
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error('useAuth must be used inside AuthProvider');
  }
  return ctx;
};

