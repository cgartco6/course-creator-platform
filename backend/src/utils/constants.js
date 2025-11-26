// Course categories
exports.COURSE_CATEGORIES = {
  WEB: 'web',
  WEB3: 'web3',
  PYTHON: 'python',
  REACT: 'react',
  WORDPRESS: 'wordpress',
  HTML5: 'html5',
  JAVASCRIPT: 'javascript',
  NODEJS: 'nodejs',
  BLOCKCHAIN: 'blockchain',
  AI_ML: 'ai-ml',
  DATA_SCIENCE: 'data-science',
  MOBILE: 'mobile',
  CYBERSECURITY: 'cybersecurity',
  DESIGN: 'design',
  BUSINESS: 'business',
  OTHER: 'other'
};

// Course levels
exports.COURSE_LEVELS = {
  BEGINNER: 'beginner',
  INTERMEDIATE: 'intermediate',
  ADVANCED: 'advanced',
  ALL_LEVELS: 'all-levels'
};

// Content types
exports.CONTENT_TYPES = {
  VIDEO: 'video',
  IMAGE: 'image',
  AUDIO: 'audio',
  DOCUMENT: 'document',
  QUIZ: 'quiz',
  INTERACTIVE: 'interactive',
  CODE: 'code'
};

// User roles
exports.USER_ROLES = {
  STUDENT: 'student',
  INSTRUCTOR: 'instructor',
  ADMIN: 'admin'
};

// Course status
exports.COURSE_STATUS = {
  DRAFT: 'draft',
  IN_PROGRESS: 'in-progress',
  COMPLETED: 'completed',
  PUBLISHED: 'published',
  ARCHIVED: 'archived'
};

// Content status
exports.CONTENT_STATUS = {
  PROCESSING: 'processing',
  READY: 'ready',
  FAILED: 'failed',
  ARCHIVED: 'archived'
};

// AI configuration defaults
exports.AI_DEFAULTS = {
  CREATIVITY_LEVEL: 7,
  CONTENT_DEPTH: 8,
  COURSE_STYLE: 'modern'
};

// Pagination defaults
exports.PAGINATION = {
  DEFAULT_PAGE: 1,
  DEFAULT_LIMIT: 10,
  MAX_LIMIT: 100
};

// File size limits (in bytes)
exports.FILE_LIMITS = {
  IMAGE: 10 * 1024 * 1024, // 10MB
  VIDEO: 500 * 1024 * 1024, // 500MB
  AUDIO: 50 * 1024 * 1024, // 50MB
  DOCUMENT: 20 * 1024 * 1024 // 20MB
};

// Supported file formats
exports.SUPPORTED_FORMATS = {
  IMAGE: ['jpg', 'jpeg', 'png', 'gif', 'webp', 'svg'],
  VIDEO: ['mp4', 'mov', 'avi', 'mkv', 'webm'],
  AUDIO: ['mp3', 'wav', 'ogg', 'm4a'],
  DOCUMENT: ['pdf', 'doc', 'docx', 'ppt', 'pptx', 'xls', 'xlsx', 'txt']
};

// Error messages
exports.ERROR_MESSAGES = {
  UNAUTHORIZED: 'Unauthorized access',
  FORBIDDEN: 'Access forbidden',
  NOT_FOUND: 'Resource not found',
  VALIDATION_ERROR: 'Validation failed',
  SERVER_ERROR: 'Internal server error',
  RATE_LIMIT: 'Rate limit exceeded'
};

// Success messages
exports.SUCCESS_MESSAGES = {
  CREATED: 'Resource created successfully',
  UPDATED: 'Resource updated successfully',
  DELETED: 'Resource deleted successfully',
  UPLOADED: 'File uploaded successfully'
};
