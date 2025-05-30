import React, { useState } from 'react';
import { View, Text, Image, TextInput, TouchableOpacity, ActivityIndicator } from 'react-native';
import { apiCall } from '../../config/api';
import { router } from 'expo-router';
import styles, { cores } from './style';
import { BaseScreen, Modal } from '../../components';

export default function Register() {
  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [modalMessage, setModalMessage] = useState('');
  const [modalVisible, setModalVisible] = useState(false);
  const [loading, setLoading] = useState(false); // Estado de loading

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

  const isSenhaValida = Object.values(senhaValida).every(value => value);

  const handleCadastro = async () => {
    if (!nome || !email || !senha) {
      setModalMessage('Por favor, preencha todos os campos.');
      setModalVisible(true);
      return;
    }

    if (!email.endsWith('@pro4tech.com.br')) {
      setModalMessage('É necessário utilizar um email com domínio "@pro4tech.com.br".');
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
        setNome('');
        setEmail('');
        setSenha('');
      } else if (data.email && Array.isArray(data.email) && data.email[0].toLowerCase().includes('exists')) {
        setModalMessage('Usuário já cadastrado.');
      } else if (data.message && data.message.toLowerCase().includes('já cadastrado')) {
        setModalMessage('Usuário já cadastrado.');
      } else {
        setModalMessage(data.message || 'Erro ao cadastrar usuário.');
      }
    } catch (error) {
      console.error(error);
      setModalMessage('Erro na conexão com o servidor.');
    } finally {
      setModalVisible(true);
      setLoading(false); // Finaliza o loading
    }
  };

  return (
    <BaseScreen>
      <Image
        source={require('../../assets/project_images/logotipo.png')}
        style={styles.image}
        resizeMode="contain"
      />
      <Modal
        show={modalVisible}
        setShow={setModalVisible}
      >
        <Text style={styles.modalText}>
          {modalMessage}
        </Text>
      </Modal>
      <TextInput
        style={styles.input}
        placeholder="Nome"
        placeholderTextColor={cores.cor6}
        value={nome}
        onChangeText={setNome}
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
        placeholderTextColor={cores.cor6}
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
      <TouchableOpacity style={[styles.button, (loading || !isSenhaValida) &&
      {
        backgroundColor: cores.cor3,
        borderColor: cores.cor3
      }]} onPress={handleCadastro} disabled={loading || !isSenhaValida}>
        {loading ? (
          <ActivityIndicator color={cores.cor8} />
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
    </BaseScreen>
  );
};