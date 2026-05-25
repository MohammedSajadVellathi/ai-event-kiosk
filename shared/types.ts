// Shared type definitions — used by both frontend and backend documentation

export interface Template {
  id: string;
  title: string;
  premium: boolean;
}

export interface GenerateRequest {
  image: File; // multipart/form-data
}

export interface GenerateResponse {
  success: boolean;
  imageUrl: string;
  error?: string;
}

export interface HealthResponse {
  status: "ok" | "degraded" | "error";
  service: string;
}
