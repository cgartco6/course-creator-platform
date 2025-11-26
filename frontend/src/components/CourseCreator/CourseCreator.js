import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { aiService, aiConfig } from '../../services/ai';
import { coursesAPI } from '../../services/api';
import toast from 'react-hot-toast';
import {
  Zap,
  Settings,
  Video,
  Image,
  Mic,
  FileText,
  HelpCircle
} from 'lucide-react';

const CourseCreator = ({ onCourseCreated, isLoading: parentLoading }) => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedOutline, setGeneratedOutline] = useState(null);
  const [aiConfigOpen, setAiConfigOpen] = useState(false);

  const { register, handleSubmit, watch, setValue, formState: { errors } } = useForm({
    defaultValues: {
      title: '',
      description: '',
      category: 'web',
      level: 'all-levels',
      learningOutcomes: '',
      targetAudience: '',
      aiConfig: {
        creativityLevel: 7,
        contentDepth: 8,
        courseStyle: 'modern',
        contentTypes: ['videos', 'documents', 'quizzes']
      }
    }
  });

  const watchedValues = watch();
  const isLoading = isGenerating || parentLoading;

  const categories = [
    { value: 'web', label: 'Web Development' },
    { value: 'web3', label: 'Web3 & Blockchain' },
    { value: 'python', label: 'Python' },
    { value: 'react', label: 'React' },
    { value: 'wordpress', label: 'WordPress' },
    { value: 'html5', label: 'HTML5' },
    { value: 'javascript', label: 'JavaScript' },
    { value: 'nodejs', label: 'Node.js' },
    { value: 'blockchain', label: 'Blockchain' },
    { value: 'ai-ml', label: 'AI & Machine Learning' },
    { value: 'data-science', label: 'Data Science' },
    { value: 'mobile', label: 'Mobile Development' },
    { value: 'cybersecurity', label: 'Cybersecurity' },
    { value: 'design', label: 'Design' },
    { value: 'business', label: 'Business' },
    { value: 'other', label: 'Other' }
  ];

  const levels = [
    { value: 'beginner', label: 'Beginner' },
    { value: 'intermediate', label: 'Intermediate' },
    { value: 'advanced', label: 'Advanced' },
    { value: 'all-levels', label: 'All Levels' }
  ];

  const handleGenerateOutline = async () => {
    const formData = watchedValues;
    
    if (!formData.title || !formData.description) {
      toast.error('Please fill in course title and description');
      return;
    }

    setIsGenerating(true);
    
    try {
      const result = await aiService.generateCourseOutline({
        title: formData.title,
        description: formData.description,
        category: formData.category,
        level: formData.level,
        learningOutcomes: formData.learningOutcomes ? [formData.learningOutcomes] : [],
        targetAudience: formData.targetAudience ? [formData.targetAudience] : [],
        aiConfig: formData.aiConfig
      });

      if (result.success) {
        setGeneratedOutline(result.data);
        toast.success('Course outline generated successfully!');
      } else {
        toast.error(result.message);
      }
    } catch (error) {
      toast.error('Failed to generate course outline');
      console.error('Generate outline error:', error);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleCreateCourse = async () => {
    if (!generatedOutline) {
      toast.error('Please generate a course outline first');
      return;
    }

    setIsGenerating(true);

    try {
      const courseData = {
        title: watchedValues.title,
        description: watchedValues.description,
        shortDescription: generatedOutline.description,
        category: watchedValues.category,
        level: watchedValues.level,
        learningOutcomes: watchedValues.learningOutcomes ? [watchedValues.learningOutcomes] : [],
        targetAudience: watchedValues.targetAudience ? [watchedValues.targetAudience] : [],
        aiConfig: watchedValues.aiConfig,
        modules: generatedOutline.modules
      };

      const response = await coursesAPI.createCourse(courseData);
      
      if (response.data.success) {
        toast.success('Course created successfully!');
        onCourseCreated(response.data.data);
      }
    } catch (error) {
      toast.error('Failed to create course');
      console.error('Create course error:', error);
    } finally {
      setIsGenerating(false);
    }
  };

  const toggleContentType = (type) => {
    const currentTypes = watchedValues.aiConfig.contentTypes;
    const newTypes = currentTypes.includes(type)
      ? currentTypes.filter(t => t !== type)
      : [...currentTypes, type];
    
    setValue('aiConfig.contentTypes', newTypes);
  };

  const contentTypes = [
    { value: 'videos', label: 'Videos', icon: Video },
    { value: 'images', label: 'Images', icon: Image },
    { value: 'audio', label: 'Audio', icon: Mic },
    { value: 'documents', label: 'Documents', icon: FileText },
    { value: 'quizzes', label: 'Quizzes', icon: HelpCircle },
    { value: 'interactive', label: 'Interactive', icon: Zap }
  ];

  return (
    <div className="space-y-8">
      {/* Course Basic Information */}
      <div className="card">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Course Information
        </h3>
        
        <div className="grid grid-cols-1 gap-6">
          <div className="form-group">
            <label className="form-label">Course Title</label>
            <input
              type="text"
              {...register('title', { required: 'Course title is required' })}
              className="form-input"
              placeholder="e.g., Advanced Web Development with React"
            />
            {errors.title && (
              <p className="text-red-600 text-sm mt-1">{errors.title.message}</p>
            )}
          </div>

          <div className="form-group">
            <label className="form-label">Course Description</label>
            <textarea
              {...register('description', { required: 'Course description is required' })}
              className="form-textarea"
              rows={4}
              placeholder="Describe what students will learn in this course..."
            />
            {errors.description && (
              <p className="text-red-600 text-sm mt-1">{errors.description.message}</p>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="form-group">
              <label className="form-label">Category</label>
              <select
                {...register('category')}
                className="form-select"
              >
                {categories.map(category => (
                  <option key={category.value} value={category.value}>
                    {category.label}
                  </option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">Difficulty Level</label>
              <select
                {...register('level')}
                className="form-select"
              >
                {levels.map(level => (
                  <option key={level.value} value={level.value}>
                    {level.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="form-group">
              <label className="form-label">Learning Outcomes</label>
              <textarea
                {...register('learningOutcomes')}
                className="form-textarea"
                rows={3}
                placeholder="What will students be able to do after completing this course?"
              />
            </div>

            <div className="form-group">
              <label className="form-label">Target Audience</label>
              <textarea
                {...register('targetAudience')}
                className="form-textarea"
                rows={3}
                placeholder="Who is this course for? (e.g., beginners, professionals, etc.)"
              />
            </div>
          </div>
        </div>
      </div>

      {/* AI Configuration */}
      <div className="card">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900">
            AI Configuration
          </h3>
          <button
            type="button"
            onClick={() => setAiConfigOpen(!aiConfigOpen)}
            className="btn btn-outline"
          >
            <Settings className="h-4 w-4 mr-2" />
            {aiConfigOpen ? 'Hide Settings' : 'Show Settings'}
          </button>
        </div>

        {aiConfigOpen && (
          <div className="space-y-6">
            {/* Content Types */}
            <div>
              <label className="form-label">Content Types to Include</label>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {contentTypes.map((type) => (
                  <button
                    key={type.value}
                    type="button"
                    onClick={() => toggleContentType(type.value)}
                    className={`p-3 border rounded-lg text-left transition-colors ${
                      watchedValues.aiConfig.contentTypes.includes(type.value)
                        ? 'border-blue-500 bg-blue-50 text-blue-700'
                        : 'border-gray-300 hover:border-gray-400'
                    }`}
                  >
                    <type.icon className="h-5 w-5 mb-2" />
                    <div className="font-medium text-sm">{type.label}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* AI Settings */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="form-group">
                <label className="form-label">
                  Creativity Level: {watchedValues.aiConfig.creativityLevel}/10
                </label>
                <input
                  type="range"
                  min="1"
                  max="10"
                  {...register('aiConfig.creativityLevel', { valueAsNumber: true })}
                  className="w-full"
                />
                <div className="flex justify-between text-sm text-gray-600 mt-1">
                  <span>More Factual</span>
                  <span>More Creative</span>
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">
                  Content Depth: {watchedValues.aiConfig.contentDepth}/10
                </label>
                <input
                  type="range"
                  min="1"
                  max="10"
                  {...register('aiConfig.contentDepth', { valueAsNumber: true })}
                  className="w-full"
                />
                <div className="flex justify-between text-sm text-gray-600 mt-1">
                  <span>Beginner</span>
                  <span>Advanced</span>
                </div>
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Course Style</label>
              <select
                {...register('aiConfig.courseStyle')}
                className="form-select"
              >
                {aiConfig.courseStyles.map(style => (
                  <option key={style.value} value={style.value}>
                    {style.label}
                  </option>
                ))}
              </select>
            </div>
          </div>
        )}
      </div>

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row gap-4">
        <button
          onClick={handleGenerateOutline}
          disabled={isLoading || !watchedValues.title || !watchedValues.description}
          className="btn btn-primary flex-1"
        >
          <Zap className="h-4 w-4 mr-2" />
          {isGenerating ? 'Generating Outline...' : 'Generate Course Outline'}
        </button>

        <button
          onClick={handleCreateCourse}
          disabled={isLoading || !generatedOutline}
          className="btn btn-success flex-1"
        >
          Create Course
        </button>
      </div>

      {/* Generated Outline Preview */}
      {generatedOutline && (
        <div className="card">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Generated Course Outline
          </h3>
          <div className="space-y-4">
            {generatedOutline.modules?.map((module, moduleIndex) => (
              <div key={moduleIndex} className="border border-gray-200 rounded-lg p-4">
                <h4 className="font-semibold text-gray-900 mb-2">
                  Module {module.order}: {module.title}
                </h4>
                <p className="text-gray-600 text-sm mb-3">{module.description}</p>
                <div className="space-y-2">
                  {module.lessons?.map((lesson, lessonIndex) => (
                    <div key={lessonIndex} className="flex items-center text-sm text-gray-700">
                      <div className="w-2 h-2 bg-blue-500 rounded-full mr-3"></div>
                      Lesson {lesson.order}: {lesson.title}
                      <span className="text-gray-500 text-xs ml-2">
                        ({lesson.duration} min)
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default CourseCreator;
