import React, { useState } from "react";
import CameraCapture from "../components/CameraCapture";
import ImageUploader from '../components/ImageUploader';

export default function Evaluate() {
    const [capturedPhoto, setCapturedPhoto] = useState(null);

    // Handle the capture from CameraCapture
    const handleCapture = (photoFile) => {
        setCapturedPhoto(photoFile);
    };

    return (
        <div className="container-fluid bg-white hero-header mb-5">
            <div className="container">
                <div className="row g-5 mt-5">
                    <div className="col-md-6 col-sm-12" id="capture from camera">
                        <div className="card-body text-center">
                            <h1>Capture Photo with Webcam</h1>
                            <CameraCapture onCapture={handleCapture} />
                        </div>
                        <div>
                            {capturedPhoto && (
                                <ImageUploader capturedImage={capturedPhoto} />
                            )}
                        </div>
                    </div>

                    <div className="col-md-6 col-sm-12" id="upload from local folder">
                        <header className="text-center card-body">
                            <h1>Image Upload</h1>
                            <p className="lead mb-4">Upload an image to preview it below.</p>
                        </header>

                        <div className="row">
                            <div className="col-lg-12 mx-auto">
                                <ImageUploader />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
