import { useState } from 'react';
import { coursesAPI } from '../services/api';
import toast from 'react-hot-toast';

export const useCourseCreation = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const createCourse = async (courseData) => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await coursesAPI.createCourse(courseData);
      return { success: true, data: response.data.data };
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to create course';
      setError(message);
      toast.error(message);
      return { success: false, error: message };
    } finally {
      setIsLoading(false);
    }
  };

  const generateOutline = async (courseData) => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await coursesAPI.generateOutline(courseData);
      return { success: true, data: response.data.data };
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to generate outline';
      setError(message);
      toast.error(message);
      return { success: false, error: message };
    } finally {
      setIsLoading(false);
    }
  };

  const updateCourse = async (courseId, courseData) => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await coursesAPI.updateCourse(courseId, courseData);
      return { success: true, data: response.data.data };
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to update course';
      setError(message);
      toast.error(message);
      return { success: false, error: message };
    } finally {
      setIsLoading(false);
    }
  };

  const deleteCourse = async (courseId) => {
    setIsLoading(true);
    setError(null);

    try {
      await coursesAPI.deleteCourse(courseId);
      return { success: true };
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to delete course';
      setError(message);
      toast.error(message);
      return { success: false, error: message };
    } finally {
      setIsLoading(false);
    }
  };

  return {
    createCourse,
    generateOutline,
    updateCourse,
    deleteCourse,
    isLoading,
    error,
    setError
  };
};
