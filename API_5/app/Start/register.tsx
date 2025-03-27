import React, { useState, useEffect } from 'react';
import { StatusBar } from 'expo-status-bar';
import { View, Text, StyleSheet, Image, TextInput, TouchableOpacity } from 'react-native';
import * as Font from 'expo-font'; 
import axios from 'axios';

const Login = () => {
  const [fontLoaded, setFontLoaded] = useState(false);
  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [admin] = useState(true); 
  
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
    try {
      const response = await axios.post('(http://localhost:8081/api/usuario/cadastrar', {
        nome: nome,
        email: email,
        senha: senha,
        admin: admin,
      });

      if (response.status === 200) {
        alert('Usuário cadastrado com sucesso!');
      }
    } catch (error) {
      console.error(error);
      alert('Erro ao cadastrar usuário.');
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
    padding: 24,
    fontSize: 24,
    width: '100%',
    height: 40,
    borderColor: '#F5F5F5',
    borderWidth: 1,
    marginBottom: 12,
    paddingLeft: 30,
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
});

export default Login;
