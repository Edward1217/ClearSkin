import React, { useRef, useState, useEffect } from 'react';

const CameraCapture = ({ onCapture }) => {
    const videoRef = useRef(null);
    const canvasRef = useRef(null);
    const [hasPhoto, setHasPhoto] = useState(false);

    // Start the camera stream
    useEffect(() => {
        const startCamera = async () => {
            try {
                const stream = await navigator.mediaDevices.getUserMedia({ video: true });
                if (videoRef.current) {
                    videoRef.current.srcObject = stream;
                }
            } catch (error) {
                console.error('Error accessing the camera', error);
            }
        };

        startCamera();
    }, []);

    // Capture the photo
    const takePhoto = () => {
        const width = 400;
        const height = 320;

        let video = videoRef.current;
        let canvas = canvasRef.current;
        canvas.width = width;
        canvas.height = height;

        let ctx = canvas.getContext('2d');
        ctx.drawImage(video, 0, 0, width, height);

        // Convert canvas image to Blob and then to File
        canvas.toBlob((blob) => {
            const photoFile = new File([blob], `photo_${Date.now()}.png`, { type: 'image/png' });
            setHasPhoto(true);

            // Pass the captured image file to the parent component
            onCapture(photoFile);
        }, 'image/png');
    };

    // Close the photo preview
    const closePhoto = () => {
        let canvas = canvasRef.current;
        let ctx = canvas.getContext('2d');
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        setHasPhoto(false);
    };

    return (
        <div className="camera-container">
            <div className="video-container">
                <video ref={videoRef} autoPlay playsInline style={{width: '400px', height: '320px'}}></video>
                <button className ="btn btn-dark" onClick={takePhoto}>Take Photo</button>
            </div>

            <div className={'photo-container ' + (hasPhoto ? 'has-photo' : '')}>
                <canvas ref={canvasRef}></canvas>
                {hasPhoto && <button className ="btn btn-dark" onClick={closePhoto}>Discard</button>}
            </div>
        </div>
    );
};

export default CameraCapture;

