const cloudinary = require('cloudinary').v2;
const fs = require('fs');
const path = require('path');

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Upload file to Cloudinary
exports.uploadToCloudinary = async (file, options = {}) => {
  try {
    const uploadOptions = {
      resource_type: 'auto',
      ...options
    };

    // If file is a buffer (from multer)
    if (file.buffer) {
      return new Promise((resolve, reject) => {
        const uploadStream = cloudinary.uploader.upload_stream(
          uploadOptions,
          (error, result) => {
            if (error) reject(error);
            else resolve(result);
          }
        );
        
        uploadStream.end(file.buffer);
      });
    }

    // If file is a path
    const result = await cloudinary.uploader.upload(file.path, uploadOptions);
    
    // Clean up temporary file
    if (file.path && fs.existsSync(file.path)) {
      fs.unlinkSync(file.path);
    }

    return result;
  } catch (error) {
    console.error('Cloudinary upload error:', error);
    throw new Error(`File upload failed: ${error.message}`);
  }
};

// Delete file from Cloudinary
exports.deleteFromCloudinary = async (publicId, resourceType = 'image') => {
  try {
    const result = await cloudinary.uploader.destroy(publicId, {
      resource_type: resourceType
    });
    return result;
  } catch (error) {
    console.error('Cloudinary delete error:', error);
    throw new Error(`File deletion failed: ${error.message}`);
  }
};

// Generate video thumbnail
exports.generateThumbnail = async (videoUrl, timeOffset = 10) => {
  try {
    // This would typically use a video processing service
    // For now, return a placeholder or use Cloudinary's built-in thumbnail generation
    return `${videoUrl}.jpg`; // Placeholder
  } catch (error) {
    console.error('Thumbnail generation error:', error);
    throw new Error(`Thumbnail generation failed: ${error.message}`);
  }
};

// Optimize media for web
exports.optimizeMedia = async (url, options = {}) => {
  try {
    const optimizationOptions = {
      quality: 'auto',
      fetch_format: 'auto',
      ...options
    };

    const optimizedUrl = cloudinary.url(url, optimizationOptions);
    return optimizedUrl;
  } catch (error) {
    console.error('Media optimization error:', error);
    throw new Error(`Media optimization failed: ${error.message}`);
  }
};

// Get media information
exports.getMediaInfo = async (publicId, resourceType = 'image') => {
  try {
    const result = await cloudinary.api.resource(publicId, {
      resource_type: resourceType
    });
    return result;
  } catch (error) {
    console.error('Get media info error:', error);
    throw new Error(`Failed to get media information: ${error.message}`);
  }
};
