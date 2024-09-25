const mongoose = require('mongoose');

// 定义图片模型
const ImageSchema = new mongoose.Schema({
    imageUrl: {
        type: String,
        required: true,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },  // Reference to the user who uploaded the image
});

// 导出模型
module.exports = mongoose.model('Image', ImageSchema);
