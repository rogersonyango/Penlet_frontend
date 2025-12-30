// src/services/resource.ts
// @ts-ignore: missing declaration file for './apiClient'
import apiClient from './apiClient';
import { Resource, ResourceList, ResourceCategory } from '../types/resource';

export const resourceService = {
  getAll: (params: Record<string, any> = {}) => 
    apiClient.get<ResourceList>('/api/3d-resources/', { params }),

  getById: (id: number) => 
    apiClient.get<Resource>(`/api/3d-resources/${id}/`),

  search: (q: string, params: Record<string, any> = {}) =>
    apiClient.get<ResourceList>('/api/3d-resources/search/', {
      params: { q, ...params }
    }),

  getFeatured: (params: Record<string, any> = {}) =>
    apiClient.get<Resource[]>(`/api/3d-resources/featured/`, { params }),

  getCategories: () =>
    apiClient.get<ResourceCategory[]>('/api/3d-resources/categories/'),

  trackView: (id: number) =>
    apiClient.post(`/api/3d-resources/${id}/view/`),

  downloadUrl: (id: number) => 
    `${apiClient.defaults.baseURL}/api/3d-resources/${id}/download/`,

  create: async (formData: FormData) => {
    return apiClient.post<Resource>('/api/3d-resources/', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
  },

  update: (id: number, data: Record<string, any>) => {
    return apiClient.put<Resource>(`/api/3d-resources/${id}/`, data);
  },

};

