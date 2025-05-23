import React, { useState, useEffect } from "react";
import { StatusBar } from "expo-status-bar";
import {
  View,
  Text,
  StyleSheet,
  Image,
  TextInput,
  TouchableOpacity,
  Modal,
  ActivityIndicator,
  Alert,
} from "react-native";
import * as Font from "expo-font";
import { router } from "expo-router";
import { apiCall } from "../../config/api";

const RecuperarSenha = () => {
  const [fontLoaded, setFontLoaded] = useState(false);
  const [email, setEmail] = useState("");
  const [modalMessage, setModalMessage] = useState("");
  const [isError, setIsError] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [loading, setLoading] = useState(false); // Estado de loading

  useEffect(() => {
    const loadFonts = async () => {
      await Font.loadAsync({
        Roboto: require("../../assets/fonts/Roboto-Regular.ttf"),
      });
      setFontLoaded(true);
    };

    loadFonts();
  }, []);

  const handleEnviarEmail = async () => {
    setLoading(true);
    try {
      const response = apiCall("/api/usuario/trocar-senha/", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: email,
        }),
      });
    } catch (er) {
      setModalMessage("Erro")
      setModalVisible(true)
    } finally {
      setLoading(false)
    }
  };

  if (!fontLoaded) {
    return <Text>Carregando fontes...</Text>;
  }

  return (
    <View style={styles.container}>
      <StatusBar style="auto" />

      <Image
        source={require("../../assets/project_images/logotipo.png")}
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
            <Text
              style={[
                styles.modalText,
                isError ? styles.errorText : styles.successText,
              ]}
            >
              {modalMessage}
            </Text>
            <TouchableOpacity
              style={styles.closeButton}
              onPress={() => setModalVisible(false)}
            >
              <Text style={styles.buttonText}>Fechar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      <Text style={styles.textQuestion}>Digite seu email:</Text>

      <TextInput
        style={styles.input}
        placeholder="Email"
        keyboardType="email-address"
        placeholderTextColor="#B8B8B8"
        value={email}
        onChangeText={setEmail}
      />

      <TouchableOpacity
        style={styles.button}
        onPress={handleEnviarEmail}
        disabled={loading}
      >
        {loading ? (
          <ActivityIndicator color="#F5F5F5" />
        ) : (
          <Text style={styles.buttonText}>Enviar</Text>
        )}
      </TouchableOpacity>

      <TouchableOpacity onPress={() => router.push("/Start/login")}>
        <Text style={styles.buttonVoltar}>Voltar</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#2E2E2E",
    padding: 24,
  },
  input: {
    paddingHorizontal: 24,
    paddingVertical: 10,
    fontSize: 24,
    width: "100%",
    borderColor: "#F5F5F5",
    borderWidth: 1,
    marginBottom: 12,
    borderRadius: 5,
    color: "#111",
    backgroundColor: "#F5F5F5",
    fontFamily: "Roboto",
  },
  image: {
    width: 250,
    height: 150,
  },
  button: {
    borderWidth: 1,
    borderColor: "#F5F5F5",
    backgroundColor: "#282828",
    borderRadius: 10,
    paddingVertical: 12,
    paddingHorizontal: 50,
    marginTop: 20,
  },
  buttonText: {
    color: "#F5F5F5",
    fontSize: 24,
    fontFamily: "Roboto",
    textAlign: "center",
  },
  buttonVoltar: {
    color: "#F5F5F5",
    fontSize: 18,
    fontFamily: "Roboto",
    textAlign: "center",
    marginTop: 15,
    textDecorationLine: "underline",
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
  textQuestion: {
    fontSize: 16,
    fontFamily: "Roboto",
    color: "#F5F5F5",
    marginBottom: 20,
    textAlign: "center",
  },
  linkVoltar: {
    color: "#B8B8B8",
    fontSize: 16,
    fontFamily: "Roboto",
    textDecorationLine: "underline",
  },
  errorText: {
    color: "white",
  },
  successText: {
    color: "white",
  },
  closeButton: {
    padding: 10,
    borderRadius: 5,
    borderWidth: 1,
    borderColor: "#fff",
    backgroundColor: "#000",
    alignItems: "center",
  },
});

export default RecuperarSenha;
