import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar.jsx';
import SignUp from './pages/SignUp';
import Home from './pages/Home.jsx';
import SignIn from './pages/SignIn.jsx';
import About from './pages/About.jsx';
import Services from './pages/Services.jsx';
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
                    <Route path="/about" element={<About />} />
                    <Route path="/services" element={<Services />} />
                </Routes>
            </Router>
        </UserProvider>
    );
};

export default App;
