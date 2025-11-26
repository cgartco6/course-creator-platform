import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import CourseCreator from '../../components/CourseCreator/CourseCreator';
import ContentEditor from '../../components/ContentEditor/ContentEditor';
import PreviewPanel from '../../components/PreviewPanel/PreviewPanel';
import { useCourseCreation } from '../../hooks/useCourseCreation';
import { 
  FileText, 
  Edit, 
  Eye,
  Save,
  Rocket
} from 'lucide-react';

const CreateCourse = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('create');
  const [courseData, setCourseData] = useState(null);
  const [generatedContent, setGeneratedContent] = useState(null);

  const {
    createCourse,
    generateOutline,
    updateCourse,
    isLoading,
    error
  } = useCourseCreation();

  const handleCourseCreated = (data) => {
    setCourseData(data);
    setActiveTab('content');
  };

  const handleContentGenerated = (content) => {
    setGeneratedContent(content);
    setActiveTab('preview');
  };

  const handleSaveCourse = async () => {
    if (!courseData) return;

    try {
      const result = await updateCourse(courseData._id, {
        ...courseData,
        status: 'completed'
      });

      if (result.success) {
        navigate('/my-courses');
      }
    } catch (error) {
      console.error('Failed to save course:', error);
    }
  };

  const tabs = [
    { id: 'create', label: 'Course Creation', icon: FileText },
    { id: 'content', label: 'Content Editor', icon: Edit },
    { id: 'preview', label: 'Preview', icon: Eye },
  ];

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Create New Course
          </h1>
          <p className="text-gray-600">
            Use AI to quickly create engaging and professional courses
          </p>
        </div>

        {/* Progress Tabs */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 mb-8">
          <div className="border-b border-gray-200">
            <nav className="flex -mb-px">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center px-6 py-4 border-b-2 font-medium text-sm ${
                    activeTab === tab.id
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  <tab.icon className="h-4 w-4 mr-2" />
                  {tab.label}
                </button>
              ))}
            </nav>
          </div>

          <div className="p-6">
            {/* Course Creation Tab */}
            {activeTab === 'create' && (
              <div>
                <div className="mb-6">
                  <h2 className="text-xl font-semibold text-gray-900 mb-2">
                    Course Information
                  </h2>
                  <p className="text-gray-600">
                    Describe what you want to teach and let AI create your course structure
                  </p>
                </div>
                <CourseCreator 
                  onCourseCreated={handleCourseCreated}
                  isLoading={isLoading}
                />
              </div>
            )}

            {/* Content Editor Tab */}
            {activeTab === 'content' && courseData && (
              <div>
                <div className="mb-6">
                  <h2 className="text-xl font-semibold text-gray-900 mb-2">
                    Course Content
                  </h2>
                  <p className="text-gray-600">
                    Edit and enhance your AI-generated course content
                  </p>
                </div>
                <ContentEditor
                  course={courseData}
                  onContentGenerated={handleContentGenerated}
                  isLoading={isLoading}
                />
              </div>
            )}

            {/* Preview Tab */}
            {activeTab === 'preview' && courseData && generatedContent && (
              <div>
                <div className="flex justify-between items-center mb-6">
                  <div>
                    <h2 className="text-xl font-semibold text-gray-900 mb-2">
                      Course Preview
                    </h2>
                    <p className="text-gray-600">
                      Review your course before publishing
                    </p>
                  </div>
                  <button
                    onClick={handleSaveCourse}
                    disabled={isLoading}
                    className="btn btn-success"
                  >
                    <Save className="h-4 w-4 mr-2" />
                    {isLoading ? 'Saving...' : 'Save & Publish Course'}
                  </button>
                </div>
                <PreviewPanel
                  course={courseData}
                  content={generatedContent}
                />
              </div>
            )}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Quick Actions
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <button
              onClick={() => setActiveTab('create')}
              className="p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-blue-500 transition-colors text-left"
            >
              <Rocket className="h-6 w-6 text-blue-600 mb-2" />
              <div className="font-medium text-gray-900">AI Course Generator</div>
              <div className="text-sm text-gray-600">Create complete course with AI</div>
            </button>

            <button
              onClick={() => setActiveTab('content')}
              className="p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-blue-500 transition-colors text-left"
            >
              <Edit className="h-6 w-6 text-green-600 mb-2" />
              <div className="font-medium text-gray-900">Manual Editor</div>
              <div className="text-sm text-gray-600">Build course from scratch</div>
            </button>

            <button
              onClick={() => setActiveTab('preview')}
              className="p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-blue-500 transition-colors text-left"
            >
              <Eye className="h-6 w-6 text-purple-600 mb-2" />
              <div className="font-medium text-gray-900">Template Library</div>
              <div className="text-sm text-gray-600">Start from a template</div>
            </button>
          </div>
        </div>

        {/* Error Display */}
        {error && (
          <div className="mt-6 p-4 bg-red-50 border border-red-200 rounded-lg">
            <div className="text-red-800 font-medium">Error</div>
            <div className="text-red-600">{error}</div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CreateCourse;
