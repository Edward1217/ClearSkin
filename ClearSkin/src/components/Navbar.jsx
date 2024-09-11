import React, { useContext } from 'react';
import { Navbar, Container, Nav } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { UserContext } from '../context/UserContext.jsx'; // Import UserContext

const NavbarComponent = () => {
    const { userName } = useContext(UserContext); // Get userName from context

    return (
        <Navbar sticky="top" bg="dark" variant="dark" expand="lg">
            <Container>
                <Navbar.Brand href="/">Clear Skin</Navbar.Brand>
                <Navbar.Toggle aria-controls="basic-navbar-nav" />
                <Navbar.Collapse id="basic-navbar-nav">
                    <Nav className="ms-auto">
                        <Nav.Link as={Link} to="/">Home</Nav.Link>
                        <Nav.Link as={Link} to="/about">About</Nav.Link>
                        <Nav.Link as={Link} to="/services">Services</Nav.Link>
                        {/* Conditionally render user's name or SignIn */}
                        {userName ? (
                            <Nav.Link as={Link} to="/profile">Welcome, {userName}</Nav.Link>
                        ) : (
                            <Nav.Link as={Link} to="/sign-in">Sign In</Nav.Link>
                        )}
                    </Nav>
                </Navbar.Collapse>
            </Container>
        </Navbar>
    );
};

export default NavbarComponent;
