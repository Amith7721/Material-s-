import { Request, Response } from 'express';
import { Material } from '../models/Material';

export const getMaterials = async (req: Request, res: Response) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const skip = (page - 1) * limit;

    // Optional filters
    const filter: any = {};
    if (req.query.category) filter.category = req.query.category;
    if (req.query.minDensity) filter.density = { ...filter.density, $gte: Number(req.query.minDensity) };
    if (req.query.maxDensity) filter.density = { ...filter.density, $lte: Number(req.query.maxDensity) };
    
    // Search
    if (req.query.search) {
      filter.$text = { $search: req.query.search as string };
    }

    const materials = await Material.find(filter).skip(skip).limit(limit);
    const total = await Material.countDocuments(filter);

    res.json({
      data: materials,
      page,
      pages: Math.ceil(total / limit),
      total
    });
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error });
  }
};

export const getMaterialById = async (req: Request, res: Response) => {
  try {
    const material = await Material.findById(req.params.id);
    if (!material) {
      return res.status(404).json({ message: 'Material not found' });
    }
    res.json(material);
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error });
  }
};

export const createMaterial = async (req: Request, res: Response) => {
  try {
    const material = new Material({
      ...req.body,
      createdBy: (req as any).user.id
    });
    const createdMaterial = await material.save();
    res.status(201).json(createdMaterial);
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error });
  }
};

export const replicateMaterial = async (req: Request, res: Response) => {
  try {
    const originalMaterial = await Material.findById(req.params.id);
    if (!originalMaterial) {
      return res.status(404).json({ message: 'Original material not found' });
    }

    const {
      _id,
      __v,
      createdAt,
      updatedAt,
      ...materialData
    } = originalMaterial.toObject();

    const replica = new Material({
      ...materialData,
      name: req.body.name || `${originalMaterial.name} (Replica)`,
      createdBy: (req as any).user.id
    });

    const createdReplica = await replica.save();
    res.status(201).json(createdReplica);
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error });
  }
};

export const advancedSearch = async (req: Request, res: Response) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const skip = (page - 1) * limit;

    const filter: any = {};

    // Full-text search
    if (req.query.search) {
      filter.$text = { $search: req.query.search as string };
    }

    // Category filter
    if (req.query.category) {
      const categories = (req.query.category as string).split(',');
      filter.category = { $in: categories };
    }

    // Property range filters
    if (req.query.minDensity || req.query.maxDensity) {
      filter.density = {};
      if (req.query.minDensity) filter.density.$gte = Number(req.query.minDensity);
      if (req.query.maxDensity) filter.density.$lte = Number(req.query.maxDensity);
    }

    if (req.query.minTensile || req.query.maxTensile) {
      filter.tensileStrength = {};
      if (req.query.minTensile) filter.tensileStrength.$gte = Number(req.query.minTensile);
      if (req.query.maxTensile) filter.tensileStrength.$lte = Number(req.query.maxTensile);
    }

    if (req.query.minConductivity || req.query.maxConductivity) {
      filter.thermalConductivity = {};
      if (req.query.minConductivity) filter.thermalConductivity.$gte = Number(req.query.minConductivity);
      if (req.query.maxConductivity) filter.thermalConductivity.$lte = Number(req.query.maxConductivity);
    }

    if (req.query.minElasticity || req.query.maxElasticity) {
      filter.elasticity = {};
      if (req.query.minElasticity) filter.elasticity.$gte = Number(req.query.minElasticity);
      if (req.query.maxElasticity) filter.elasticity.$lte = Number(req.query.maxElasticity);
    }

    if (req.query.minSustainability || req.query.maxSustainability) {
      filter.sustainabilityScore = {};
      if (req.query.minSustainability) filter.sustainabilityScore.$gte = Number(req.query.minSustainability);
      if (req.query.maxSustainability) filter.sustainabilityScore.$lte = Number(req.query.maxSustainability);
    }

    // Sustainability score filter
    if (req.query.sustainabilityMin) {
      filter.sustainabilityScore = { ...filter.sustainabilityScore, $gte: Number(req.query.sustainabilityMin) };
    }

    // Applications filter (array contains)
    if (req.query.applications) {
      const apps = (req.query.applications as string).split(',');
      filter.applications = { $in: apps };
    }

    // Sort options
    let sortOptions: any = { createdAt: -1 };
    if (req.query.sortBy === 'name') sortOptions = { name: 1 };
    else if (req.query.sortBy === 'density') sortOptions = { density: 1 };
    else if (req.query.sortBy === 'sustainability') sortOptions = { sustainabilityScore: -1 };
    else if (req.query.sortBy === 'cost') sortOptions = { costIndex: 1 };

    const materials = await Material.find(filter)
      .sort(sortOptions)
      .skip(skip)
      .limit(limit);

    const total = await Material.countDocuments(filter);

    res.json({
      data: materials,
      page,
      pages: Math.ceil(total / limit),
      total,
      filters: {
        search: req.query.search,
        category: req.query.category,
        properties: {
          density: { min: req.query.minDensity, max: req.query.maxDensity },
          tensileStrength: { min: req.query.minTensile, max: req.query.maxTensile },
          thermalConductivity: { min: req.query.minConductivity, max: req.query.maxConductivity },
          elasticity: { min: req.query.minElasticity, max: req.query.maxElasticity },
          sustainability: { min: req.query.minSustainability, max: req.query.maxSustainability }
        }
      }
    });
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error });
  }
};
