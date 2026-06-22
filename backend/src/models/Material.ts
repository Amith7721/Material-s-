import mongoose from 'mongoose';

const materialSchema = new mongoose.Schema({
  name: { type: String, required: true },
  category: { type: String, required: true },
  composition: { type: String },
  density: { type: Number }, // g/cm3
  tensileStrength: { type: Number }, // MPa
  thermalConductivity: { type: Number }, // W/(m·K)
  elasticity: { type: Number }, // GPa
  sustainabilityScore: { type: Number, min: 0, max: 100 },
  costIndex: { type: Number },
  applications: [{ type: String }],
  advantages: [{ type: String }],
  disadvantages: [{ type: String }],
  aiRecommendationScore: { type: Number },
  materialImage: { type: String },
  researchReferences: [{ type: String }],
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
}, { timestamps: true });

materialSchema.index({ name: 'text', category: 'text', applications: 'text' });

export const Material = mongoose.model('Material', materialSchema);
