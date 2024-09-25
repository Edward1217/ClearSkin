const express = require('express');
const Image = require('../models/Image'); // 引入模型
const router = express.Router();
const authMiddleware = require('../utils/authMiddleware'); // 引入身份验证中间件

// 使用身份验证中间件来确保用户登录
router.use(authMiddleware);

// 保存图片 URL 到数据库，关联用户
router.post('/images', async (req, res) => {
    const { imageUrl } = req.body;

    if (!imageUrl) {
        return res.status(400).json({ error: 'Image URL is required' });
    }

    try {
        // 获取当前用户的 ID
        const user = req.user; // 假设 authMiddleware 将用户信息附加到 req 对象

        // 创建新图片，并将当前用户的 ID 关联
        const newImage = new Image({
            imageUrl,
            user: user._id // 将当前用户的 ID 关联到图片
        });

        await newImage.save();
        res.status(201).json({ message: 'Image URL saved successfully' });
    } catch (error) {
        console.error('Error saving image URL:', error);
        res.status(500).json({ error: 'Error saving image URL' });
    }
});

// 获取所有图片 URL，并按用户过滤
router.get('/images', async (req, res) => {
    try {
        // 获取当前用户的 ID
        const user = req.user;

        // 查询与该用户相关联的所有图片
        const images = await Image.find({ user: user._id }).sort({ createdAt: -1 });  // 按创建时间倒序排列

        res.status(200).json(images);
    } catch (error) {
        console.error('Error fetching images:', error);
        res.status(500).json({ error: 'Error fetching images' });
    }
});

module.exports = router;
