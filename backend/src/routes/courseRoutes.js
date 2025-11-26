const express = require('express');
const { body } = require('express-validator');
const courseController = require('../controllers/courseController');
const auth = require('../middleware/auth');
const validate = require('../middleware/validation');

const router = express.Router();

// Public routes
router.get('/', courseController.getCourses);
router.get('/:id', courseController.getCourse);

// Private routes
router.post('/', auth, [
  body('title')
    .notEmpty()
    .withMessage('Course title is required')
    .isLength({ max: 100 })
    .withMessage('Title must be less than 100 characters'),
  body('description')
    .notEmpty()
    .withMessage('Course description is required'),
  body('category')
    .isIn(['web', 'web3', 'python', 'react', 'wordpress', 'html5', 'javascript', 'nodejs', 'blockchain', 'ai-ml', 'data-science', 'mobile', 'cybersecurity', 'design', 'business', 'other'])
    .withMessage('Invalid category'),
  body('level')
    .isIn(['beginner', 'intermediate', 'advanced', 'all-levels'])
    .withMessage('Invalid level')
], validate, courseController.createCourse);

router.put('/:id', auth, [
  body('title')
    .optional()
    .isLength({ max: 100 })
    .withMessage('Title must be less than 100 characters'),
  body('category')
    .optional()
    .isIn(['web', 'web3', 'python', 'react', 'wordpress', 'html5', 'javascript', 'nodejs', 'blockchain', 'ai-ml', 'data-science', 'mobile', 'cybersecurity', 'design', 'business', 'other'])
    .withMessage('Invalid category')
], validate, courseController.updateCourse);

router.delete('/:id', auth, courseController.deleteCourse);

// Module routes
router.post('/:id/modules', auth, [
  body('title')
    .notEmpty()
    .withMessage('Module title is required')
], validate, courseController.addModule);

// Lesson routes
router.post('/:id/modules/:moduleId/lessons', auth, [
  body('title')
    .notEmpty()
    .withMessage('Lesson title is required'),
  body('content')
    .notEmpty()
    .withMessage('Lesson content is required')
], validate, courseController.addLesson);

module.exports = router;
