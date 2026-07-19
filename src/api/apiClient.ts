/**
 * API Client for CentralObra
 * This layer abstracts all fetch calls and prepares the app for a future Backend adoption.
 * Includes: Timeout, Retry with exponential backoff, Error formatting.
 */

export interface ApiClientOptions extends RequestInit {
  timeout?: number;
  retries?: number;
  retryDelay?: number;
}

export class ApiError extends Error {
  public status: number;
  public data: any;

  constructor(message: string, status: number, data?: any) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.data = data;
  }
}

class ApiClient {
  private defaultOptions: ApiClientOptions = {
    timeout: 10000, // 10 seconds
    retries: 2,
    retryDelay: 1000,
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    }
  };

  /**
   * Main request method with timeout and retry logic
   */
  async request<T>(endpoint: string, options: ApiClientOptions = {}): Promise<T> {
    const config = { ...this.defaultOptions, ...options };
    const { timeout, retries, retryDelay, ...fetchOptions } = config;

    let attempt = 0;
    while (attempt <= (retries || 0)) {
      try {
        const controller = new AbortController();
        const id = setTimeout(() => controller.abort(), timeout);

        const response = await fetch(endpoint, {
          ...fetchOptions,
          signal: controller.signal
        });

        clearTimeout(id);

        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}));
          throw new ApiError(`Request failed with status ${response.status}`, response.status, errorData);
        }

        // Return empty object for 204 No Content
        if (response.status === 204) {
          return {} as T;
        }

        return await response.json() as T;

      } catch (error: any) {
        attempt++;
        const isAbort = error.name === 'AbortError';
        
        console.warn(`[ApiClient] Attempt ${attempt} failed for ${endpoint}:`, error.message);

        if (attempt > (retries || 0)) {
          if (isAbort) {
            throw new ApiError('Request timeout', 408);
          }
          throw error;
        }

        // Wait before retrying (Exponential Backoff)
        const delay = (retryDelay || 1000) * attempt;
        await new Promise(res => setTimeout(res, delay));
      }
    }

    throw new Error('Unreachable request block');
  }

  // Convenience methods
  async get<T>(endpoint: string, options?: ApiClientOptions): Promise<T> {
    return this.request<T>(endpoint, { ...options, method: 'GET' });
  }

  async post<T>(endpoint: string, body: any, options?: ApiClientOptions): Promise<T> {
    return this.request<T>(endpoint, {
      ...options,
      method: 'POST',
      body: JSON.stringify(body)
    });
  }

  async put<T>(endpoint: string, body: any, options?: ApiClientOptions): Promise<T> {
    return this.request<T>(endpoint, {
      ...options,
      method: 'PUT',
      body: JSON.stringify(body)
    });
  }

  async delete<T>(endpoint: string, options?: ApiClientOptions): Promise<T> {
    return this.request<T>(endpoint, { ...options, method: 'DELETE' });
  }
}

export const apiClient = new ApiClient();
