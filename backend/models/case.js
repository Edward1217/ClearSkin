const mongoose = require('mongoose');

const CaseSchema = new mongoose.Schema({
    patient: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',  // 与患者关联
        required: true,
    },
    doctor: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',  // 与医生关联
        required: true,
    },
    diagnosis: {
        type: String,
        required: true,
    },
    treatment: String,
    createdAt: {
        type: Date,
        default: Date.now,
    },
});

module.exports = mongoose.model('Case', CaseSchema);
