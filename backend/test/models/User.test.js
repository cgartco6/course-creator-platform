const mongoose = require('mongoose');
const User = require('../../src/models/User');
const { USER_ROLES } = require('../../src/utils/constants');

describe('User Model', () => {
  beforeAll(async () => {
    await mongoose.connect(process.env.MONGODB_URI_TEST || 'mongodb://localhost:27017/coursecreator_test', {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
  });

  afterAll(async () => {
    await mongoose.connection.dropDatabase();
    await mongoose.connection.close();
  });

  afterEach(async () => {
    await User.deleteMany({});
  });

  describe('User Creation', () => {
    it('should create a user successfully', async () => {
      const userData = {
        username: 'testuser',
        email: 'test@example.com',
        password: 'password123',
        role: USER_ROLES.INSTRUCTOR
      };

      const user = new User(userData);
      await user.save();

      expect(user._id).toBeDefined();
      expect(user.username).toBe(userData.username);
      expect(user.email).toBe(userData.email);
      expect(user.role).toBe(userData.role);
      expect(user.isVerified).toBe(false);
      expect(user.isActive).toBe(true);
    });

    it('should hash password before saving', async () => {
      const userData = {
        username: 'testuser2',
        email: 'test2@example.com',
        password: 'password123'
      };

      const user = new User(userData);
      await user.save();

      expect(user.password).not.toBe(userData.password);
      expect(user.password).toMatch(/^\$2[ayb]\$.{56}$/); // bcrypt pattern
    });

    it('should not allow duplicate emails', async () => {
      const userData = {
        username: 'testuser',
        email: 'duplicate@example.com',
        password: 'password123'
      };

      await new User(userData).save();
      
      const duplicateUser = new User({
        username: 'testuser2',
        email: 'duplicate@example.com',
        password: 'password456'
      });

      await expect(duplicateUser.save()).rejects.toThrow();
    });

    it('should not allow duplicate usernames', async () => {
      const userData = {
        username: 'uniqueuser',
        email: 'test1@example.com',
        password: 'password123'
      };

      await new User(userData).save();
      
      const duplicateUser = new User({
        username: 'uniqueuser',
        email: 'test2@example.com',
        password: 'password456'
      });

      await expect(duplicateUser.save()).rejects.toThrow();
    });
  });

  describe('User Methods', () => {
    let user;

    beforeEach(async () => {
      user = new User({
        username: 'methoduser',
        email: 'method@example.com',
        password: 'password123'
      });
      await user.save();
    });

    it('should compare password correctly', async () => {
      const isMatch = await user.comparePassword('password123');
      const isNotMatch = await user.comparePassword('wrongpassword');

      expect(isMatch).toBe(true);
      expect(isNotMatch).toBe(false);
    });

    it('should get display name correctly', () => {
      // Without profile name
      expect(user.getDisplayName()).toBe('methoduser');

      // With profile name
      user.profile.firstName = 'John';
      user.profile.lastName = 'Doe';
      expect(user.getDisplayName()).toBe('John Doe');
    });

    it('should check subscription correctly', () => {
      // Free user
      expect(user.hasActiveSubscription()).toBe(false);

      // User with active subscription
      user.subscription.expiresAt = new Date(Date.now() + 86400000); // Tomorrow
      expect(user.hasActiveSubscription()).toBe(true);

      // User with expired subscription
      user.subscription.expiresAt = new Date(Date.now() - 86400000); // Yesterday
      expect(user.hasActiveSubscription()).toBe(false);
    });

    it('should check course creation limits', () => {
      // Free user with no courses
      expect(user.canCreateCourse()).toBe(true);

      // Free user with 3 courses (limit)
      user.stats.coursesCreated = 3;
      expect(user.canCreateCourse()).toBe(false);

      // Pro user with 50 courses (limit)
      user.subscription.plan = 'pro';
      user.stats.coursesCreated = 50;
      expect(user.canCreateCourse()).toBe(false);

      // Pro user with 49 courses
      user.stats.coursesCreated = 49;
      expect(user.canCreateCourse()).toBe(true);

      // Enterprise user with many courses
      user.subscription.plan = 'enterprise';
      user.stats.coursesCreated = 1000;
      expect(user.canCreateCourse()).toBe(true);
    });
  });

  describe('User Statics', () => {
    beforeEach(async () => {
      // Create test instructors
      await User.create([
        {
          username: 'instructor1',
          email: 'instructor1@example.com',
          password: 'password123',
          role: USER_ROLES.INSTRUCTOR,
          stats: { totalStudents: 100, averageRating: 4.5 }
        },
        {
          username: 'instructor2',
          email: 'instructor2@example.com',
          password: 'password123',
          role: USER_ROLES.INSTRUCTOR,
          stats: { totalStudents: 200, averageRating: 4.8 }
        },
        {
          username: 'student1',
          email: 'student1@example.com',
          password: 'password123',
          role: USER_ROLES.STUDENT
        }
      ]);
    });

    it('should find instructors only', async () => {
      const instructors = await User.findInstructors();
      
      expect(instructors).toHaveLength(2);
      expect(instructors[0].username).toBe('instructor2'); // Sorted by totalStudents
      expect(instructors[1].username).toBe('instructor1');
    });

    it('should find by email or username', async () => {
      const byEmail = await User.findByEmailOrUsername('instructor1@example.com');
      const byUsername = await User.findByEmailOrUsername('instructor2');

      expect(byEmail).toBeDefined();
      expect(byEmail.email).toBe('instructor1@example.com');
      expect(byUsername).toBeDefined();
      expect(byUsername.username).toBe('instructor2');
    });
  });
});
