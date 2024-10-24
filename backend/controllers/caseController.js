const express = require('express');
const Case = require('../models/case');
const Image = require('../models/image'); // 导入 Image 模型
const router = express.Router();

router.post('/save', async (req, res) => {
    const { imageId, modelDiagnosis, secondModelDiagnosis, treatment } = req.body; // 使用 imageId

    if (!req.user || req.user.role !== 'doctor') {
        return res.status(403).json({ error: 'Only doctors can create cases.' });
    }

    try {
        let finalDiagnosis = modelDiagnosis;

        // 如果有第二次诊断，将其添加到诊断字段
        if (secondModelDiagnosis) {
            finalDiagnosis += ` | Second Diagnosis: ${secondModelDiagnosis}`;
        }

        // 确保 imageId 对应的图片存在
        const image = await Image.findById(imageId);
        if (!image) {
            return res.status(404).json({ error: 'Image not found' });
        }

        const newCase = new Case({
            doctor: req.user._id,
            image: imageId,  // 保存图片的 ObjectId
            modelDiagnosis: finalDiagnosis,  // 保存模型诊断结果
            treatment,
        });

        await newCase.save();
        res.status(201).json(newCase);
    } catch (error) {
        console.error('Error saving case:', error);
        res.status(500).json({ error: 'Server error' });
    }
});
// 获取患者的病例信息
router.get('/patient/:patientId', async (req, res) => {
    if (!req.user || req.user.role !== 'patient') {
        return res.status(403).json({ error: 'Only patients can view their cases.' });
    }

    try {
        const cases = await Case.find()
            .populate('doctor', 'name')
            .populate({
                path: 'image',
                populate: { path: 'user', select: 'name' }  // 填充 image 中的 user 信息
            });

        // 只返回属于该患者的病例
        const patientCases = cases.filter(c => c.image.user._id.toString() === req.params.patientId);

        res.json(patientCases);
    } catch (error) {
        console.error('Error fetching cases:', error);
        res.status(500).json({ error: 'Server error' });
    }
});

// 创建病例
router.post('/', async (req, res) => {
    const { doctorDiagnosis, modelDiagnosis, treatment, imageId } = req.body; // 使用 imageId

    if (!req.user || req.user.role !== 'doctor') {
        return res.status(403).json({ error: 'Only doctors can create cases.' });
    }

    // 检查必填项
    if (!doctorDiagnosis || !imageId) {
        return res.status(400).json({ error: 'Doctor diagnosis and image ID are required.' });
    }

    try {
        // 检查图片是否存在
        const image = await Image.findById(imageId).populate('user');
        if (!image) {
            return res.status(404).json({ error: 'Image not found' });
        }

        const newCase = new Case({
            doctor: req.user._id,
            image: imageId,  // 引用图片的 ObjectId
            doctorDiagnosis,
            modelDiagnosis,
            treatment,
        });

        await newCase.save();
        res.status(201).json(newCase);
    } catch (error) {
        console.error('Error creating case:', error);
        res.status(500).json({ error: 'Server error' });
    }
});


// 获取当前登录患者的病例信息
router.get('/patient', async (req, res) => {
    if (!req.user || req.user.role !== 'patient') {
        return res.status(403).json({ error: 'Only patients can view their cases.' });
    }

    try {
        const cases = await Case.find()
            .populate('doctor', 'name')
            .populate({
                path: 'image',
                populate: { path: 'user', select: 'name' }  // 填充 image 中的 user 信息
            });

        // 只返回属于当前患者的病例
        const patientCases = cases.filter(c => c.image.user._id.toString() === req.user._id.toString());

        res.json(patientCases);
    } catch (error) {
        console.error('Error fetching cases:', error);
        res.status(500).json({ error: 'Server error' });
    }
});

// 获取医生的病例列表
router.get('/', async (req, res) => {
    if (!req.user || req.user.role !== 'doctor') {
        return res.status(403).json({ error: 'Access denied.' });
    }

    try {
        const cases = await Case.find({ doctor: req.user._id })
            .populate({
                path: 'image',
                populate: { path: 'user', select: 'name' }  // 填充 image 中的 user 信息
            });

        res.json(cases);
    } catch (error) {
        console.error('Error fetching cases:', error);
        res.status(500).json({ error: 'Server error' });
    }
});


module.exports = router;
