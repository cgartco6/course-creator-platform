@echo off
echo ====================================
echo CourseCreator AI Platform Installer
echo ====================================
echo.

echo Checking system requirements...
echo.

:: Check Node.js
node --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ERROR: Node.js is not installed!
    echo Please install Node.js 16+ from https://nodejs.org/
    pause
    exit /b 1
)

:: Check npm
npm --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ERROR: npm is not installed!
    pause
    exit /b 1
)

echo System requirements check passed!
echo.

:: Create project directory
echo Creating project directory...
if not exist "coursecreator-ai-platform" mkdir coursecreator-ai-platform
cd coursecreator-ai-platform

:: Clone or create project structure
echo Setting up project structure...
mkdir backend
mkdir frontend
mkdir docs
mkdir scripts

echo.
echo ====================================
echo Backend Setup
echo ====================================
echo.

cd backend

:: Create backend structure
mkdir src
mkdir src\controllers
mkdir src\models
mkdir src\routes
mkdir src\middleware
mkdir src\services
mkdir src\utils
mkdir src\config
mkdir tests
mkdir tests\models
mkdir tests\controllers
mkdir tests\services
mkdir uploads
mkdir uploads\images
mkdir uploads\videos
mkdir uploads\documents
mkdir uploads\temp

:: Create backend package.json
echo Creating backend package.json...
(
echo {
echo   "name": "coursecreator-backend",
echo   "version": "1.0.0",
echo   "description": "AI-powered course creation platform backend",
echo   "main": "server.js",
echo   "scripts": {
echo     "start": "node server.js",
echo     "dev": "nodemon server.js",
echo     "test": "jest",
echo     "test:watch": "jest --watch",
echo     "test:coverage": "jest --coverage"
echo   },
echo   "dependencies": {
echo     "express": "^4.18.2",
echo     "mongoose": "^7.4.0",
echo     "bcryptjs": "^2.4.3",
echo     "jsonwebtoken": "^9.0.1",
echo     "cors": "^2.8.5",
echo     "dotenv": "^16.3.1",
echo     "multer": "^1.4.5",
echo     "cloudinary": "^1.40.0",
echo     "openai": "^3.3.0",
echo     "axios": "^1.4.0",
echo     "express-validator": "^7.0.1",
echo     "helmet": "^7.0.0",
echo     "express-rate-limit": "^6.8.1",
echo     "redis": "^4.6.7",
echo     "nodemailer": "^6.9.4",
echo     "moment": "^2.29.4"
echo   },
echo   "devDependencies": {
echo     "nodemon": "^2.0.22",
echo     "jest": "^29.5.0",
echo     "supertest": "^6.3.3"
echo   },
echo   "keywords": ["ai", "courses", "education", "platform"],
echo   "author": "CourseCreator AI",
echo   "license": "MIT"
echo }
) > package.json

:: Create environment files
echo Creating environment files...
(
echo # Backend Environment Configuration
echo NODE_ENV=development
echo PORT=5000
echo FRONTEND_URL=http://localhost:3000
echo.
echo # Database
echo MONGODB_URI=mongodb://localhost:27017/coursecreator
echo REDIS_URL=redis://localhost:6379
echo.
echo # JWT
echo JWT_SECRET=your_super_secure_jwt_secret_key_here_change_in_production
echo JWT_EXPIRE=30d
echo.
echo # Cloudinary
echo CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
echo CLOUDINARY_API_KEY=your_cloudinary_api_key
echo CLOUDINARY_API_SECRET=your_cloudinary_api_secret
echo.
echo # OpenAI
echo OPENAI_API_KEY=your_openai_api_key_here
) > .env

(
echo # Backend Environment Configuration Template
echo NODE_ENV=development
echo PORT=5000
echo FRONTEND_URL=http://localhost:3000
echo.
echo # Database
echo MONGODB_URI=mongodb://localhost:27017/coursecreator
echo REDIS_URL=redis://localhost:6379
echo.
echo # JWT
echo JWT_SECRET=your_super_secure_jwt_secret_key_here_change_in_production
echo JWT_EXPIRE=30d
echo.
echo # Cloudinary
echo CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
echo CLOUDINARY_API_KEY=your_cloudinary_api_key
echo CLOUDINARY_API_SECRET=your_cloudinary_api_secret
echo.
echo # OpenAI
echo OPENAI_API_KEY=your_openai_api_key_here
) > .env.example

:: Install backend dependencies
echo Installing backend dependencies...
call npm install

echo.
echo ====================================
echo Frontend Setup
echo ====================================
echo.

cd ..\frontend

:: Create frontend structure
mkdir public
mkdir public\css
mkdir src
mkdir src\components
mkdir src\components\Layout
mkdir src\components\Dashboard
mkdir src\components\CourseCreator
mkdir src\components\ContentEditor
mkdir src\components\PreviewPanel
mkdir src\pages
mkdir src\pages\Home
mkdir src\pages\CreateCourse
mkdir src\pages\MyCourses
mkdir src\pages\Settings
mkdir src\pages\Auth
mkdir src\services
mkdir src\styles
mkdir src\hooks

:: Create frontend package.json
echo Creating frontend package.json...
(
echo {
echo   "name": "coursecreator-frontend",
echo   "version": "1.0.0",
echo   "description": "AI-powered course creation platform frontend",
echo   "main": "src/index.js",
echo   "scripts": {
echo     "start": "react-scripts start",
echo     "build": "react-scripts build",
echo     "test": "react-scripts test",
echo     "eject": "react-scripts eject"
echo   },
echo   "dependencies": {
echo     "react": "^18.2.0",
echo     "react-dom": "^18.2.0",
echo     "react-scripts": "5.0.1",
echo     "react-router-dom": "^6.14.1",
echo     "axios": "^1.4.0",
echo     "react-query": "^3.39.3",
echo     "react-hook-form": "^7.45.0",
echo     "framer-motion": "^10.12.18",
echo     "react-hot-toast": "^2.4.1",
echo     "lucide-react": "^0.263.1",
echo     "react-dropzone": "^14.2.3",
echo     "react-markdown": "^8.0.7",
echo     "react-modal": "^3.16.1",
echo     "date-fns": "^2.30.0",
echo     "clsx": "^2.0.0",
echo     "tailwindcss": "^3.3.3",
echo     "autoprefixer": "^10.4.14",
echo     "postcss": "^8.4.24"
echo   },
echo   "devDependencies": {
echo     "@testing-library/jest-dom": "^5.17.0",
echo     "@testing-library/react": "^13.4.0",
echo     "@testing-library/user-event": "^14.4.3"
echo   },
echo   "browserslist": {
echo     "production": [
echo       ">0.2%",
echo       "not dead",
echo       "not op_mini all"
echo     ],
echo     "development": [
echo       "last 1 chrome version",
echo       "last 1 firefox version",
echo       "last 1 safari version"
echo     ]
echo   }
echo }
) > package.json

:: Create frontend environment file
echo Creating frontend environment file...
(
echo REACT_APP_API_URL=http://localhost:5000/api
echo REACT_APP_ENVIRONMENT=development
) > .env

:: Install frontend dependencies
echo Installing frontend dependencies...
call npm install

echo.
echo ====================================
echo Database Setup
echo ====================================
echo.

cd ..

echo Installing MongoDB...
echo Please install MongoDB Community Edition from:
echo https://www.mongodb.com/try/download/community
echo.
echo Installing Redis for Windows...
echo Please install Redis for Windows from:
echo https://github.com/microsoftarchive/redis/releases
echo.

:: Create setup scripts
mkdir scripts
(
echo const mongoose = require('mongoose');
echo require('dotenv').config();
echo.
echo const User = require('../backend/src/models/User');
echo const Course = require('../backend/src/models/Course');
echo.
echo async function setupDatabase() {
echo   try {
echo     await mongoose.connect(process.env.MONGODB_URI);
echo     console.log('Connected to MongoDB');
echo.
echo     // Create admin user
echo     const adminUser = new User({
echo       username: 'admin',
echo       email: 'admin@coursecreator.com',
echo       password: 'admin123',
echo       role: 'admin',
echo       isVerified: true,
echo       profile: {
echo         firstName: 'Admin',
echo         lastName: 'User'
echo       }
echo     });
echo.
echo     await adminUser.save();
echo     console.log('Admin user created:', adminUser.username);
echo.
echo     // Create sample courses
echo     const sampleCourses = [
echo       {
echo         title: 'Introduction to Web Development',
echo         description: 'Learn the basics of HTML, CSS, and JavaScript',
echo         category: 'web',
echo         level: 'beginner',
echo         instructor: adminUser._id,
echo         isPublished: true,
echo         stats: {
echo           enrolledStudents: 150,
echo           averageRating: 4.5
echo         }
echo       },
echo       {
echo         title: 'AI and Machine Learning Fundamentals',
echo         description: 'Introduction to AI concepts and machine learning algorithms',
echo         category: 'ai-ml',
echo         level: 'intermediate',
echo         instructor: adminUser._id,
echo         isPublished: true,
echo         stats: {
echo           enrolledStudents: 89,
echo           averageRating: 4.7
echo         }
echo       }
echo     ];
echo.
echo     await Course.insertMany(sampleCourses);
echo     console.log('Sample courses created');
echo.
echo     console.log('Database setup completed successfully!');
echo     process.exit(0);
echo   } catch (error) {
echo     console.error('Database setup failed:', error);
echo     process.exit(1);
echo   }
echo }
echo.
echo setupDatabase();
) > scripts\setup-db.js

echo.
echo ====================================
echo Installation Complete!
echo ====================================
echo.
echo Next steps:
echo 1. Install MongoDB Community Edition
echo 2. Install Redis for Windows 
echo 3. Configure your environment variables in backend/.env
echo 4. Start the backend: cd backend && npm run dev
echo 5. Start the frontend: cd frontend && npm start
echo.
echo For detailed setup instructions, see docs/SETUP.md
echo.
pause
