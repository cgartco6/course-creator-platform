const { Configuration, OpenAIApi } = require('openai');

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});

const openai = new OpenAIApi(configuration);

// Generate course outline
exports.generateCourseOutline = async ({ title, description, category, level, learningOutcomes, targetAudience, config }) => {
  try {
    const creativityLevel = config.creativityLevel || 7;
    const contentDepth = config.contentDepth || 8;
    const courseStyle = config.courseStyle || 'modern';

    const prompt = `
      Create a comprehensive course outline for the following course:
      
      Title: ${title}
      Description: ${description}
      Category: ${category}
      Level: ${level}
      Learning Outcomes: ${learningOutcomes?.join(', ') || 'Not specified'}
      Target Audience: ${targetAudience?.join(', ') || 'Not specified'}
      
      Requirements:
      - Create ${contentDepth >= 8 ? '6-8' : '4-5'} modules
      - Each module should have ${contentDepth >= 8 ? '5-7' : '3-5'} lessons
      - Include practical exercises and projects
      - Style: ${courseStyle}
      - Creativity level: ${creativityLevel}/10
      
      Please respond with a JSON object containing:
      {
        "title": "Course Title",
        "description": "Course Description",
        "modules": [
          {
            "title": "Module Title",
            "description": "Module Description",
            "order": 1,
            "lessons": [
              {
                "title": "Lesson Title",
                "description": "Lesson Description",
                "order": 1,
                "duration": 30,
                "contentType": ["text", "video", "quiz"]
              }
            ]
          }
        ]
      }
    `;

    const response = await openai.createChatCompletion({
      model: "gpt-4",
      messages: [
        {
          role: "system",
          content: "You are an expert course designer and educator. Create detailed, engaging course outlines that follow modern pedagogical principles."
        },
        {
          role: "user",
          content: prompt
        }
      ],
      temperature: creativityLevel / 10,
      max_tokens: 4000
    });

    const content = response.data.choices[0].message.content;
    
    // Extract JSON from response
    const jsonMatch = content.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      return JSON.parse(jsonMatch[0]);
    } else {
      throw new Error('Failed to parse AI response');
    }
  } catch (error) {
    console.error('OpenAI API error:', error);
    throw new Error(`AI service error: ${error.message}`);
  }
};

// Generate lesson content
exports.generateLessonContent = async ({ moduleTitle, lessonTitle, lessonDescription, previousContent, config }) => {
  try {
    const creativityLevel = config.creativityLevel || 7;

    const prompt = `
      Create comprehensive lesson content for:
      
      Module: ${moduleTitle}
      Lesson: ${lessonTitle}
      Description: ${lessonDescription}
      
      ${previousContent ? `Previous content context: ${previousContent}` : ''}
      
      Requirements:
      - Create engaging, well-structured content
      - Include examples and practical applications
      - Use markdown formatting
      - Include learning objectives
      - Suggest multimedia elements (videos, images, diagrams)
      - Creativity level: ${creativityLevel}/10
      
      Please structure the content with:
      # Learning Objectives
      ## Main Content
      ### Key Concepts
      ### Examples
      ## Summary
      ## Practice Exercises
    `;

    const response = await openai.createChatCompletion({
      model: "gpt-4",
      messages: [
        {
          role: "system",
          content: "You are an expert educator who creates engaging, informative lesson content."
        },
        {
          role: "user",
          content: prompt
        }
      ],
      temperature: creativityLevel / 10,
      max_tokens: 3000
    });

    return {
      content: response.data.choices[0].message.content,
      estimatedReadingTime: Math.ceil(response.data.choices[0].message.content.length / 1000) * 5, // 5 min per 1000 chars
      suggestedMedia: ['diagram', 'example video', 'interactive exercise']
    };
  } catch (error) {
    console.error('OpenAI API error:', error);
    throw new Error(`AI service error: ${error.message}`);
  }
};

// Generate quiz
exports.generateQuiz = async ({ lessonContent, difficulty, questionCount, questionTypes }) => {
  try {
    const prompt = `
      Create a ${difficulty} level quiz based on the following lesson content:
      
      ${lessonContent}
      
      Requirements:
      - ${questionCount} questions
      - Question types: ${questionTypes.join(', ')}
      - Include multiple choice, true/false, and short answer questions
      - Provide correct answers and explanations
      
      Please respond with a JSON object containing:
      {
        "title": "Quiz Title",
        "description": "Quiz Description",
        "questions": [
          {
            "type": "multiple-choice",
            "question": "Question text",
            "options": ["Option A", "Option B", "Option C", "Option D"],
            "correctAnswer": 0,
            "explanation": "Explanation of correct answer"
          }
        ],
        "passingScore": 70
      }
    `;

    const response = await openai.createChatCompletion({
      model: "gpt-4",
      messages: [
        {
          role: "system",
          content: "You are an expert educator who creates fair and educational quizzes."
        },
        {
          role: "user",
          content: prompt
        }
      ],
      temperature: 0.3, // Lower temperature for more consistent quizzes
      max_tokens: 3000
    });

    const content = response.data.choices[0].message.content;
    const jsonMatch = content.match(/\{[\s\S]*\}/);
    
    if (jsonMatch) {
      return JSON.parse(jsonMatch[0]);
    } else {
      throw new Error('Failed to parse quiz response');
    }
  } catch (error) {
    console.error('OpenAI API error:', error);
    throw new Error(`AI service error: ${error.message}`);
  }
};

// Generate media prompt
exports.generateMediaPrompt = async (contentPrompt, mediaType, style) => {
  try {
    const prompt = `
      Create a detailed prompt for ${mediaType} generation based on:
      "${contentPrompt}"
      
      Style: ${style}
      Media Type: ${mediaType}
      
      Requirements:
      - Be specific and descriptive
      - Include style references
      - Focus on educational clarity
      - Maximum 2 sentences
    `;

    const response = await openai.createChatCompletion({
      model: "gpt-4",
      messages: [
        {
          role: "system",
          content: "You create excellent prompts for AI media generation."
        },
        {
          role: "user",
          content: prompt
        }
      ],
      temperature: 0.7,
      max_tokens: 150
    });

    return response.data.choices[0].message.content.trim();
  } catch (error) {
    console.error('OpenAI API error:', error);
    throw new Error(`AI service error: ${error.message}`);
  }
};
