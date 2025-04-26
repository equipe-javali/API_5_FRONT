import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Modal, ActivityIndicator } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { makeAuthenticatedRequest } from '../../../config/tokenService';
import * as SplashScreen from "expo-splash-screen";
import { useFonts, Roboto_400Regular, Roboto_700Bold } from "@expo-google-fonts/roboto";
import { router } from "expo-router";

const CadastrarBot = () => {
  const [name, setName] = useState("");
  const [descricao, setDescricao] = useState("");
  const [modalVisible, setModalVisible] = useState(false);
  const [modalMessage, setModalMessage] = useState("");
  const [isError, setIsError] = useState(false);
  const [loading, setLoading] = useState(false); // Estado de carregamento

  // Carregar fontes
  const [fontsLoaded] = useFonts({
    Roboto_400Regular,
    Roboto_700Bold,
  });

  if (!fontsLoaded) {
    SplashScreen.preventAutoHideAsync();
    return null;
  }

  const handleSignUp = async () => {
    if (!name || !descricao) {
      setModalMessage("Por favor, preencha todos os campos.");
      setIsError(true);
      setModalVisible(true);
      return;
    }
  
    const token = await AsyncStorage.getItem('access_token');
    if (!token) {
      setModalMessage("Você não está autenticado. Faça login novamente.");
      setIsError(true);
      setModalVisible(true);
      setTimeout(() => router.push('/Start/login'), 2000);
      return;
    }
  
    setLoading(true); // Ativar o carregamento
  
    try {
      // PASSO 1: Criar a permissão
      console.log("Criando permissão com nome:", name);
      const permissaoResponse = await makeAuthenticatedRequest("/api/permissao/cadastrar", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ nome: name }),
      });
      
      const permissaoData = await permissaoResponse.json();
      console.log("Resposta completa da API de permissão:", JSON.stringify(permissaoData));
      
      if (!permissaoResponse.ok) {
        if (permissaoResponse.status === 401) {
          setModalMessage("Sessão expirada. Por favor, faça login novamente.");
          setIsError(true);
          setTimeout(() => router.push('/Start/login'), 2000);
          return;
        }
        
        throw new Error(permissaoData.message || "Erro ao criar permissão.");
      }
  
      // PASSO 2: Buscar a permissão pelo nome para obter o ID
      console.log("Buscando permissão pelo nome:", name);
      const buscarPermissaoResponse = await makeAuthenticatedRequest(
        `/api/permissao/buscar?nome=${encodeURIComponent(name)}`,
        { method: "GET" }
      );
      
      const permissoesEncontradas = await buscarPermissaoResponse.json();
      console.log("Permissões encontradas:", JSON.stringify(permissoesEncontradas));
      
      // PASSO 3: Extrair o ID com tratamento de diferentes formatos
      let permissaoId;
      if (Array.isArray(permissoesEncontradas) && permissoesEncontradas.length > 0) {
        // Se retornou um array de permissões, pegar a primeira
        permissaoId = parseInt(permissoesEncontradas[0].id, 10);
      } else if (permissoesEncontradas && permissoesEncontradas.id) {
        // Se retornou um objeto único
        permissaoId = parseInt(permissoesEncontradas.id, 10);
      }
  
      // Verificar se obtivemos um ID válido
      if (!permissaoId || isNaN(permissaoId)) {
        console.error("ID da permissão não encontrado:", permissoesEncontradas);
        throw new Error("ID de permissão inválido ou não encontrado");
      }
  
      console.log("ID da permissão obtido:", permissaoId, "tipo:", typeof permissaoId);
  
      // PASSO 4: Criar o agente com o ID da permissão
      const agenteResponse = await makeAuthenticatedRequest("/api/agente/cadastrar", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          nome: name,
          descricao: descricao,
          Permissao_id: permissaoId
        }),
      });
  
      // Resto do código para tratar a resposta...
      const agenteData = await agenteResponse.json();
      console.log("Resposta do cadastro de agente:", JSON.stringify(agenteData));
  
      if (agenteResponse.ok) {
        // Armazenar o agentId para uso nas telas seguintes
        await AsyncStorage.setItem("agentId", agenteData.id.toString());
  
        setModalMessage("Chatbot cadastrado com sucesso!");
        setIsError(false);
        setName("");
        setDescricao("");
  
        // Redirect to context registration screen
        router.push("/CadastroContexto/cadastrarContexto");
      } else if (agenteResponse.status === 401) {
        setModalMessage("Sessão expirada. Por favor, faça login novamente.");
        setIsError(true);
        setTimeout(() => router.push('/Start/login'), 2000);
      } else {
        setModalMessage(agenteData.message || "Erro ao cadastrar chatbot.");
        setIsError(true);
      }
    } catch (error) {
      console.error("Erro:", error);
      setModalMessage(
        error instanceof Error ? error.message : "Erro ao conectar com o servidor."
      );
      setIsError(true);
    } finally {
      setLoading(false); // Desativar o carregamento
      setModalVisible(true);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Cadastrar Bot</Text>
      <TextInput
        style={styles.input}
        placeholder="Nome"
        placeholderTextColor="#B8B8B8"
        value={name}
        onChangeText={setName}
      />
      <TextInput
        style={styles.input}
        placeholder="Descrição"
        placeholderTextColor="#B8B8B8"
        value={descricao}
        onChangeText={setDescricao}
        autoCapitalize="none"
      />
      
      <TouchableOpacity style={styles.button} onPress={handleSignUp} disabled={loading}>
          <Text style={styles.buttonText}>Cadastrar</Text>
      </TouchableOpacity>

      {/* Modal de Carregamento (Tela cheia) */}
      <Modal
        transparent={true}
        animationType="fade"
        visible={loading}  // Exibir quando carregando
        onRequestClose={() => setLoading(false)}
      >
        <View style={styles.fullScreenModal}>
          <ActivityIndicator size="large" color="#fff" />
          <Text style={styles.loadingText}>Cadastrando...</Text>
        </View>
      </Modal>

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
              <Text style={styles.closeButtonText}>Fechar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#282828", justifyContent: "center", alignItems: "center", padding: 20 },
  title: { fontSize: 25, fontFamily: "Roboto_400Regular", color: "#fff", marginBottom: 25, textAlign: "left", alignSelf: "flex-start" },
  input: {padding: 15, color: "#F4F4F4", width: "100%", height: 50, borderRadius: 5, borderWidth: 1, borderColor: "#fff", alignItems: "center", backgroundColor: "#282828", fontFamily: "Roboto_400Regular", fontSize: 18, marginBottom: 20,},
  button: { width: "60%", padding: 10, borderRadius: 5, borderWidth: 1, borderColor: "#F4F4F4", alignItems: "center", backgroundColor: "#212121", fontFamily: "Roboto_400Regular" },
  buttonText: { color: "#fff", fontSize: 16, fontFamily: "Roboto_400Regular" },
  modalOverlay: { flex: 1, backgroundColor: "rgba(0, 0, 0, 0.5)", justifyContent: "center", alignItems: "center" },
  modalContainer: { width: "80%", backgroundColor: "#282828", borderRadius: 10, padding: 20, alignItems: "center", borderWidth: 1 },
  modalText: { fontSize: 18, fontFamily: "Roboto_400Regular", color: "#fff", marginBottom: 20, textAlign: "center" },
  errorText: { color: "white" },
  successText: { color: "green" },
  closeButton: { padding: 10, borderRadius: 5, borderWidth: 1, borderColor: "#fff", backgroundColor: "#282828", alignItems: "center" },
  closeButtonText: { color: "#fff", fontSize: 16, fontFamily: "Roboto_400Regular" },

  // Estilos para o modal de carregamento em tela cheia
  fullScreenModal: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.7)",
  },
  loadingText: {
    fontSize: 18,
    fontFamily: "Roboto_400Regular",
    color: "#fff",
    marginTop: 15,
  },
});

export default CadastrarBot;
