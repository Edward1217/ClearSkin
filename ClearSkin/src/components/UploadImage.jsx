import React, { useState } from 'react';
import {storage} from "../firebase/firebase.js";
import {ref,uploadBytes, getDownloadURL} from "firebase/storage";
import { v4 } from 'uuid';
import 'bootstrap/dist/css/bootstrap.min.css';


const UploadImage = () => {
    const [image, setImage] = useState(null); // State to hold the uploaded image
    const [imageUpload,setImageUpload] = useState(null);
    const [uploadStatus, setUploadStatus] = useState("");
    const uploadImage = () => {
        if (imageUpload == null ) return;
        const imageRef = ref(storage,`images/${imageUpload.name + v4()}`);
        uploadBytes(imageRef,imageUpload).then(()=>{
            alert("Image Uploaded");
            setImageUpload(null);
            setImage(null);
        });
    }

    const readURL = (event) => {
        const file = event.target.files[0]; // Get the first file
        if (file) {
            const reader = new FileReader(); // Create a new FileReader instance
            reader.onloadend = () => {
                setImage(reader.result); // Update state with the image data URL

            };
            reader.readAsDataURL(file); // Read the file as a data URL
        }
        setImageUpload(file)
    };
    const handleUploadClick = () => {
        if (image) {
            // Simulate an API call to upload the image
            setUploadStatus("Uploading...");
            // Here, you would implement the actual upload logic to your database.
            // For demonstration, we'll use a timeout to simulate a delay.
            setTimeout(() => {
                setUploadStatus("Upload successful!");
                // Reset image after successful upload
                setImage(null);
            }, 2000);
        } else {
            setUploadStatus("No image selected.");
        }
    };


    console.log(image)
    return (
        <div className="container ">
            <header className="text-center card-body">
                <h1>Image Upload</h1>
                <p className="lead mb-4">Upload an image to preview it below.</p>
            </header>

            <div className="row">
                <div className="col-lg-6 mx-auto">
                    {/* Upload image input */}
                    <div className="input-group mb-3">
                        <input
                            id="upload"
                            type="file"
                            onChange={readURL}
                            className="form-control border-0"
                            accept="image/*"
                        />
                        <div className="input-group-append">
                            <label htmlFor="upload" className="btn btn-primary m-0">Choose File</label>
                        </div>
                    </div>

                    {/* Uploaded image area */}

                    {image && (
                        <div className="image-area mt-4">
                            <h5 className="font-italic">Uploaded Image:</h5>
                            <img
                                src={image}
                                alt="Uploaded"
                                className="img-fluid rounded shadow-sm mx-auto d-block"
                            />
                            <button className="btn btn-success mt-3" onClick={uploadImage}>
                                Upload to Database
                            </button>
                            {uploadStatus && <p className="mt-2">{uploadStatus}</p>}
                        </div>
                    )}

                </div>
            </div>
        </div>
    );
};

export default UploadImage;