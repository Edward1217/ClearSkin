import React, { useState, useCallback, useEffect } from "react";
import { useUser } from '../context/UserContext';
import { storage } from '../firebase/firebase';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { v4 } from 'uuid';
import imageService from '../services/imageService';

const ImageUploader = ({ capturedImage }) => {
    const [imageUpload, setImageUpload] = useState(null);
    const [uploadSuccess, setUploadSuccess] = useState(false);
    const [error, setError] = useState(null);
    const { user } = useUser();
    const [analysisResult, setAnalysisResult] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [secondAnalysisResult, setSecondAnalysisResult] = useState(null);

    useEffect(() => {
        if (capturedImage) {
            setImageUpload(capturedImage);
        }
    }, [capturedImage]);

    const handleImageUpload = async () => {
        const imageRef = ref(storage, `images/${imageUpload.name + v4()}`);
        await uploadBytes(imageRef, imageUpload);
        return await getDownloadURL(imageRef);
    };

    const handleImageAnalysis = async (formData) => {
        const analysisResponse = await imageService.analyzeImage(formData);
        setAnalysisResult(analysisResponse.analysisResult);
        let finalDiagnosis = analysisResponse.analysisResult;

        if (analysisResponse.analysisResult === "Benign") {
            setIsLoading(true);
            const secondAnalysisResponse = await imageService.analyzeImageCnn(formData);
            setSecondAnalysisResult(secondAnalysisResponse.analysisResult);
            finalDiagnosis += ` | Second Diagnosis: ${secondAnalysisResponse.analysisResult}`;
        }
        return finalDiagnosis;
    };

    const uploadImage = useCallback(async () => {
        if (!imageUpload) return;
        setIsLoading(true);
        setError(null);

        if (!user || !user.id) {
            setError('User not found. Please log in.');
            setIsLoading(false);
            return;
        }

        try {
            const imageUrl = await handleImageUpload();
            const formData = new FormData();
            formData.append('image', imageUpload);

            const finalDiagnosis = await handleImageAnalysis(formData);

            await imageService.uploadImageUrl({
                imageUrl,
                modelDiagnosis: finalDiagnosis,
            });

            setUploadSuccess(true);
        } catch (err) {
            console.error('Error uploading image:', err);
            setError('Error uploading image to backend.');
        } finally {
            setIsLoading(false);
        }
    }, [imageUpload, user]);

    return (
        <div style={{ display: 'flex', justifyContent: 'center', flexDirection: 'column', alignItems: 'center' }}>
            {!capturedImage && (
                <div className="p-1" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                    <label htmlFor="fileInput" className="btn btn-dark" style={{ width: '150px' }}>Choose File</label>
                    <input
                        type="file"
                        id="fileInput"
                        style={{ display: "none" }}
                        onChange={(e) => setImageUpload(e.target.files[0])}
                    />
                    <button className="btn btn-dark" onClick={uploadImage}
                            style={{ width: '150px', marginLeft: '10px' }} disabled={isLoading}>
                        {isLoading ? 'Uploading...' : 'Upload Image'}
                    </button>
                </div>
            )}

            <div>
                {capturedImage && <button className="btn btn-dark" onClick={uploadImage}
                                          style={{ width: '150px', marginLeft: '10px' }} disabled={isLoading}>
                    {isLoading ? 'Uploading...' : 'Upload Image'}
                </button>}
            </div>

            {uploadSuccess && (
                <div className="alert alert-success mt-3" style={{ maxWidth: '600px', textAlign: 'center', borderRadius: '10px', padding: '20px', border: '1px solid #28a745' }}>
                    <h5><strong>Image uploaded successfully!</strong></h5>
                    <p>Your current skin condition appears to be <strong>{analysisResult}</strong>. Please note that this app does not guarantee 100% accuracy.</p>
                    {analysisResult === "Benign" ? (
                        <>
                            <p>Performing a second analysis for more accuracy...</p>
                            {secondAnalysisResult && (
                                <p>Your second analysis result is: <strong>{secondAnalysisResult}</strong>.</p>
                            )}
                        </>
                    ) : (
                        <p>If you receive a <strong className="text-danger">malignant</strong> result, we strongly recommend consulting a medical professional for further evaluation and guidance.</p>
                    )}
                </div>
            )}
            {error && <p className="text-danger">{error}</p>}
            {isLoading && <p>Processing your image, please wait...</p>}  {/* 显示加载提示 */}
        </div>
    );
};

export default ImageUploader;
