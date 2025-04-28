import React, { useState, useEffect } from "react";
import { View, Text, FlatList, TouchableOpacity, StyleSheet, ActivityIndicator, Modal, TextInput, Alert, ScrollView } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { apiCall } from "../../../config/api";
import { useRouter } from "expo-router";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { makeAuthenticatedRequest } from "../../../config/tokenService";

interface Chatbot {
  id: number;
  nome: string;
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
  const [contextModalVisible, setContextModalVisible] = useState(false);
  const [selectedChatbot, setSelectedChatbot] = useState<Chatbot | null>(null);
  const [updatedName, setUpdatedName] = useState("");
  const [updatedDescription, setUpdatedDescription] = useState("");
  const [agentContext, setAgentContext] = useState<{ pergunta: string; resposta: string }[]>([]);
  const [rawContextText, setRawContextText] = useState(""); 

<TextInput
  style={[styles.input, { height: 200, maxWidth: 300 }]} // Campo de texto maior para edição em massa
  multiline={true}
  value={rawContextText} // Exibe o texto bruto digitado pelo usuário
  onChangeText={setRawContextText} // Atualiza o texto bruto diretamente
  placeholder="Digite no formato: Pergunta || Resposta (uma por linha)" // Apenas informa o formato esperado
  autoCorrect={false} // Desativa correção automática
  autoCapitalize="none" // Desativa capitalização automática
/>
  const router = useRouter();

  useEffect(() => {
    const fetchChatbots = async () => {
      try {
        const response = await makeAuthenticatedRequest("/api/agente/listar-todos", {
          method: "GET",
          headers: { "Content-Type": "application/json" },
        });
  
        if (response.ok) {
          const data = await response.json();
  
          // Filtra apenas os agentes válidos
          const validChatbots = data.filter((chatbot: Chatbot) => chatbot.id);
          setChatbots(validChatbots);
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
    setUpdatedName(chatbot.nome);
    setUpdatedDescription(chatbot.descricao || "");
    setModalVisible(true);
  };

  const handleEditContext = async (chatbot: Chatbot) => {
    try {
      console.log("ID do agente:", chatbot.Agente_id_id); // Log do ID do agente
      const response = await makeAuthenticatedRequest(`/api/contexto/listar/${chatbot.id}`, {
        method: "GET",
        headers: { "Content-Type": "application/json" },
      });
  
      if (response.ok) {
        const data = await response.json();
        console.log("Dados do contexto:", data); // Log para verificar a resposta
        setAgentContext(data.contexts || []); // Armazena o array completo de contextos
  
        // Formata os contextos existentes para exibição no TextInput
        const formattedText = (data.contexts || [])
          .map((context: { pergunta: string; resposta: string }) => `${context.pergunta} || ${context.resposta}`)
          .join("\n");
        setRawContextText(formattedText);
  
        setSelectedChatbot(chatbot);
        setContextModalVisible(true);
      } else {
        Alert.alert("Erro", "Erro ao buscar o contexto do agente.");
      }
    } catch (error) {
      console.error("Erro ao buscar contexto:", error);
      Alert.alert("Erro", "Erro na conexão com o servidor.");
    }
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
            ? { ...bot, nome: updatedName, descricao: updatedDescription }
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

  const handleSaveContext = async () => {
    if (!selectedChatbot) return;
  
    // Divide o texto em linhas e valida o formato
    const lines = rawContextText.split("\n");
    const updatedContexts = lines.map((line) => {
      const [pergunta = "", resposta = ""] = line.split("||").map((str) => str.trim());
      return { pergunta, resposta };
    });
  
    const isValid = updatedContexts.every(
      (context) => context.pergunta && context.resposta
    );
  
    if (!isValid) {
      Alert.alert(
        "Formato inválido",
        "Certifique-se de que cada linha esteja no formato: Pergunta || Resposta"
      );
      return;
    }
  
    try {
      const response = await makeAuthenticatedRequest(`/api/contexto/atualizar/${selectedChatbot.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ contexts: updatedContexts }), // Envia o array completo de contextos
      });
  
      if (response.ok) {
        Alert.alert("Sucesso", "Contextos atualizados com sucesso!");
        setAgentContext(updatedContexts); // Atualiza o estado com os contextos válidos
        setContextModalVisible(false);
      } else {
        const errorData = await response.json();
        Alert.alert("Erro", errorData.message || "Erro ao atualizar os contextos.");
      }
    } catch (error) {
      console.error("Erro ao atualizar contextos:", error);
      Alert.alert("Erro", "Erro na conexão com o servidor.");
    }
  };

  

    const handleDelete = async () => {
    console.log("Chatbot selecionado para exclusão:", selectedChatbot);
    if (!selectedChatbot) {
      Alert.alert("Erro", "Nenhum chatbot selecionado para exclusão");
      return;
    }
    
    Alert.alert(
      "Confirmar exclusão",
      `Tem certeza que deseja excluir o chatbot "${selectedChatbot.nome}"? Isso também excluirá todos os contextos associados.`,
      [
        { text: "Cancelar", style: "cancel" },
        {
          text: "Excluir",
          style: "destructive",
          onPress: async () => {
            try {
              // Identificar o ID correto do agente
              const agenteId = selectedChatbot.Agente_id_id || selectedChatbot.agent_id || selectedChatbot.agente_id || selectedChatbot.id;
              
              if (!agenteId) {
                Alert.alert("Erro", "ID do agente não encontrado");
                return;
              }
              
              console.log(`Excluindo agente ID: ${agenteId}`);
              const response = await makeAuthenticatedRequest(
                `/api/agente/deletar/${agenteId}`, 
                {
                  method: "DELETE",
                  headers: { "Content-Type": "application/json" }
                }
              );
                
              if (response.ok) {
                // Obter a resposta para exibir a mensagem personalizada do backend
                const respData = await response.json();
                Alert.alert("Sucesso", respData.message || "Chatbot excluído com sucesso!");
                
                // Atualiza a lista filtrando pelo Agente_id_id
                setChatbots(chatbots.filter(bot => 
                  (bot.Agente_id_id !== agenteId) && 
                  (bot.agent_id !== agenteId) && 
                  (bot.agente_id !== agenteId) &&
                  (bot.id !== agenteId)
                ));
              } else {
                try {
                  const errorData = await response.json();
                  Alert.alert("Erro", errorData.error || "Não foi possível excluir o chatbot.");
                } catch (parseError) {
                  Alert.alert("Erro", `Erro de servidor: ${response.status}`);
                }
              }
            } catch (error) {
              console.error("Erro ao excluir chatbot:", error);
              Alert.alert("Erro", "Erro na conexão com o servidor.");
            }
          }
        }
      ]
    );
  };

  const ChatbotItem = ({ item }: { item: Chatbot }) => {
    const [expanded, setExpanded] = useState(false);

    return (
      <TouchableOpacity
        style={styles.itemContainer}
        onPress={() => setExpanded(!expanded)}
      >
        <View style={styles.itemHeader}>
          <Text style={styles.itemTitle}>{item.nome}</Text>
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
                    chatbotName: item.nome
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

            {/* Botão "Editar Contexto" */}
            <TouchableOpacity
              style={styles.editButton}
              onPress={() => handleEditContext(item)}
            >
              <Ionicons name="document-text" size={20} color="#fff" />
              <Text style={styles.editButtonText}>Editar Contexto</Text>
            </TouchableOpacity>
                        {/* Botão "Excluir" */}
            <TouchableOpacity
              style={[styles.editButton, { backgroundColor: "#D32F2F" }]}
              onPress={() => {
                setSelectedChatbot(item);                
                handleDelete();
              }}
            >
              <Ionicons name="trash" size={20} color="#fff" />
              <Text style={styles.editButtonText}>Excluir</Text>
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

      {/* Modal de edição de nome e descrição */}
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

            {/* Modal de edição de contexto */}
            <Modal
        transparent={true}
        animationType="fade"
        visible={contextModalVisible}
        onRequestClose={() => setContextModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <ScrollView>
              <Text style={styles.modalTitle}>Editar Contexto</Text>
              <TextInput
                style={[styles.input, { height: 200 }]}
                multiline={true}
                value={rawContextText}
                onChangeText={setRawContextText}
                placeholder="Digite no formato: Pergunta || Resposta (uma por linha). O contexto não pode ser vazio."
                autoCorrect={false}
                autoCapitalize="none"
              />
              <View style={styles.modalButtons}>
                <TouchableOpacity style={styles.saveButton} onPress={handleSaveContext}>
                  <Text style={styles.buttonText}>Salvar</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.cancelButton}
                  onPress={() => setContextModalVisible(false)}
                >
                  <Text style={styles.buttonText}>Cancelar</Text>
                </TouchableOpacity>
              </View>
            </ScrollView>
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
    backgroundColor: "#282828", // Green color for "Edit"
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
    
  },
  saveButton: {
    flex: 1,
    backgroundColor: "#282828", // Cor verde para o botão "Salvar"
    padding: 10,
    borderRadius: 5,
    marginRight: 5,
    alignItems: "center",
    maxWidth: 100, // Limita a largura do botão "Salvar"
  },
  cancelButton: {
    flex: 1,
    backgroundColor: "#3E3E3E", // Cor vermelha para o botão "Cancelar"
    padding: 10,
    borderRadius: 5,
    marginLeft: 5,
    alignItems: "center",
    // maxWidth: 100, // Limita a largura do botão "Cancelar"
  },
  buttonText: {
    color: "#fff", // Cor do texto dos botões
    fontSize: 16,
  },
  contextItem: {
    marginBottom: 15,
    padding: 10,
    backgroundColor: "#555",
    borderRadius: 5,
  },
  contextQuestion: {
    fontSize: 16,
    color: "#fff",
    marginBottom: 5,
  },
  contextAnswer: {
    fontSize: 16,
    color: "#fff",
    marginTop: 10,
    marginBottom: 5,
  },
  scrollContainer: {
    maxHeight: 300, // Limita a altura do conteúdo rolável
    marginBottom: 10, // Espaço entre o conteúdo e os botões
  },
  closeButton: {
    position: "absolute",
    top: 10,
    right: 10,
    zIndex: 1,
  },
});

export default Chatbots;