const axios = require('axios');
const { Configuration, OpenAIApi } = require('openai');

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

// Generate image using DALL-E
exports.generateImage = async (prompt, size = '1024x1024') => {
  try {
    const response = await openai.createImage({
      prompt: prompt,
      n: 1,
      size: size,
    });

    return {
      url: response.data.data[0].url,
      size: size,
      prompt: prompt
    };
  } catch (error) {
    console.error('DALL-E API error:', error);
    throw new Error(`Image generation failed: ${error.message}`);
  }
};

// Generate audio (placeholder - would integrate with ElevenLabs or similar)
exports.generateAudio = async (text, voice = 'alloy') => {
  try {
    // This is a mock implementation
    // In production, integrate with actual TTS service
    return {
      url: `https://example.com/audio/generated-${Date.now()}.mp3`,
      duration: Math.ceil(text.length / 10), // Mock duration
      size: text.length * 100, // Mock size
      voice: voice
    };
  } catch (error) {
    console.error('Audio generation error:', error);
    throw new Error(`Audio generation failed: ${error.message}`);
  }
};

// Generate video (placeholder - would integrate with RunwayML or similar)
exports.generateVideo = async (prompt, duration = 30) => {
  try {
    // Mock implementation
    return {
      url: `https://example.com/video/generated-${Date.now()}.mp4`,
      duration: duration,
      size: duration * 1000000, // Mock size
      thumbnail: `https://example.com/thumbnails/generated-${Date.now()}.jpg`
    };
  } catch (error) {
    console.error('Video generation error:', error);
    throw new Error(`Video generation failed: ${error.message}`);
  }
};

// Main content generation function
exports.generateContentFromPrompt = async (prompt, mediaType, size = '1024x1024') => {
  try {
    switch (mediaType) {
      case 'image':
        return await exports.generateImage(prompt, size);
      case 'audio':
        return await exports.generateAudio(prompt);
      case 'video':
        return await exports.generateVideo(prompt);
      default:
        throw new Error(`Unsupported media type: ${mediaType}`);
    }
  } catch (error) {
    console.error('Content generation error:', error);
    throw new Error(`Content generation failed: ${error.message}`);
  }
};

// Batch generate multiple content types
exports.batchGenerateContent = async (contentRequests) => {
  try {
    const results = await Promise.all(
      contentRequests.map(async (request) => {
        try {
          const result = await exports.generateContentFromPrompt(
            request.prompt,
            request.mediaType,
            request.size
          );
          return {
            success: true,
            type: request.mediaType,
            data: result
          };
        } catch (error) {
          return {
            success: false,
            type: request.mediaType,
            error: error.message
          };
        }
      })
    );

    return results;
  } catch (error) {
    console.error('Batch content generation error:', error);
    throw new Error(`Batch content generation failed: ${error.message}`);
  }
};
