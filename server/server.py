# server.py
from flask import Flask, request, jsonify
import joblib
import numpy as np
from flask_cors import CORS  
import pandas as pd

# Load the trained model and threshold
model = joblib.load('water_potability_model.pkl')
threshold = np.load('best_threshold.npy')

app = Flask(__name__)

CORS(app)

@app.route('/')
def home():
    return "Water Potability Prediction Server is running!"

@app.route('/predict', methods=['POST'])
def predict():
    data = request.get_json()
    

    # Expected input: JSON with keys matching your features
    features = [
        data.get('ph'),
        data.get('Hardness'),
        data.get('Solids'),
        data.get('Chloramines'),
        data.get('Sulfate'),
        data.get('Conductivity'),
        data.get('Organic_carbon'),
        data.get('Trihalomethanes'),
        data.get('Turbidity')
    ]
    feature_names = ['ph', 'Hardness', 'Solids', 'Chloramines', 'Sulfate', 'Conductivity', 'Organic_carbon', 'Trihalomethanes', 'Turbidity']

    features_df = pd.DataFrame([features], columns=feature_names)

    # Predict probability
    prob = model.predict_proba(features_df)[0][1]

    # Apply dynamic threshold
    prediction = int(prob >= threshold)

    return jsonify({
        'potability_prediction': prediction,
        'probability': float(prob),
        'threshold_used': float(threshold)
    })

if __name__ == '__main__':
    app.run(debug=True, port=5000)
