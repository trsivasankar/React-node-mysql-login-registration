import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../global_context/AuthContext';  // ✅ Import useAuth
import axios from 'axios';

const Login = () => {
    const { login } = useAuth();  

    const [values, setValues] = useState({
        email: '',
        password: ''
    });

    const [errors, setErrors] = useState({}); // ✅ Store validation errors

    // ✅ Function to validate inputs before submitting
    const validateForm = () => {
        let errors = {};

        if (!values.email) {
            errors.email = "Email is required";
        } else if (!/\S+@\S+\.\S+/.test(values.email)) {
            errors.email = "Enter a valid email";
        }

        if (!values.password) {
            errors.password = "Password is required";
        } else if (values.password.length < 6) {
            errors.password = "Password must be at least 6 characters";
        }

        setErrors(errors);
        return Object.keys(errors).length === 0;
    };

    const navigate = useNavigate();

    const handleChanges = (e) => {
        setValues({ ...values, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (!validateForm()) return;
    
        try {
            const response = await axios.post("http://localhost:3000/auth/login", values);
            if (response.status === 200) {
                login(response.data.token, response.data.user);  
                localStorage.setItem("token", response.data.token);
                navigate("/", { replace: true });  
            }
        } catch (err) {
            if (err.response?.status === 401) {
                setErrors({ general: "❌ Invalid email or password" }); // ✅ Fix applied
            } else {
                setErrors({ general: "⚠️ Something went wrong. Try again." }); // ✅ Fix applied
            }
        }
    };

    return (
        <div className="h-screen flex justify-center items-center">
            <div className="shadow-lg px-8 py-5 border w-72">
                <h2 className="text-lg font-bold mb-4">Login</h2>
                <form onSubmit={handleSubmit}>
                    <div className="mb-4">
                        <label htmlFor="email" className="block text-gray-700">Email</label>
                        <input
                            type="email"
                            placeholder="Enter Email"
                            className="w-full px-3 py-2 border"
                            name="email"
                            onChange={handleChanges}
                        />
                        {errors.email && <p className="text-red-500 text-sm">{errors.email}</p>}
                    </div>
                    <div className="mb-4">
                        <label htmlFor="password" className="block text-gray-700">Password</label>
                        <input
                            type="password"
                            placeholder="Enter Password"
                            className="w-full px-3 py-2 border"
                            name="password"
                            onChange={handleChanges}
                        />
                        {errors.password && <p className="text-red-500 text-sm">{errors.password}</p>}
                    </div>
                    <button className="w-full bg-blue-700 text-white py-2">Submit</button>
                    
                    {/* General Error Message */}
                    {errors.general && (
                        <p className="text-red-500 text-sm text-center mt-2">{errors.general}</p>
                    )}
                </form>
                <div className="text-center mt-2">
                    <span>Don't have an account?</span>
                    <Link to="/register" className="text-blue-500 ml-1">Sign up</Link>
                </div>
            </div>
        </div>
    );
};

export default Login;
