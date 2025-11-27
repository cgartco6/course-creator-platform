const mongoose = require('mongoose');
const Content = require('../../src/models/Content');
const Course = require('../../src/models/Course');
const User = require('../../src/models/User');
const { CONTENT_TYPES, CONTENT_STATUS } = require('../../src/utils/constants');

describe('Content Model', () => {
  let instructor, course, lessonId, moduleId;

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

  beforeEach(async () => {
    await Content.deleteMany({});
    await Course.deleteMany({});
    await User.deleteMany({});

    // Create instructor
    instructor = new User({
      username: 'contentcreator',
      email: 'creator@example.com',
      password: 'password123',
      role: 'instructor'
    });
    await instructor.save();

    // Create course with module and lesson
    course = new Course({
      title: 'Content Test Course',
      description: 'Course for testing content',
      category: 'web',
      instructor: instructor._id,
      modules: [
        {
          title: 'Test Module',
          order: 1,
          lessons: [
            {
              title: 'Test Lesson',
              content: 'Lesson content',
              order: 1,
              duration: 30
            }
          ]
        }
      ]
    });
    await course.save();

    moduleId = course.modules[0]._id;
    lessonId = course.modules[0].lessons[0]._id;
  });

  describe('Content Creation', () => {
    it('should create content successfully', async () => {
      const contentData = {
        title: 'Test Video Content',
        description: 'A test video for the course',
        type: CONTENT_TYPES.VIDEO,
        format: 'mp4',
        url: 'https://example.com/video.mp4',
        duration: 300,
        size: 1024000,
        course: course._id,
        module: moduleId,
        lesson: lessonId,
        createdBy: instructor._id,
        metadata: {
          width: 1920,
          height: 1080,
          bitrate: 5000
        }
      };

      const content = new Content(contentData);
      await content.save();

      expect(content._id).toBeDefined();
      expect(content.title).toBe(contentData.title);
      expect(content.type).toBe(CONTENT_TYPES.VIDEO);
      expect(content.course.toString()).toBe(course._id.toString());
      expect(content.lesson.toString()).toBe(lessonId.toString());
      expect(content.status).toBe(CONTENT_STATUS.PROCESSING);
      expect(content.durationMinutes).toBe(5); // 300 seconds = 5 minutes
    });

    it('should create AI-generated content', async () => {
      const contentData = {
        title: 'AI Generated Image',
        type: CONTENT_TYPES.IMAGE,
        format: 'jpg',
        url: 'https://example.com/ai-image.jpg',
        course: course._id,
        module: moduleId,
        lesson: lessonId,
        createdBy: instructor._id,
        aiGenerated: {
          isGenerated: true,
          model: 'dall-e-3',
          prompt: 'Create an image about web development',
          generationTime: new Date()
        }
      };

      const content = new Content(contentData);
      await content.save();

      expect(content.aiGenerated.isGenerated).toBe(true);
      expect(content.aiGenerated.model).toBe('dall-e-3');
      expect(content.status).toBe(CONTENT_STATUS.READY);
    });

    it('should auto-set format based on type', async () => {
      const content = new Content({
        title: 'Test Content',
        type: CONTENT_TYPES.VIDEO,
        url: 'https://example.com/test',
        course: course._id,
        module: moduleId,
        lesson: lessonId,
        createdBy: instructor._id
      });

      await content.save();

      expect(content.format).toBe('mp4');
    });
  });

  describe('Content Methods', () => {
    let content;

    beforeEach(async () => {
      content = new Content({
        title: 'Method Test Content',
        type: CONTENT_TYPES.VIDEO,
        format: 'mp4',
        url: 'https://example.com/video.mp4',
        course: course._id,
        module: moduleId,
        lesson: lessonId,
        createdBy: instructor._id,
        size: 2048000 // 2MB
      });
      await content.save();
    });

    it('should update processing status', async () => {
      await content.updateProcessingStatus(50, CONTENT_STATUS.PROCESSING);
      
      expect(content.processingProgress).toBe(50);
      expect(content.status).toBe(CONTENT_STATUS.PROCESSING);

      await content.updateProcessingStatus(100);
      
      expect(content.processingProgress).toBe(100);
      expect(content.status).toBe(CONTENT_STATUS.READY);
    });

    it('should mark as AI generated', async () => {
      await content.generateAIContent('Generate educational video about programming', {
        style: 'educational',
        length: 'short'
      });

      expect(content.aiGenerated.isGenerated).toBe(true);
      expect(content.aiGenerated.prompt).toBe('Generate educational video about programming');
      expect(content.status).toBe(CONTENT_STATUS.READY);
    });

    it('should calculate virtual fields correctly', () => {
      expect(content.durationMinutes).toBe(0); // No duration set
      expect(content.formattedSize).toBe('1.95 MB');

      content.duration = 150; // 2.5 minutes
      expect(content.durationMinutes).toBe(3); // Rounded up
    });
  });

  describe('Content Statics', () => {
    beforeEach(async () => {
      // Create test content
      await Content.create([
        {
          title: 'Video 1',
          type: CONTENT_TYPES.VIDEO,
          format: 'mp4',
          url: 'https://example.com/video1.mp4',
          course: course._id,
          module: moduleId,
          lesson: lessonId,
          createdBy: instructor._id,
          status: CONTENT_STATUS.READY,
          aiGenerated: { isGenerated: true }
        },
        {
          title: 'Video 2',
          type: CONTENT_TYPES.VIDEO,
          format: 'mp4',
          url: 'https://example.com/video2.mp4',
          course: course._id,
          module: moduleId,
          lesson: lessonId,
          createdBy: instructor._id,
          status: CONTENT_STATUS.READY
        },
        {
          title: 'Document 1',
          type: CONTENT_TYPES.DOCUMENT,
          format: 'pdf',
          url: 'https://example.com/doc1.pdf',
          course: course._id,
          module: moduleId,
          lesson: lessonId,
          createdBy: instructor._id,
          status: CONTENT_STATUS.READY
        },
        {
          title: 'Processing Video',
          type: CONTENT_TYPES.VIDEO,
          format: 'mp4',
          url: 'https://example.com/processing.mp4',
          course: course._id,
          module: moduleId,
          lesson: lessonId,
          createdBy: instructor._id,
          status: CONTENT_STATUS.PROCESSING
        }
      ]);
    });

    it('should find content by course', async () => {
      const courseContent = await Content.findByCourse(course._id);
      
      expect(courseContent).toHaveLength(4);
      expect(courseContent[0].course.toString()).toBe(course._id.toString());
    });

    it('should filter content by type', async () => {
      const videos = await Content.findByCourse(course._id, { type: CONTENT_TYPES.VIDEO });
      const documents = await Content.findByCourse(course._id, { type: CONTENT_TYPES.DOCUMENT });

      expect(videos).toHaveLength(3); // Includes processing video
      expect(documents).toHaveLength(1);
    });

    it('should filter content by status', async () => {
      const readyContent = await Content.findByCourse(course._id, { status: CONTENT_STATUS.READY });
      const processingContent = await Content.findByCourse(course._id, { status: CONTENT_STATUS.PROCESSING });

      expect(readyContent).toHaveLength(3);
      expect(processingContent).toHaveLength(1);
    });

    it('should find AI-generated content', async () => {
      const aiContent = await Content.findAIGenerated();

      expect(aiContent).toHaveLength(1);
      expect(aiContent[0].title).toBe('Video 1');
      expect(aiContent[0].aiGenerated.isGenerated).toBe(true);
    });

    it('should get content statistics', async () => {
      const stats = await Content.getStats(instructor._id);

      // Should have stats for video and document types
      expect(stats).toHaveLength(2);
      
      const videoStats = stats.find(s => s._id === CONTENT_TYPES.VIDEO);
      const documentStats = stats.find(s => s._id === CONTENT_TYPES.DOCUMENT);

      expect(videoStats.count).toBe(3);
      expect(documentStats.count).toBe(1);
    });
  });

  describe('Content Analytics', () => {
    let content;

    beforeEach(async () => {
      content = new Content({
        title: 'Analytics Test Content',
        type: CONTENT_TYPES.VIDEO,
        format: 'mp4',
        url: 'https://example.com/analytics.mp4',
        course: course._id,
        module: moduleId,
        lesson: lessonId,
        createdBy: instructor._id,
        analytics: {
          views: 100,
          downloads: 25,
          completionRate: 75,
          averageWatchTime: 120
        }
      });
      await content.save();
    });

    it('should track analytics', () => {
      expect(content.analytics.views).toBe(100);
      expect(content.analytics.downloads).toBe(25);
      expect(content.analytics.completionRate).toBe(75);
      expect(content.analytics.averageWatchTime).toBe(120);
    });

    it('should increment analytics', async () => {
      content.analytics.views += 1;
      content.analytics.downloads += 1;
      await content.save();

      expect(content.analytics.views).toBe(101);
      expect(content.analytics.downloads).toBe(26);
    });
  });
});
