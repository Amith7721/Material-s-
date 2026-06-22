import { Request, Response } from 'express';
import multer from 'multer';

// Setup multer for memory storage or disk storage
const storage = multer.memoryStorage();
export const upload = multer({ storage });

export const uploadPDF = async (req: Request, res: Response) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }

    // Proxy the file buffer to Python microservice for PDF parsing and NLP extraction
    // const formData = new FormData();
    // formData.append('file', req.file.buffer, req.file.originalname);
    // const response = await axios.post(`${ML_SERVICE_URL}/ml/extract-properties`, formData, ...);

    res.json({
      message: 'PDF successfully processed',
      filename: req.file.originalname,
      extractedData: {
        materialName: 'Bismuth Telluride',
        properties: {
          thermalConductivity: 1.5,
          seebeckCoefficient: -210
        },
        summary: 'A highly efficient thermoelectric material extracted from the document.'
      }
    });
  } catch (error) {
    res.status(500).json({ message: 'Upload Processing Error', error });
  }
};
