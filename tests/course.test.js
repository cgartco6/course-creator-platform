const request = require('supertest');
const app = require('../server');
const Course = require('../models/Course');
const User = require('../models/User');

describe('Course API', () => {
  let authToken;
  let userId;

  beforeEach(async () => {
    await User.deleteMany({});
    await Course.deleteMany({});

    // Create test user and get token
    const user = await User.create({
      username: 'instructor',
      email: 'instructor@example.com',
      password: 'password123',
      role: 'instructor'
    });

    userId = user._id;

    const loginRes = await request(app)
      .post('/api/auth/login')
      .send({
        email: 'instructor@example.com',
        password: 'password123'
      });

    authToken = loginRes.body.data.token;
  });

  describe('POST /api/courses', () => {
    it('should create a new course', async () => {
      const res = await request(app)
        .post('/api/courses')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          title: 'Test Course',
          description: 'Test course description',
          category: 'web',
          level: 'beginner'
        });

      expect(res.statusCode).toEqual(201);
      expect(res.body.success).toBe(true);
      expect(res.body.data).toHaveProperty('title', 'Test Course');
    });

    it('should not create course without authentication', async () => {
      const res = await request(app)
        .post('/api/courses')
        .send({
          title: 'Test Course',
          description: 'Test course description',
          category: 'web'
        });

      expect(res.statusCode).toEqual(401);
    });
  });

  describe('GET /api/courses', () => {
    beforeEach(async () => {
      await Course.create({
        title: 'Published Course',
        description: 'Published course description',
        category: 'web',
        instructor: userId,
        isPublished: true
      });

      await Course.create({
        title: 'Draft Course',
        description: 'Draft course description',
        category: 'python',
        instructor: userId,
        isPublished: false
      });
    });

    it('should get published courses', async () => {
      const res = await request(app)
        .get('/api/courses');

      expect(res.statusCode).toEqual(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data).toHaveLength(1);
      expect(res.body.data[0]).toHaveProperty('title', 'Published Course');
    });
  });
});
