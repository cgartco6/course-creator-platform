const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const { USER_ROLES } = require('../utils/constants');

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    minlength: 3,
    maxlength: 30
  },
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true
  },
  password: {
    type: String,
    required: true,
    minlength: 6
  },
  role: {
    type: String,
    enum: Object.values(USER_ROLES),
    default: USER_ROLES.STUDENT
  },
  profile: {
    firstName: String,
    lastName: String,
    bio: String,
    avatar: String,
    socialLinks: {
      website: String,
      twitter: String,
      linkedin: String,
      github: String
    }
  },
  preferences: {
    language: { type: String, default: 'en' },
    notifications: {
      email: { type: Boolean, default: true },
      courseUpdates: { type: Boolean, default: true },
      marketing: { type: Boolean, default: true }
    },
    aiSettings: {
      creativityLevel: { type: Number, min: 1, max: 10, default: 7 },
      preferredContentTypes: { type: [String], default: ['videos', 'documents'] },
      autoGenerate: { type: Boolean, default: false }
    }
  },
  stats: {
    coursesCreated: { type: Number, default: 0 },
    coursesEnrolled: { type: Number, default: 0 },
    totalStudents: { type: Number, default: 0 },
    totalRevenue: { type: Number, default: 0 },
    averageRating: { type: Number, default: 0 },
    ratingCount: { type: Number, default: 0 }
  },
  subscription: {
    plan: { 
      type: String, 
      enum: ['free', 'pro', 'enterprise'], 
      default: 'free' 
    },
    expiresAt: Date,
    features: [String],
    stripeCustomerId: String,
    stripeSubscriptionId: String
  },
  isVerified: {
    type: Boolean,
    default: false
  },
  isActive: {
    type: Boolean,
    default: true
  },
  lastLogin: Date,
  loginCount: {
    type: Number,
    default: 0
  }
}, {
  timestamps: true
});

// Indexes
userSchema.index({ email: 1 });
userSchema.index({ username: 1 });
userSchema.index({ 'subscription.plan': 1 });
userSchema.index({ isActive: 1 });

// Hash password before saving
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  
  try {
    const salt = await bcrypt.genSalt(12);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

// Update last login on authentication
userSchema.pre('save', function(next) {
  if (this.isModified('lastLogin')) {
    this.loginCount += 1;
  }
  next();
});

// Compare password method
userSchema.methods.comparePassword = async function(candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

// Check if user has active subscription
userSchema.methods.hasActiveSubscription = function() {
  return this.subscription.expiresAt && this.subscription.expiresAt > new Date();
};

// Check if user can create more courses (based on subscription)
userSchema.methods.canCreateCourse = function() {
  const limits = {
    free: 3,
    pro: 50,
    enterprise: Infinity
  };
  
  return this.stats.coursesCreated < limits[this.subscription.plan];
};

// Get user's display name
userSchema.methods.getDisplayName = function() {
  if (this.profile.firstName && this.profile.lastName) {
    return `${this.profile.firstName} ${this.profile.lastName}`;
  }
  return this.username;
};

// Update user stats after course creation
userSchema.methods.updateCourseStats = async function() {
  const Course = mongoose.model('Course');
  
  const courseStats = await Course.aggregate([
    { $match: { instructor: this._id } },
    {
      $group: {
        _id: null,
        totalCourses: { $sum: 1 },
        totalStudents: { $sum: '$stats.enrolledStudents' },
        totalRevenue: { $sum: { $multiply: ['$price', '$stats.enrolledStudents'] } },
        averageRating: { $avg: '$stats.averageRating' }
      }
    }
  ]);
  
  if (courseStats.length > 0) {
    this.stats.coursesCreated = courseStats[0].totalCourses;
    this.stats.totalStudents = courseStats[0].totalStudents;
    this.stats.totalRevenue = courseStats[0].totalRevenue;
    this.stats.averageRating = courseStats[0].averageRating || 0;
  }
  
  await this.save();
};

// Remove password from JSON output
userSchema.methods.toJSON = function() {
  const user = this.toObject();
  delete user.password;
  return user;
};

// Static method to find instructors
userSchema.statics.findInstructors = function(limit = 10) {
  return this.find({ role: USER_ROLES.INSTRUCTOR })
    .sort({ 'stats.totalStudents': -1, 'stats.averageRating': -1 })
    .limit(limit)
    .select('username profile stats');
};

// Static method to find by email or username
userSchema.statics.findByEmailOrUsername = function(identifier) {
  return this.findOne({
    $or: [
      { email: identifier },
      { username: identifier }
    ]
  });
};

module.exports = mongoose.model('User', userSchema);
