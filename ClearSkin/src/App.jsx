import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar.jsx';
import SignUp from './pages/SignUp';
import Home from './pages/Home.jsx';
import SignIn from './pages/SignIn.jsx';
import Education from './pages/Education.jsx';
import Services from './pages/Services.jsx';
import UserProfile from './pages/UserProfile.jsx'
import EditProfile from './pages/EditProfile.jsx'
import { UserProvider } from './context/UserContext.jsx';

const App = () => {
    return (
        <UserProvider>
            <Router>
                <Navbar />
                <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/sign-up" element={<SignUp />} />
                    <Route path="/sign-in" element={<SignIn />} />
                    <Route path="/education" element={<Education />} />
                    <Route path="/services" element={<Services />} />
                    <Route path="/profile" element={<UserProfile />} />
                    <Route path="/edit-profile" element={<EditProfile />} />
                </Routes>
            </Router>
        </UserProvider>
    );
};

export default App;
