import Constants from 'expo-constants';
import { Platform } from 'react-native';

// URL do Render - será usada para desenvolvimento e produção
const RENDER_URL = 'https://omni-c4j7.onrender.com';

// Função auxiliar para determinar a URL base da API
const getApiUrl = () => {
  // Para qualquer plataforma, sempre use o Render
  return RENDER_URL;
};

// Configuração da API
export const API_CONFIG = {
  baseURL: getApiUrl(),
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  }
};

// Para debug - mostra a URL base no console
console.log(`[API] URL Base: ${API_CONFIG.baseURL}`);

// Funções auxiliares para chamadas à API
export const apiCall = async (endpoint, options = {}) => {
  // Antes de cada chamada, mostra a URL completa (para debug)
  const url = `${API_CONFIG.baseURL}${endpoint}`;
  
  // Em produção, não mostramos logs
  if (__DEV__) {
    console.log(`[API] Chamando: ${url}`);
  }
  
  const config = {
    ...options,
    headers: {
      ...API_CONFIG.headers,
      ...options.headers,
    },
  };
  
  try {
    const response = await fetch(url, config);
    return response;
  } catch (error) {
    if (__DEV__) {
      console.error(`[API] Erro: ${error.message}`);
    }
    throw error;
  }
};
