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
    const [analysisResult, setAnalysisResult] = useState(null);  // 保存分析结果
    const [isLoading, setIsLoading] = useState(false); // Loading state for feedback

    // 当 capturedImage 变化时，自动设置 imageUpload
    useEffect(() => {
        if (capturedImage) {
            setImageUpload(capturedImage);
        }
    }, [capturedImage]);

    const uploadImage = useCallback(async () => {
        if (!imageUpload) return;
        setIsLoading(true);  // Set loading to true when upload starts
        setError(null);  // Clear previous errors

        if (!user || !user.id) {
            setError('User not found. Please log in.');
            return;
        }

        try {
            const imageRef = ref(storage, `images/${imageUpload.name + v4()}`);

            // 如果 imageUpload 是 File 对象，直接上传到 Firebase
            await uploadBytes(imageRef, imageUpload);

            // 获取上传图片的 URL
            const imageUrl = await getDownloadURL(imageRef);

            // 发送图片 URL 到后端保存
            await imageService.uploadImageUrl(imageUrl);

            // 将图片文件发送到后端 /analyze 路由进行分析
            const formData = new FormData();
            formData.append('image', imageUpload);  // 传入图片文件
            console.log('FormData: ', formData.get('image'));

            const analysisResponse = await imageService.analyzeImage(formData);  // 发送到 /analyze 路由

            // 将分析结果保存并显示
            setAnalysisResult(analysisResponse.analysisResult);
            setUploadSuccess(true);
        } catch (err) {
            console.error('Error uploading image:', err);
            setError('Error uploading image to backend.');
        } finally {
            setIsLoading(false);  // Stop loading when operation is done
        }
    }, [imageUpload, user]);
    const ImageUploaderButton = ({ uploadImage, isLoading }) => {
        return (
            <button className="btn btn-dark"
                    onClick={uploadImage}
                    disabled={isLoading}
                    style={{ width: '150px', marginLeft: '10px' }}>
                {isLoading ? "Uploading..." : "Upload Image"}
            </button>
        );
    };

    return (
        <div style={{ display: 'flex', justifyContent: 'center', flexDirection: 'column',alignItems: 'center' }}>
            {!capturedImage && (
                <div className="p-1" style={{display: 'flex', justifyContent: 'center', alignItems: 'center'}}>
                    <label htmlFor="fileInput" className="btn btn-dark" style={{width: '150px'}}>Choose File</label>
                    <input
                        type="file"
                        id="fileInput"
                        style={{display: "none"}}
                        onChange={(e) => setImageUpload(e.target.files[0])}
                    />
                    <button className="btn btn-dark" onClick={uploadImage}
                            style={{width: '150px', marginLeft: '10px'}}>Upload Image
                    </button>
                </div>


            )}
            <div>
                {/*<button className="btn btn-dark" onClick={uploadImage}*/}
                {/*        style={{width: '150px', marginLeft: '10px'}}>Upload Image*/}
                {/*</button>*/}
                {capturedImage && <button className="btn btn-dark" onClick={uploadImage}
                                          style={{width: '150px', marginLeft: '10px'}}>Upload Image
                </button>}

            </div>

            {uploadSuccess && (
                <div className="alert alert-success mt-3" style={{ maxWidth: '600px', textAlign: 'center', borderRadius: '10px', padding: '20px', border: '1px solid #28a745' }}>
                    <h5><strong>Image uploaded successfully!</strong></h5>
                    <p>Your current skin condition appears to be <strong>{analysisResult}</strong>. Please note that this app does not guarantee 100% accuracy.</p>
                    <p>If you receive a <strong className="text-danger">malignant</strong> result, we strongly recommend consulting a medical professional for further evaluation and guidance.</p>
                </div>
            )}
            {error && <p className="text-danger">{error}</p>}
        </div>
    );
};

export default ImageUploader;
