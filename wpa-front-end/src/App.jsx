import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Register from "./register/Register";
import Home from "./home/Home";
import Login from "./login/Login";
import Intro from "./intro/Intro";
import ProtectedRoute from "./global_context/ProtectedRoute";
import { AuthProvider, useAuth } from "./global_context/AuthContext"; // Ensure correct path
import Navbar from "./navbar/navbar";
import PrivateRoute from "./PrivateRoute";

function App() {
  return (
    <AuthProvider> {/* Wrap everything inside AuthProvider */}
      <BrowserRouter>
        <MainContent />
      </BrowserRouter>
    </AuthProvider>
  );
}

// Separate Component to use useAuth properly
const MainContent = () => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <p className="text-xl font-semibold">Loading...</p>
      </div>
    );
  }

  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/" element={user ? <Home /> : <Navigate to="/login" />} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/intro" element={user ? <Intro /> : <Navigate to="/login" />} />

        {/* Protect these routes */}
        <Route element={<PrivateRoute />}>
          <Route path="/" element={<Home />} />
        </Route>
        <Route path="/intro" element={<ProtectedRoute><Intro /></ProtectedRoute>} />
      </Routes>
    </>
  );
};

export default App;
