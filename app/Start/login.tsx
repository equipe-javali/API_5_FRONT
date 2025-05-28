import React, { useState, useEffect } from 'react';
import { StatusBar } from 'expo-status-bar';
import { View, Text, StyleSheet, Image, TextInput, TouchableOpacity, Modal, ActivityIndicator } from 'react-native';
import * as Font from 'expo-font'; 
import { apiCall } from '../../config/api';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { router } from 'expo-router';



const Login = () => {
  const [fontLoaded, setFontLoaded] = useState(false);
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [modalMessage, setModalMessage] = useState('');

  useEffect(() => {
    const loadFonts = async () => {
      await Font.loadAsync({
          Roboto: require('../../assets/fonts/Roboto-Regular.ttf'),
      });
      setFontLoaded(true);
    };

    loadFonts();
  }, []);

  const handleLogin = async () => {
    // Validação básica
    if (!email || !senha) {
      setModalMessage('Por favor, preencha todos os campos.');
      setModalVisible(true);
      return;
    }

    try {
      setLoading(true);
      
      // Verificar se é um email corporativo pro4tech
      // if (email.endsWith('@pro4tech.com.br')) {
      //   // Redirecionar para a tela de registro para usuários corporativos
      //   router.push('/Start/register');
      //   return;
      // }
      
      // Para outros emails, tentar fazer login
      const response = await apiCall('/api/usuario/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: email,
          senha: senha,
        }),
      });

      const data = await response.json();
      
        if (response.ok) {
        // Log detalhado da resposta
        // console.log('Resposta completa do login:', data);
        
        // Armazena os tokens
        await AsyncStorage.setItem('access_token', data.access_token);
        await AsyncStorage.setItem('refresh_token', data.refresh_token);
        
        try {
          // Decodificar o token para obter o ID do usuário
          const tokenParts = data.access_token.split('.');
          const payloadBase64 = tokenParts[1];
          // Decodifica o Base64 para string e converte para objeto
          const payloadString = atob ? atob(payloadBase64) : 
            Buffer.from(payloadBase64, 'base64').toString('ascii');
          const payload = JSON.parse(payloadString);
          const userId = payload.user_id;
          
          // console.log('ID do usuário extraído do token:', userId);
          
          // Armazenar o ID do usuário
          if (userId) {
            await AsyncStorage.setItem('userId', userId.toString());
          }
        } catch (error) {
          console.error('Erro ao extrair ID do usuário do token:', error);
        }
        
        const isAdmin = data.is_staff === true || 
                        data.admin === true || 
                        data.is_admin === true;
                        
        console.log('Status de admin detectado:', isAdmin);
        console.log('Valores nas propriedades:',
          'is_admin:', data.is_admin,
          'admin:', data.admin,
          'is_staff:', data.is_staff
        );
        
        await AsyncStorage.setItem('isAdmin', isAdmin ? 'true' : 'false');
        
        console.log('Tentando redirecionar para:', isAdmin ? 
          '/(drawer)/Home' : '/(drawer)/MeusChatbots/meusChatbots');
        
        try {
          if (isAdmin) {
            router.push('/(drawer)/Home');
          } else {
            router.push('/Start/HomeUsuario');
          }
          console.log('Redirecionamento executado');
        } catch (error) {
          console.error('Erro no redirecionamento:', error);
          // Rotas alternativas como fallback
          router.push(isAdmin ? '/Home' : '/MeusChatbots/meusChatbots');
        }
      } else {
        setModalMessage(data.msg || 'Credenciais inválidas.');
        setModalVisible(true);
      }
    } catch (error) {
      console.error('Erro no login:', error);
      setModalMessage('Erro ao conectar com o servidor.');
      setModalVisible(true);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar style="auto" />
      
      <Image
        source={require('../../assets/project_images/logotipo.png')}
        style={styles.image}
        resizeMode="contain"
      />

      <TextInput
        style={styles.input}
        placeholder="Email"
        keyboardType="email-address"
        placeholderTextColor="#B8B8B8" 
        value={email}
        onChangeText={setEmail}
      />
      
      <TextInput
        style={styles.input}
        placeholder="Senha"
        secureTextEntry
        placeholderTextColor="#B8B8B8" 
        value={senha}
        onChangeText={setSenha}
      />

      <TouchableOpacity 
        style={styles.button} 
        onPress={handleLogin}
        disabled={loading}
      >
        {loading ? (
          <ActivityIndicator color="#F5F5F5" />
        ) : (
          <Text style={styles.buttonText}>Entrar</Text>
        )}
      </TouchableOpacity>

      <View style={styles.registerContainer}>
        <Text style={styles.registerText}>Não tem cadastro? </Text>
        <TouchableOpacity onPress={() => router.push('/Start/register')}>
          <Text style={styles.registerLink}>Registre-se aqui</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.registerContainer}>
        <TouchableOpacity onPress={() => router.push('/Start/recuperarSenha')}>
          <Text style={styles.registerLink}>Esqueci minha senha</Text>
        </TouchableOpacity>
      </View>


      <Modal
        transparent={true}
        animationType="fade"
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <Text style={styles.modalText}>{modalMessage}</Text>
            <TouchableOpacity 
              style={styles.closeButton} 
              onPress={() => setModalVisible(false)}
            >
              <Text style={styles.buttonText}>Fechar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#2E2E2E',
    padding: 24,
  },
  input: {
    paddingHorizontal: 24,
    paddingVertical: 10,
    fontSize: 24,
    width: '100%',
    borderColor: '#F5F5F5',
    borderWidth: 1,
    marginBottom: 12,
    borderRadius: 5,
    color: '#111',
    backgroundColor: '#F5F5F5',
    fontFamily: 'Roboto',
  },
  image: {
    width: 250,
    height: 150,
  },
  button: {
    borderWidth: 1, 
    borderColor: '#F5F5F5',
    backgroundColor: '#282828',  
    borderRadius: 10,  
    paddingVertical: 12, 
    paddingHorizontal: 50,  
    marginTop: 20,
    minWidth: 150,
    alignItems: 'center',
  },
  buttonText: {
    color: '#F5F5F5',  
    fontSize: 24,
    fontFamily: 'Roboto',
    textAlign: 'center',
  },
  // Estilos para o modal
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContainer: {
    width: "80%",
    backgroundColor: "#000",
    borderRadius: 10,
    padding: 20,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#fff",
  },
  modalText: {
    fontSize: 18,
    fontFamily: "Roboto",
    color: "#fff",
    marginBottom: 20,
    textAlign: "center",
  },
  closeButton: {
    padding: 10,
    borderRadius: 5,
    borderWidth: 1,
    borderColor: "#fff",
    backgroundColor: "#000",
    alignItems: "center",
    minWidth: 100,
  },

  registerContainer: {
    marginTop: 20,
    flexDirection: 'row',
    alignItems: 'center',
  },
  registerText: {
    color: '#F5F5F5',
    fontSize: 16,
    fontFamily: 'Roboto',
  },
  registerLink: {
    color: '#B8B8B8',
    fontSize: 16,
    fontFamily: 'Roboto',
    textDecorationLine: 'underline',
  },
});

export default Login;