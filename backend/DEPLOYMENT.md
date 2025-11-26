
### docs/DEPLOYMENT.md
```markdown
# Deployment Guide

## Production Deployment

### 1. Backend Deployment

#### Option A: Heroku
```bash
# Login to Heroku
heroku login

# Create new app
heroku create your-course-creator-api

# Set environment variables
heroku config:set NODE_ENV=production
heroku config:set MONGODB_URI=your_production_mongodb_uri
heroku config:set JWT_SECRET=your_production_jwt_secret
heroku config:set CLOUDINARY_CLOUD_NAME=your_cloud_name
heroku config:set CLOUDINARY_API_KEY=your_api_key
heroku config:set CLOUDINARY_API_SECRET=your_api_secret
heroku config:set OPENAI_API_KEY=your_openai_key

# Deploy
git push heroku main
