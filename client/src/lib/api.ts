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

// ======================= API HELPERS =======================

export const getMyProfile = () => apiFetch('/profile/me');

export const updateMyProfile = (data: Record<string, any>) =>
  apiFetch('/profile/me', {
    method: 'PATCH',
    body: JSON.stringify(data),
  });

export const getUserReviews = (userId: string) => apiFetch(`/users/${userId}/reviews`);

export const getMatches = (params?: { lookingFor?: string }) => {
  const query = new URLSearchParams();
  if (params?.lookingFor) query.append('lookingFor', params.lookingFor);
  const qs = query.toString();
  return apiFetch(`/matches${qs ? `?${qs}` : ''}`);
};

export interface RoomFilterParams {
  locality?: string;
  area?: string;
  maxRent?: string | number;
  maxDistanceKm?: string | number;
  roomType?: string;
  furnished?: string;
}

export const getRooms = (params?: RoomFilterParams) => {
  const query = new URLSearchParams();
  if (params?.locality) query.append('locality', params.locality);
  if (params?.area) query.append('area', params.area);
  if (params?.maxRent) query.append('maxRent', String(params.maxRent));
  if (params?.maxDistanceKm) query.append('maxDistanceKm', String(params.maxDistanceKm));
  if (params?.roomType) query.append('roomType', params.roomType);
  if (params?.furnished) query.append('furnished', params.furnished);
  const qs = query.toString();
  return apiFetch(`/rooms${qs ? `?${qs}` : ''}`);
};

export const getRoomById = (id: string) => apiFetch(`/rooms/${id}`);

export const createRoom = (data: Record<string, any>) =>
  apiFetch('/rooms', {
    method: 'POST',
    body: JSON.stringify(data),
  });

export const updateRoom = (id: string, data: Record<string, any>) =>
  apiFetch(`/rooms/${id}`, {
    method: 'PATCH',
    body: JSON.stringify(data),
  });

export const deleteRoom = (id: string) =>
  apiFetch(`/rooms/${id}`, {
    method: 'DELETE',
  });

export const sendRoomieRequest = (receiverId: string) =>
  apiFetch('/requests', {
    method: 'POST',
    body: JSON.stringify({ receiverId }),
  });

