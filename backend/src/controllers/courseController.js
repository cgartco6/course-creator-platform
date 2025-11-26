const Course = require('../models/Course');
const User = require('../models/User');
const Content = require('../models/Content');
const { validationResult } = require('express-validator');

// @desc    Create a new course
// @route   POST /api/courses
// @access  Private
exports.createCourse = async (req, res) => {
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
      title,
      description,
      shortDescription,
      category,
      level,
      price,
      requirements,
      learningOutcomes,
      targetAudience,
      aiConfig
    } = req.body;

    const course = new Course({
      title,
      description,
      shortDescription,
      category,
      level,
      price: price || 0,
      instructor: req.user.id,
      requirements: requirements || [],
      learningOutcomes: learningOutcomes || [],
      targetAudience: targetAudience || [],
      aiConfig: aiConfig || {},
      status: 'draft'
    });

    await course.save();
    
    // Update user stats
    await User.findByIdAndUpdate(req.user.id, {
      $inc: { 'stats.coursesCreated': 1 }
    });

    res.status(201).json({
      success: true,
      message: 'Course created successfully',
      data: course
    });
  } catch (error) {
    console.error('Create course error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create course',
      error: error.message
    });
  }
};

// @desc    Get all courses with filtering and pagination
// @route   GET /api/courses
// @access  Public
exports.getCourses = async (req, res) => {
  try {
    const {
      page = 1,
      limit = 10,
      category,
      level,
      search,
      instructor,
      minPrice,
      maxPrice,
      sortBy = 'createdAt',
      sortOrder = 'desc'
    } = req.query;

    // Build filter object
    const filter = { isPublished: true };
    
    if (category) filter.category = category;
    if (level) filter.level = level;
    if (instructor) filter.instructor = instructor;
    if (minPrice !== undefined || maxPrice !== undefined) {
      filter.price = {};
      if (minPrice !== undefined) filter.price.$gte = parseFloat(minPrice);
      if (maxPrice !== undefined) filter.price.$lte = parseFloat(maxPrice);
    }
    
    if (search) {
      filter.$text = { $search: search };
    }

    // Build sort object
    const sort = {};
    sort[sortBy] = sortOrder === 'desc' ? -1 : 1;

    const courses = await Course.find(filter)
      .populate('instructor', 'username profile')
      .sort(sort)
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .exec();

    const total = await Course.countDocuments(filter);

    res.json({
      success: true,
      data: courses,
      pagination: {
        current: parseInt(page),
        pages: Math.ceil(total / limit),
        total
      }
    });
  } catch (error) {
    console.error('Get courses error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch courses',
      error: error.message
    });
  }
};

// @desc    Get single course
// @route   GET /api/courses/:id
// @access  Public
exports.getCourse = async (req, res) => {
  try {
    const course = await Course.findById(req.params.id)
      .populate('instructor', 'username profile stats')
      .populate('modules.lessons');

    if (!course) {
      return res.status(404).json({
        success: false,
        message: 'Course not found'
      });
    }

    // Check if user can access the course
    if (!course.isPublished && (!req.user || course.instructor._id.toString() !== req.user.id)) {
      return res.status(403).json({
        success: false,
        message: 'Access denied'
      });
    }

    res.json({
      success: true,
      data: course
    });
  } catch (error) {
    console.error('Get course error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch course',
      error: error.message
    });
  }
};

// @desc    Update course
// @route   PUT /api/courses/:id
// @access  Private
exports.updateCourse = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    let course = await Course.findById(req.params.id);

    if (!course) {
      return res.status(404).json({
        success: false,
        message: 'Course not found'
      });
    }

    // Check if user is the instructor
    if (course.instructor.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Access denied. You are not the instructor of this course.'
      });
    }

    const updates = { ...req.body };
    delete updates.instructor; // Prevent changing instructor

    course = await Course.findByIdAndUpdate(
      req.params.id,
      { $set: updates },
      { new: true, runValidators: true }
    ).populate('instructor', 'username profile');

    res.json({
      success: true,
      message: 'Course updated successfully',
      data: course
    });
  } catch (error) {
    console.error('Update course error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update course',
      error: error.message
    });
  }
};

// @desc    Delete course
// @route   DELETE /api/courses/:id
// @access  Private
exports.deleteCourse = async (req, res) => {
  try {
    const course = await Course.findById(req.params.id);

    if (!course) {
      return res.status(404).json({
        success: false,
        message: 'Course not found'
      });
    }

    // Check if user is the instructor or admin
    if (course.instructor.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Access denied'
      });
    }

    // Delete associated content
    await Content.deleteMany({ course: req.params.id });

    await Course.findByIdAndDelete(req.params.id);

    // Update user stats
    await User.findByIdAndUpdate(req.user.id, {
      $inc: { 'stats.coursesCreated': -1 }
    });

    res.json({
      success: true,
      message: 'Course deleted successfully'
    });
  } catch (error) {
    console.error('Delete course error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete course',
      error: error.message
    });
  }
};

// @desc    Add module to course
// @route   POST /api/courses/:id/modules
// @access  Private
exports.addModule = async (req, res) => {
  try {
    const { title, description } = req.body;
    const course = await Course.findById(req.params.id);

    if (!course) {
      return res.status(404).json({
        success: false,
        message: 'Course not found'
      });
    }

    if (course.instructor.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Access denied'
      });
    }

    const moduleOrder = course.modules.length + 1;
    course.modules.push({
      title,
      description,
      order: moduleOrder
    });

    await course.save();

    res.status(201).json({
      success: true,
      message: 'Module added successfully',
      data: course.modules[course.modules.length - 1]
    });
  } catch (error) {
    console.error('Add module error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to add module',
      error: error.message
    });
  }
};

// @desc    Add lesson to module
// @route   POST /api/courses/:id/modules/:moduleId/lessons
// @access  Private
exports.addLesson = async (req, res) => {
  try {
    const { title, content, duration } = req.body;
    const course = await Course.findById(req.params.id);

    if (!course) {
      return res.status(404).json({
        success: false,
        message: 'Course not found'
      });
    }

    if (course.instructor.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Access denied'
      });
    }

    const module = course.modules.id(req.params.moduleId);
    if (!module) {
      return res.status(404).json({
        success: false,
        message: 'Module not found'
      });
    }

    const lessonOrder = module.lessons.length + 1;
    module.lessons.push({
      title,
      content,
      duration: duration || 0,
      order: lessonOrder
    });

    await course.save();

    res.status(201).json({
      success: true,
      message: 'Lesson added successfully',
      data: module.lessons[module.lessons.length - 1]
    });
  } catch (error) {
    console.error('Add lesson error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to add lesson',
      error: error.message
    });
  }
};
