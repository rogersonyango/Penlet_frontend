// src/types/resource.ts
export interface ResourceCategory {
  id: number;
  name: string;
}

export interface Resource {
  id: number;
  title: string;
  description: string | null;
  subject: string;
  file_format: 'glb' | 'gltf' | 'obj';
  is_featured: boolean;
  view_count: number;
  created_at: string; // ISO 8601
  category: ResourceCategory;
}

export interface ResourceList {
  items: Resource[];
  total: number;
  page: number;
  size: number;
}