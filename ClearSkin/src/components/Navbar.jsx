import React, { useContext } from 'react';
import { Navbar, Container, Nav, Dropdown } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import { UserContext } from '../context/UserContext';

const NavbarComponent = () => {
    const { user, setUser } = useContext(UserContext); // 从上下文中获取 user 和 setUser
    const navigate = useNavigate();

    const handleLogout = () => {
        // 清除 localStorage 和上下文中的用户数据
        localStorage.removeItem('token');
        localStorage.removeItem('user'); // 改为 'user'，因为我们存储的是 'user' 对象
        setUser(null);

        // 注销后重定向到登录页面
        navigate('/sign-in');
    };

    return (
        <Navbar sticky="top" bg="dark" variant="dark" expand="lg" className="py-3 px-4">
            <Container>
                <Navbar.Brand as={Link} to="/">Clear Skin</Navbar.Brand>
                <Navbar.Toggle aria-controls="basic-navbar-nav" />
                <Navbar.Collapse id="basic-navbar-nav">
                    <Nav className="ms-auto">
                        <Nav.Link as={Link} to="/">Home</Nav.Link>
                        <Nav.Link as={Link} to="/about">About</Nav.Link>
                        <Nav.Link as={Link} to="/services">Services</Nav.Link>

                        {user && user.name ? (
                            <Dropdown alignRight>
                                <Dropdown.Toggle variant="secondary" id="dropdown-basic">
                                    Welcome, {user.name}
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
