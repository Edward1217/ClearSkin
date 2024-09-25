import React, { useState } from "react";
import { storage } from '../pages/firebase.js';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { v4 } from 'uuid';
import imageService from '../services/imageService'; // Import the imageService

const ImageUploader = () => {
    const [imageUpload, setImageUpload] = useState(null);

    const uploadImage = async () => {
        if (imageUpload === null) return;

        // Upload to Firebase
        const imageRef = ref(storage, `images/${imageUpload.name + v4()}`);
        await uploadBytes(imageRef, imageUpload);
        const imageUrl = await getDownloadURL(imageRef);

        // Send image URL to backend using imageService
        try {
            await imageService.uploadImageUrl(imageUrl);
            alert('Image uploaded and URL saved successfully!');
        } catch (error) {
            console.error('Error uploading image:', error);
        }
    };

    return (
        <div>
            <input type="file" onChange={(event) => setImageUpload(event.target.files[0])} />
            <button onClick={uploadImage}>Upload Image</button>
        </div>
    );
};

export default ImageUploader;
