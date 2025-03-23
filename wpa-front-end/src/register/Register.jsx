import React, { useState } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';

const Register = () => {
    const [values, setValues] = useState({
        username: '',
        email: '',
        password: ''
    });
    const [errorMessage, setErrorMessage] = useState({});
    const [generalError, setGeneralError] = useState("");

    // ✅ Function to validate inputs before submitting
    const validateForm = () => {
        let errorMessage = {};

        if (!values.username.trim()) {
            errorMessage.username = "Username is required";
        } else if (values.username.length < 3) {
            errorMessage.username = "Username must be at least 3 characters";
        } else if (!/^[a-zA-Z0-9]+$/.test(values.username)) {
            errorMessage.username = "Username can only contain letters and numbers";
        }

        if (!values.email) {
            errorMessage.email = "Email is required";
        } else if (!/\S+@\S+\.\S+/.test(values.email)) {
            errorMessage.email = "Enter a valid email";
        }

        if (!values.password) {
            errorMessage.password = "Password is required";
        } else if (values.password.length < 6) {
            errorMessage.password = "Password must be at least 6 characters";
        }

        setErrorMessage(errorMessage);
        return Object.keys(errorMessage).length === 0; // Returns `true` if no errors
    };

    const navigate = useNavigate();

    const handleChange = (e) => {
        setValues({ ...values, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Prevent empty registration attempts
        if (!validateForm()) return;

        try {
            const response = await axios.post('http://localhost:3000/auth/register', values);
            if (response.status === 201) {
                alert("Registration successful! Redirecting to login...");
                navigate('/login');
            }
        } catch (err) {
            if (err.response?.status === 409) {
                setGeneralError("User already exists. Please login.");
            } else {
                setGeneralError("Something went wrong. Try again.");
            }
        }
    };

    return (
        <div className='flex justify-center items-center h-screen'>
            <div className='shadow-lg px-8 py-5 border w-72'>
                <h2 className='text-lg font-bold mb-4'>Register</h2>
                <form onSubmit={handleSubmit}>
                    <div className="mb-4">
                        <label htmlFor="username" className='block text-gray-700'>Username</label>
                        <input 
                            type="text" 
                            placeholder='Enter Username' 
                            className='w-full px-3 py-2 border'
                            name="username" 
                            onChange={handleChange} 
                        />
                        {errorMessage.username && <p className="text-red-500 text-sm">{errorMessage.username}</p>}
                    </div>
                    <div className="mb-4">
                        <label htmlFor="email" className='block text-gray-700'>Email</label>
                        <input 
                            type="email" 
                            placeholder='Enter Email' 
                            className='w-full px-3 py-2 border'
                            name="email" 
                            onChange={handleChange} 
                        />
                        {errorMessage.email && <p className="text-red-500 text-sm">{errorMessage.email}</p>}
                    </div>
                    <div className="mb-4">
                        <label htmlFor="password" className='block text-gray-700'>Password</label>
                        <input 
                            type="password" 
                            placeholder='Enter Password' 
                            className='w-full px-3 py-2 border'
                            name="password" 
                            onChange={handleChange} 
                        />
                         {errorMessage.password && <p className="text-red-500 text-sm">{errorMessage.password}</p>}
                    </div>
                    <button type="submit" className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-2 rounded-lg transition duration-300">Submit</button>
                </form>
                 {/* Error Message */}
                 {generalError && (
    <div className="text-red-500 text-center mt-2">{generalError}</div>
)}
                <div className="text-center mt-2">
                    <span>Already have an account?</span>
                    <Link to='/login' className='text-blue-500 ml-1'>Login</Link>
                </div>
            </div>
        </div>
    );
};

export default Register;
