import React, { useContext, useEffect, useState } from 'react';
import { UserContext } from '../context/UserContext';
import { Container, Card, Button } from 'react-bootstrap';
import axios from 'axios';

const UserProfile = () => {
    const { user } = useContext(UserContext); // 获取用户上下文
    const [images, setImages] = useState([]); // 保存照片信息

    useEffect(() => {
        if (!user) return; // 确保用户信息已加载
        console.log('User in UserProfile:', user); // 调试输出用户信息

        // 获取所有图片及上传者信息
        const fetchImages = async () => {
            try {
                const response = await axios.get('/api/images', {
                    headers: {
                        Authorization: `Bearer ${user.token}`, // 使用用户token获取数据
                    },
                });
                setImages(response.data);
            } catch (error) {
                console.error('Error fetching images:', error);
            }
        };

        fetchImages();
    }, [user]);

    if (!user) {
        return <div>Loading...</div>; // 如果用户信息尚未加载，显示加载状态
    }

    const filteredImages = user.role === 'doctor'
        ? images // 医生能看到所有图片
        : images.filter(image => image.user._id === user.id); // 患者只能看到自己的图片

    return (
        <Container className="mt-5">
            <Card>
                <Card.Body>
                    <Card.Title>{user.role === 'doctor' ? 'Doctor Profile' : 'Patient Profile'}</Card.Title>

                    <Card.Text>
                        <strong>Name:</strong> {user.name || 'N/A'} <br/>
                        <strong>Email:</strong> {user.username || 'N/A'} <br/>
                        <strong>Role:</strong> {user.role || 'N/A'} <br/>
                    </Card.Text>

                    {/* 显示图片及上传者信息 */}
                    {filteredImages.length > 0 ? (
                        <div className="image-gallery">
                            {filteredImages.map(image => (
                                <div key={image._id} className="image-item">
                                    <img src={image.imageUrl} alt="Uploaded" style={{ width: '150px', marginRight: '10px' }} />
                                    <p>Uploaded by: {image.user.name} ({image.user.username})</p>
                                    <p>Uploaded at: {new Date(image.createdAt).toLocaleString()}</p>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <p>No images found.</p>
                    )}

                    <Button variant="primary">Edit Profile</Button>
                </Card.Body>
            </Card>
        </Container>
    );
};
export default UserProfile;
