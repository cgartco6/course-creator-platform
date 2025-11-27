const mongoose = require('mongoose');
const { COURSE_CATEGORIES, COURSE_LEVELS, COURSE_STATUS } = require('../utils/constants');

const lessonSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  content: {
    type: String,
    required: true
  },
  duration: {
    type: Number,
    default: 0
  },
  media: [{
    type: {
      type: String,
      enum: ['video', 'image', 'audio', 'document', 'quiz'],
      required: true
    },
    url: String,
    thumbnail: String,
    duration: Number,
    size: Number,
    format: String
  }],
  order: {
    type: Number,
    required: true
  },
  isPublished: {
    type: Boolean,
    default: false
  },
  resources: [{
    title: String,
    url: String,
    type: String
  }],
  aiGenerated: {
    isGenerated: { type: Boolean, default: false },
    model: String,
    prompt: String,
    config: mongoose.Schema.Types.Mixed
  }
}, {
  timestamps: true
});

const moduleSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  description: String,
  order: {
    type: Number,
    required: true
  },
  lessons: [lessonSchema],
  isPublished: {
    type: Boolean,
    default: false
  },
  aiGenerated: {
    isGenerated: { type: Boolean, default: false },
    model: String,
    prompt: String
  }
}, {
  timestamps: true
});

const courseSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true,
    maxlength: 100
  },
  description: {
    type: String,
    required: true
  },
  shortDescription: {
    type: String,
    maxlength: 200
  },
  instructor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  category: {
    type: String,
    required: true,
    enum: Object.values(COURSE_CATEGORIES)
  },
  level: {
    type: String,
    enum: Object.values(COURSE_LEVELS),
    default: COURSE_LEVELS.ALL_LEVELS
  },
  price: {
    type: Number,
    default: 0,
    min: 0
  },
  currency: {
    type: String,
    default: 'USD'
  },
  thumbnail: String,
  promotionalVideo: String,
  tags: [String],
  modules: [moduleSchema],
  aiConfig: {
    creativityLevel: { type: Number, min: 1, max: 10, default: 7 },
    contentDepth: { type: Number, min: 1, max: 10, default: 8 },
    courseStyle: { type: String, default: 'modern' },
    contentTypes: [String],
    generationType: { type: String, enum: ['trending', 'rare', 'traditional', 'random'], default: 'trending' }
  },
  stats: {
    enrolledStudents: { type: Number, default: 0 },
    totalLessons: { type: Number, default: 0 },
    totalDuration: { type: Number, default: 0 },
    averageRating: { type: Number, default: 0 },
    ratingCount: { type: Number, default: 0 },
    completionRate: { type: Number, default: 0 },
    views: { type: Number, default: 0 },
    revenue: { type: Number, default: 0 }
  },
  requirements: [String],
  learningOutcomes: [String],
  targetAudience: [String],
  isPublished: {
    type: Boolean,
    default: false
  },
  isFeatured: {
    type: Boolean,
    default: false
  },
  status: {
    type: String,
    enum: Object.values(COURSE_STATUS),
    default: COURSE_STATUS.DRAFT
  },
  language: {
    type: String,
    default: 'en'
  },
  certificate: {
    providesCertificate: { type: Boolean, default: false },
    template: String,
    requirements: [String]
  },
  aiGenerated: {
    isGenerated: { type: Boolean, default: false },
    model: String,
    prompt: String,
    config: mongoose.Schema.Types.Mixed,
    generationTime: Date
  }
}, {
  timestamps: true
});

// Indexes for search and performance
courseSchema.index({
  title: 'text',
  description: 'text',
  shortDescription: 'text',
  tags: 'text'
});

courseSchema.index({ instructor: 1, createdAt: -1 });
courseSchema.index({ category: 1, level: 1 });
courseSchema.index({ isPublished: 1, isFeatured: 1 });

// Virtual for total duration
courseSchema.virtual('totalDuration').get(function() {
  return this.modules.reduce((total, module) => {
    return total + module.lessons.reduce((moduleTotal, lesson) => {
      return moduleTotal + (lesson.duration || 0);
    }, 0);
  }, 0);
});

// Virtual for total lessons
courseSchema.virtual('totalLessonsCount').get(function() {
  return this.modules.reduce((total, module) => {
    return total + module.lessons.length;
  }, 0);
});

// Pre-save middleware to update stats
courseSchema.pre('save', function(next) {
  this.stats.totalLessons = this.totalLessonsCount;
  this.stats.totalDuration = this.totalDuration;
  next();
});

// Static method to find trending courses
courseSchema.statics.findTrending = function(limit = 10) {
  return this.find({ isPublished: true })
    .sort({ 'stats.enrolledStudents': -1, 'stats.averageRating': -1 })
    .limit(limit)
    .populate('instructor', 'username profile');
};

// Static method to find courses by AI generation type
courseSchema.statics.findByAIType = function(generationType, limit = 10) {
  return this.find({ 
    'aiGenerated.isGenerated': true,
    'aiConfig.generationType': generationType,
    isPublished: true 
  })
    .sort({ createdAt: -1 })
    .limit(limit)
    .populate('instructor', 'username profile');
};

// Instance method to update course stats
courseSchema.methods.updateStats = async function() {
  // This would typically update stats based on enrollments, completions, etc.
  // For now, we'll just recalculate basic stats
  this.stats.totalLessons = this.totalLessonsCount;
  this.stats.totalDuration = this.totalDuration;
  await this.save();
};

// Instance method to generate AI content for course
courseSchema.methods.generateAIContent = async function(prompt, config = {}) {
  // This would integrate with AI service to generate content
  // For now, we'll mark the course as AI generated
  this.aiGenerated = {
    isGenerated: true,
    model: 'gpt-4',
    prompt: prompt,
    config: config,
    generationTime: new Date()
  };
  
  return await this.save();
};

module.exports = mongoose.model('Course', courseSchema);
