import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Modal } from "react-native";
import * as SplashScreen from "expo-splash-screen";
import { useFonts, Roboto_400Regular, Roboto_700Bold } from "@expo-google-fonts/roboto";

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

  const handleSignUp = () => {
    if (!name || !descricao) {
      setModalMessage("Por favor, preencha todos os campos!");
      setIsError(true);
      setModalVisible(true);
    } else {
      setModalMessage("Chatbot cadastrado com sucesso!");
      setIsError(false);
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

      {/* Modal para exibir mensagens */}
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
            <TouchableOpacity
              style={styles.closeButton}
              onPress={() => setModalVisible(false)}
            >
              <Text style={styles.closeButtonText}>Fechar</Text>
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
    backgroundColor: "#000",
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontFamily: "Roboto_400Regular",
    color: "#fff",
    marginBottom: 20,
    textAlign: "left",
    alignSelf: "flex-start", // segue alinhamento do container
  },
  input: {
    width: "100%",
    backgroundColor: "#000",
    padding: 10,
    borderRadius: 5,
    marginBottom: 15,
    color: "#fff",
    borderWidth: 1, 
    borderColor: "#fff",
  },
  button: {
    width: "100%",
    padding: 10,
    borderRadius: 5,
    borderWidth: 2,
    borderColor: "#fff",
    alignItems: "center",
    backgroundColor: "#000",
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
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
    color: "red",
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

export default CadastrarBot;
