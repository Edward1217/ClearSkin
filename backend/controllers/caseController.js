const express = require('express');
const Case = require('../models/case');
const router = express.Router();

// 创建病例
router.post('/', async (req, res) => {
    const { patientId, diagnosis, treatment } = req.body;

    if (!req.user || req.user.role !== 'doctor') {
        return res.status(403).json({ error: 'Only doctors can create cases.' });
    }

    try {
        const newCase = new Case({
            patient: patientId,
            doctor: req.user._id,
            diagnosis,
            treatment,
        });
        await newCase.save();
        res.status(201).json(newCase);
    } catch (error) {
        console.error('Error creating case:', error);
        res.status(500).json({ error: 'Server error' });
    }
});

// 获取医生的病例列表
router.get('/', async (req, res) => {
    if (!req.user || req.user.role !== 'doctor') {
        return res.status(403).json({ error: 'Access denied.' });
    }

    try {
        const cases = await Case.find({ doctor: req.user._id }).populate('patient', 'name');
        res.json(cases);
    } catch (error) {
        console.error('Error fetching cases:', error);
        res.status(500).json({ error: 'Server error' });
    }
});

module.exports = router;
