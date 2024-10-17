const express = require('express');
const multer = require('multer');
const axios = require('axios');
const fs = require('fs');
const path = require('path');
const Image = require('../models/image');
const FormData = require('form-data');
const authMiddleware = require('../utils/authMiddleware');  // Middleware for authentication
const router = express.Router();

// 设置 multer 接收文件
const upload = multer({ dest: 'uploads/' });

router.post('/',async (req, res) => {
    const { imageUrl } = req.body;  // Only get the imageUrl from the request body


    if (!imageUrl) {
        return res.status(400).json({ error: 'Image URL is required' });
    }

    try {
        // Create a new Image instance using user from req.user (extracted from JWT)
        const newImage = new Image({
            imageUrl,   // The image URL as a string
            user: req.user.id,  // Use req.user.id extracted from the JWT token
        });

        await newImage.save();  // Save to database
        console.log('Image URL saved to the database');

        res.status(201).json({ message: 'Image URL saved successfully!' });
    } catch (error) {
        console.error('Error saving image URL:', error);
        res.status(500).json({ error: 'Server error while saving image URL' });
    }
});

router.get('/:id', async (req, res) => {
    try {
        const userId = req.params.id;  // 获取 URL 中的用户 ID
        console.log('Fetching images for user:', userId);

        // 通过 userId 找到该用户上传的所有图片
        const images = await Image.find({ user: userId }).populate('user', 'name username');

        // 打印 images，确保找到的数据是正确的
        console.log('Found images:', images);

        res.status(200).json(images);
    } catch (error) {
        console.error('Error fetching images for user:', error);
        res.status(500).json({ error: 'Failed to fetch images for user' });
    }
});


// 处理图片上传并分析
router.post('/analyze', upload.single('image'), async (req, res) => {
    if (!req.file) {
        return res.status(400).json({ error: 'No image file received' });
    }

    try {
        const filePath = req.file.path;  // 获取 multer 保存的文件路径
        console.log('File path received: ', filePath);

        const formData = new FormData();
        formData.append('image', fs.createReadStream(filePath));  // 读取文件并附加到 FormData

        // 调用 Flask API 进行分析
        const response = await axios.post('https://clearskin-0c4j.onrender.com/analyze', formData, {
            headers: formData.getHeaders(),
        });

        const result = response.data.result;
        res.status(200).json({ analysisResult: result });
    } catch (error) {
        console.error('Error in image analysis:', error);
        res.status(500).json({ error: 'Error analyzing image' });
    }
});

module.exports = router;
