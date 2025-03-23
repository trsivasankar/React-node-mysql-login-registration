import axios from 'axios';
import React, { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from "../global_context/AuthContext"; // Ensure correct path

const Intro = () => {
    const { user, loading } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
       if (!loading && !user) {
         console.log("🚫 No user found, redirecting to login...");
         navigate("/login");
       }
     }, [user, loading, navigate]);

     if (loading) {
        return (
          <div className="h-screen flex justify-center items-center">
            <div className="w-16 h-16 border-4 border-gray-300 border-t-green-600 rounded-full animate-spin"></div>
          </div>
        );
      }

    return (
        <div>
            <div className="mt-8">
                <p className="text-sm text-gray-600 dark:text-neutral-400">
                    I am a seasoned graphic designer with over 14 years of experience in creating visually appealing and user-centric designs. My expertise spans across UI design, design systems, and custom illustrations, helping clients bring their digital visions to life.
                </p>

                <p className="mt-3 text-sm text-gray-600 dark:text-neutral-400">
                    Currently, I work remotely for Notion, where I design template UIs, convert them into HTML and CSS, and provide comprehensive support to our users. I am passionate about crafting elegant and functional designs that enhance user experiences.
                </p>

                <Link to='/register' className='text-blue-500'>Continue</Link>
            </div>
        </div>
    );
};

export default Intro;
