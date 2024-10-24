@app.route('/analyze_cnn', methods=['POST'])
def analyze_cnn():
    cnn_model = None  # Load the model on demand
    cnn_model_file_path = 'cnn_skin_issues.h5'
    try:
        cnn_model = tf.keras.models.load_model(cnn_model_file_path)
        app.logger.info("CNN model loaded successfully")
    except Exception as e:
        app.logger.error(f"Error loading CNN model: {e}")
        return jsonify({"error": "CNN model not loaded"}), 500

    if 'image' not in request.files:
        app.logger.error("No image uploaded")
        return jsonify({"error": "No image uploaded"}), 400

    try:
        file = request.files['image']
        image = Image.open(file.stream)
        app.logger.info(f"Image received: format={image.format}, size={image.size}")

        # Preprocess image
        processed_image = preprocess_image(image)
        processed_image = np.array(processed_image).reshape(-1, 224, 224, 3)  # Adjust shape for CNN input

        # Predict using the CNN model
        prediction = cnn_model.predict(processed_image)
        predicted_class = np.argmax(prediction, axis=1)[0]

        # Expanded class names for the CNN model
        class_names = {
            0: 'Acne and Rosacea',
            1: 'Actinic Keratosis and Malignant Lesions',
            2: 'Atopic Dermatitis',
            3: 'Cellulitis and Bacterial Infections',
            4: 'Eczema',
            5: 'Exanthems and Drug Eruptions',
            6: 'Herpes and STDs',
            7: 'Pigmentation Disorders',
            8: 'Lupus and Connective Tissue Diseases',
            9: 'Melanoma and Skin Cancer',
            10: 'Contact Dermatitis (Poison Ivy)',
            11: 'Psoriasis and Related Diseases',
            12: 'Seborrheic Keratoses and Benign Tumors',
            13: 'Systemic Diseases',
            14: 'Fungal Infections (Tinea, Ringworm)',
            15: 'Urticaria (Hives)',
            16: 'Vascular Tumors',
            17: 'Vasculitis',
            18: 'Warts and Viral Infections'
        }

        result = class_names.get(predicted_class, "Unknown")

        app.logger.info(f"CNN Prediction result: {result}")
        return jsonify({"result": result})

    except Exception as e:
        app.logger.error(f"Error during CNN model prediction: {e}")
        return jsonify({"error": "Error analyzing image with CNN"}), 500
