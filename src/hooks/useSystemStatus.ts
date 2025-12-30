// src/hooks/useSystemStatus.ts
import { useQuery } from '@tanstack/react-query';
import { systemService } from '../services/system';

export const useHealth = () => 
  useQuery({ queryKey: ['health'], queryFn: systemService.health });

export const useVersion = () => 
  useQuery({ queryKey: ['version'], queryFn: systemService.version });

export const useSystemStatus = () => 
  useQuery({ queryKey: ['system-status'], queryFn: systemService.status });