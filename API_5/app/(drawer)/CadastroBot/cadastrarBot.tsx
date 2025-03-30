import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Modal } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { apiCall } from "../../../config/api";
import * as SplashScreen from "expo-splash-screen";
import { useFonts, Roboto_400Regular, Roboto_700Bold } from "@expo-google-fonts/roboto";
import { router } from "expo-router";

const CadastrarBot = () => {
  const [name, setName] = useState("");
  const [descricao, setDescricao] = useState("");
  const [modalVisible, setModalVisible] = useState(false);
  const [modalMessage, setModalMessage] = useState("");
  const [isError, setIsError] = useState(false);

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
  
    try {
      // Criar permissão sem token
      const permissaoResponse = await apiCall("/api/permissao/cadastrar", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ nome: name }),
      });
  
      const permissaoData = await permissaoResponse.json();
  
      if (!permissaoResponse.ok) {
        console.error("Erro ao criar permissão:", permissaoData);
        throw new Error(permissaoData.message || "Erro ao criar permissão.");
      }
  
      console.log("Permissão criada com sucesso:", permissaoData);
      
      // Obter o ID da permissão
      const permissaoId = permissaoData.id;
      if (!permissaoId) {
        console.error("Erro: ID da permissão não retornado pelo servidor. Resposta:", permissaoData);
        throw new Error("Erro: ID da permissão não retornado pelo servidor.");
      }
  
      console.log("Permissao_id para o agente:", permissaoId);
      
      // Criar agente com o ID da permissão sem token
      const agenteResponse = await apiCall("/api/agente/cadastrar", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          nome: name,
          descricao: descricao,
          Permissao_id: permissaoId,
        }),
      });
  
      const agenteData = await agenteResponse.json();
  
      if (agenteResponse.ok) {
        // Armazenar o agentId para uso nas telas seguintes
        await AsyncStorage.setItem("agentId", agenteData.id.toString());
  
        setModalMessage("Chatbot cadastrado com sucesso!");
        setIsError(false);
        setName("");
        setDescricao("");
  
        console.log("Chatbot cadastrado com sucesso:", {
          nome: name,
          descricao: descricao,
          Permissao_id: permissaoId,
        });
  
        // Redirect to context registration screen
        router.push("/CadastroContexto/cadastrarContexto");
      } else {
        console.error("Erro ao cadastrar chatbot:", agenteData);
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
      setModalVisible(true);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Cadastrar Bot</Text>
      <TextInput
        style={styles.input}
        placeholder="Nome"
        placeholderTextColor="#fff"
        value={name}
        onChangeText={setName}
      />
      <TextInput
        style={styles.input}
        placeholder="Descrição"
        placeholderTextColor="#fff"
        value={descricao}
        onChangeText={setDescricao}
        autoCapitalize="none"
      />
      <TouchableOpacity style={styles.button} onPress={handleSignUp}>
        <Text style={styles.buttonText}>Cadastrar</Text>
      </TouchableOpacity>
  
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
  title: { fontSize: 24, fontFamily: "Roboto_400Regular", color: "#fff", marginBottom: 20, textAlign: "left", alignSelf: "flex-start" },
  input: { width: "100%", backgroundColor: "#282828", padding: 10, borderRadius: 5, marginBottom: 15, color: "#fff", borderWidth: 1, borderColor: "#fff", fontFamily: "Roboto_400Regular" },
  button: { width: "100%", padding: 10, borderRadius: 5, borderWidth: 2, borderColor: "#fff", alignItems: "center", backgroundColor: "#282828", fontFamily: "Roboto_400Regular" },
  buttonText: { color: "#fff", fontSize: 16, fontFamily: "Roboto_400Regular" },
  modalOverlay: { flex: 1, backgroundColor: "rgba(0, 0, 0, 0.5)", justifyContent: "center", alignItems: "center" },
  modalContainer: { width: "80%", backgroundColor: "#282828", borderRadius: 10, padding: 20, alignItems: "center", borderWidth: 1 },
  modalText: { fontSize: 18, fontFamily: "Roboto_400Regular", color: "#fff", marginBottom: 20, textAlign: "center" },
  errorText: { color: "white" },
  successText: { color: "green" },
  closeButton: { padding: 10, borderRadius: 5, borderWidth: 1, borderColor: "#fff", backgroundColor: "#282828", alignItems: "center" },
  closeButtonText: { color: "#fff", fontSize: 16, fontFamily: "Roboto_400Regular" },
});
  
export default CadastrarBot;