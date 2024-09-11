import React, { useContext } from 'react';
import { Navbar, Container, Nav, Dropdown } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import { UserContext } from '../context/UserContext';

const NavbarComponent = () => {
    const { userName, setUserName } = useContext(UserContext); // Get userName and setUserName from context
    const navigate = useNavigate();

    const handleLogout = () => {
        // Clear user data from localStorage and context
        localStorage.removeItem('token');
        localStorage.removeItem('name');
        setUserName(null);

        // Redirect to home or sign-in page after logout
        navigate('/sign-in');
    };

    return (
        <Navbar sticky="top" bg="dark" variant="dark" expand="lg">
            <Container>
                <Navbar.Brand as={Link} to="/">Clear Skin</Navbar.Brand>
                <Navbar.Toggle aria-controls="basic-navbar-nav" />
                <Navbar.Collapse id="basic-navbar-nav">
                    <Nav className="ms-auto">
                        <Nav.Link as={Link} to="/">Home</Nav.Link>
                        <Nav.Link as={Link} to="/about">About</Nav.Link>
                        <Nav.Link as={Link} to="/services">Services</Nav.Link>

                        {userName ? (
                            <Dropdown alignRight>
                                <Dropdown.Toggle variant="secondary" id="dropdown-basic">
                                    Welcome, {userName}
                                </Dropdown.Toggle>

                                <Dropdown.Menu>
                                    <Dropdown.Item as={Link} to="/profile">Profile</Dropdown.Item>
                                    <Dropdown.Divider />
                                    <Dropdown.Item onClick={handleLogout}>Logout</Dropdown.Item>
                                </Dropdown.Menu>
                            </Dropdown>
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
