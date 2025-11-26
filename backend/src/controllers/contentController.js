const Content = require('../models/Content');
const Course = require('../models/Course');
const { uploadToCloudinary } = require('../services/cloudStorage');
const { generateAIContent } = require('../services/openaiService');
const { validationResult } = require('express-validator');

// @desc    Upload content
// @route   POST /api/content/upload
// @access  Private
exports.uploadContent = async (req, res) => {
  try {
    if (!req.files || !req.files.file) {
      return res.status(400).json({
        success: false,
        message: 'No file uploaded'
      });
    }

    const { courseId, moduleId, lessonId, title, description, type } = req.body;
    
    // Verify course ownership
    const course = await Course.findById(courseId);
    if (!course || course.instructor.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Access denied'
      });
    }

    const file = req.files.file;
    const uploadResult = await uploadToCloudinary(file, {
      resource_type: type === 'video' ? 'video' : 'image',
      folder: `courses/${courseId}/content`
    });

    const content = new Content({
      title: title || file.name,
      description,
      type,
      format: file.mimetype,
      url: uploadResult.secure_url,
      thumbnail: uploadResult.thumbnail_url,
      duration: uploadResult.duration,
      size: uploadResult.bytes,
      metadata: {
        width: uploadResult.width,
        height: uploadResult.height,
        format: uploadResult.format
      },
      course: courseId,
      module: moduleId,
      lesson: lessonId,
      createdBy: req.user.id,
      status: 'ready'
    });

    await content.save();

    res.status(201).json({
      success: true,
      message: 'Content uploaded successfully',
      data: content
    });
  } catch (error) {
    console.error('Upload content error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to upload content',
      error: error.message
    });
  }
};

// @desc    Generate AI content
// @route   POST /api/content/generate
// @access  Private
exports.generateAIContent = async (req, res) => {
  try {
    const {
      courseId,
      moduleId,
      lessonId,
      type,
      prompt,
      config = {}
    } = req.body;

    // Verify course ownership
    const course = await Course.findById(courseId);
    if (!course || course.instructor.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Access denied'
      });
    }

    // Generate content using AI
    const aiContent = await generateAIContent({
      type,
      prompt,
      courseContext: {
        title: course.title,
        description: course.description,
        category: course.category
      },
      config
    });

    const content = new Content({
      title: aiContent.title,
      description: aiContent.description,
      type,
      format: aiContent.format,
      url: aiContent.url,
      thumbnail: aiContent.thumbnail,
      duration: aiContent.duration,
      size: aiContent.size,
      aiGenerated: {
        isGenerated: true,
        model: aiContent.model,
        prompt: prompt,
        config: config
      },
      course: courseId,
      module: moduleId,
      lesson: lessonId,
      createdBy: req.user.id,
      status: 'ready'
    });

    await content.save();

    res.status(201).json({
      success: true,
      message: 'AI content generated successfully',
      data: content
    });
  } catch (error) {
    console.error('Generate AI content error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to generate AI content',
      error: error.message
    });
  }
};

// @desc    Get content by course
// @route   GET /api/content/course/:courseId
// @access  Private
exports.getCourseContent = async (req, res) => {
  try {
    const { courseId } = req.params;
    
    // Verify access
    const course = await Course.findById(courseId);
    if (!course) {
      return res.status(404).json({
        success: false,
        message: 'Course not found'
      });
    }

    if (course.instructor.toString() !== req.user.id && !course.isPublished) {
      return res.status(403).json({
        success: false,
        message: 'Access denied'
      });
    }

    const content = await Content.find({ course: courseId })
      .populate('createdBy', 'username profile')
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      data: content
    });
  } catch (error) {
    console.error('Get course content error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch content',
      error: error.message
    });
  }
};

// @desc    Update content
// @route   PUT /api/content/:id
// @access  Private
exports.updateContent = async (req, res) => {
  try {
    const { title, description, accessControl } = req.body;
    
    const content = await Content.findById(req.params.id)
      .populate('course');

    if (!content) {
      return res.status(404).json({
        success: false,
        message: 'Content not found'
      });
    }

    // Verify ownership
    if (content.course.instructor.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Access denied'
      });
    }

    const updates = {};
    if (title) updates.title = title;
    if (description) updates.description = description;
    if (accessControl) updates.accessControl = accessControl;

    const updatedContent = await Content.findByIdAndUpdate(
      req.params.id,
      { $set: updates },
      { new: true }
    );

    res.json({
      success: true,
      message: 'Content updated successfully',
      data: updatedContent
    });
  } catch (error) {
    console.error('Update content error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update content',
      error: error.message
    });
  }
};

// @desc    Delete content
// @route   DELETE /api/content/:id
// @access  Private
exports.deleteContent = async (req, res) => {
  try {
    const content = await Content.findById(req.params.id)
      .populate('course');

    if (!content) {
      return res.status(404).json({
        success: false,
        message: 'Content not found'
      });
    }

    // Verify ownership
    if (content.course.instructor.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Access denied'
      });
    }

    await Content.findByIdAndDelete(req.params.id);

    res.json({
      success: true,
      message: 'Content deleted successfully'
    });
  } catch (error) {
    console.error('Delete content error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete content',
      error: error.message
    });
  }
};
