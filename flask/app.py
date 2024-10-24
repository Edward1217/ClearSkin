from flask import Flask, request, jsonify
import joblib
from PIL import Image
import numpy as np
import logging
import os

app = Flask(__name__)

logging.basicConfig(level=logging.INFO)

# Image preprocessing function
def preprocess_image(image):
    size = (224, 224)  # Ensure the size matches model input
    image = image.resize(size)  # Resize the image
    image = image.convert("RGB")  # Force convert the image to RGB, removing alpha channel if exists
    image_array = np.array(image)  # Convert image to numpy array
    image_array = image_array / 255.0  # Normalize to [0, 1] range
    image_flattened = image_array.flatten()  # Flatten into a 1D array
    return [image_flattened]

@app.route('/')
def index():
    return "Welcome to the Skin Analysis API!"

# Image analysis route with lazy model loading
@app.route('/analyze', methods=['POST'])
def analyze():
    model = None  # Load the model on demand
    model_file_path = 'skin_cancer_model.pkl'
    try:
        model = joblib.load(model_file_path)
        app.logger.info("Model loaded successfully")
    except Exception as e:
        app.logger.error(f"Error loading model: {e}")
        return jsonify({"error": "Model not loaded"}), 500

    if 'image' not in request.files:
        app.logger.error("No image uploaded")
        return jsonify({"error": "No image uploaded"}), 400

    try:
        file = request.files['image']
        image = Image.open(file.stream)
        app.logger.info(f"Image received: format={image.format}, size={image.size}")

        # Preprocess image
        processed_image = preprocess_image(image)

        # Predict using the model
        prediction = model.predict(processed_image)[0]
        class_names = {0: 'Benign', 1: 'Malignant'}  # Assuming model returns 0 or 1
        result = class_names.get(prediction, "Unknown")

        app.logger.info(f"Prediction result: {result}")
        return jsonify({"result": result})

    except Exception as e:
        app.logger.error(f"Error during prediction: {e}")
        return jsonify({"error": "Error analyzing image"}), 500

if __name__ == "__main__":
    port = int(os.getenv("PORT", 8000))  # Default to port 8000 if PORT env variable is not found
    app.run(host='0.0.0.0', port=port, debug=True)
