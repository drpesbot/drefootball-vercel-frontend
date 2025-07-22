import axios from 'axios';

const API_BASE_URL = 'https://drefootball-backend.onrender.com/api';

const api = axios.create({
  baseURL: API_BASE_URL,
});

export const getPlayers = async () => {
  try {
    const response = await api.get('/players');
    return response.data;
  } catch (error) {
    console.error('Error fetching players:', error);
    throw error;
  }
};

export const addPlayer = async (playerData) => {
  try {
    const response = await api.post('/players', playerData);
    return response.data;
  } catch (error) {
    console.error('Error adding player:', error);
    throw error;
  }
};

export const updatePlayer = async (id, playerData) => {
  try {
    const response = await api.put(`/players/${id}`, playerData);
    return response.data;
  } catch (error) {
    console.error('Error updating player:', error);
    throw error;
  }
};

export const deletePlayer = async (id) => {
  try {
    const response = await api.delete(`/players/${id}`);
    return response.data;
  } catch (error) {
    console.error('Error deleting player:', error);
    throw error;
  }
};

export const uploadImage = async (file) => {
  try {
    const formData = new FormData();
    formData.append('image', file);
    const response = await api.post('/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error uploading image:', error);
    throw error;
  }
};

export const authenticate = async (password) => {
  try {
    const response = await api.post('/auth', { password });
    return response.data;
  } catch (error) {
    console.error('Authentication error:', error);
    throw error;
  }
};

export const getSettings = async () => {
  try {
    const response = await api.get('/settings');
    return response.data;
  } catch (error) {
    console.error('Error fetching settings:', error);
    throw error;
  }
};

export const updateSettings = async (settingsData) => {
  try {
    const response = await api.put('/settings', settingsData);
    return response.data;
  } catch (error) {
    console.error('Error updating settings:', error);
    throw error;
  }
};

