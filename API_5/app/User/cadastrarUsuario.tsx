import React, { useState } from "react";
import { apiCall } from './../../config/api';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Modal, Image, ActivityIndicator } from "react-native";
import * as SplashScreen from "expo-splash-screen";
import { useFonts, Roboto_400Regular, Roboto_700Bold } from "@expo-google-fonts/roboto";
import { router, useLocalSearchParams, useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";

const SignUpScreen = () => {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [modalVisible, setModalVisible] = useState(false);
    const [modalMessage, setModalMessage] = useState("");
    const [isError, setIsError] = useState(false);
    const [loading, setLoading] = useState(false);

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

        setLoading(true);

        try {
            const response = await apiCall('/api/usuario/cadastrar', {
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
                console.log("Usuário cadastrado com sucesso:", {
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
            setLoading(false);
            setModalVisible(true);
        }
    };

    return (
        <View style={styles.container}>
            <Text style={styles.text}>
                Cadastrar usuário
            </Text>
            <TextInput
                style={styles.input}
                placeholder="Nome"
                placeholderTextColor="#B8B8B8"
                value={name}
                onChangeText={setName}
            />
            <TextInput
                style={styles.input}
                placeholder="Email"
                placeholderTextColor="#B8B8B8"
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
            />
            <TextInput
                style={styles.input}
                placeholder="Senha"
                placeholderTextColor="#B8B8B8"
                value={password}
                onChangeText={setPassword}
                secureTextEntry
            />

            <View style={styles.buttonContainer}>
                <TouchableOpacity style={styles.button} onPress={handleSignUp}>
                    <Text style={styles.buttonText}>Cadastrar</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.cancelButton} onPress={() => router.push('/CadastroUsuario/listarUsuario')}>
                    <Text style={styles.cancelButtonText}>Cancelar</Text>
                </TouchableOpacity>
            </View>


            {loading && (
                <View style={styles.loadingOverlay}>
                    <ActivityIndicator size="large" color="#fff" />
                </View>
            )}

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
        backgroundColor: "#282828",
        justifyContent: "center",
        alignItems: "center",
        padding: 20,
    },
    input: {
        padding: 15,
        color: "#F4F4F4",
        width: "100%",
        height: 50,
        borderRadius: 5,
        borderWidth: 1,
        borderColor: "#fff",
        alignItems: "center",
        backgroundColor: "#282828",
        fontFamily: "Roboto_400Regular",
        fontSize: 18,
        marginBottom: 20,
    },
    buttonContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        gap: 12, // espaço entre os botões
        marginTop: 20,
      },
      
      button: {
        flex: 1,
        padding: 10,
        borderRadius: 5,
        borderWidth: 1,
        borderColor: "#f4f4f4",
        alignItems: "center",
        backgroundColor: "#212121",
        fontFamily: "Roboto_400Regular",
      },
    cancelButton: {
        flex: 1,
        padding: 10,
        borderRadius: 5,
        borderWidth: 1,
        borderColor: "#555",
        alignItems: "center",
        backgroundColor: "#2c2c2c",
        fontFamily: "Roboto_400Regular",
    },
    buttonText: {
        color: "#fff",
        fontSize: 16,
        fontFamily: "Roboto_400Regular"
    },
    cancelButtonText: {
        color: "#aaa",
        fontSize: 16,
        fontFamily: "Roboto_400Regular"
    },
    modalOverlay: {
        flex: 1,
        backgroundColor: "rgba(0, 0, 0, 0.5)",
        justifyContent: "center",
        alignItems: "center",
    },
    modalContainer: {
        width: "80%",
        backgroundColor: "#282828",
        borderRadius: 10,
        padding: 20,
        alignItems: "center",
        borderWidth: 1,
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
        backgroundColor: "#282828",
        alignItems: "center",
    },
    closeButtonText: {
        color: "#fff",
        fontSize: 16,
        fontFamily: "Roboto_400Regular",
    },
    image: {
        width: 100,
        height: 100,
        marginBottom: 20,
    },
    text: {
        fontSize: 25, 
        marginBottom: 25,
        color: '#FFFFFF', 
        textAlign: "left", 
        alignSelf: "flex-start" ,
        fontFamily: "Roboto_400Regular",
    },
    loadingOverlay: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: "rgba(0, 0, 0, 0.7)",
        justifyContent: "center",
        alignItems: "center",
    },
    returnButton: {
        padding: 10,
        marginRight: 10,
      },
});

export default SignUpScreen;
