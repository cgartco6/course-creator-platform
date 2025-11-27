import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useQuery } from 'react-query';
import { coursesAPI } from '../../services/api';
import {
  TrendingUp,
  Users,
  Clock,
  Star,
  PlusCircle,
  Eye,
  Edit,
  Download,
  Calendar,
  ArrowUp,
  ArrowDown
} from 'lucide-react';

const Dashboard = () => {
  const [timeRange, setTimeRange] = useState('week');
  const [activeTab, setActiveTab] = useState('overview');

  // Fetch user's courses and stats
  const { data: courses, isLoading } = useQuery(
    'dashboardCourses',
    () => coursesAPI.getUserCourses().then(res => res.data.data),
    {
      retry: 1,
      staleTime: 5 * 60 * 1000,
    }
  );

  // Mock dashboard data (in real app, this would come from API)
  const dashboardStats = {
    totalCourses: courses?.length || 0,
    totalStudents: courses?.reduce((sum, course) => sum + (course.stats?.enrolledStudents || 0), 0) || 0,
    totalRevenue: courses?.reduce((sum, course) => sum + (course.price * (course.stats?.enrolledStudents || 0)), 0) || 0,
    averageRating: courses?.reduce((sum, course) => sum + (course.stats?.averageRating || 0), 0) / (courses?.length || 1) || 0,
    completionRate: 68,
    growth: {
      students: 12,
      revenue: 8,
      courses: 5
    }
  };

  const recentActivity = [
    {
      id: 1,
      type: 'enrollment',
      message: 'New student enrolled in "React Advanced Patterns"',
      time: '2 hours ago',
      icon: Users,
      color: 'text-green-600'
    },
    {
      id: 2,
      type: 'review',
      message: 'New 5-star review for "JavaScript Mastery"',
      time: '5 hours ago',
      icon: Star,
      color: 'text-yellow-600'
    },
    {
      id: 3,
      type: 'completion',
      message: 'Student completed "Web Development Bootcamp"',
      time: '1 day ago',
      icon: TrendingUp,
      color: 'text-blue-600'
    },
    {
      id: 4,
      type: 'course',
      message: 'You published "Node.js API Design"',
      time: '2 days ago',
      icon: Edit,
      color: 'text-purple-600'
    }
  ];

  const quickActions = [
    {
      title: 'Create Course',
      description: 'Start a new course with AI',
      icon: PlusCircle,
      color: 'bg-blue-500',
      href: '/create-course'
    },
    {
      title: 'Analytics',
      description: 'View detailed analytics',
      icon: TrendingUp,
      color: 'bg-green-500',
      href: '/analytics'
    },
    {
      title: 'Content Library',
      description: 'Manage your content',
      icon: Download,
      color: 'bg-purple-500',
      href: '/content'
    },
    {
      title: 'Student Reviews',
      description: 'Read student feedback',
      icon: Star,
      color: 'bg-yellow-500',
      href: '/reviews'
    }
  ];

  const StatCard = ({ title, value, icon: Icon, change, changeType }) => (
    <div className="card">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600">{title}</p>
          <p className="text-2xl font-bold text-gray-900 mt-1">{value}</p>
          {change && (
            <div className={`flex items-center mt-1 text-sm ${
              changeType === 'positive' ? 'text-green-600' : 'text-red-600'
            }`}>
              {changeType === 'positive' ? (
                <ArrowUp className="h-4 w-4 mr-1" />
              ) : (
                <ArrowDown className="h-4 w-4 mr-1" />
              )}
              {change}% from last week
            </div>
          )}
        </div>
        <div className="p-3 bg-blue-50 rounded-lg">
          <Icon className="h-6 w-6 text-blue-600" />
        </div>
      </div>
    </div>
  );

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-1/4 mb-8"></div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              {[1, 2, 3, 4].map(i => (
                <div key={i} className="bg-white rounded-lg shadow p-6">
                  <div className="h-4 bg-gray-200 rounded w-1/2 mb-4"></div>
                  <div className="h-8 bg-gray-200 rounded w-3/4"></div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Dashboard
            </h1>
            <p className="text-gray-600">
              Welcome back! Here's what's happening with your courses.
            </p>
          </div>
          <div className="flex items-center space-x-4 mt-4 sm:mt-0">
            <select
              value={timeRange}
              onChange={(e) => setTimeRange(e.target.value)}
              className="form-select"
            >
              <option value="week">Last 7 days</option>
              <option value="month">Last 30 days</option>
              <option value="quarter">Last 90 days</option>
              <option value="year">Last year</option>
            </select>
            <Link
              to="/create-course"
              className="btn btn-primary"
            >
              <PlusCircle className="h-4 w-4 mr-2" />
              Create Course
            </Link>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatCard
            title="Total Courses"
            value={dashboardStats.totalCourses}
            icon={Edit}
            change={dashboardStats.growth.courses}
            changeType="positive"
          />
          <StatCard
            title="Total Students"
            value={dashboardStats.totalStudents.toLocaleString()}
            icon={Users}
            change={dashboardStats.growth.students}
            changeType="positive"
          />
          <StatCard
            title="Total Revenue"
            value={`$${dashboardStats.totalRevenue.toLocaleString()}`}
            icon={TrendingUp}
            change={dashboardStats.growth.revenue}
            changeType="positive"
          />
          <StatCard
            title="Average Rating"
            value={dashboardStats.averageRating.toFixed(1)}
            icon={Star}
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Quick Actions & Recent Courses */}
          <div className="lg:col-span-2 space-y-8">
            {/* Quick Actions */}
            <div className="card">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">
                Quick Actions
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {quickActions.map((action, index) => (
                  <Link
                    key={index}
                    to={action.href}
                    className="p-4 border border-gray-200 rounded-lg hover:border-blue-500 hover:shadow-md transition-all duration-200 group"
                  >
                    <div className="flex items-center">
                      <div className={`p-2 rounded-lg ${action.color} text-white mr-4 group-hover:scale-110 transition-transform`}>
                        <action.icon className="h-5 w-5" />
                      </div>
                      <div>
                        <div className="font-semibold text-gray-900 group-hover:text-blue-600">
                          {action.title}
                        </div>
                        <div className="text-sm text-gray-600">
                          {action.description}
                        </div>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>

            {/* Recent Courses */}
            <div className="card">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-semibold text-gray-900">
                  Recent Courses
                </h2>
                <Link
                  to="/my-courses"
                  className="text-blue-600 hover:text-blue-700 font-medium"
                >
                  View all
                </Link>
              </div>

              <div className="space-y-4">
                {courses?.slice(0, 5).map((course) => (
                  <div
                    key={course._id}
                    className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:border-blue-500 transition-colors"
                  >
                    <div className="flex items-center space-x-4">
                      <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center text-white font-bold">
                        {course.title.charAt(0)}
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900">
                          {course.title}
                        </h3>
                        <div className="flex items-center space-x-4 text-sm text-gray-600 mt-1">
                          <span>{course.modules?.length || 0} modules</span>
                          <span>{course.stats?.enrolledStudents || 0} students</span>
                          <span className="flex items-center">
                            <Star className="h-3 w-3 text-yellow-500 mr-1" />
                            {course.stats?.averageRating || 'No ratings'}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Link
                        to={`/courses/${course._id}`}
                        className="btn btn-outline btn-sm"
                      >
                        <Eye className="h-4 w-4" />
                      </Link>
                      <Link
                        to={`/create-course?edit=${course._id}`}
                        className="btn btn-outline btn-sm"
                      >
                        <Edit className="h-4 w-4" />
                      </Link>
                    </div>
                  </div>
                ))}

                {(!courses || courses.length === 0) && (
                  <div className="text-center py-8">
                    <PlusCircle className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">
                      No courses yet
                    </h3>
                    <p className="text-gray-600 mb-4">
                      Create your first course to get started
                    </p>
                    <Link
                      to="/create-course"
                      className="btn btn-primary"
                    >
                      <PlusCircle className="h-4 w-4 mr-2" />
                      Create Your First Course
                    </Link>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Right Column - Recent Activity & Performance */}
          <div className="space-y-8">
            {/* Recent Activity */}
            <div className="card">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">
                Recent Activity
              </h2>
              <div className="space-y-4">
                {recentActivity.map((activity) => (
                  <div key={activity.id} className="flex items-start space-x-3">
                    <div className={`p-2 rounded-lg bg-gray-50 ${activity.color}`}>
                      <activity.icon className="h-4 w-4" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-gray-900">
                        {activity.message}
                      </p>
                      <p className="text-xs text-gray-500 mt-1">
                        {activity.time}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Performance Metrics */}
            <div className="card">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">
                Performance
              </h2>
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between text-sm text-gray-600 mb-2">
                    <span>Course Completion Rate</span>
                    <span>{dashboardStats.completionRate}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-green-600 h-2 rounded-full transition-all"
                      style={{ width: `${dashboardStats.completionRate}%` }}
                    ></div>
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-sm text-gray-600 mb-2">
                    <span>Student Engagement</span>
                    <span>84%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-blue-600 h-2 rounded-full"
                      style={{ width: '84%' }}
                    ></div>
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-sm text-gray-600 mb-2">
                    <span>Content Quality</span>
                    <span>92%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-purple-600 h-2 rounded-full"
                      style={{ width: '92%' }}
                    ></div>
                  </div>
                </div>
              </div>
            </div>

            {/* Upcoming Tasks */}
            <div className="card">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">
                Upcoming Tasks
              </h2>
              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                  <div className="flex items-center">
                    <Calendar className="h-4 w-4 text-yellow-600 mr-3" />
                    <span className="text-sm text-yellow-800">
                      Update course content for React Advanced
                    </span>
                  </div>
                  <span className="text-xs text-yellow-600">Tomorrow</span>
                </div>

                <div className="flex items-center justify-between p-3 bg-blue-50 border border-blue-200 rounded-lg">
                  <div className="flex items-center">
                    <Users className="h-4 w-4 text-blue-600 mr-3" />
                    <span className="text-sm text-blue-800">
                      Respond to student questions
                    </span>
                  </div>
                  <span className="text-xs text-blue-600">In 2 days</span>
                </div>

                <div className="flex items-center justify-between p-3 bg-green-50 border border-green-200 rounded-lg">
                  <div className="flex items-center">
                    <TrendingUp className="h-4 w-4 text-green-600 mr-3" />
                    <span className="text-sm text-green-800">
                      Review course analytics
                    </span>
                  </div>
                  <span className="text-xs text-green-600">This week</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* AI Recommendations */}
        <div className="card mt-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            AI Recommendations
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="p-4 border border-gray-200 rounded-lg">
              <div className="flex items-center mb-3">
                <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center mr-3">
                  <TrendingUp className="h-4 w-4 text-blue-600" />
                </div>
                <h3 className="font-semibold text-gray-900">Trend Alert</h3>
              </div>
              <p className="text-sm text-gray-600 mb-3">
                Web3 development courses are trending. Consider creating content in this area.
              </p>
              <button className="text-sm text-blue-600 hover:text-blue-700 font-medium">
                Explore Topics →
              </button>
            </div>

            <div className="p-4 border border-gray-200 rounded-lg">
              <div className="flex items-center mb-3">
                <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center mr-3">
                  <Star className="h-4 w-4 text-green-600" />
                </div>
                <h3 className="font-semibold text-gray-900">Content Gap</h3>
              </div>
              <p className="text-sm text-gray-600 mb-3">
                Add more practical exercises to Module 3 of your React course.
              </p>
              <button className="text-sm text-blue-600 hover:text-blue-700 font-medium">
                Improve Course →
              </button>
            </div>

            <div className="p-4 border border-gray-200 rounded-lg">
              <div className="flex items-center mb-3">
                <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center mr-3">
                  <Users className="h-4 w-4 text-purple-600" />
                </div>
                <h3 className="font-semibold text-gray-900">Student Feedback</h3>
              </div>
              <p className="text-sm text-gray-600 mb-3">
                Students are requesting more real-world projects in your courses.
              </p>
              <button className="text-sm text-blue-600 hover:text-blue-700 font-medium">
                Add Projects →
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
