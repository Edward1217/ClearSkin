import React, { useContext } from 'react';
import { UserContext } from '../context/UserContext';
import { Container, Card, Button } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';

const UserProfile = () => {
    const { user } = useContext(UserContext); // Get user data from context
    const navigate = useNavigate();

    const handleEditProfile = () => {
        // Redirect to the profile edit page or implement editing functionality here
        navigate('/edit-profile');
    };

    // Redirect if the user is not logged in
    if (!user) {
        navigate('/sign-in');
        return null; // Prevent rendering if user is not logged in
    }

    return (
        <Container className="mt-5">
            <Card>
                <Card.Body>
                    <Card.Title>User Profile</Card.Title>
                    <Card.Text>
                        <strong>Name:</strong> {user.name} <br/>
                        <strong>Email:</strong> {user.username} <br/>
                        <strong>Role:</strong> {user.role} <br/>
                        <strong>Recent Upload Photos</strong>
                        {/* Add more user details as needed */}
                    </Card.Text>
                    <Button variant="primary" onClick={handleEditProfile}>Edit Profile</Button>
                </Card.Body>
            </Card>
        </Container>
    );
};

export default UserProfile;
