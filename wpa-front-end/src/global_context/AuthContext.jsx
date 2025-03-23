import { createContext, useContext, useEffect, useState } from "react";
import axios from "axios";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    const fetchUser = async () => {
        try {
            const token = localStorage.getItem("token");
            if (!token) {
                setUser(null);
                setLoading(false);
                return;
            }

            const response = await axios.get("http://localhost:3000/auth/home", {
                headers: { Authorization: `Bearer ${token}` },
            });

            if (response.status === 200) {
                setUser(response.data.user);
            } 
            else {
                setUser(null);
            }
        } catch (err) {
            setUser(null);
            console.log("Auth check failed", err.response?.data || err.message);
            localStorage.removeItem("token");  // Clear invalid token
        } finally {
            setLoading(false);
        }
    };
    // ✅ Login function
    const login = (token, userData) => {
        localStorage.setItem("token", token);
        setUser(userData);
    };

    const logout = () => {
        setUser(null);
        localStorage.removeItem("token");
        window.location.href = "/login";
    };
    // ✅ Correct placement of useEffect
    useEffect(() => {
        fetchUser();
    }, []);



    return (
        <AuthContext.Provider value={{ user, loading, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
