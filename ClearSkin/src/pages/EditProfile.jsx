import React, { useContext, useState } from 'react';
import { UserContext } from '../context/UserContext';
import { Container, Form, Button } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';

const EditProfile = () => {
    const { user, setUser } = useContext(UserContext);
    const [name, setName] = useState(user ? user.name : '');
    const [email, setEmail] = useState(user ? user.email : '');
    const navigate = useNavigate();

    const handleSave = () => {
        // Update user context or make API call to save changes
        setUser({ ...user, name, email });
        navigate('/profile'); // Redirect back to profile page
    };

    return (
        <Container className="mt-5">
            <h2>Edit Profile</h2>
            <Form>
                <Form.Group controlId="formBasicName">
                    <Form.Label>Name</Form.Label>
                    <Form.Control
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                    />
                </Form.Group>

                <Form.Group controlId="formBasicEmail">
                    <Form.Label>Email</Form.Label>
                    <Form.Control
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />
                </Form.Group>

                <Button variant="primary" onClick={handleSave}>
                    Save Changes
                </Button>
            </Form>
        </Container>
    );
};

export default EditProfile;
