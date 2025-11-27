// Global test setup
process.env.NODE_ENV = 'test';

// Increase timeout for tests
jest.setTimeout(30000);

// Global test utilities
global.createTestUser = async (userData = {}) => {
  const User = require('../src/models/User');
  
  const defaultData = {
    username: `testuser_${Date.now()}`,
    email: `test_${Date.now()}@example.com`,
    password: 'password123',
    role: 'instructor',
    ...userData
  };
  
  return await User.create(defaultData);
};

global.createTestCourse = async (instructorId, courseData = {}) => {
  const Course = require('../src/models/Course');
  
  const defaultData = {
    title: `Test Course ${Date.now()}`,
    description: 'Test course description',
    category: 'web',
    instructor: instructorId,
    ...courseData
  };
  
  return await Course.create(defaultData);
};

global.createTestContent = async (courseId, moduleId, lessonId, creatorId, contentData = {}) => {
  const Content = require('../src/models/Content');
  
  const defaultData = {
    title: `Test Content ${Date.now()}`,
    type: 'video',
    format: 'mp4',
    url: 'https://example.com/test.mp4',
    course: courseId,
    module: moduleId,
    lesson: lessonId,
    createdBy: creatorId,
    ...contentData
  };
  
  return await Content.create(defaultData);
};
