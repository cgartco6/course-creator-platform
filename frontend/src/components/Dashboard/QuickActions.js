import React from 'react';
import { Link } from 'react-router-dom';
import {
  PlusCircle,
  TrendingUp,
  Download,
  Star,
  Users,
  Settings,
  FileText,
  Video,
  Image,
  Zap
} from 'lucide-react';

const QuickActions = () => {
  const actions = [
    {
      title: 'Create Course',
      description: 'Start a new course with AI assistance',
      icon: PlusCircle,
      color: 'bg-blue-500',
      hoverColor: 'hover:bg-blue-600',
      href: '/create-course',
      badge: 'AI Powered'
    },
    {
      title: 'View Analytics',
      description: 'Track course performance and student engagement',
      icon: TrendingUp,
      color: 'bg-green-500',
      hoverColor: 'hover:bg-green-600',
      href: '/analytics'
    },
    {
      title: 'Content Library',
      description: 'Manage your videos, documents, and resources',
      icon: Download,
      color: 'bg-purple-500',
      hoverColor: 'hover:bg-purple-600',
      href: '/content'
    },
    {
      title: 'Student Reviews',
      description: 'Read and respond to student feedback',
      icon: Star,
      color: 'bg-yellow-500',
      hoverColor: 'hover:bg-yellow-600',
      href: '/reviews'
    },
    {
      title: 'Manage Students',
      description: 'View and manage your student roster',
      icon: Users,
      color: 'bg-indigo-500',
      hoverColor: 'hover:bg-indigo-600',
      href: '/students'
    },
    {
      title: 'Course Settings',
      description: 'Configure your course preferences',
      icon: Settings,
      color: 'bg-gray-500',
      hoverColor: 'hover:bg-gray-600',
      href: '/settings'
    }
  ];

  const aiActions = [
    {
      title: 'Generate Content',
      description: 'Use AI to create course materials',
      icon: FileText,
      color: 'bg-gradient-to-r from-blue-500 to-purple-600',
      href: '/ai/content'
    },
    {
      title: 'Create Videos',
      description: 'Generate video content with AI',
      icon: Video,
      color: 'bg-gradient-to-r from-green-500 to-blue-600',
      href: '/ai/videos'
    },
    {
      title: 'Generate Images',
      description: 'Create custom images for your courses',
      icon: Image,
      color: 'bg-gradient-to-r from-purple-500 to-pink-600',
      href: '/ai/images'
    },
    {
      title: 'AI Assistant',
      description: 'Get help with course creation',
      icon: Zap,
      color: 'bg-gradient-to-r from-yellow-500 to-orange-600',
      href: '/ai/assistant'
    }
  ];

  return (
    <div className="space-y-8">
      {/* Main Quick Actions */}
      <div className="card">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-gray-900">
            Quick Actions
          </h2>
          <span className="text-sm text-gray-500">
            Frequently used actions
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {actions.map((action, index) => (
            <Link
              key={index}
              to={action.href}
              className="group block p-4 border border-gray-200 rounded-lg hover:border-blue-500 hover:shadow-md transition-all duration-200 bg-white"
            >
              <div className="flex items-start space-x-4">
                <div className={`p-3 rounded-lg ${action.color} ${action.hoverColor} text-white group-hover:scale-110 transition-transform duration-200 flex-shrink-0`}>
                  <action.icon className="h-5 w-5" />
                </div>
                
                <div className="flex-1 min-w-0">
                  <div className="flex items-center space-x-2 mb-1">
                    <h3 className="font-semibold text-gray-900 group-hover:text-blue-600 truncate">
                      {action.title}
                    </h3>
                    {action.badge && (
                      <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                        {action.badge}
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-gray-600 line-clamp-2">
                    {action.description}
                  </p>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* AI-Powered Actions */}
      <div className="card">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-xl font-semibold text-gray-900">
              AI-Powered Tools
            </h2>
            <p className="text-sm text-gray-600 mt-1">
              Leverage AI to enhance your courses
            </p>
          </div>
          <div className="flex items-center px-3 py-1 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full text-white text-sm font-medium">
            <Zap className="h-3 w-3 mr-1" />
            AI
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {aiActions.map((action, index) => (
            <Link
              key={index}
              to={action.href}
              className="group block p-4 border border-gray-200 rounded-lg hover:shadow-lg transition-all duration-200 bg-white relative overflow-hidden"
            >
              {/* Gradient Background */}
              <div className={`absolute inset-0 ${action.color} opacity-5 group-hover:opacity-10 transition-opacity duration-200`}></div>
              
              <div className="relative z-10 flex items-center space-x-4">
                <div className={`p-3 rounded-lg ${action.color} text-white group-hover:scale-110 transition-transform duration-200 flex-shrink-0`}>
                  <action.icon className="h-5 w-5" />
                </div>
                
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-gray-900 group-hover:text-blue-600 mb-1">
                    {action.title}
                  </h3>
                  <p className="text-sm text-gray-600">
                    {action.description}
                  </p>
                </div>

                {/* Arrow Indicator */}
                <div className="text-gray-400 group-hover:text-blue-600 transition-colors duration-200">
                  <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* AI Features Description */}
        <div className="mt-6 p-4 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg border border-blue-200">
          <div className="flex items-start space-x-3">
            <Zap className="h-5 w-5 text-blue-600 mt-0.5 flex-shrink-0" />
            <div>
              <h4 className="font-semibold text-blue-900 mb-1">
                Advanced AI Features
              </h4>
              <p className="text-sm text-blue-800">
                Our AI can generate complete courses, create engaging content, produce videos and images, 
                and provide personalized recommendations to improve your teaching.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Shortcuts */}
      <div className="card">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">
          Recent Shortcuts
        </h2>
        
        <div className="space-y-3">
          <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                <FileText className="h-4 w-4 text-blue-600" />
              </div>
              <span className="text-sm font-medium text-gray-900">
                React Advanced Course
              </span>
            </div>
            <span className="text-xs text-gray-500">Edited 2 hours ago</span>
          </div>

          <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                <TrendingUp className="h-4 w-4 text-green-600" />
              </div>
              <span className="text-sm font-medium text-gray-900">
                Course Analytics
              </span>
            </div>
            <span className="text-xs text-gray-500">Viewed 1 day ago</span>
          </div>

          <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center">
                <Download className="h-4 w-4 text-purple-600" />
              </div>
              <span className="text-sm font-medium text-gray-900">
                Content Library
              </span>
            </div>
            <span className="text-xs text-gray-500">Accessed 2 days ago</span>
          </div>
        </div>

        <div className="mt-4 pt-4 border-t border-gray-200">
          <button className="w-full btn btn-outline text-sm">
            Clear Recent History
          </button>
        </div>
      </div>
    </div>
  );
};

export default QuickActions;
