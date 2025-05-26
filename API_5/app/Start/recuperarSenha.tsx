import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, Alert, ActivityIndicator, Image } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { router } from 'expo-router';
import { apiCall } from '../../config/api';
import styles from './style';
import { BaseScreen } from '../../components';

const RecuperarSenha: React.FC = () => {
  const [email, setEmail] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);

  const handleEnviar = async () => {
    if (!email) {
      Alert.alert('Erro', 'Por favor, preencha o e-mail.');
      return;
    }

    setLoading(true);

    try {
      const response = await apiCall('/api/usuario/trocar-senha/', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });

      if (response.status === 200) {
        Alert.alert('Recuperação', 'Se o e-mail estiver cadastrado, enviaremos instruções.');
      } else {
        Alert.alert('Erro', 'Erro ao enviar solicitação. Tente novamente.');
      }
    } catch (error) {
      console.error(error);
      Alert.alert('Erro', 'Ocorreu um erro de conexão.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <BaseScreen>
      <Image
        source={require('../../assets/project_images/logotipo.png')}
        style={styles.image}
        resizeMode="contain"
      />

      <Text style={styles.headerTitle}>Recuperar Senha</Text>

      <TextInput
        style={styles.input}
        placeholder="Digite seu e-mail"
        placeholderTextColor="#B8B8B8"
        keyboardType="email-address"
        autoCapitalize="none"
        value={email}
        onChangeText={setEmail}
      />

      <View style={styles.buttonContainer}>
        {loading ? (
          <ActivityIndicator size="large" color="#F5F5F5" style={{ marginBottom: 20 }} />
        ) : (
          <TouchableOpacity style={styles.button} onPress={handleEnviar}>
            <Text style={styles.buttonText}>Enviar</Text>
          </TouchableOpacity>
        )}

        <TouchableOpacity style={styles.button} onPress={() => router.back()}>
          <Text style={styles.buttonText}>Voltar</Text>
        </TouchableOpacity>
      </View>
    </BaseScreen>
  );
};

export default RecuperarSenha;
