from flask import Flask, request, jsonify
import joblib
from PIL import Image
import numpy as np
import logging
import os

app = Flask(__name__)

# 加载模型
model_file_path = 'skin_cancer_model.pkl'  # 确保这个模型文件路径正确
try:
    model = joblib.load(model_file_path)
except Exception as e:
    app.logger.error(f"Error loading model: {e}")

# 图像预处理函数
from PIL import Image
import numpy as np

# 图像预处理函数
def preprocess_image(image):
    size = (224, 224)  # 确保尺寸与模型输入一致
    image = image.resize(size)  # 调整图像尺寸
    image = image.convert("RGB")  # 强制将图像转换为 RGB 格式，去除 alpha 通道
    image_array = np.array(image)  # 转换为数组
    image_array = image_array / 255.0  # 归一化
    image_flattened = image_array.flatten()  # 展平为一维数组
    return [image_flattened]


@app.route('/')
def index():
    return "Welcome to the Skin Analysis API!"

# 接收图像并通过模型分析
@app.route('/analyze', methods=['POST'])
def analyze():
    if 'image' not in request.files:
        return jsonify({"error": "No image uploaded"}), 400

    try:
        file = request.files['image']
        image = Image.open(file.stream)

        # 预处理图像
        processed_image = preprocess_image(image)

        # 模型预测
        prediction = model.predict(processed_image)[0]
        class_names = {0: 'Benign', 1: 'Malignant'}  # 假设模型返回的是 0 或 1
        result = class_names.get(prediction, "Unknown")

        app.logger.info(f"Prediction: {result}")
        return jsonify({"result": result})
    except Exception as e:
        app.logger.error(f"Error during prediction: {e}")
        return jsonify({"error": "Error analyzing image"}), 500

if __name__ == "__main__":
    port = int(os.getenv("PORT", 8000))  # 如果没有找到 PORT 环境变量，默认使用 8000
    app.run(host='0.0.0.0', port=port, debug=True)

