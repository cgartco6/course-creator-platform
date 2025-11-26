const express = require('express');
const { body } = require('express-validator');
const aiController = require('../controllers/aiController');
const auth = require('../middleware/auth');
const validate = require('../middleware/validation');

const router = express.Router();

// All routes are private
router.use(auth);

// Course generation routes
router.post('/generate-outline', [
  body('title')
    .notEmpty()
    .withMessage('Course title is required'),
  body('description')
    .notEmpty()
    .withMessage('Course description is required'),
  body('category')
    .isIn(['web', 'web3', 'python', 'react', 'wordpress', 'html5', 'javascript', 'nodejs', 'blockchain', 'ai-ml', 'data-science', 'mobile', 'cybersecurity', 'design', 'business', 'other'])
    .withMessage('Invalid category')
], validate, aiController.generateCourseOutline);

router.post('/generate-lesson', [
  body('lessonTitle')
    .notEmpty()
    .withMessage('Lesson title is required')
], validate, aiController.generateLessonContent);

router.post('/generate-quiz', aiController.generateQuiz);
router.post('/generate-media', aiController.generateMediaContent);
router.post('/analyze-course', aiController.analyzeCourse);

module.exports = router;
