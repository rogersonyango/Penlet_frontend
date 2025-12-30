// src/services/systemService.ts
// @ts-ignore: no declaration file for './apiClient'
const apiClient = require('./apiClient') as {
  get<T>(url: string): Promise<T>;
  post?<T>(url: string, body?: any): Promise<T>;
  put?<T>(url: string, body?: any): Promise<T>;
  delete?<T>(url: string): Promise<T>;
};
import { HealthResponse, VersionResponse, StatusResponse } from '../types/system';

export const systemService = {
  health: () => apiClient.get<HealthResponse>('/api/health/'),
  version: () => apiClient.get<VersionResponse>('/api/version/'),
  status: () => apiClient.get<StatusResponse>('/api/status/'),
};