import React, { useState, useEffect } from 'react';
import { StatusBar } from 'expo-status-bar';
import { View, Text, StyleSheet, Image, TextInput, TouchableOpacity, Modal } from 'react-native';
import * as Font from 'expo-font'; 
import { apiCall } from '../../config/api';

const Login = () => {
  const [fontLoaded, setFontLoaded] = useState(false);
  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const admin = true; 
  const [modalMessage, setModalMessage] = useState('');
  const [isError, setIsError] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  
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
      const response = await apiCall('/api/usuario/cadastrar', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          nome: nome,
          email: email,
          senha: senha,
          admin: admin,
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
        onChangeText={setSenha}
      />

      <TouchableOpacity style={styles.button} onPress={handleCadastro}>
        <Text style={styles.buttonText}>Cadastrar</Text>
      </TouchableOpacity>
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
  },
  buttonText: {
    color: '#F5F5F5',  
    fontSize: 24,
    fontFamily: 'Roboto',
    textAlign: 'center',
  },
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
    fontFamily: "Roboto_400Regular",
    color: "#fff",
    marginBottom: 20,
    textAlign: "center",
  },
  errorText: {
    color: "white",
  },
  successText: {
    color: "green",
  },
  closeButton: {
    padding: 10,
    borderRadius: 5,
    borderWidth: 1,
    borderColor: "#fff",
    backgroundColor: "#000",
    alignItems: "center",
  },
  closeButtonText: {
    color: "#fff",
    fontSize: 16,
    fontFamily: "Roboto_400Regular",
  },
});

export default Login;
