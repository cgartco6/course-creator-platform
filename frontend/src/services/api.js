import axios from 'axios';
import toast from 'react-hot-toast';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

// Create axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const message = error.response?.data?.message || 'Something went wrong';
    
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    } else if (error.response?.status >= 500) {
      toast.error('Server error. Please try again later.');
    } else if (message) {
      toast.error(message);
    }
    
    return Promise.reject(error);
  }
);

// Auth API
export const authAPI = {
  login: (credentials) => api.post('/auth/login', credentials),
  register: (userData) => api.post('/auth/register', userData),
  getProfile: () => api.get('/auth/me'),
  updateProfile: (profileData) => api.put('/auth/profile', profileData),
  changePassword: (passwordData) => api.put('/auth/password', passwordData),
};

// Courses API
export const coursesAPI = {
  getCourses: (params = {}) => api.get('/courses', { params }),
  getCourse: (id) => api.get(`/courses/${id}`),
  createCourse: (courseData) => api.post('/courses', courseData),
  updateCourse: (id, courseData) => api.put(`/courses/${id}`, courseData),
  deleteCourse: (id) => api.delete(`/courses/${id}`),
  addModule: (courseId, moduleData) => api.post(`/courses/${courseId}/modules`, moduleData),
  addLesson: (courseId, moduleId, lessonData) => api.post(`/courses/${courseId}/modules/${moduleId}/lessons`, lessonData),
  getUserCourses: () => api.get('/courses/my-courses'),
};

// AI API
export const aiAPI = {
  generateOutline: (data) => api.post('/ai/generate-outline', data),
  generateLesson: (data) => api.post('/ai/generate-lesson', data),
  generateQuiz: (data) => api.post('/ai/generate-quiz', data),
  generateMedia: (data) => api.post('/ai/generate-media', data),
  analyzeCourse: (data) => api.post('/ai/analyze-course', data),
};

// Content API
export const contentAPI = {
  uploadContent: (formData) => api.post('/content/upload', formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  }),
  generateAIContent: (data) => api.post('/content/generate', data),
  getCourseContent: (courseId) => api.get(`/content/course/${courseId}`),
  updateContent: (id, data) => api.put(`/content/${id}`, data),
  deleteContent: (id) => api.delete(`/content/${id}`),
};

// Utility function for file upload
export const uploadFile = async (file, onProgress = null) => {
  const formData = new FormData();
  formData.append('file', file);

  const response = await api.post('/content/upload', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
    onUploadProgress: (progressEvent) => {
      if (onProgress && progressEvent.total) {
        const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
        onProgress(percentCompleted);
      }
    },
  });

  return response.data;
};

export default api;
