import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Modal } from "react-native";
import * as SplashScreen from "expo-splash-screen";
import { useFonts, Roboto_400Regular, Roboto_700Bold } from "@expo-google-fonts/roboto";

const SignUpScreen = () => {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [modalVisible, setModalVisible] = useState(false);
    const [modalMessage, setModalMessage] = useState("");
    const [isError, setIsError] = useState(false);

    // Carrega a fonte roboto
    const [fontsLoaded] = useFonts({
        Roboto_400Regular,
        Roboto_700Bold,
    });

    if (!fontsLoaded) {
        SplashScreen.preventAutoHideAsync();
        return null;
    }

    const handleSignUp = async () => {
        if (!name || !email || !password) {
            setModalMessage("Por favor, preencha todos os campos.");
            setIsError(true);
            setModalVisible(true);
            return;
        }

        try {
            const response = await fetch("http://localhost:8000/api/usuario/cadastrar", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    nome: name,
                    email: email,
                    senha: password,
                    admin: false,
                }),
            });

            const data = await response.json();

            if (response.ok) {
                setModalMessage("Usuário cadastrado com sucesso!");
                setIsError(false);
                setName(""); 
                setEmail(""); 
                setPassword("");

                console.log("Usuário cadastrado:", {
                    nome: data.nome,
                    email: data.email,
                });

            } else {
                setModalMessage(data.message || "Erro ao cadastrar usuário.");
                setIsError(true);
            }
        } catch (error) {
            setModalMessage("Erro na conexão com o servidor.");
            setIsError(true);
        } finally {
            setModalVisible(true);
        }
    };

    return (
        <View style={styles.container}>
            <TextInput
                style={styles.input}
                placeholder="Nome"
                placeholderTextColor="#000"
                value={name}
                onChangeText={setName}
            />
            <TextInput
                style={styles.input}
                placeholder="Email"
                placeholderTextColor="#000"
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
            />
            <TextInput
                style={styles.input}
                placeholder="Senha"
                placeholderTextColor="#000"
                value={password}
                onChangeText={setPassword}
                secureTextEntry
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
    input: {
        width: "100%",
        backgroundColor: "#fff",
        padding: 10,
        borderRadius: 5,
        marginBottom: 15,
        color: "#000",
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

export default SignUpScreen;
