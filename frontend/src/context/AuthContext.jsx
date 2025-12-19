import { createContext, useContext, useEffect, useState } from "react";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { auth } from "../firebase/firebaseConfig";
import axiosInstance from "../api/axiosInstance";
import { useNavigate } from "react-router-dom";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [firebaseUser, setFirebaseUser] = useState(null);
  const [user, setUser] = useState(null); // DB user
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // Listen to Firebase login/logout
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (fbUser) => {
      setLoading(true);
      setFirebaseUser(fbUser);
      setUser(null);

      if (fbUser) {
        const token = await fbUser.getIdToken();

        try {
          const res = await axiosInstance.get("/api/auth/me", {
            headers: { Authorization: `Bearer ${token}` },
          });

          setUser({
            ...res.data.user,
            role: res.data.user.role || "user",
          });
        } catch (err) {
          console.log("Backend user fetch failed", err);
        }
      }

      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const logout = async () => {
    await signOut(auth);
    setUser(null);
    navigate("/login");
  };

  return (
    <AuthContext.Provider value={{ firebaseUser, user, loading, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
