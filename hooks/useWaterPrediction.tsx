import { useState } from 'react';
import axios from 'axios';

export const useWaterPrediction = () => {
  const [prediction, setPrediction] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);

  interface WaterFormData {
    [key: string]: string | number;
  }

  const handleSubmit = async (formData: WaterFormData) => {
    setLoading(true);
    try {
      const response = await axios.post('http://127.0.0.1:5000/predict', formData);
      setPrediction(response.data.potability_prediction === 1 ? 'Safe to Drink' : 'Unsafe');
    } catch (error) {
      console.error('Error while predicting:', error);
      setPrediction('Error predicting water potability');
    } finally {
      setLoading(false);
    }
  };

  return { prediction, loading, handleSubmit };
};
