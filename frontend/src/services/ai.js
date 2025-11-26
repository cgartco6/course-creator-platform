import { aiAPI } from './api';

// AI Service for course generation and content creation
export const aiService = {
  // Generate complete course outline
  generateCourseOutline: async (courseData) => {
    try {
      const response = await aiAPI.generateOutline(courseData);
      return {
        success: true,
        data: response.data.data
      };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to generate course outline'
      };
    }
  },

  // Generate lesson content
  generateLessonContent: async (lessonData) => {
    try {
      const response = await aiAPI.generateLesson(lessonData);
      return {
        success: true,
        data: response.data.data
      };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to generate lesson content'
      };
    }
  },

  // Generate quiz for a lesson
  generateQuiz: async (quizData) => {
    try {
      const response = await aiAPI.generateQuiz(quizData);
      return {
        success: true,
        data: response.data.data
      };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to generate quiz'
      };
    }
  },

  // Generate media content (images, etc.)
  generateMedia: async (mediaData) => {
    try {
      const response = await aiAPI.generateMedia(mediaData);
      return {
        success: true,
        data: response.data.data
      };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to generate media'
      };
    }
  },

  // Analyze course structure and content
  analyzeCourse: async (courseId) => {
    try {
      const response = await aiAPI.analyzeCourse({ courseId });
      return {
        success: true,
        data: response.data.data
      };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to analyze course'
      };
    }
  },

  // Batch generate multiple content types
  batchGenerateContent: async (contentRequests) => {
    const results = await Promise.all(
      contentRequests.map(async (request) => {
        try {
          let result;
          switch (request.type) {
            case 'lesson':
              result = await aiService.generateLessonContent(request.data);
              break;
            case 'quiz':
              result = await aiService.generateQuiz(request.data);
              break;
            case 'media':
              result = await aiService.generateMedia(request.data);
              break;
            default:
              result = { success: false, message: 'Unknown content type' };
          }
          return { type: request.type, ...result };
        } catch (error) {
          return { 
            type: request.type, 
            success: false, 
            message: error.message 
          };
        }
      })
    );

    return results;
  }
};

// AI configuration helpers
export const aiConfig = {
  creativityLevels: [
    { value: 1, label: 'More Factual', description: 'Strictly follows source material' },
    { value: 3, label: 'Balanced', description: 'Good mix of facts and creativity' },
    { value: 7, label: 'Creative', description: 'Adds creative examples and analogies' },
    { value: 10, label: 'Highly Creative', description: 'Very imaginative and innovative' }
  ],

  contentDepthLevels: [
    { value: 1, label: 'Beginner', description: 'Basic concepts and overview' },
    { value: 4, label: 'Intermediate', description: 'Detailed explanations with examples' },
    { value: 8, label: 'Advanced', description: 'Comprehensive coverage with case studies' },
    { value: 10, label: 'Expert', description: 'In-depth analysis and advanced topics' }
  ],

  courseStyles: [
    { value: 'traditional', label: 'Traditional Academic', description: 'Structured and formal' },
    { value: 'modern', label: 'Modern Interactive', description: 'Engaging and interactive' },
    { value: 'storytelling', label: 'Storytelling Approach', description: 'Narrative-driven' },
    { value: 'hands-on', label: 'Hands-on Practical', description: 'Project-based learning' },
    { value: 'fast-paced', label: 'Fast-paced Intensive', description: 'Quick and focused' }
  ],

  contentTypes: [
    { value: 'videos', label: 'Videos', icon: '🎬' },
    { value: 'images', label: 'Images', icon: '🖼️' },
    { value: 'audio', label: 'Audio', icon: '🎵' },
    { value: 'documents', label: 'Documents', icon: '📄' },
    { value: 'quizzes', label: 'Quizzes', icon: '❓' },
    { value: 'interactive', label: 'Interactive', icon: '🎮' }
  ]
};

export default aiService;
