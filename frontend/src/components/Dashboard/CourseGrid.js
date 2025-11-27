import React from 'react';
import { Link } from 'react-router-dom';
import {
  Eye,
  Edit,
  Users,
  Star,
  Clock,
  MoreVertical,
  TrendingUp
} from 'lucide-react';

const CourseGrid = ({ courses, onEdit, onView, onDelete }) => {
  const categoryLabels = {
    web: 'Web Development',
    web3: 'Web3 & Blockchain',
    python: 'Python',
    react: 'React',
    wordpress: 'WordPress',
    html5: 'HTML5',
    javascript: 'JavaScript',
    nodejs: 'Node.js',
    blockchain: 'Blockchain',
    'ai-ml': 'AI & ML',
    'data-science': 'Data Science',
    mobile: 'Mobile Development',
    cybersecurity: 'Cybersecurity',
    design: 'Design',
    business: 'Business',
    other: 'Other',
  };

  const statusColors = {
    draft: 'bg-gray-100 text-gray-800',
    'in-progress': 'bg-yellow-100 text-yellow-800',
    completed: 'bg-blue-100 text-blue-800',
    published: 'bg-green-100 text-green-800',
    archived: 'bg-red-100 text-red-800',
  };

  const getTotalDuration = (course) => {
    return course.modules?.reduce((total, module) => {
      return total + (module.lessons?.reduce((moduleTotal, lesson) => {
        return moduleTotal + (lesson.duration || 0);
      }, 0) || 0);
    }, 0) || 0;
  };

  const getTotalLessons = (course) => {
    return course.modules?.reduce((total, module) => {
      return total + (module.lessons?.length || 0);
    }, 0) || 0;
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {courses.map((course) => (
        <div
          key={course._id}
          className="bg-white rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow duration-200"
        >
          {/* Course Image */}
          <div className="relative">
            <div className="h-48 bg-gradient-to-br from-blue-500 to-purple-600 rounded-t-lg flex items-center justify-center">
              {course.thumbnail ? (
                <img
                  src={course.thumbnail}
                  alt={course.title}
                  className="h-full w-full object-cover rounded-t-lg"
                />
              ) : (
                <div className="text-white text-center">
                  <div className="text-2xl font-bold mb-2">
                    {course.title.charAt(0)}
                  </div>
                  <div className="text-sm opacity-80">
                    {categoryLabels[course.category] || course.category}
                  </div>
                </div>
              )}
            </div>

            {/* Status Badge */}
            <div className="absolute top-3 left-3">
              <span className={`badge ${statusColors[course.status]}`}>
                {course.status.charAt(0).toUpperCase() + course.status.slice(1)}
              </span>
            </div>

            {/* Enrollment Badge */}
            {course.stats?.enrolledStudents > 0 && (
              <div className="absolute top-3 right-3">
                <span className="badge bg-white text-gray-800 border border-gray-300">
                  <Users className="h-3 w-3 mr-1" />
                  {course.stats.enrolledStudents}
                </span>
              </div>
            )}
          </div>

          {/* Course Content */}
          <div className="p-6">
            {/* Category and Rating */}
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm font-medium text-blue-600">
                {categoryLabels[course.category] || course.category}
              </span>
              {course.stats?.averageRating > 0 && (
                <div className="flex items-center text-sm text-gray-600">
                  <Star className="h-4 w-4 text-yellow-500 mr-1" />
                  {course.stats.averageRating.toFixed(1)}
                  <span className="text-gray-400 ml-1">
                    ({course.stats.ratingCount || 0})
                  </span>
                </div>
              )}
            </div>

            {/* Title and Description */}
            <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2">
              {course.title}
            </h3>
            <p className="text-gray-600 text-sm mb-4 line-clamp-2">
              {course.shortDescription || course.description}
            </p>

            {/* Course Stats */}
            <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
              <div className="flex items-center">
                <Clock className="h-4 w-4 mr-1" />
                {getTotalDuration(course)}m
              </div>
              <div className="flex items-center">
                <TrendingUp className="h-4 w-4 mr-1" />
                {getTotalLessons(course)} lessons
              </div>
              <div className="flex items-center">
                <Users className="h-4 w-4 mr-1" />
                {course.stats?.enrolledStudents || 0} students
              </div>
            </div>

            {/* Progress Bar for Published Courses */}
            {course.status === 'published' && course.stats?.enrolledStudents > 0 && (
              <div className="mb-4">
                <div className="flex justify-between text-xs text-gray-600 mb-1">
                  <span>Completion Rate</span>
                  <span>{Math.min(Math.round((course.stats.enrolledStudents / 100) * 100), 100)}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-green-600 h-2 rounded-full transition-all"
                    style={{
                      width: `${Math.min(
                        ((course.stats.enrolledStudents || 0) / 100) * 100,
                        100
                      )}%`
                    }}
                  ></div>
                </div>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex space-x-2">
              <button
                onClick={() => onView(course)}
                className="flex-1 btn btn-outline text-sm py-2"
              >
                <Eye className="h-3 w-3 mr-1" />
                View
              </button>
              <button
                onClick={() => onEdit(course)}
                className="flex-1 btn btn-outline text-sm py-2"
              >
                <Edit className="h-3 w-3 mr-1" />
                Edit
              </button>
              <button className="btn btn-outline text-sm py-2 px-3">
                <MoreVertical className="h-3 w-3" />
              </button>
            </div>
          </div>
        </div>
      ))}

      {/* Empty State */}
      {courses.length === 0 && (
        <div className="col-span-full">
          <div className="text-center py-12">
            <div className="bg-gray-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <TrendingUp className="h-8 w-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              No courses found
            </h3>
            <p className="text-gray-600 mb-6">
              Get started by creating your first course
            </p>
            <Link
              to="/create-course"
              className="btn btn-primary"
            >
              Create Your First Course
            </Link>
          </div>
        </div>
      )}
    </div>
  );
};

export default CourseGrid;
