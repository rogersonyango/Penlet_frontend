// src/hooks/useResources.ts
import { useQuery } from '@tanstack/react-query';
import { resourceService } from '../services/resource';

export const useResources = (params: Record<string, any> = {}) => {
  return useQuery({
    queryKey: ['resources', params],
    queryFn: () => resourceService.getAll(params),
    staleTime: 5 * 60 * 1000, // 5 min
  });
};

export const useResource = (id: number) => {
  return useQuery({
    queryKey: ['resource', id],
    queryFn: () => resourceService.getById(id),
    enabled: !!id,
  });
};

export const useSearch = (query: string, params: Record<string, any> = {}) => {
  return useQuery({
    queryKey: ['search', query, params],
    queryFn: () => resourceService.search(query, params),
    enabled: !!query.trim(),
  });
};

export const useFeatured = (params: Record<string, any> = {}) => {
  return useQuery({
    queryKey: ['featured', params],
    queryFn: () => resourceService.getFeatured(params),
  });
};

export const useCategories = () => {
  return useQuery({
    queryKey: ['categories'],
    queryFn: resourceService.getCategories,
  });
};