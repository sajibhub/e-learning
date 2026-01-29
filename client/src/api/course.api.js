import API from "./axios";

export const getCoursesApi = () =>
  API.get(`/api/v1/course/courses`);
export const getCourseByIdApi = (id) =>
  API.get(`/api/v1/course/${id}`);

export const getCourseStructureApi = (courseId) =>
  API.get(`/api/v1/courses/${courseId}/structure`,{
    withCredentials:true
  });