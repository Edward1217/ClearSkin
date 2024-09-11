import React from 'react';
import {BrowserRouter as Router, Routes, Route, BrowserRouter} from 'react-router-dom';
import Navbar from './components/Navbar.jsx'
import SignUp from './pages/SignUp'; // Import the SignUp component
import Home from './pages/Home.jsx';
import SignIn from './pages/SignIn.jsx';
import About from './pages/About.jsx';
import Services from './pages/Services.jsx'

const App = () => {
    return (
        <BrowserRouter>
            <Navbar/>

            <Routes>
                <Route path="/" element={<Home/>}/>
                <Route path="/sign-up" element={<SignUp/>}/>
                <Route path="/sign-in" element={<SignIn/>}/>
                <Route path="/about" element={<About/>}/>
                <Route path="/services" element={<Services/>}/>
            </Routes>
        </BrowserRouter>
    );
};

export default App;
