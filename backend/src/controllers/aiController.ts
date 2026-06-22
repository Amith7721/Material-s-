import { Request, Response } from 'express';
import axios from 'axios';

// Placeholder for ML microservice URL
const ML_SERVICE_URL = process.env.ML_SERVICE_URL || 'http://localhost:8000';

export const chatWithAI = async (req: Request, res: Response) => {
  try {
    const { prompt, history } = req.body;
    
    // In a real scenario, you'd integrate OpenAI or local LLM here.
    // For now, we simulate a response or proxy to the Python ML microservice.
    
    // const response = await axios.post(`${ML_SERVICE_URL}/ml/chat`, { prompt, history });
    // res.json(response.data);

    // Mock response
    res.json({
      message: `AI Response to: "${prompt}". I am a highly advanced materials informatics AI.`,
      confidence: 0.95
    });

  } catch (error) {
    res.status(500).json({ message: 'AI Service Error', error });
  }
};

export const getRecommendations = async (req: Request, res: Response) => {
  try {
    const { constraints } = req.body;
    
    // Proxy to Python microservice
    // const response = await axios.post(`${ML_SERVICE_URL}/ml/recommend`, { constraints });
    // res.json(response.data);

    res.json({
      recommendations: [
        { material: 'Titanium Aluminides', score: 98, reason: 'High temp resistance, low density' },
        { material: 'Carbon Fiber', score: 85, reason: 'High strength to weight' }
      ]
    });
  } catch (error) {
    res.status(500).json({ message: 'AI Service Error', error });
  }
};
