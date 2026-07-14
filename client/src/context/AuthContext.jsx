import { createContext, useState, useContext } from "react";

// Create a context to store authentication data
const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  // Restore user information from localStorage on page refresh
  const [user, setUser] = useState(
    JSON.parse(localStorage.getItem("user")) || null,
  );

  // Restore the access token from localStorage
  const [token, setToken] = useState(localStorage.getItem("token") || null);

  // Save authentication data after a successful login
  const login = (userData, token) => {
    localStorage.setItem("user", JSON.stringify(userData));
    localStorage.setItem("token", token);

    setUser(userData);
    setToken(token);
  };

  // Remove authentication data when the user logs out
  const logout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("token");

    setUser(null);
    setToken(null);
  };

  return (
    <AuthContext.Provider value={{ user, token, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook to access authentication data throughout the application
export const useAuth = () => useContext(AuthContext);