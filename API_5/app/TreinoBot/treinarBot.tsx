import React, { useState, useEffect } from "react";
import { View, Text, TouchableOpacity, Modal } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { apiCall } from "../../config/api";
import styles from "./style";

export default function TreinarBot() {
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