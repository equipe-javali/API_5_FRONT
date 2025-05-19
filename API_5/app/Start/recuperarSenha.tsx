import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, Alert } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { router } from 'expo-router';

const RecuperarSenha: React.FC = () => {
  const [email, setEmail] = useState<string>('');

  const handleEnviar = () => {
    if (!email) {
      Alert.alert('Erro', 'Por favor, preencha o e-mail.');
      return;
    }

    // Aqui você faria uma chamada para o backend
    Alert.alert('Recuperação', 'Se o e-mail estiver cadastrado, enviaremos instruções.');
  };

  return (
    <View style={styles.container}>
      <StatusBar style="auto" />
      <Text style={styles.title}>Recuperar Senha</Text>

      <TextInput
        style={styles.input}
        placeholder="Digite seu e-mail"
        placeholderTextColor="#B8B8B8"
        keyboardType="email-address"
        autoCapitalize="none"
        value={email}
        onChangeText={setEmail}
      />

      <TouchableOpacity style={styles.button} onPress={handleEnviar}>
        <Text style={styles.buttonText}>Enviar</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
        <Text style={styles.backButtonText}>Voltar</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#2E2E2E',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },
  title: {
    fontSize: 24,
    color: '#F5F5F5',
    marginBottom: 20,
    fontFamily: 'Roboto',
  },
  input: {
    width: '100%',
    backgroundColor: '#F5F5F5',
    color: '#111',
    borderRadius: 5,
    paddingHorizontal: 20,
    paddingVertical: 12,
    fontSize: 18,
    fontFamily: 'Roboto',
    marginBottom: 20,
  },
  button: {
    backgroundColor: '#282828',
    borderRadius: 10,
    paddingVertical: 12,
    paddingHorizontal: 40,
    borderWidth: 1,
    borderColor: '#F5F5F5',
    marginBottom: 20,
  },
  buttonText: {
    color: '#F5F5F5',
    fontSize: 20,
    fontFamily: 'Roboto',
  },
  backButton: {
    padding: 10,
  },
  backButtonText: {
    color: '#B8B8B8',
    fontSize: 16,
    fontFamily: 'Roboto',
    textDecorationLine: 'underline',
  },
});

export default RecuperarSenha;
