import React, { useState } from 'react';
import { View, Text, Image, TextInput, TouchableOpacity, ActivityIndicator } from 'react-native';
import { apiCall } from '../../config/api';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { router } from 'expo-router';
import styles, { cores } from './style';
import { BaseScreen, Modal } from '../../components';

export default function Login() {
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [modalMessage, setModalMessage] = useState('');

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
        console.log('Resposta completa do login:', data);

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

          console.log('ID do usuário extraído do token:', userId);

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
          '/(drawer)/Home' : '/(drawer)/Chatbots');

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
          router.push(isAdmin ? '/Home' : '/(drawer)/Chatbots');
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
    <BaseScreen >
      <Image
        source={require('../../assets/project_images/logotipo.png')}
        style={styles.image}
        resizeMode="contain"
      />

      <TextInput
        style={styles.input}
        placeholder="Email"
        keyboardType="email-address"
        placeholderTextColor={cores.cor6}
        value={email}
        onChangeText={setEmail}
      />

      <TextInput
        style={styles.input}
        placeholder="Senha"
        secureTextEntry
        placeholderTextColor={cores.cor1}
        value={senha}
        onChangeText={setSenha}
      />

      <TouchableOpacity
        style={styles.button}
        onPress={handleLogin}
        disabled={loading}
      >
        {loading ? (
          <ActivityIndicator color={cores.cor8} />
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
      <Modal setShow={setModalVisible} show={modalVisible}>
        <Text style={styles.modalText}>{modalMessage}</Text>
      </Modal>
    </BaseScreen >
  );
};