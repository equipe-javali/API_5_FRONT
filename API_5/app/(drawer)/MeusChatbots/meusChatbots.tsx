import React, { useState, useEffect } from "react";
import { View, Text, FlatList, TouchableOpacity, StyleSheet, ActivityIndicator, Modal, TextInput, Alert } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { apiCall } from "../../../config/api";
import { useRouter } from "expo-router";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { makeAuthenticatedRequest } from "../../../config/tokenService";
 
interface Chatbot {
  id: number;
  Agente_nome: string;
  examples_count: number;
  performance_score: number;
  Agente_id_id?: number;
  agent_id?: number;
  agente_id?: number;
  created_at: string;
  descricao?: string;
}
 
const Chatbots = () => {
  const [chatbots, setChatbots] = useState<Chatbot[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedChatbot, setSelectedChatbot] = useState<Chatbot | null>(null);
  const [updatedName, setUpdatedName] = useState("");
  const [updatedDescription, setUpdatedDescription] = useState("");
  const router = useRouter();
 
  useEffect(() => {
    const fetchChatbots = async () => {
      try {
        const response = await apiCall("/api/modelo/listar-completo", {
          method: "GET",
          headers: { "Content-Type": "application/json" },
        });
 
        if (response.ok) {
          const data = await response.json();
          console.log("API Response:", data);
          setChatbots(data);
        } else {
          console.error("Erro ao buscar chatbots:", await response.text());
        }
      } catch (error) {
        console.error("Erro na conexão:", error);
      } finally {
        setLoading(false);
      }
    };
 
    fetchChatbots();
  }, []);
 
  const handleEdit = (chatbot: Chatbot) => {
    setSelectedChatbot(chatbot);
    setUpdatedName(chatbot.Agente_nome);
    setUpdatedDescription(chatbot.descricao || "");
    setModalVisible(true);
  };
 
  const handleSave = async () => {
    if (!selectedChatbot) return;
 
    try {
      const response = await makeAuthenticatedRequest(`/api/agente/atualizar/${selectedChatbot.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          nome: updatedName,
          descricao: updatedDescription,
        }),
      });
 
      if (response.ok) {
        Alert.alert("Sucesso", "Chatbot atualizado com sucesso!");
        setModalVisible(false);
        const updatedChatbots = chatbots.map((bot) =>
          bot.id === selectedChatbot.id
            ? { ...bot, Agente_nome: updatedName, descricao: updatedDescription }
            : bot
        );
        setChatbots(updatedChatbots);
      } else {
        const errorData = await response.json();
        Alert.alert("Erro", errorData.message || "Erro ao atualizar o chatbot.");
      }
    } catch (error) {
      console.error("Erro ao atualizar chatbot:", error);
      Alert.alert("Erro", "Erro na conexão com o servidor.");
    }
  };
 
  useEffect(() => {
    const fetchChatbots = async () => {
      try {
        const response = await makeAuthenticatedRequest("/api/modelo/listar-completo", {
          method: "GET",
          headers: { "Content-Type": "application/json" },
        });
 
        if (response.ok) {
          const data = await response.json();
          console.log("API Response:", data);
          setChatbots(data);
        } else {
          console.error("Erro ao buscar chatbots:", await response.text());
        }
      } catch (error) {
        console.error("Erro na conexão:", error);
      } finally {
        setLoading(false);
      }
    };
 
    fetchChatbots();
  }, []);
 
 
  const ChatbotItem = ({ item }: { item: Chatbot }) => {
    const [expanded, setExpanded] = useState(false);
 
    return (
      <TouchableOpacity
        style={styles.itemContainer}
        onPress={() => setExpanded(!expanded)}
      >
        <View style={styles.itemHeader}>
          <Text style={styles.itemTitle}>{item.Agente_nome}</Text>
          <Ionicons
            name={expanded ? "chevron-up" : "chevron-down"}
            size={24}
            color="#fff"
          />
        </View>
        <Text style={styles.itemFrases}>Frases: {item.examples_count}</Text>
        {expanded && (
          <View style={styles.itemDetails}>
            <Text style={styles.itemText}>Performance: {item.performance_score}</Text>
            <Text style={styles.itemText}>
              Agente ID: {item.Agente_id_id}
            </Text>
            <Text style={styles.itemText}>
              Data de criação: {new Date(item.created_at).toLocaleString()}
            </Text>
 
            {/* Botão "Chat" */}
            <TouchableOpacity
              style={styles.chatButton}
              onPress={() => {
                const agentId = item.Agente_id_id || item.agent_id || item.agente_id;
                if (!agentId) {
                  console.error("No agent ID found in item:", item);
                  return;
                }
                router.push({
                  pathname: "/Chat",
                  params: {
                    agenteId: String(agentId),
                    chatbotName: item.Agente_nome
                  }
                });
              }}
            >
              <Ionicons name="chatbubbles" size={20} color="#fff" />
              <Text style={styles.chatButtonText}>Chat</Text>
            </TouchableOpacity>
 
            {/* Botão "Editar" */}
            <TouchableOpacity
              style={styles.editButton}
              onPress={() => handleEdit(item)}
            >
              <Ionicons name="create" size={20} color="#fff" />
              <Text style={styles.editButtonText}>Editar</Text>
            </TouchableOpacity>
          </View>
        )}
      </TouchableOpacity>
    );
  };
 
  return (
    <View style={styles.container}>
      {loading ? (
        <ActivityIndicator size="large" color="#fff" />
      ) : (
        <FlatList
          data={chatbots}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => <ChatbotItem item={item} />}
          ListEmptyComponent={
            <Text style={styles.emptyText}>Nenhum chatbot treinado encontrado.</Text>
          }
        />
      )}
 
      {/* Modal de edição */}
      <Modal
        transparent={true}
        animationType="fade"
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <Text style={styles.modalTitle}>Editar Chatbot</Text>
            <TextInput
              style={styles.input}
              placeholder="Nome"
              value={updatedName}
              onChangeText={setUpdatedName}
            />
            <TextInput
              style={styles.input}
              placeholder="Descrição"
              value={updatedDescription}
              onChangeText={setUpdatedDescription}
            />
            <View style={styles.modalButtons}>
              <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
                <Text style={styles.buttonText}>Salvar</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.cancelButton}
                onPress={() => setModalVisible(false)}
              >
                <Text style={styles.buttonText}>Cancelar</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};
 
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#282828", padding: 20 },
  title: { fontSize: 24, color: "#fff", textAlign: "center", marginVertical: 10 },
  itemContainer: {
    backgroundColor: "#444",
    padding: 15,
    borderRadius: 5,
    marginBottom: 10,
  },
  itemHeader: { flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
  itemTitle: { fontSize: 20, color: "#fff", fontWeight: "bold" },
  itemFrases: { fontSize: 16, color: "#ccc", marginTop: 5 },
  itemDetails: { marginTop: 10, borderTopWidth: 1, borderTopColor: "#666", paddingTop: 10 },
  itemText: { fontSize: 14, color: "#ccc", marginTop: 3 },
  emptyText: { fontSize: 18, color: "gray", textAlign: "center", marginTop: 20 },
  chatButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#007BFF",
    padding: 8,
    borderRadius: 5,
    marginTop: 10,
    alignSelf: "flex-start",
  },
  chatButtonText: { color: "#fff", marginLeft: 5, fontSize: 14 },
  editButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#28A745", // Green color for "Edit"
    padding: 8,
    borderRadius: 5,
    marginTop: 10,
    alignSelf: "flex-start",
  },
  editButtonText: { color: "#fff", marginLeft: 5, fontSize: 14 },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)", // Fundo semitransparente
    justifyContent: "center",
    alignItems: "center",
  },
  modalContainer: {
    width: "80%",
    backgroundColor: "#444", // Cor de fundo do modal
    borderRadius: 10,
    padding: 20,
    alignItems: "center",
  },
  modalTitle: {
    fontSize: 20,
    color: "#fff", // Cor do texto do título
    marginBottom: 10,
  },
  input: {
    width: "100%",
    backgroundColor: "#555", // Cor de fundo do campo de entrada
    color: "#fff", // Cor do texto no campo de entrada
    padding: 10,
    borderRadius: 5,
    marginBottom: 10,
  },
  modalButtons: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
  },
  saveButton: {
    flex: 1,
    backgroundColor: "#28A745", // Cor verde para o botão "Salvar"
    padding: 10,
    borderRadius: 5,
    marginRight: 5,
    alignItems: "center",
  },
  cancelButton: {
    flex: 1,
    backgroundColor: "#DC3545", // Cor vermelha para o botão "Cancelar"
    padding: 10,
    borderRadius: 5,
    marginLeft: 5,
    alignItems: "center",
  },
  buttonText: {
    color: "#fff", // Cor do texto dos botões
    fontSize: 16,
  },
});
 
export default Chatbots;