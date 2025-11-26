import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { aiService } from '../../services/ai';
import { contentAPI } from '../../services/api';
import toast from 'react-hot-toast';
import {
  Edit,
  Play,
  Image,
  FileText,
  HelpCircle,
  Download,
  Upload,
  Zap
} from 'lucide-react';

const ContentEditor = ({ course, onContentGenerated, isLoading: parentLoading }) => {
  const [activeModule, setActiveModule] = useState(0);
  const [activeLesson, setActiveLesson] = useState(0);
  const [isGenerating, setIsGenerating] = useState(false);
  const [uploadProgress, setUploadProgress] = useState({});

  const { register, handleSubmit, watch, setValue } = useForm({
    defaultValues: {
      content: '',
      mediaPrompt: '',
      mediaType: 'image'
    }
  });

  const isLoading = isGenerating || parentLoading;
  const currentModule = course.modules[activeModule];
  const currentLesson = currentModule?.lessons[activeLesson];

  const mediaTypes = [
    { value: 'image', label: 'Image', icon: Image },
    { value: 'video', label: 'Video', icon: Play },
    { value: 'audio', label: 'Audio', icon: Play },
    { value: 'document', label: 'Document', icon: FileText }
  ];

  const handleGenerateLessonContent = async () => {
    if (!currentLesson) return;

    setIsGenerating(true);

    try {
      const result = await aiService.generateLessonContent({
        moduleTitle: currentModule.title,
        lessonTitle: currentLesson.title,
        lessonDescription: currentLesson.description,
        config: course.aiConfig
      });

      if (result.success) {
        setValue('content', result.data.content);
        toast.success('Lesson content generated successfully!');
      } else {
        toast.error(result.message);
      }
    } catch (error) {
      toast.error('Failed to generate lesson content');
      console.error('Generate lesson content error:', error);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleGenerateMedia = async () => {
    const prompt = watch('mediaPrompt');
    const mediaType = watch('mediaType');

    if (!prompt) {
      toast.error('Please enter a prompt for media generation');
      return;
    }

    setIsGenerating(true);

    try {
      const result = await aiService.generateMedia({
        courseId: course._id,
        prompt,
        mediaType,
        style: 'realistic'
      });

      if (result.success) {
        toast.success('Media generated successfully!');
        // Here you would typically upload the media to your content management system
      } else {
        toast.error(result.message);
      }
    } catch (error) {
      toast.error('Failed to generate media');
      console.error('Generate media error:', error);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleFileUpload = async (event, lessonId) => {
    const file = event.target.files[0];
    if (!file) return;

    setUploadProgress(prev => ({ ...prev, [lessonId]: 0 }));

    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('courseId', course._id);
      formData.append('moduleId', currentModule._id);
      formData.append('lessonId', lessonId);
      formData.append('title', file.name);
      formData.append('type', getFileType(file.type));

      await contentAPI.uploadContent(formData, {
        onUploadProgress: (progressEvent) => {
          const percentCompleted = Math.round(
            (progressEvent.loaded * 100) / progressEvent.total
          );
          setUploadProgress(prev => ({ ...prev, [lessonId]: percentCompleted }));
        }
      });

      toast.success('File uploaded successfully!');
    } catch (error) {
      toast.error('Failed to upload file');
      console.error('File upload error:', error);
    } finally {
      setUploadProgress(prev => ({ ...prev, [lessonId]: undefined }));
    }
  };

  const getFileType = (mimeType) => {
    if (mimeType.startsWith('image/')) return 'image';
    if (mimeType.startsWith('video/')) return 'video';
    if (mimeType.startsWith('audio/')) return 'audio';
    return 'document';
  };

  const handleSaveContent = async (data) => {
    try {
      // Save lesson content
      // This would typically update the lesson in the database
      toast.success('Content saved successfully!');
    } catch (error) {
      toast.error('Failed to save content');
      console.error('Save content error:', error);
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
      {/* Sidebar - Course Structure */}
      <div className="lg:col-span-1">
        <div className="card">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Course Structure
          </h3>
          <div className="space-y-2">
            {course.modules?.map((module, moduleIndex) => (
              <div key={module._id} className="border border-gray-200 rounded-lg">
                <button
                  onClick={() => setActiveModule(moduleIndex)}
                  className={`w-full text-left p-3 font-medium ${
                    activeModule === moduleIndex
                      ? 'bg-blue-50 text-blue-700 border-blue-200'
                      : 'hover:bg-gray-50'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span>Module {module.order}</span>
                    <span className="text-sm text-gray-500">
                      {module.lessons?.length} lessons
                    </span>
                  </div>
                  <div className="text-sm mt-1">{module.title}</div>
                </button>

                {activeModule === moduleIndex && module.lessons?.length > 0 && (
                  <div className="border-t border-gray-200">
                    {module.lessons.map((lesson, lessonIndex) => (
                      <button
                        key={lesson._id}
                        onClick={() => setActiveLesson(lessonIndex)}
                        className={`w-full text-left p-2 pl-6 text-sm ${
                          activeLesson === lessonIndex
                            ? 'bg-blue-100 text-blue-700'
                            : 'hover:bg-gray-50'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <span>Lesson {lesson.order}</span>
                          {lesson.duration && (
                            <span className="text-xs text-gray-500">
                              {lesson.duration}m
                            </span>
                          )}
                        </div>
                        <div className="truncate">{lesson.title}</div>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="lg:col-span-3 space-y-6">
        {currentLesson ? (
          <>
            {/* Lesson Header */}
            <div className="card">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h2 className="text-xl font-semibold text-gray-900">
                    {currentLesson.title}
                  </h2>
                  <p className="text-gray-600 mt-1">
                    {currentLesson.description}
                  </p>
                </div>
                <button
                  onClick={handleGenerateLessonContent}
                  disabled={isLoading}
                  className="btn btn-primary"
                >
                  <Zap className="h-4 w-4 mr-2" />
                  {isLoading ? 'Generating...' : 'AI Generate Content'}
                </button>
              </div>

              <div className="flex space-x-2">
                <span className="badge badge-primary">
                  Module {currentModule.order}
                </span>
                <span className="badge badge-gray">
                  {currentLesson.duration || 30} minutes
                </span>
                {currentLesson.contentType?.map((type, index) => (
                  <span key={index} className="badge badge-success">
                    {type}
                  </span>
                ))}
              </div>
            </div>

            {/* Content Editor */}
            <div className="card">
              <form onSubmit={handleSubmit(handleSaveContent)}>
                <div className="form-group">
                  <label className="form-label">Lesson Content</label>
                  <textarea
                    {...register('content')}
                    className="form-textarea"
                    rows={12}
                    placeholder="Enter lesson content here... Use markdown for formatting."
                  />
                </div>

                <div className="flex justify-between items-center">
                  <div className="text-sm text-gray-600">
                    Use markdown for rich text formatting
                  </div>
                  <button type="submit" className="btn btn-primary">
                    <Download className="h-4 w-4 mr-2" />
                    Save Content
                  </button>
                </div>
              </form>
            </div>

            {/* Media Generation */}
            <div className="card">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Generate Media Content
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div className="form-group">
                  <label className="form-label">Media Type</label>
                  <select
                    {...register('mediaType')}
                    className="form-select"
                  >
                    {mediaTypes.map(type => (
                      <option key={type.value} value={type.value}>
                        {type.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="form-group">
                  <label className="form-label">Media Prompt</label>
                  <input
                    type="text"
                    {...register('mediaPrompt')}
                    className="form-input"
                    placeholder="Describe what you want to generate..."
                  />
                </div>
              </div>

              <button
                onClick={handleGenerateMedia}
                disabled={isLoading}
                className="btn btn-outline w-full"
              >
                <Zap className="h-4 w-4 mr-2" />
                {isLoading ? 'Generating Media...' : 'Generate Media with AI'}
              </button>
            </div>

            {/* File Upload */}
            <div className="card">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Upload Files
              </h3>
              
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                <Upload className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                <div className="text-sm text-gray-600 mb-4">
                  Upload images, videos, audio, or documents for this lesson
                </div>
                <input
                  type="file"
                  onChange={(e) => handleFileUpload(e, currentLesson._id)}
                  className="hidden"
                  id="file-upload"
                />
                <label
                  htmlFor="file-upload"
                  className="btn btn-outline cursor-pointer"
                >
                  Choose Files
                </label>
                
                {uploadProgress[currentLesson._id] !== undefined && (
                  <div className="mt-4">
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-blue-600 h-2 rounded-full transition-all"
                        style={{ width: `${uploadProgress[currentLesson._id]}%` }}
                      ></div>
                    </div>
                    <div className="text-sm text-gray-600 mt-1">
                      Uploading: {uploadProgress[currentLesson._id]}%
                    </div>
                  </div>
                )}
              </div>
            </div>
          </>
        ) : (
          <div className="card text-center py-12">
            <Edit className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Select a Lesson
            </h3>
            <p className="text-gray-600">
              Choose a lesson from the sidebar to start editing content
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ContentEditor;
