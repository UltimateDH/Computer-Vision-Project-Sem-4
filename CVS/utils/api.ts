import * as SecureStore from 'expo-secure-store';
import { router } from 'expo-router';
export const API_URL = "https://available-dichotomously-clare.ngrok-free.dev"; // replace with your LAN IP

async function authHeaders() {
  const token = await SecureStore.getItemAsync('token');
  if (!token) {
    router.replace('/login');
    throw new Error('Not authenticated');
  }
  return {
    Authorization: `Bearer ${token}`,
    "ngrok-skip-browser-warning": "true",
  };
}

export async function uploadImage(uri: string, source: 'camera' | 'album') {
  const headers = await authHeaders();

  const formData = new FormData();
  formData.append('file', {
    uri,
    name: `${source}-${Date.now()}.jpg`,
    type: 'image/jpeg',
  } as any);
  formData.append('source', source);

  const res = await fetch(`${API_URL}/images/upload`, {
    method: 'POST',
    headers, // no Content-Type — fetch sets the multipart boundary itself
    body: formData,
  });
    
  const data = await res.json();
  if (!res.ok) throw new Error(data.detail || 'Upload failed');
  return data; // { id, url, source, uploaded_at, ... }
}

export async function getImages() {
  const headers = await authHeaders();

  const res = await fetch(`${API_URL}/images`, { headers });
  const data = await res.json();
  if (!res.ok) throw new Error(data.detail || 'Failed to load images');
  return data.images as {
    id: string;
    original_name: string;
    content_type: string;
    source: string;
    uploaded_at: string;
    url: string;
  }[];
}

export async function signup(
  username: string,
  email: string,
  password: string,
  phone_num?: string,
  address?: string
) {
  const res = await fetch(`${API_URL}/auth/signup`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "ngrok-skip-browser-warning": "true",
    },
    body: JSON.stringify({ username, email, password, phone_num, address }),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.detail || "Signup failed");
  return data;
}

export async function login(username: string, email: string, password: string) {
  const res = await fetch(`${API_URL}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username, email, password }), // Added username here
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.detail || "Login failed");
  return data; // { access_token, token_type }
}


export async function getMe() {
  const headers = await authHeaders();
  const res = await fetch(`${API_URL}/auth/me`, { headers });
  const data = await res.json();
  if (!res.ok) throw new Error(data.detail || 'Failed to load profile');
  return data as {
    user_id: number;
    username: string;
    email: string;
    phone_num?: string;
    address?: string;
    profile_picture_url: string | null;
  };
}

export async function uploadProfilePicture(uri: string) {
  const headers = await authHeaders();

  const formData = new FormData();
  formData.append('file', {
    uri,
    name: `profile-${Date.now()}.jpg`,
    type: 'image/jpeg',
  } as any);

  const res = await fetch(`${API_URL}/auth/me/profile-picture`, {
    method: 'POST',
    headers,
    body: formData,
  });

  const data = await res.json();
  if (!res.ok) throw new Error(data.detail || 'Failed to upload profile picture');
  return data;
}