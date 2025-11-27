const mongoose = require('mongoose');
require('dotenv').config();

const User = require('../backend/src/models/User');
const Course = require('../backend/src/models/Course');
const { COURSE_CATEGORIES, COURSE_LEVELS, USER_ROLES } = require('../backend/src/utils/constants');

async function setupDatabase() {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/coursecreator');
    console.log('✅ Connected to MongoDB');

    // Clear existing data (optional - for fresh setup)
    await User.deleteMany({});
    await Course.deleteMany({});
    console.log('🗑️  Cleared existing data');

    // Create admin user
    const adminUser = new User({
      username: 'admin',
      email: 'admin@coursecreator.com',
      password: 'admin123',
      role: USER_ROLES.ADMIN,
      isVerified: true,
      profile: {
        firstName: 'Admin',
        lastName: 'User',
        bio: 'Platform administrator and course creator'
      },
      preferences: {
        aiSettings: {
          creativityLevel: 8,
          preferredContentTypes: ['videos', 'documents', 'quizzes'],
          autoGenerate: true
        }
      }
    });

    await adminUser.save();
    console.log('👤 Admin user created:', adminUser.username);

    // Create instructor user
    const instructorUser = new User({
      username: 'instructor',
      email: 'instructor@coursecreator.com',
      password: 'instructor123',
      role: USER_ROLES.INSTRUCTOR,
      isVerified: true,
      profile: {
        firstName: 'Jane',
        lastName: 'Smith',
        bio: 'Professional course creator and educator with 5+ years experience'
      },
      stats: {
        coursesCreated: 12,
        totalStudents: 1248,
        totalRevenue: 12500,
        averageRating: 4.7
      }
    });

    await instructorUser.save();
    console.log('👨‍🏫 Instructor user created:', instructorUser.username);

    // Create sample courses
    const sampleCourses = [
      {
        title: 'Complete Web Development Bootcamp 2024',
        description: 'Learn HTML, CSS, JavaScript, React, Node.js, MongoDB and more! Build real projects.',
        shortDescription: 'Become a full-stack web developer with this comprehensive course',
        category: COURSE_CATEGORIES.WEB,
        level: COURSE_LEVELS.BEGINNER,
        instructor: instructorUser._id,
        price: 89.99,
        tags: ['web development', 'javascript', 'react', 'nodejs', 'mongodb'],
        requirements: ['Basic computer skills', 'No programming experience needed'],
        learningOutcomes: [
          'Build responsive websites with HTML5 and CSS3',
          'Create interactive web applications with JavaScript',
          'Develop full-stack applications with React and Node.js',
          'Work with databases like MongoDB',
          'Deploy applications to cloud platforms'
        ],
        isPublished: true,
        isFeatured: true,
        stats: {
          enrolledStudents: 342,
          averageRating: 4.8,
          ratingCount: 127,
          completionRate: 72,
          views: 1250,
          revenue: 30780
        },
        modules: [
          {
            title: 'HTML5 Fundamentals',
            order: 1,
            lessons: [
              {
                title: 'Introduction to HTML5',
                content: 'Learn the basics of HTML5 structure and semantic elements...',
                order: 1,
                duration: 45
              },
              {
                title: 'Forms and Input Elements',
                content: 'Create interactive forms with various input types...',
                order: 2,
                duration: 60
              }
            ]
          },
          {
            title: 'CSS3 and Responsive Design',
            order: 2,
            lessons: [
              {
                title: 'CSS Grid and Flexbox',
                content: 'Master modern CSS layout techniques...',
                order: 1,
                duration: 75
              }
            ]
          }
        ]
      },
      {
        title: 'AI & Machine Learning with Python',
        description: 'Complete guide to artificial intelligence and machine learning using Python, TensorFlow, and scikit-learn',
        shortDescription: 'Master AI and ML concepts with hands-on Python projects',
        category: COURSE_CATEGORIES.AI_ML,
        level: COURSE_LEVELS.INTERMEDIATE,
        instructor: instructorUser._id,
        price: 99.99,
        tags: ['artificial intelligence', 'machine learning', 'python', 'tensorflow', 'data science'],
        isPublished: true,
        stats: {
          enrolledStudents: 215,
          averageRating: 4.7,
          ratingCount: 89,
          completionRate: 65,
          views: 890,
          revenue: 21485
        },
        aiConfig: {
          creativityLevel: 8,
          contentDepth: 9,
          courseStyle: 'modern',
          contentTypes: ['videos', 'documents', 'quizzes'],
          generationType: 'trending'
        },
        aiGenerated: {
          isGenerated: true,
          model: 'gpt-4',
          prompt: 'Create a comprehensive AI and machine learning course for intermediate Python developers',
          generationTime: new Date('2024-01-15')
        }
      },
      {
        title: 'Web3 and Blockchain Development',
        description: 'Learn to build decentralized applications (dApps) with Ethereum, Solidity, and smart contracts',
        shortDescription: 'Become a Web3 developer and build blockchain applications',
        category: COURSE_CATEGORIES.WEB3,
        level: COURSE_LEVELS.ADVANCED,
        instructor: instructorUser._id,
        price: 129.99,
        tags: ['blockchain', 'web3', 'ethereum', 'solidity', 'smart contracts'],
        isPublished: true,
        stats: {
          enrolledStudents: 128,
          averageRating: 4.9,
          ratingCount: 45,
          completionRate: 58,
          views: 567,
          revenue: 16627
        },
        aiConfig: {
          creativityLevel: 9,
          contentDepth: 10,
          courseStyle: 'hands-on',
          generationType: 'trending'
        }
      }
    ];

    await Course.insertMany(sampleCourses);
    console.log('📚 Sample courses created');

    // Update instructor stats
    await instructorUser.updateCourseStats();
    console.log('📊 Instructor stats updated');

    console.log('\n🎉 Database setup completed successfully!');
    console.log('\n📋 Created users:');
    console.log('   Admin: admin@coursecreator.com / admin123');
    console.log('   Instructor: instructor@coursecreator.com / instructor123');
    console.log('\n📚 Created 3 sample courses with AI-generated content');

    process.exit(0);
  } catch (error) {
    console.error('❌ Database setup failed:', error);
    process.exit(1);
  }
}

// Run setup if called directly
if (require.main === module) {
  setupDatabase();
}

module.exports = setupDatabase;
