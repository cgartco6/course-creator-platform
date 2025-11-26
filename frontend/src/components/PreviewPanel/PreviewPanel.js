import React, { useState } from 'react';
import ReactMarkdown from 'react-markdown';
import {
  Eye,
  Download,
  Share2,
  Play,
  Clock,
  Users,
  Star,
  ChevronDown,
  ChevronUp
} from 'lucide-react';

const PreviewPanel = ({ course, content }) => {
  const [expandedModules, setExpandedModules] = useState({});
  const [currentView, setCurrentView] = useState('overview');

  const toggleModule = (moduleId) => {
    setExpandedModules(prev => ({
      ...prev,
      [moduleId]: !prev[moduleId]
    }));
  };

  const totalDuration = course.modules?.reduce((total, module) => {
    return total + (module.lessons?.reduce((moduleTotal, lesson) => {
      return moduleTotal + (lesson.duration || 0);
    }, 0) || 0);
  }, 0) || 0;

  const totalLessons = course.modules?.reduce((total, module) => {
    return total + (module.lessons?.length || 0);
  }, 0) || 0;

  const views = [
    { id: 'overview', label: 'Course Overview' },
    { id: 'content', label: 'Full Content' },
    { id: 'mobile', label: 'Mobile Preview' }
  ];

  return (
    <div className="space-y-6">
      {/* Preview Controls */}
      <div className="card">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div className="flex items-center space-x-4">
            {views.map(view => (
              <button
                key={view.id}
                onClick={() => setCurrentView(view.id)}
                className={`px-4 py-2 rounded-lg font-medium ${
                  currentView === view.id
                    ? 'bg-blue-100 text-blue-700'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                {view.label}
              </button>
            ))}
          </div>
          
          <div className="flex space-x-3">
            <button className="btn btn-outline">
              <Share2 className="h-4 w-4 mr-2" />
              Share Preview
            </button>
            <button className="btn btn-primary">
              <Download className="h-4 w-4 mr-2" />
              Export Course
            </button>
          </div>
        </div>
      </div>

      {/* Course Overview */}
      {currentView === 'overview' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Course Header */}
          <div className="lg:col-span-2">
            <div className="card">
              <div className="aspect-w-16 aspect-h-9 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg mb-6 flex items-center justify-center">
                {course.thumbnail ? (
                  <img
                    src={course.thumbnail}
                    alt={course.title}
                    className="w-full h-full object-cover rounded-lg"
                  />
                ) : (
                  <div className="text-white text-center">
                    <div className="text-4xl font-bold mb-2">
                      {course.title.charAt(0)}
                    </div>
                    <div className="text-xl opacity-80">
                      Course Preview
                    </div>
                  </div>
                )}
              </div>

              <h1 className="text-2xl font-bold text-gray-900 mb-4">
                {course.title}
              </h1>
              
              <p className="text-gray-600 mb-6">
                {course.description}
              </p>

              <div className="flex flex-wrap gap-4 text-sm text-gray-600">
                <div className="flex items-center">
                  <Clock className="h-4 w-4 mr-1" />
                  {totalDuration} minutes
                </div>
                <div className="flex items-center">
                  <Play className="h-4 w-4 mr-1" />
                  {totalLessons} lessons
                </div>
                <div className="flex items-center">
                  <Users className="h-4 w-4 mr-1" />
                  {course.stats?.enrolledStudents || 0} students
                </div>
                <div className="flex items-center">
                  <Star className="h-4 w-4 mr-1" />
                  {course.stats?.averageRating || 'No'} ratings
                </div>
              </div>
            </div>

            {/* What You'll Learn */}
            <div className="card">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">
                What You'll Learn
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {course.learningOutcomes?.map((outcome, index) => (
                  <div key={index} className="flex items-start">
                    <div className="w-2 h-2 bg-green-500 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                    <span className="text-gray-700">{outcome}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Course Content Sidebar */}
          <div className="space-y-6">
            <div className="card">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Course Content
              </h3>
              
              <div className="space-y-2">
                {course.modules?.map((module, moduleIndex) => (
                  <div key={module._id} className="border border-gray-200 rounded-lg">
                    <button
                      onClick={() => toggleModule(module._id)}
                      className="w-full text-left p-3 font-medium hover:bg-gray-50 flex items-center justify-between"
                    >
                      <div>
                        <div className="text-sm text-gray-500">
                          Module {module.order}
                        </div>
                        <div>{module.title}</div>
                      </div>
                      {expandedModules[module._id] ? (
                        <ChevronUp className="h-4 w-4 text-gray-400" />
                      ) : (
                        <ChevronDown className="h-4 w-4 text-gray-400" />
                      )}
                    </button>

                    {expandedModules[module._id] && (
                      <div className="border-t border-gray-200">
                        {module.lessons?.map((lesson, lessonIndex) => (
                          <div
                            key={lesson._id}
                            className="p-3 border-b border-gray-100 last:border-b-0"
                          >
                            <div className="flex items-center justify-between">
                              <div className="flex items-center">
                                <Play className="h-4 w-4 text-gray-400 mr-2" />
                                <span className="text-sm">
                                  {lesson.title}
                                </span>
                              </div>
                              <span className="text-xs text-gray-500">
                                {lesson.duration || 0}m
                              </span>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>

              <div className="mt-4 pt-4 border-t border-gray-200 text-sm text-gray-600">
                <div className="flex justify-between mb-1">
                  <span>Total duration:</span>
                  <span>{totalDuration} minutes</span>
                </div>
                <div className="flex justify-between">
                  <span>Total lessons:</span>
                  <span>{totalLessons} lessons</span>
                </div>
              </div>
            </div>

            {/* Requirements */}
            <div className="card">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">
                Requirements
              </h3>
              <ul className="text-sm text-gray-600 space-y-1">
                {course.requirements?.map((requirement, index) => (
                  <li key={index} className="flex items-start">
                    <div className="w-1 h-1 bg-gray-400 rounded-full mt-2 mr-2 flex-shrink-0"></div>
                    {requirement}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      )}

      {/* Full Content View */}
      {currentView === 'content' && (
        <div className="card">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">
            Course Content
          </h2>
          
          <div className="space-y-8">
            {course.modules?.map((module, moduleIndex) => (
              <div key={module._id} className="border border-gray-200 rounded-lg">
                <div className="bg-gray-50 p-4 border-b border-gray-200">
                  <h3 className="text-lg font-semibold text-gray-900">
                    Module {module.order}: {module.title}
                  </h3>
                  {module.description && (
                    <p className="text-gray-600 mt-1">{module.description}</p>
                  )}
                </div>

                <div className="divide-y divide-gray-200">
                  {module.lessons?.map((lesson, lessonIndex) => (
                    <div key={lesson._id} className="p-4">
                      <div className="flex items-start justify-between mb-3">
                        <div>
                          <h4 className="font-semibold text-gray-900">
                            Lesson {lesson.order}: {lesson.title}
                          </h4>
                          {lesson.description && (
                            <p className="text-gray-600 text-sm mt-1">
                              {lesson.description}
                            </p>
                          )}
                        </div>
                        <div className="flex items-center text-sm text-gray-500">
                          <Clock className="h-4 w-4 mr-1" />
                          {lesson.duration || 0} min
                        </div>
                      </div>

                      {lesson.content && (
                        <div className="prose max-w-none markdown-content">
                          <ReactMarkdown>{lesson.content}</ReactMarkdown>
                        </div>
                      )}

                      {/* Lesson Resources */}
                      {lesson.resources?.length > 0 && (
                        <div className="mt-4">
                          <h5 className="font-medium text-gray-900 text-sm mb-2">
                            Resources:
                          </h5>
                          <div className="space-y-1">
                            {lesson.resources.map((resource, resourceIndex) => (
                              <a
                                key={resourceIndex}
                                href={resource.url}
                                className="flex items-center text-sm text-blue-600 hover:text-blue-800"
                                target="_blank"
                                rel="noopener noreferrer"
                              >
                                <Download className="h-3 w-3 mr-2" />
                                {resource.title}
                              </a>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Mobile Preview */}
      {currentView === 'mobile' && (
        <div className="flex justify-center">
          <div className="w-80 border-8 border-gray-800 rounded-[2rem] bg-white shadow-xl">
            <div className="h-12 bg-gray-800 rounded-t-[1.5rem] flex items-center justify-center">
              <div className="w-20 h-1 bg-gray-600 rounded"></div>
            </div>
            
            <div className="p-4 h-[600px] overflow-y-auto">
              <div className="text-center mb-4">
                <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center mx-auto mb-2">
                  <div className="text-white font-bold text-lg">
                    {course.title.charAt(0)}
                  </div>
                </div>
                <h3 className="font-semibold text-gray-900">{course.title}</h3>
                <p className="text-gray-600 text-sm mt-1">
                  {course.shortDescription}
                </p>
              </div>

              <div className="space-y-2">
                {course.modules?.slice(0, 3).map((module, index) => (
                  <div
                    key={index}
                    className="p-3 border border-gray-200 rounded-lg"
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="text-xs text-gray-500">
                          Module {module.order}
                        </div>
                        <div className="font-medium text-sm">
                          {module.title}
                        </div>
                      </div>
                      <div className="text-xs text-gray-500">
                        {module.lessons?.length} lessons
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <button className="w-full mt-4 bg-blue-600 text-white py-2 rounded-lg font-medium text-sm">
                Enroll Now
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PreviewPanel;
