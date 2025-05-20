import React, { useState, useEffect } from 'react';
import { StatusBar } from 'expo-status-bar';
import { View, Text, Image, TextInput, TouchableOpacity, Modal, ActivityIndicator } from 'react-native';
import * as Font from 'expo-font';
import { apiCall } from '../../config/api';
import { router } from 'expo-router';
import styles from './style';

export default function Register() {
  const [fontLoaded, setFontLoaded] = useState(false);
  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [modalMessage, setModalMessage] = useState('');
  const [isError, setIsError] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [loading, setLoading] = useState(false); // Estado de loading
  // const admin = true;

  const [senhaValida, setSenhaValida] = useState({
    tamanho: false,
    maiuscula: false,
    minuscula: false,
    numero: false,
    especial: false,
  });

  const validarSenha = (senha: string) => {
    setSenhaValida({
      tamanho: senha.length >= 8,
      maiuscula: /[A-Z]/.test(senha),
      minuscula: /[a-z]/.test(senha),
      numero: /\d/.test(senha),
      especial: /[@$!%*#?&]/.test(senha),
    });
  };


  useEffect(() => {
    const loadFonts = async () => {
      await Font.loadAsync({
        Roboto: require('../../assets/fonts/Roboto-Regular.ttf'),
      });
      setFontLoaded(true);
    };

    loadFonts();
  }, []);

  const handleCadastro = async () => {
    if (!nome || !email || !senha) {
      setModalMessage('Por favor, preencha todos os campos.');
      setIsError(true);
      setModalVisible(true);
      return;
    }

    if (!email.endsWith('@pro4tech.com.br')) {
      setModalMessage('É necessário utilizar um email com domínio "@pro4tech.com.br".');
      setIsError(true);
      setModalVisible(true);
      return;
    }

    try {
      setLoading(true); // Inicia o loading
      const response = await apiCall('/api/admin/cadastrar', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          nome: nome,
          email: email,
          senha: senha,
          // permissoes: [],
          // admin: admin,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setModalMessage('Usuário cadastrado com sucesso!');
        setIsError(false);
        setNome('');
        setEmail('');
        setSenha('');
      } else if (data.email && Array.isArray(data.email) && data.email[0].toLowerCase().includes('exists')) {
        setModalMessage('Usuário já cadastrado.');
        setIsError(true);
      } else if (data.message && data.message.toLowerCase().includes('já cadastrado')) {
        setModalMessage('Usuário já cadastrado.');
        setIsError(true);
      } else {
        setModalMessage(data.message || 'Erro ao cadastrar usuário.');
        setIsError(true);
      }
    } catch (error) {
      console.error(error);
      setModalMessage('Erro na conexão com o servidor.');
      setIsError(true);
    } finally {
      setModalVisible(true);
      setLoading(false); // Finaliza o loading
    }
  };

  if (!fontLoaded) {
    return <Text>Carregando fontes...</Text>;
  }

  return (
    <View style={styles.container}>
      <StatusBar style="auto" />

      <Image
        source={require('../../assets/project_images/logotipo.png')}
        style={styles.image}
        resizeMode="contain"
      />

      <Modal
        transparent={true}
        animationType="fade"
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <Text style={[styles.modalText, isError ? styles.errorText : styles.successText]}>
              {modalMessage}
            </Text>
            <TouchableOpacity style={styles.closeButton} onPress={() => setModalVisible(false)}>
              <Text style={styles.buttonText}>Fechar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      <TextInput
        style={styles.input}
        placeholder="Nome"
        placeholderTextColor="#B8B8B8"
        value={nome}
        onChangeText={setNome}
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
        onChangeText={(text) => {
          setSenha(text);
          validarSenha(text);
        }}
      />

      <View style={styles.senhaDicasContainer}>
        <Text style={[styles.senhaDica, senhaValida.tamanho ? styles.valido : styles.invalido]}>
          {senhaValida.tamanho ? '✓' : '✗'} Pelo menos 8 caracteres
        </Text>
        <Text style={[styles.senhaDica, senhaValida.maiuscula ? styles.valido : styles.invalido]}>
          {senhaValida.maiuscula ? '✓' : '✗'} Pelo menos uma letra maiúscula
        </Text>
        <Text style={[styles.senhaDica, senhaValida.minuscula ? styles.valido : styles.invalido]}>
          {senhaValida.minuscula ? '✓' : '✗'} Pelo menos uma letra minúscula
        </Text>
        <Text style={[styles.senhaDica, senhaValida.numero ? styles.valido : styles.invalido]}>
          {senhaValida.numero ? '✓' : '✗'} Pelo menos um número
        </Text>
        <Text style={[styles.senhaDica, senhaValida.especial ? styles.valido : styles.invalido]}>
          {senhaValida.especial ? '✓' : '✗'} Pelo menos um caractere especial
        </Text>
      </View>


      <TouchableOpacity style={styles.button} onPress={handleCadastro} disabled={loading}>
        {loading ? (
          <ActivityIndicator color="#F5F5F5" />
        ) : (
          <Text style={styles.buttonText}>Cadastrar</Text>
        )}
      </TouchableOpacity>

      <View style={styles.registerContainer}>
        <Text style={styles.registerText}>Já tem uma conta? </Text>
        <TouchableOpacity onPress={() => router.push('/Start/login')}>
          <Text style={styles.registerLink}>Entrar</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};