from flask import Flask, request, jsonify
import joblib
from PIL import Image
import numpy as np
import logging
import os

app = Flask(__name__)

# Load the model
model_file_path = 'skin_cancer_model.pkl'  # Ensure the model file path is correct
model = None
try:
    model = joblib.load(model_file_path)
    app.logger.info("Model loaded successfully.")
except FileNotFoundError as e:
    app.logger.error(f"Model file not found: {e}")
except Exception as e:
    app.logger.error(f"Error loading model: {e}")


# Image preprocessing function
def preprocess_image(image):
    size = (224, 224)  # Ensure the size matches the model input
    image = image.resize(size)  # Resize the image
    image = image.convert("RGB")  # Convert to RGB to remove the alpha channel
    image_array = np.array(image)  # Convert to array
    image_array = image_array / 255.0  # Normalize the array
    image_flattened = image_array.flatten()  # Flatten to a 1D array
    return [image_flattened]


@app.route('/')
def index():
    return "Welcome to the Skin Analysis API!"


# Analyze endpoint: accept image and make prediction
@app.route('/analyze', methods=['POST'])
def analyze():
    if 'image' not in request.files:
        return jsonify({"error": "No image uploaded"}), 400

    if model is None:
        return jsonify({"error": "Model not loaded"}), 500

    try:
        file = request.files['image']
        image = Image.open(file.stream)

        # Log image details
        app.logger.info(f"Image received: {file.filename}, format: {image.format}, size: {image.size}")

        # Preprocess the image
        processed_image = preprocess_image(image)

        # Model prediction
        prediction = model.predict(processed_image)[0]
        class_names = {0: 'Benign', 1: 'Malignant'}  # Assuming the model returns 0 or 1
        result = class_names.get(prediction, "Unknown")

        app.logger.info(f"Prediction result: {result}")
        return jsonify({"result": result})
    except Exception as e:
        app.logger.error(f"Error during prediction: {e}")
        return jsonify({"error": "Error analyzing image"}), 500


if __name__ == "__main__":
    port = int(os.getenv("PORT", 8000))  # Default to 8000 if no PORT env variable found
    app.run(host='0.0.0.0', port=port, debug=True)
