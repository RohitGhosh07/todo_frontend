import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { GoogleOAuthProvider } from '@react-oauth/google';
import Login from './pages/login';
import SignUp from './pages/signup';
import Home from './pages/home';

const CLIENT_ID = '888490493099-8bnctuk90n2a5c8hj8p09c3jndk5a5fs.apps.googleusercontent.com';

const App = () => {
  return (
    <GoogleOAuthProvider clientId={CLIENT_ID}>
      <Router>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/home" element={<Home />} />
        </Routes>
      </Router>
    </GoogleOAuthProvider>
  );
};

export default App;
