const mongoose = require('mongoose');

const CaseSchema = new mongoose.Schema({
    doctor: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',  // 与医生关联
        required: true,
    },
    image: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Image',  // 关联图片信息，图片中包含患者信息
        required: true,
    },
    doctorDiagnosis: {
        type: String,
    },
    treatment: String,
    createdAt: {
        type: Date,
        default: Date.now,
    },
});

module.exports = mongoose.model('Case', CaseSchema);
