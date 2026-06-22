process.env.MONGO_URI = 'mongodb://localhost:27017/matinformatics_test';
process.env.NODE_ENV = 'test';
process.env.JWT_SECRET = 'testjwtsecret';

import request from 'supertest';
import mongoose from 'mongoose';
import app from './app';
import { User } from './models/User';
import { Material } from './models/Material';

describe('MatInformatics API Integration Tests', () => {
  beforeAll(async () => {
    // Clear test databases if needed
    try {
      await User.deleteMany({ email: /test.*@example\.com/ });
      await Material.deleteMany({ name: /Test Material/ });
    } catch (e) {
      console.error('Error during cleanup', e);
    }
  });

  afterAll(async () => {
    // Clean up databases and close connection
    try {
      await User.deleteMany({ email: /test.*@example\.com/ });
      await Material.deleteMany({ name: /Test Material/ });
    } catch (e) {
      console.error('Error during cleanup', e);
    }
    await mongoose.connection.close();
  });

  describe('GET /health', () => {
    it('should return 200 OK and health status', async () => {
      const res = await request(app).get('/health');
      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty('status', 'OK');
    });
  });

  describe('Auth Endpoints', () => {
    const testUser = {
      name: 'Test User',
      email: 'testuser@example.com',
      password: 'password123',
      role: 'Researcher'
    };

    it('should register a new user', async () => {
      const res = await request(app)
        .post('/api/auth/register')
        .send(testUser);
      
      expect(res.status).toBe(201);
      expect(res.body).toHaveProperty('token');
      expect(res.body.email).toBe(testUser.email);
    });

    it('should login the registered user', async () => {
      const res = await request(app)
        .post('/api/auth/login')
        .send({
          email: testUser.email,
          password: testUser.password
        });
      
      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty('token');
    });
  });

  describe('Materials Endpoints', () => {
    let token: string;

    beforeAll(async () => {
      // Login to get a token
      const res = await request(app)
        .post('/api/auth/login')
        .send({
          email: 'testuser@example.com',
          password: 'password123'
        });
      token = res.body.token;
    });

    it('should get materials list', async () => {
      const res = await request(app).get('/api/materials');
      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty('data');
      expect(Array.isArray(res.body.data)).toBe(true);
    });

    it('should create a new material', async () => {
      const newMaterial = {
        name: 'Test Material X',
        category: 'Polymers',
        density: 1.2,
        tensileStrength: 60,
        sustainabilityScore: 80
      };

      const res = await request(app)
        .post('/api/materials')
        .set('Authorization', `Bearer ${token}`)
        .send(newMaterial);
      
      expect(res.status).toBe(201);
      expect(res.body.name).toBe(newMaterial.name);
    });

    it('should replicate an existing material', async () => {
      const originalMaterial = {
        name: 'Test Material Replica Source',
        category: 'Ceramics',
        density: 3.2,
        tensileStrength: 150,
        sustainabilityScore: 65
      };

      const createRes = await request(app)
        .post('/api/materials')
        .set('Authorization', `Bearer ${token}`)
        .send(originalMaterial);

      expect(createRes.status).toBe(201);
      const originalId = createRes.body._id;

      const replicaRes = await request(app)
        .post(`/api/materials/${originalId}/replica`)
        .set('Authorization', `Bearer ${token}`)
        .send({ name: 'Test Material Replica' });

      expect(replicaRes.status).toBe(201);
      expect(replicaRes.body.name).toBe('Test Material Replica');
      expect(replicaRes.body._id).not.toBe(originalId);
      expect(replicaRes.body.category).toBe(originalMaterial.category);
    });
  });
});
