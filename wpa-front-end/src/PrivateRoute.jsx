import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "./global_context/AuthContext";

const PrivateRoute = () => {
    const { user, loading } = useAuth();

    console.log("🔍 PrivateRoute - User:", user, "Loading:", loading);
    if (loading) return <div>Loading...</div>;

    return user ? <Outlet /> : <Navigate to="/login" replace />;
};

export default PrivateRoute;