import React, { useContext, useEffect, useState } from 'react';
import { UserContext } from '../context/UserContext';
import { Container, Card, Button, Row, Col } from 'react-bootstrap';
import axios from 'axios';

const UserProfile = () => {
    const { user } = useContext(UserContext); // 获取用户上下文
    const [images, setImages] = useState([]); // 保存图片信息
    const [error, setError] = useState(null); // 保存错误信息
    const [loading, setLoading] = useState(true); // 加载状态

    useEffect(() => {
        if (!user) return; // 确保用户信息已加载

        const fetchImages = async () => {
            try {
                const token = localStorage.getItem('token'); // 从 localStorage 获取 token
                if (!token) {
                    throw new Error('No token found');
                }

                // 发送请求以获取图片
                const response = await axios.get(`/api/image/${user.id}`, {
                    headers: {
                        Authorization: `Bearer ${token}`, // 使用用户 token 获取数据
                    },
                });

                setImages(response.data);
            } catch (error) {
                setError('Failed to fetch images');
                console.error('Error fetching images:', error);
            } finally {
                setLoading(false); // 无论成功或失败，停止加载状态
            }
        };

        fetchImages();
    }, [user]);

    // Loading 状态
    if (loading) {
        return (
            <Container className="d-flex justify-content-center mt-5">
                <Spinner animation="border" role="status">
                    <span className="sr-only">Loading...</span>
                </Spinner>
            </Container>
        );
    }

    // 错误状态
    if (error) {
        return (
            <Container className="mt-5">
                <Alert variant="danger">
                    <Alert.Heading>Error</Alert.Heading>
                    <p>{error}</p>
                </Alert>
            </Container>
        );
    }

    // 根据用户角色筛选图片 (医生可以看到所有图片，患者只能看到自己的图片)
    const filteredImages = user.role === 'doctor'
        ? images // 医生可以看到所有图片
        : images.filter(image => image.user._id === user._id); // 患者只能看到自己的图片

    // 过滤掉没有 imageUrl 的图片
    const validImages = filteredImages.filter(image => image.imageUrl);

    return (
        <Container className="mt-5">
            <Card>
                <Card.Body>
                    <Card.Title>{user.role === 'doctor' ? 'Doctor Profile' : 'Patient Profile'}</Card.Title>

                    <Card.Text>
                        <strong>Name:</strong> {user.name || 'N/A'} <br />
                        <strong>Email:</strong> {user.username || 'N/A'} <br />
                        <strong>Role:</strong> {user.role || 'N/A'} <br />
                    </Card.Text>

                    {/* 显示图片及上传者信息 */}
                    {filteredImages.length > 0 ? (
                        <div className="image-gallery">
                            {filteredImages.map(image => (
                                <Row key={image._id} className="mb-4"> {/* Add Row with margin for spacing */}
                                    <Col xs={12} md={4}> {/* First column for the image */}
                                        <img
                                            src={image.imageUrl}
                                            alt="Uploaded"
                                            style={{ width: '100%', height: 'auto' }}
                                        />
                                    </Col>
                                    <Col xs={6} md={4}> {/* Second column for uploader info */}
                                        <p><strong>Uploaded by:</strong> {image.user.name} ({image.user.username})</p>
                                    </Col>
                                    <Col xs={6} md={4}> {/* Third column for upload time */}
                                        <p><strong>Uploaded at:</strong> {new Date(image.createdAt).toLocaleString()}</p>
                                    </Col>
                                </Row>
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
