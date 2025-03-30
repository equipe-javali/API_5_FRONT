import React, { useState, useEffect } from "react";
import { View, Text, TouchableOpacity, StyleSheet, Modal } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { apiCall } from "../../../config/api";

const TreinarBot = () => {
    const [modalVisible, setModalVisible] = useState(false);
    const [modalMessage, setModalMessage] = useState("");
    const [isError, setIsError] = useState(false);
    const [agentId, setAgentId] = useState("");

    // Recupera automaticamente o agentId armazenado após a criação do agente
    useEffect(() => {
        AsyncStorage.getItem("agentId")
            .then(id => { if (id) setAgentId(id); })
            .catch(err => console.error("Erro ao buscar agentId:", err));
    }, []);

    const handleTreinarBot = async () => {
        if (!agentId) {
            setModalMessage("Agente não encontrado. Crie um agente e adicione seu contexto primeiro.");
            setIsError(true);
            setModalVisible(true);
            return;
        }

        try {
            const response = await apiCall("/api/contexto/treinar", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    Agente_id: agentId
                }),
            });

            const data = await response.json();
            if (response.ok) {
                setModalMessage(data.message || "Treinamento realizado com sucesso!");
                setIsError(false);
            } else {
                setModalMessage(data.error || "Erro ao treinar o chatbot.");
                setIsError(true);
            }
        } catch (error) {
            console.error(error);
            setModalMessage("Erro na conexão com o servidor.");
            setIsError(true);
        } finally {
            setModalVisible(true);
        }
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Treinar Chatbot</Text>
            <TouchableOpacity style={styles.button} onPress={handleTreinarBot}>
                <Text style={styles.buttonText}>Iniciar Treinamento</Text>
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
    container: {
        flex: 1,
        backgroundColor: "#282828",
        padding: 20,
        justifyContent: "center",
        alignItems: "center"
    },
    title: {
        fontSize: 24,
        color: "#fff",
        marginBottom: 20,
        textAlign: "center",
    },
    button: {
        backgroundColor: "#007BFF",
        padding: 10,
        borderRadius: 5,
        alignItems: "center",
    },
    buttonText: {
        color: "#fff",
        fontSize: 16,
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
        borderColor: "#fff",
    },
    modalText: {
        fontSize: 18,
        marginBottom: 10,
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
        backgroundColor: "#007BFF",
        alignItems: "center",
    },
    closeButtonText: {
        color: "#fff",
        fontSize: 16,
    },
});

export default TreinarBot;