interface ApiResponse<T> {
    data?: T
    error?: string
  }
  
  const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8000/api'
  
  export const apiClient = {
    async get<T>(endpoint: string): Promise<ApiResponse<T>> {
      return await request<T>(endpoint)
    },
  
    async post<T>(endpoint: string, data: Record<string, unknown>): Promise<ApiResponse<T>> {
      return await request<T>(endpoint, {
        method: 'POST',
        body: JSON.stringify(data),
      })
    },
  
    async delete<T>(endpoint: string): Promise<ApiResponse<T>> {
      return await request<T>(endpoint, { method: 'DELETE' })
    },
  }
  
  async function request<T>(endpoint: string, options: RequestInit = {}): Promise<ApiResponse<T>> {
    try {
      const url = `${API_BASE_URL}${endpoint}`
      const response = await fetch(url, {
        ...options,
        headers: {
          'Content-Type': 'application/json',
          ...options.headers,
        },
      })
  
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        return { error: errorData.detail || `HTTP error! status: ${response.status}` }
      }
  
      const data: T = await response.json()
      return { data }
    } catch (error) {
      console.error('API Error:', error)
      return { error: error instanceof Error ? error.message : 'An unknown error occurred' }
    }
  }
  
  