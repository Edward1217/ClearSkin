const express = require('express');
const multer = require('multer');
const axios = require('axios');
const fs = require('fs');
const path = require('path');
const Image = require('../models/image');
const FormData = require('form-data');
const authMiddleware = require('../utils/authMiddleware');  // Middleware for authentication
const router = express.Router();

// Set up multer for file handling
const upload = multer({ dest: 'uploads/' });

// Save image URL route
router.post('/',  async (req, res) => {
    const { imageUrl, modelDiagnosis } = req.body;  // Now also receiving modelDiagnosis

    if (!imageUrl || !modelDiagnosis) {
        return res.status(400).json({ error: 'Image URL and diagnosis are required' });
    }

    try {
        const newImage = new Image({
            imageUrl,
            user: req.user.id,  // Use req.user.id extracted from the JWT token
            modelDiagnosis,      // Save the diagnosis result
        });

        await newImage.save();
        console.log('Image URL and diagnosis saved to the database');
        res.status(201).json({ message: 'Image URL and diagnosis saved successfully!' });
    } catch (error) {
        console.error('Error saving image URL and diagnosis:', error);
        res.status(500).json({ error: 'Server error while saving image URL and diagnosis' });
    }
});

router.post('/analyze',  upload.single('image'), async (req, res) => {
    if (!req.file) {
        return res.status(400).json({ error: 'No image file received' });
    }

    try {
        const filePath = req.file.path;
        console.log('File path received: ', filePath);

        const formData = new FormData();
        formData.append('image', fs.createReadStream(filePath));

        // Call the first model API for analysis
        const response = await axios.post('https://clearskin-0c4j.onrender.com/analyze', formData, {
            headers: formData.getHeaders(),
        });

        const result = response.data.result;
        console.log('First model result:', result);

        let finalDiagnosis = result;

        // If the result is Benign, call the second model for further diagnosis
        if (result === 'Benign') {
            console.log('Running second model for further diagnosis...');
            const secondResponse = await axios.post('https://clearskin-0c4j.onrender.com/analyze_cnn', formData, {
                headers: formData.getHeaders(),
            });

            const secondResult = secondResponse.data.result;
            console.log('Second model result:', secondResult);
            finalDiagnosis += ` | Second Diagnosis: ${secondResult}`;
        }

        // Save the image URL and final diagnosis to the database only once



          // Ensure the image and diagnosis are only saved once
        res.status(200).json({ analysisResult: finalDiagnosis });
    } catch (error) {
        console.error('Error in image analysis:', error);
        res.status(500).json({ error: 'Error analyzing image' });
    }
});


router.get('/:id',  async (req, res) => {
    const userId = req.params.id;
    try {
        const images = await Image.find({ user: userId }).populate('user', 'name username');
        if (!images.length) {
            return res.status(404).json({ message: 'No images found for this user' });
        }
        res.status(200).json(images);
    } catch (error) {
        console.error('Error fetching images for user:', error);
        res.status(500).json({ error: 'Failed to fetch images for user' });
    }
});

module.exports = router;
