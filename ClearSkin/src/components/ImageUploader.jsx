import React, { useState, useCallback, useEffect } from "react";
import { useUser } from '../context/UserContext';
import { storage } from '../firebase/firebase.js';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { v4 } from 'uuid';
import imageService from '../services/imageService';

const ImageUploader = ({ capturedImage }) => {
    const [imageUpload, setImageUpload] = useState(null);
    const [uploadSuccess, setUploadSuccess] = useState(false);
    const [error, setError] = useState(null);
    const { user } = useUser();

    // 当 capturedImage 变化时，自动设置 imageUpload
    useEffect(() => {
        if (capturedImage) {
            setImageUpload(capturedImage);
        }
    }, [capturedImage]);

    const uploadImage = useCallback(async () => {
        if (!imageUpload) return;

        if (!user || !user.id) {
            setError('User not found. Please log in.');
            return;
        }

        try {
            const imageRef = ref(storage, `images/${imageUpload.name + v4()}`);

            // 如果 imageUpload 是 File 对象，直接上传
            await uploadBytes(imageRef, imageUpload);

            const imageUrl = await getDownloadURL(imageRef);

            // Send image URL to backend
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
            {!capturedImage && (
                <input
                    type="file"
                    onChange={(e) => setImageUpload(e.target.files[0])}
                />
            )}
            <button onClick={uploadImage}>Upload Image</button>
            {uploadSuccess && <p>Image uploaded successfully!</p>}
            {error && <p className="text-danger">{error}</p>}
        </div>
    );
};

export default ImageUploader;
