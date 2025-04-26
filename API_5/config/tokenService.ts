import AsyncStorage from '@react-native-async-storage/async-storage';
import { apiCall } from './api';

const TOKEN_KEY = 'access_token';
const REFRESH_TOKEN_KEY = 'refresh_token';

export const getToken = async () => {
  return await AsyncStorage.getItem(TOKEN_KEY);
};

export const refreshToken = async () => {
  try {
    const refreshToken = await AsyncStorage.getItem(REFRESH_TOKEN_KEY);
    if (!refreshToken) return null;

    const response = await apiCall('/api/token/refresh/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ refresh: refreshToken }),
    });

    if (response.ok) {
      const data = await response.json();
      await AsyncStorage.setItem(TOKEN_KEY, data.access);
      return data.access;
    }
    
    return null;
  } catch (error) {
    console.error('Erro ao renovar token:', error);
    return null;
  }
};

export const makeAuthenticatedRequest = async (url: string, options: { headers?: Record<string, string> } = {}) => {
  // Obter token atual
  let token = await getToken();
  
  // Configurar headers com o token
  const requestOptions = {
    ...options,
    headers: {
      ...options.headers,
      'Authorization': `Bearer ${token}`,
    },
  };
  
  // Realizar a chamada
  let response = await apiCall(url, requestOptions);
  
  // Se o token expirou, tenta renovar e refazer a chamada
  if (response.status === 401) {
    token = await refreshToken();
    
    if (token) {
      requestOptions.headers['Authorization'] = `Bearer ${token}`;
      response = await apiCall(url, requestOptions);
    }
  }
  
  return response;
};