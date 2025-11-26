import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from 'react-query';
import { coursesAPI } from '../../services/api';
import { 
  PlusCircle, 
  Edit, 
  Trash2, 
  Eye, 
  Download,
  Filter,
  Search,
  MoreVertical
} from 'lucide-react';

const MyCourses = () => {
  const queryClient = useQueryClient();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [categoryFilter, setCategoryFilter] = useState('all');

  // Fetch user's courses
  const { data: courses, isLoading, error } = useQuery(
    'myCourses',
    () => coursesAPI.getUserCourses().then(res => res.data.data),
    {
      retry: 1,
      staleTime: 5 * 60 * 1000, // 5 minutes
    }
  );

  // Delete course mutation
  const deleteMutation = useMutation(
    (courseId) => coursesAPI.deleteCourse(courseId),
    {
      onSuccess: () => {
        queryClient.invalidateQueries('myCourses');
      },
    }
  );

  const handleDeleteCourse = async (courseId, courseTitle) => {
    if (window.confirm(`Are you sure you want to delete "${courseTitle}"?`)) {
      await deleteMutation.mutateAsync(courseId);
    }
  };

  // Filter courses based on search and filters
  const filteredCourses = courses?.filter(course => {
    const matchesSearch = course.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         course.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || course.status === statusFilter;
    const matchesCategory = categoryFilter === 'all' || course.category === categoryFilter;
    
    return matchesSearch && matchesStatus && matchesCategory;
  });

  const statusColors = {
    draft: 'bg-gray-100 text-gray-800',
    'in-progress': 'bg-yellow-100 text-yellow-800',
    completed: 'bg-blue-100 text-blue-800',
    published: 'bg-green-100 text-green-800',
    archived: 'bg-red-100 text-red-800',
  };

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

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-1/4 mb-4"></div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3].map(i => (
                <div key={i} className="bg-white rounded-lg shadow p-6">
                  <div className="h-4 bg-gray-200 rounded w-3/4 mb-4"></div>
                  <div className="h-3 bg-gray-200 rounded w-full mb-2"></div>
                  <div className="h-3 bg-gray-200 rounded w-2/3"></div>
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
              My Courses
            </h1>
            <p className="text-gray-600">
              Manage and track your created courses
            </p>
          </div>
          <Link
            to="/create-course"
            className="btn btn-primary mt-4 sm:mt-0"
          >
            <PlusCircle className="h-4 w-4 mr-2" />
            Create New Course
          </Link>
        </div>

        {/* Filters and Search */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <input
                type="text"
                placeholder="Search courses..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="form-input pl-10"
              />
            </div>

            {/* Status Filter */}
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="form-select"
            >
              <option value="all">All Statuses</option>
              <option value="draft">Draft</option>
              <option value="in-progress">In Progress</option>
              <option value="completed">Completed</option>
              <option value="published">Published</option>
              <option value="archived">Archived</option>
            </select>

            {/* Category Filter */}
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="form-select"
            >
              <option value="all">All Categories</option>
              {Object.entries(categoryLabels).map(([value, label]) => (
                <option key={value} value={value}>{label}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Courses Grid */}
        {filteredCourses?.length === 0 ? (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-12 text-center">
            <div className="max-w-md mx-auto">
              <div className="bg-gray-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <PlusCircle className="h-8 w-8 text-gray-400" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                No courses found
              </h3>
              <p className="text-gray-600 mb-6">
                {searchTerm || statusFilter !== 'all' || categoryFilter !== 'all'
                  ? 'Try adjusting your search or filters'
                  : 'Get started by creating your first course'
                }
              </p>
              <Link
                to="/create-course"
                className="btn btn-primary"
              >
                <PlusCircle className="h-4 w-4 mr-2" />
                Create Your First Course
              </Link>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredCourses?.map((course) => (
              <div
                key={course._id}
                className="bg-white rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow duration-200"
              >
                {/* Course Image */}
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

                {/* Course Content */}
                <div className="p-6">
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <span className={`badge ${statusColors[course.status]}`}>
                        {course.status.charAt(0).toUpperCase() + course.status.slice(1)}
                      </span>
                    </div>
                    <div className="relative">
                      <button className="p-1 hover:bg-gray-100 rounded">
                        <MoreVertical className="h-4 w-4 text-gray-400" />
                      </button>
                    </div>
                  </div>

                  <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2">
                    {course.title}
                  </h3>
                  <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                    {course.shortDescription || course.description}
                  </p>

                  <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                    <span>{course.modules?.length || 0} modules</span>
                    <span>
                      {course.stats?.totalLessons || 0} lessons
                    </span>
                  </div>

                  {/* Progress Bar */}
                  {course.status === 'published' && (
                    <div className="mb-4">
                      <div className="flex justify-between text-sm text-gray-600 mb-1">
                        <span>Progress</span>
                        <span>{course.stats?.enrolledStudents || 0} students</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-green-600 h-2 rounded-full"
                          style={{
                            width: `${Math.min(
                              ((course.stats?.enrolledStudents || 0) / 100) * 100,
                              100
                            )}%`
                          }}
                        ></div>
                      </div>
                    </div>
                  )}

                  {/* Actions */}
                  <div className="flex space-x-2">
                    <Link
                      to={`/courses/${course._id}`}
                      className="flex-1 btn btn-outline text-sm py-2"
                    >
                      <Eye className="h-3 w-3 mr-1" />
                      View
                    </Link>
                    <Link
                      to={`/create-course?edit=${course._id}`}
                      className="flex-1 btn btn-outline text-sm py-2"
                    >
                      <Edit className="h-3 w-3 mr-1" />
                      Edit
                    </Link>
                    <button
                      onClick={() => handleDeleteCourse(course._id, course.title)}
                      disabled={deleteMutation.isLoading}
                      className="flex-1 btn btn-outline text-sm py-2 text-red-600 hover:bg-red-50 hover:text-red-700"
                    >
                      <Trash2 className="h-3 w-3 mr-1" />
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="bg-white rounded-lg shadow-sm border border-red-200 p-6">
            <div className="text-red-800 font-medium mb-2">Error Loading Courses</div>
            <div className="text-red-600">
              {error.response?.data?.message || 'Failed to load courses'}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default MyCourses;
