import React from 'react';
import {
  Users,
  Star,
  TrendingUp,
  Edit,
  Download,
  MessageCircle,
  Clock
} from 'lucide-react';

const RecentActivity = ({ activities = [] }) => {
  const defaultActivities = [
    {
      id: 1,
      type: 'enrollment',
      message: 'New student enrolled in "React Advanced Patterns"',
      time: '2 hours ago',
      icon: Users,
      color: 'text-green-600',
      bgColor: 'bg-green-50'
    },
    {
      id: 2,
      type: 'review',
      message: 'New 5-star review for "JavaScript Mastery"',
      time: '5 hours ago',
      icon: Star,
      color: 'text-yellow-600',
      bgColor: 'bg-yellow-50'
    },
    {
      id: 3,
      type: 'completion',
      message: 'Student completed "Web Development Bootcamp"',
      time: '1 day ago',
      icon: TrendingUp,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50'
    },
    {
      id: 4,
      type: 'course',
      message: 'You published "Node.js API Design"',
      time: '2 days ago',
      icon: Edit,
      color: 'text-purple-600',
      bgColor: 'bg-purple-50'
    },
    {
      id: 5,
      type: 'download',
      message: 'Course materials downloaded 15 times',
      time: '3 days ago',
      icon: Download,
      color: 'text-indigo-600',
      bgColor: 'bg-indigo-50'
    },
    {
      id: 6,
      type: 'comment',
      message: 'New comment on "Python for Data Science"',
      time: '4 days ago',
      icon: MessageCircle,
      color: 'text-pink-600',
      bgColor: 'bg-pink-50'
    }
  ];

  const displayActivities = activities.length > 0 ? activities : defaultActivities;

  const getActivityIcon = (type) => {
    const activity = displayActivities.find(a => a.type === type);
    return activity ? activity.icon : Users;
  };

  const getActivityColor = (type) => {
    const activity = displayActivities.find(a => a.type === type);
    return activity ? activity.color : 'text-gray-600';
  };

  const getActivityBgColor = (type) => {
    const activity = displayActivities.find(a => a.type === type);
    return activity ? activity.bgColor : 'bg-gray-50';
  };

  return (
    <div className="card">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold text-gray-900">
          Recent Activity
        </h2>
        <button className="text-sm text-blue-600 hover:text-blue-700 font-medium">
          View all
        </button>
      </div>

      <div className="space-y-4">
        {displayActivities.map((activity) => (
          <div
            key={activity.id}
            className="flex items-start space-x-4 p-3 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <div className={`p-2 rounded-lg ${activity.bgColor} ${activity.color} flex-shrink-0`}>
              <activity.icon className="h-4 w-4" />
            </div>
            
            <div className="flex-1 min-w-0">
              <p className="text-sm text-gray-900 leading-relaxed">
                {activity.message}
              </p>
              <div className="flex items-center mt-1 text-xs text-gray-500">
                <Clock className="h-3 w-3 mr-1" />
                {activity.time}
              </div>
            </div>

            {/* Activity Type Badge */}
            <div className="flex-shrink-0">
              <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium capitalize ${
                activity.type === 'enrollment' ? 'bg-green-100 text-green-800' :
                activity.type === 'review' ? 'bg-yellow-100 text-yellow-800' :
                activity.type === 'completion' ? 'bg-blue-100 text-blue-800' :
                activity.type === 'course' ? 'bg-purple-100 text-purple-800' :
                activity.type === 'download' ? 'bg-indigo-100 text-indigo-800' :
                'bg-pink-100 text-pink-800'
              }`}>
                {activity.type}
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Load More Button */}
      <div className="mt-6 pt-4 border-t border-gray-200">
        <button className="w-full btn btn-outline text-sm">
          Load more activities
        </button>
      </div>

      {/* Empty State */}
      {displayActivities.length === 0 && (
        <div className="text-center py-8">
          <div className="bg-gray-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
            <Clock className="h-8 w-8 text-gray-400" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            No recent activity
          </h3>
          <p className="text-gray-600">
            Activity will appear here as students interact with your courses
          </p>
        </div>
      )}
    </div>
  );
};

export default RecentActivity;
