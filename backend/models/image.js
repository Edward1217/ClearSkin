const mongoose = require('mongoose');

const ImageSchema = new mongoose.Schema({
    imageUrl: {
        type: String,
        required: true,
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    modelDiagnosis: {
        type: String,
        required: true
    },
});

module.exports = mongoose.model('Image', ImageSchema);
