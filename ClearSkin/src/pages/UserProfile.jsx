import React, { useContext, useEffect, useState } from 'react';
import { UserContext } from '../context/UserContext';
import { Container, Card, Button } from 'react-bootstrap';
import axios from 'axios';

const UserProfile = () => {
    const { user } = useContext(UserContext); // 获取用户上下文
    const [images, setImages] = useState([]); // 保存照片信息
    const [error, setError] = useState(null); // 新增用于保存错误信息
    const [loading, setLoading] = useState(true); // 增加加载状态

    useEffect(() => {
        if (!user) return; // 确保用户信息已加载
        console.log('User in UserProfile:', user); // 调试输出用户信息

        const fetchImages = async () => {
            try {
                const token = localStorage.getItem('token'); // 从 localStorage 获取 token
                if (!token) {
                    throw new Error('No token found');
                }
                // 动态地将 `user.id` 传递给 `/api/image/:id`
                const response = await axios.get(`/api/image/${user.id}`, {
                    headers: {
                        Authorization: `Bearer ${token}`, // 使用用户token获取数据
                    },
                });
                setImages(response.data);
                setLoading(false); // 数据加载完毕
            } catch (error) {
                setError('Failed to fetch images');
                console.error('Error fetching images:', error);
                setLoading(false); // 即使出错，也要停止加载状态
            }
        };

        fetchImages();
    }, [user]);

    if (loading) {
        return <div>Loading...</div>; // 如果数据加载中，显示加载状态
    }

    if (error) {
        return <div className="text-danger">{error}</div>; // 如果出现错误，显示错误信息
    }

    const filteredImages = user.role === 'doctor'
        ? images // 医生能看到所有图片
        : images.filter(image => image.user._id === user._id); // 患者只能看到自己的图片

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
                                    {/* 输出图片 URL 以调试 */}
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
