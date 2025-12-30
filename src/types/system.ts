// src/types/system.ts
export interface HealthResponse {
  status: string;
  timestamp: string;
}

export interface VersionResponse {
  app_name: string;
  version: string;
  python_version: string;
  platform: string;
  timestamp: string;
}

export interface StatusResponse {
  status: string;
  uptime: string;
  services: {
    database: string;
    storage: string;
    cache: string;
  };
  timestamp: string;
}