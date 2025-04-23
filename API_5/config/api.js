import Constants from 'expo-constants';
import { Platform } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

// IP do servidor de desenvolvimento - altere para seu IP atual
// Isso será usado como fallback quando a detecção automática falhar
const DEV_SERVER_IP = '192.168.18.210'; // 👈 Atualize para seu IP atual

// Função auxiliar para determinar a URL base da API
const getApiUrl = () => {
  // Obtém o tipo de execução - 'web', 'ios', 'android'
  const runningPlatform = Platform.OS;
  
  // Ambiente de desenvolvimento com Expo
  if (__DEV__) {
    // Para web em desenvolvimento, localhost funciona
    if (runningPlatform === 'web') {
      return 'http://localhost:8000';
    }
    
    // Para dispositivos móveis em desenvolvimento, use o IP da máquina host
    if (runningPlatform === 'android' || runningPlatform === 'ios') {
      // Primeiro, tente o endereço da LAN do host Expo
      const debuggerHost = Constants.expoConfig?.hostUri || 
                           Constants.manifest?.debuggerHost || 
                           Constants.manifest2?.extra?.expoGo?.debuggerHost;
                        
      if (debuggerHost) {
        const host = debuggerHost.split(':')[0];
        console.log(`[API] Usando host detectado: ${host}`);
        return `http://${host}:8000`;
      }
      
      // Se a detecção falhar, use o IP configurado
      console.log(`[API] Usando IP configurado: ${DEV_SERVER_IP}`);
      return `http://${DEV_SERVER_IP}:8000`;
    }
  }
  
  // Produção - use sua URL de produção
  return 'https://api.pro4tech.com.br';
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
  console.log(`[API] Chamando: ${url}`);
  
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
    console.error(`[API] Erro: ${error.message}`);
    throw error;
  }
};