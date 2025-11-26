const mongoose = require('mongoose');

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
    type: Number, // in minutes
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
  }]
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
    enum: ['web', 'web3', 'python', 'react', 'wordpress', 'html5', 'javascript', 'nodejs', 'blockchain', 'ai-ml', 'data-science', 'mobile', 'cybersecurity', 'design', 'business', 'other']
  },
  level: {
    type: String,
    enum: ['beginner', 'intermediate', 'advanced', 'all-levels'],
    default: 'all-levels'
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
    contentTypes: [String]
  },
  stats: {
    enrolledStudents: { type: Number, default: 0 },
    totalLessons: { type: Number, default: 0 },
    totalDuration: { type: Number, default: 0 }, // in minutes
    averageRating: { type: Number, default: 0 },
    ratingCount: { type: Number, default: 0 },
    completionRate: { type: Number, default: 0 }
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
    enum: ['draft', 'in-progress', 'completed', 'published', 'archived'],
    default: 'draft'
  },
  language: {
    type: String,
    default: 'en'
  },
  certificate: {
    providesCertificate: { type: Boolean, default: false },
    template: String,
    requirements: [String]
  }
}, {
  timestamps: true
});

// Index for search functionality
courseSchema.index({
  title: 'text',
  description: 'text',
  shortDescription: 'text',
  tags: 'text'
});

// Virtual for total duration
courseSchema.virtual('totalDuration').get(function() {
  return this.modules.reduce((total, module) => {
    return total + module.lessons.reduce((moduleTotal, lesson) => {
      return moduleTotal + (lesson.duration || 0);
    }, 0);
  }, 0);
});

module.exports = mongoose.model('Course', courseSchema);
