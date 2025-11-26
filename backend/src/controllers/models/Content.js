const mongoose = require('mongoose');

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
    enum: ['video', 'image', 'audio', 'document', 'quiz', 'interactive', 'code']
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
  duration: Number, // in seconds for media
  size: Number, // in bytes
  metadata: {
    width: Number,
    height: Number,
    bitrate: Number,
    codec: String,
    pages: Number, // for documents
    wordCount: Number // for documents
  },
  aiGenerated: {
    isGenerated: { type: Boolean, default: false },
    model: String,
    prompt: String,
    config: mongoose.Schema.Types.Mixed
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
    enum: ['processing', 'ready', 'failed', 'archived'],
    default: 'processing'
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
    password: String
  }
}, {
  timestamps: true
});

// Index for efficient querying
contentSchema.index({ course: 1, lesson: 1 });
contentSchema.index({ type: 1, status: 1 });
contentSchema.index({ createdBy: 1, createdAt: -1 });

module.exports = mongoose.model('Content', contentSchema);
