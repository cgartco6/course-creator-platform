const mongoose = require('mongoose');
const { CONTENT_TYPES, CONTENT_STATUS } = require('../utils/constants');

const contentSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  description: String,
  type: {
    type: String,
    required: true,
    enum: Object.values(CONTENT_TYPES)
  },
  format: {
    type: String,
    required: true
  },
  url: {
    type: String,
    required: true
  },
  thumbnail: String,
  duration: Number,
  size: Number,
  metadata: {
    width: Number,
    height: Number,
    bitrate: Number,
    codec: String,
    pages: Number,
    wordCount: Number,
    language: String,
    transcript: String
  },
  aiGenerated: {
    isGenerated: { type: Boolean, default: false },
    model: String,
    prompt: String,
    config: mongoose.Schema.Types.Mixed,
    generationTime: Date
  },
  course: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Course',
    required: true
  },
  module: {
    type: mongoose.Schema.Types.ObjectId,
    required: true
  },
  lesson: {
    type: mongoose.Schema.Types.ObjectId,
    required: true
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  version: {
    type: Number,
    default: 1
  },
  status: {
    type: String,
    enum: Object.values(CONTENT_STATUS),
    default: CONTENT_STATUS.PROCESSING
  },
  processingProgress: {
    type: Number,
    min: 0,
    max: 100,
    default: 0
  },
  accessControl: {
    isPublic: { type: Boolean, default: false },
    allowedUsers: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    password: String,
    expiresAt: Date
  },
  analytics: {
    views: { type: Number, default: 0 },
    downloads: { type: Number, default: 0 },
    completionRate: { type: Number, default: 0 },
    averageWatchTime: { type: Number, default: 0 }
  },
  tags: [String],
  categories: [String]
}, {
  timestamps: true
});

// Indexes for efficient querying
contentSchema.index({ course: 1, lesson: 1 });
contentSchema.index({ type: 1, status: 1 });
contentSchema.index({ createdBy: 1, createdAt: -1 });
contentSchema.index({ 'aiGenerated.isGenerated': 1 });
contentSchema.index({ tags: 1 });

// Text search index
contentSchema.index({
  title: 'text',
  description: 'text',
  tags: 'text'
});

// Pre-save middleware to update format based on type
contentSchema.pre('save', function(next) {
  if (this.isModified('type') && !this.format) {
    const formatMap = {
      'video': 'mp4',
      'image': 'jpg',
      'audio': 'mp3',
      'document': 'pdf',
      'quiz': 'json',
      'interactive': 'html',
      'code': 'zip'
    };
    this.format = formatMap[this.type] || 'unknown';
  }
  next();
});

// Instance method to update processing status
contentSchema.methods.updateProcessingStatus = async function(progress, status = null) {
  this.processingProgress = progress;
  if (status) {
    this.status = status;
  }
  
  if (progress >= 100) {
    this.status = CONTENT_STATUS.READY;
  }
  
  return await this.save();
};

// Instance method to generate AI content
contentSchema.methods.generateAIContent = async function(prompt, config = {}) {
  // This would integrate with AI service to generate content
  // For now, we'll mark the content as AI generated
  this.aiGenerated = {
    isGenerated: true,
    model: 'gpt-4',
    prompt: prompt,
    config: config,
    generationTime: new Date()
  };
  
  this.status = CONTENT_STATUS.READY;
  return await this.save();
};

// Static method to find content by course
contentSchema.statics.findByCourse = function(courseId, options = {}) {
  const query = { course: courseId };
  
  if (options.type) {
    query.type = options.type;
  }
  
  if (options.status) {
    query.status = options.status;
  }
  
  return this.find(query)
    .populate('createdBy', 'username profile')
    .sort({ createdAt: -1 });
};

// Static method to find AI-generated content
contentSchema.statics.findAIGenerated = function(limit = 20) {
  return this.find({ 'aiGenerated.isGenerated': true })
    .populate('course', 'title category')
    .populate('createdBy', 'username profile')
    .sort({ 'aiGenerated.generationTime': -1 })
    .limit(limit);
};

// Static method to get content statistics
contentSchema.statics.getStats = async function(userId = null) {
  const matchStage = userId ? { createdBy: new mongoose.Types.ObjectId(userId) } : {};
  
  return await this.aggregate([
    { $match: matchStage },
    {
      $group: {
        _id: '$type',
        count: { $sum: 1 },
        totalSize: { $sum: '$size' },
        averageDuration: { $avg: '$duration' }
      }
    }
  ]);
};

// Virtual for content duration in minutes
contentSchema.virtual('durationMinutes').get(function() {
  return this.duration ? Math.ceil(this.duration / 60) : 0;
});

// Virtual for formatted size
contentSchema.virtual('formattedSize').get(function() {
  if (!this.size) return '0 Bytes';
  
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(this.size) / Math.log(k));
  
  return parseFloat((this.size / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
});

module.exports = mongoose.model('Content', contentSchema);
