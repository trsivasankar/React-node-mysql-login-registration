import React from "react";
import ReactDOM from "react-dom/client";
import { AuthProvider } from './global_context/AuthContext';
import App from './App.jsx'

import './index.css';

ReactDOM.createRoot(document.getElementById('root')).render(
  <AuthProvider >
    <App />
  </AuthProvider >,
)
