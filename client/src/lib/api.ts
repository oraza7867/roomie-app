export const BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001/api';

export const apiFetch = async (endpoint: string, options: RequestInit = {}) => {
  try {
    const response = await fetch(`${BASE_URL}${endpoint}`, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      // CRITICAL: This allows the browser to send and receive HTTP-only cookies
      credentials: 'include', 
    });

    const data = await response.json();

    if (!response.ok) {
      // Map robotic backend errors to natural ones
      let errorMessage = data.message || 'Something went wrong';
      
      if (errorMessage === 'Invalid credentials') {
        errorMessage = "Email or password doesn't look right.";
      } else if (errorMessage === 'Email is already registered') {
        errorMessage = "That email is already registered.";
      }

      throw new Error(errorMessage);
    }

    return data;
  } catch (error: any) {
    // If it's our thrown error, re-throw it
    if (error.message) throw error;
    throw new Error('Network error. Please check your connection.');
  }
};
