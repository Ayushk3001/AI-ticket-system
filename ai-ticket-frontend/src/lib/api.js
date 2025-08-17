const API_BASE_URL = import.meta.env.VITE_SERVER_URL || 'http://localhost:3000/api';

class ApiError extends Error {
  constructor(message, status, data) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.data = data;
  }
}

const getAuthHeaders = () => {
  const token = localStorage.getItem('token');
  return {
    'Content-Type': 'application/json',
    ...(token && { Authorization: `Bearer ${token}` }),
  };
};

const handleResponse = async (response) => {
  const data = await response.json().catch(() => ({}));
  
  if (!response.ok) {
    throw new ApiError(
      data.message || data.error || 'An error occurred',
      response.status,
      data
    );
  }
  
  return data;
};

const apiRequest = async (endpoint, options = {}) => {
  const url = `${API_BASE_URL}${endpoint}`;
  const config = {
    headers: getAuthHeaders(),
    ...options,
  };

  if (config.body && typeof config.body === 'object') {
    config.body = JSON.stringify(config.body);
  }

  try {
    const response = await fetch(url, config);
    return await handleResponse(response);
  } catch (error) {
    if (error instanceof ApiError) {
      throw error;
    }
    throw new ApiError('Network error occurred', 0, { originalError: error });
  }
};

// Auth API
export const auth = {
  login: (credentials) => apiRequest('/auth/login', {
    method: 'POST',
    body: credentials,
  }),
  
  signup: (userData) => apiRequest('/auth/signup', {
    method: 'POST',
    body: userData,
  }),
  
  logout: () => apiRequest('/auth/logout', {
    method: 'POST',
  }),
};

// Users API
export const users = {
  getAll: () => apiRequest('/auth/users'),
  
  update: (userData) => apiRequest('/auth/update-user', {
    method: 'POST',
    body: userData,
  }),
};

// Tickets API
export const tickets = {
  getAll: (params = {}) => {
    const searchParams = new URLSearchParams();
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== '') {
        searchParams.append(key, value);
      }
    });
    
    const queryString = searchParams.toString();
    return apiRequest(`/tickets${queryString ? `?${queryString}` : ''}`);
  },
  
  getById: (id) => apiRequest(`/tickets/${id}`),
  
  create: (ticketData) => apiRequest('/tickets', {
    method: 'POST',
    body: ticketData,
  }),
  
  update: (id, ticketData) => apiRequest(`/tickets/${id}`, {
    method: 'PUT',
    body: ticketData,
  }),
  
  delete: (id) => apiRequest(`/tickets/${id}`, {
    method: 'DELETE',
  }),
};

// Export the ApiError for use in components
export { ApiError };