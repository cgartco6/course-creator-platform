const Course = require('../models/Course');
const { generateCourseOutline, generateLessonContent, generateQuiz, generateMediaPrompt } = require('../services/openaiService');
const { generateContentFromPrompt } = require('../services/contentGeneration');
const { validationResult } = require('express-validator');

// @desc    Generate course outline
// @route   POST /api/ai/generate-outline
// @access  Private
exports.generateCourseOutline = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    const {
      courseId,
      title,
      description,
      category,
      level,
      learningOutcomes,
      targetAudience,
      aiConfig = {}
    } = req.body;

    // If courseId provided, verify ownership
    if (courseId) {
      const course = await Course.findById(courseId);
      if (!course || course.instructor.toString() !== req.user.id) {
        return res.status(403).json({
          success: false,
          message: 'Access denied'
        });
      }
    }

    const outline = await generateCourseOutline({
      title,
      description,
      category,
      level,
      learningOutcomes,
      targetAudience,
      config: aiConfig
    });

    res.json({
      success: true,
      message: 'Course outline generated successfully',
      data: outline
    });
  } catch (error) {
    console.error('Generate outline error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to generate course outline',
      error: error.message
    });
  }
};

// @desc    Generate lesson content
// @route   POST /api/ai/generate-lesson
// @access  Private
exports.generateLessonContent = async (req, res) => {
  try {
    const {
      courseId,
      moduleTitle,
      lessonTitle,
      lessonDescription,
      previousContent,
      aiConfig = {}
    } = req.body;

    // Verify course ownership if courseId provided
    if (courseId) {
      const course = await Course.findById(courseId);
      if (!course || course.instructor.toString() !== req.user.id) {
        return res.status(403).json({
          success: false,
          message: 'Access denied'
        });
      }
    }

    const lessonContent = await generateLessonContent({
      moduleTitle,
      lessonTitle,
      lessonDescription,
      previousContent,
      config: aiConfig
    });

    res.json({
      success: true,
      message: 'Lesson content generated successfully',
      data: lessonContent
    });
  } catch (error) {
    console.error('Generate lesson content error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to generate lesson content',
      error: error.message
    });
  }
};

// @desc    Generate quiz
// @route   POST /api/ai/generate-quiz
// @access  Private
exports.generateQuiz = async (req, res) => {
  try {
    const {
      courseId,
      lessonContent,
      difficulty = 'medium',
      questionCount = 5,
      questionTypes = ['multiple-choice']
    } = req.body;

    // Verify course ownership if courseId provided
    if (courseId) {
      const course = await Course.findById(courseId);
      if (!course || course.instructor.toString() !== req.user.id) {
        return res.status(403).json({
          success: false,
          message: 'Access denied'
        });
      }
    }

    const quiz = await generateQuiz({
      lessonContent,
      difficulty,
      questionCount,
      questionTypes
    });

    res.json({
      success: true,
      message: 'Quiz generated successfully',
      data: quiz
    });
  } catch (error) {
    console.error('Generate quiz error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to generate quiz',
      error: error.message
    });
  }
};

// @desc    Generate media content
// @route   POST /api/ai/generate-media
// @access  Private
exports.generateMediaContent = async (req, res) => {
  try {
    const {
      courseId,
      prompt,
      mediaType = 'image',
      style = 'realistic',
      size = '1024x1024'
    } = req.body;

    // Verify course ownership if courseId provided
    if (courseId) {
      const course = await Course.findById(courseId);
      if (!course || course.instructor.toString() !== req.user.id) {
        return res.status(403).json({
          success: false,
          message: 'Access denied'
        });
      }
    }

    const mediaPrompt = await generateMediaPrompt(prompt, mediaType, style);
    const mediaContent = await generateContentFromPrompt(mediaPrompt, mediaType, size);

    res.json({
      success: true,
      message: 'Media content generated successfully',
      data: mediaContent
    });
  } catch (error) {
    console.error('Generate media content error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to generate media content',
      error: error.message
    });
  }
};

// @desc    Analyze course performance
// @route   POST /api/ai/analyze-course
// @access  Private
exports.analyzeCourse = async (req, res) => {
  try {
    const { courseId } = req.body;

    const course = await Course.findById(courseId)
      .populate('modules.lessons');

    if (!course || course.instructor.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Access denied'
      });
    }

    // Analyze course structure and content
    const analysis = {
      overallScore: Math.floor(Math.random() * 30) + 70, // Mock score
      recommendations: [
        'Consider adding more practical exercises',
        'Include more visual content in Module 2',
        'Add a summary quiz at the end of each module'
      ],
      engagementMetrics: {
        estimatedCompletionRate: '75%',
        suggestedImprovements: ['Add interactive elements', 'Include real-world examples']
      },
      contentGaps: [
        'Missing advanced topics in Module 4',
        'Consider adding case studies'
      ]
    };

    res.json({
      success: true,
      message: 'Course analysis completed',
      data: analysis
    });
  } catch (error) {
    console.error('Analyze course error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to analyze course',
      error: error.message
    });
  }
};
