import React, { useState, useCallback } from "react";
import { useUser } from '../context/UserContext';
import { storage } from '../pages/firebase';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { v4 } from 'uuid';
import imageService from '../services/imageService';

const ImageUploader = ({ capturedImage }) => {
    const [imageUpload, setImageUpload] = useState(capturedImage || null);
    const [uploadSuccess, setUploadSuccess] = useState(false);
    const [error, setError] = useState(null);
    const { user } = useUser(); // Access user.id and user.name

    const uploadImage = useCallback(async () => {
        if (!imageUpload) return;

        if (!user || !user.id) {
            setError('User not found. Please log in.');
            return;
        }

        try {
            const imageRef = ref(storage, `images/${imageUpload.name + v4()}`);
            await uploadBytes(imageRef, imageUpload);
            const imageUrl = await getDownloadURL(imageRef);

            // Send image URL and user ID to backend
            await imageService.uploadImageUrl(imageUrl);
            setUploadSuccess(true);
            setError(null);
        } catch (err) {
            console.error('Error uploading image:', err);
            setError('Error uploading image to backend.');
        }
    }, [imageUpload, user]);

    return (
        <div>
            <input
                type="file"
                onChange={(e) => setImageUpload(e.target.files[0])}
            />
            <button onClick={uploadImage}>Upload Image</button>
            {uploadSuccess && <p>Image uploaded successfully!</p>}
            {error && <p className="text-danger">{error}</p>}
        </div>
    );
};

export default ImageUploader;
