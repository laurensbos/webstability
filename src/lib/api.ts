/**
 * API Utility - Webstability
 * 
 * Centralized fetch wrapper with:
 * - Consistent error handling
 * - Automatic JSON parsing
 * - Loading state management
 * - Retry logic for failed requests
 */

export interface ApiResponse<T = unknown> {
  success: boolean
  data?: T
  error?: string
  status: number
}

export class ApiError extends Error {
  status: number
  code?: string
  
  constructor(message: string, status: number, code?: string) {
    super(message)
    this.name = 'ApiError'
    this.status = status
    this.code = code
  }
}

interface FetchOptions extends RequestInit {
  retries?: number
  retryDelay?: number
}

/**
 * Enhanced fetch with error handling
 */
export async function api<T = unknown>(
  url: string,
  options: FetchOptions = {}
): Promise<ApiResponse<T>> {
  const { retries = 0, retryDelay = 1000, ...fetchOptions } = options

  let lastError: Error | null = null

  for (let attempt = 0; attempt <= retries; attempt++) {
    try {
      const response = await fetch(url, {
        headers: {
          'Content-Type': 'application/json',
          ...fetchOptions.headers,
        },
        ...fetchOptions,
      })

      // Try to parse JSON response
      let data: T | undefined
      const contentType = response.headers.get('content-type')
      
      if (contentType?.includes('application/json')) {
        try {
          data = await response.json()
        } catch {
          // Response wasn't valid JSON
        }
      }

      if (!response.ok) {
        const errorMessage = (data as any)?.error || (data as any)?.message || `HTTP error ${response.status}`
        throw new ApiError(errorMessage, response.status, (data as any)?.code)
      }

      return {
        success: true,
        data,
        status: response.status,
      }
    } catch (error) {
      lastError = error as Error

      // Don't retry on client errors (4xx)
      if (error instanceof ApiError && error.status >= 400 && error.status < 500) {
        break
      }

      // Wait before retrying
      if (attempt < retries) {
        await new Promise(resolve => setTimeout(resolve, retryDelay * (attempt + 1)))
      }
    }
  }

  return {
    success: false,
    error: lastError?.message || 'Unknown error occurred',
    status: lastError instanceof ApiError ? lastError.status : 0,
  }
}

/**
 * GET request helper
 */
export async function apiGet<T = unknown>(
  url: string,
  options?: Omit<FetchOptions, 'method' | 'body'>
): Promise<ApiResponse<T>> {
  return api<T>(url, { ...options, method: 'GET' })
}

/**
 * POST request helper
 */
export async function apiPost<T = unknown>(
  url: string,
  body?: unknown,
  options?: Omit<FetchOptions, 'method' | 'body'>
): Promise<ApiResponse<T>> {
  return api<T>(url, {
    ...options,
    method: 'POST',
    body: body ? JSON.stringify(body) : undefined,
  })
}

/**
 * PUT request helper
 */
export async function apiPut<T = unknown>(
  url: string,
  body?: unknown,
  options?: Omit<FetchOptions, 'method' | 'body'>
): Promise<ApiResponse<T>> {
  return api<T>(url, {
    ...options,
    method: 'PUT',
    body: body ? JSON.stringify(body) : undefined,
  })
}

/**
 * DELETE request helper
 */
export async function apiDelete<T = unknown>(
  url: string,
  options?: Omit<FetchOptions, 'method'>
): Promise<ApiResponse<T>> {
  return api<T>(url, { ...options, method: 'DELETE' })
}
