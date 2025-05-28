import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  Modal,
  TextInput,
  Alert,
  ScrollView,
  Platform,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { apiCall } from "../../../config/api";
import { useRouter } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
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
  const [agentContext, setAgentContext] = useState<
    { pergunta: string; resposta: string }[]
  >([]);
  const [rawContextText, setRawContextText] = useState("");
  const [deleteTriggered, setDeleteTriggered] = useState(false);

  <TextInput
    style={[styles.input, { height: 200, maxWidth: 300 }]}
    multiline={true}
    value={rawContextText}
    onChangeText={setRawContextText}
    placeholder="Digite no formato: Pergunta || Resposta (uma por linha)"
    autoCorrect={false}
    autoCapitalize="none"
  />;

  useEffect(() => {
    const fetchChatbots = async () => {
      try {
        const response = await makeAuthenticatedRequest(
          "/api/agente/listar-todos",
          {
            method: "GET",
            headers: { "Content-Type": "application/json" },
          }
        );

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

  useEffect(() => {
    if (selectedChatbot && deleteTriggered) {
      console.log("Chatbot selecionado para exclusão:", selectedChatbot);

      if (Platform.OS === "web") {
        // Usa window.confirm para web
        const confirmDelete = window.confirm(
          `Tem certeza que deseja excluir o chatbot "${selectedChatbot.nome}"? Isso também excluirá todos os contextos associados.`
        );

        if (!confirmDelete) {
          // Se cancelou, apenas reseta o gatilho
          setDeleteTriggered(false);
          return;
        }

        // Se confirmou, executa a lógica de exclusão
        (async () => {
          try {
            console.log("IDs disponíveis:", {
              Agente_id_id: selectedChatbot.Agente_id_id,
              agent_id: selectedChatbot.agent_id,
              agente_id: selectedChatbot.agente_id,
              id: selectedChatbot.id,
            });
            // Identificar o ID correto do agente
            const agenteId =              
              selectedChatbot.id;
            
            if (!agenteId) {
              window.alert("ID do agente não encontrado");
              setDeleteTriggered(false);
              return;
            }

            console.log(`Excluindo agente ID: ${agenteId}`);
            const response = await makeAuthenticatedRequest(
              `/api/agente/deletar/${agenteId}`,
              {
                method: "DELETE",
                headers: { "Content-Type": "application/json" },
              }
            );

            if (response.ok) {
              const respData = await response.json();
              window.alert(respData.message || "Chatbot excluído com sucesso!");

              setChatbots(
                chatbots.filter(
                  (bot) =>                    
                    bot.id !== agenteId
                )
              );
            } else {
              try {
                const errorData = await response.json();
                window.alert(
                  errorData.error || "Não foi possível excluir o chatbot."
                );
              } catch (parseError) {
                window.alert(`Erro de servidor: ${response.status}`);
              }
            }
          } catch (error) {
            console.error("Erro ao excluir chatbot:", error);
            window.alert("Erro na conexão com o servidor.");
          } finally {
            setDeleteTriggered(false);
          }
        })();
      } else {
        // Usa o Alert normal para dispositivos móveis (código existente)
        Alert.alert(
          "Confirmar exclusão",
          `Tem certeza que deseja excluir o chatbot "${selectedChatbot.nome}"? Isso também excluirá todos os contextos associados.`,
          [
            {
              text: "Cancelar",
              style: "cancel",
              onPress: () => setDeleteTriggered(false),
            },
            {
              text: "Excluir",
              style: "destructive",
              onPress: async () => {
                try {
                  // Identificar o ID correto do agente
                  const agenteId =                    
                    selectedChatbot.id;

                  if (!agenteId) {
                    Alert.alert("Erro", "ID do agente não encontrado");
                    setDeleteTriggered(false);
                    return;
                  }

                  console.log(`Excluindo agente ID: ${agenteId}`);
                  const response = await makeAuthenticatedRequest(
                    `/api/agente/deletar/${agenteId}`,
                    {
                      method: "DELETE",
                      headers: { "Content-Type": "application/json" },
                    }
                  );

                  if (response.ok) {
                    const respData = await response.json();
                    Alert.alert(
                      "Sucesso",
                      respData.message || "Chatbot excluído com sucesso!"
                    );

                    setChatbots(
                      chatbots.filter(
                        (bot) =>                          
                          bot.id !== agenteId
                      )
                    );
                  } else {
                    try {
                      const errorData = await response.json();
                      Alert.alert(
                        "Erro",
                        errorData.error || "Não foi possível excluir o chatbot."
                      );
                    } catch (parseError) {
                      Alert.alert(
                        "Erro",
                        `Erro de servidor: ${response.status}`
                      );
                    }
                  }
                } catch (error) {
                  console.error("Erro ao excluir chatbot:", error);
                  Alert.alert("Erro", "Erro na conexão com o servidor.");
                } finally {
                  setDeleteTriggered(false);
                }
              },
            },
          ],
          {
            onDismiss: () => setDeleteTriggered(false),
          }
        );
      }
    }
  }, [selectedChatbot, deleteTriggered, chatbots]);

  const handleEdit = (chatbot: Chatbot) => {
    setSelectedChatbot(chatbot);
    setUpdatedName(chatbot.nome);
    setUpdatedDescription(chatbot.descricao || "");
    setModalVisible(true);
  };

  const handleEditContext = async (chatbot: Chatbot) => {
    try {
      console.log("ID do agente:", chatbot.Agente_id_id); // Log do ID do agente
      const response = await makeAuthenticatedRequest(
        `/api/contexto/listar/${chatbot.id}`,
        {
          method: "GET",
          headers: { "Content-Type": "application/json" },
        }
      );

      if (response.ok) {
        const data = await response.json();
        console.log("Dados do contexto:", data); // Log para verificar a resposta
        setAgentContext(data.contexts || []); // Armazena o array completo de contextos

        // Formata os contextos existentes para exibição no TextInput
        const formattedText = (data.contexts || [])
          .map(
            (context: { pergunta: string; resposta: string }) =>
              `${context.pergunta} || ${context.resposta}`
          )
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
      const response = await makeAuthenticatedRequest(
        `/api/agente/atualizar/${selectedChatbot.id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            nome: updatedName,
            descricao: updatedDescription,
          }),
        }
      );

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
        Alert.alert(
          "Erro",
          errorData.message || "Erro ao atualizar o chatbot."
        );
      }
    } catch (error) {
      console.error("Erro ao atualizar chatbot:", error);
      Alert.alert("Erro", "Erro na conexão com o servidor.");
    }
  };

  const handleSaveContext = async () => {
    if (!selectedChatbot) return;

    // Configura loading
    setLoading(true);

    // Divide o texto em linhas e valida o formato
    const lines = rawContextText.split("\n");
    const updatedContexts = lines.map((line) => {
      const [pergunta = "", resposta = ""] = line
        .split("||")
        .map((str) => str.trim());
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
      setLoading(false);
      return;
    }

    try {
      // 1. Primeiro atualiza os contextos
      const response = await makeAuthenticatedRequest(
        `/api/contexto/atualizar/${selectedChatbot.id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ contexts: updatedContexts }),
        }
      );

      if (response.ok) {
        // 2. Se os contextos foram atualizados, treina o modelo
        const trainResponse = await makeAuthenticatedRequest(
          "/api/contexto/treinar",
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ Agente_id: selectedChatbot.id }),
          }
        );

        if (trainResponse.ok) {
          Alert.alert(
            "Sucesso",
            "Contextos atualizados e chatbot treinado com sucesso!"
          );
        } else {
          const trainData = await trainResponse.json();
          Alert.alert(
            "Atenção",
            `Contextos atualizados, mas ocorreu um erro ao treinar: ${
              trainData.message || trainData.error
            }`
          );
        }

        setAgentContext(updatedContexts);
        setContextModalVisible(false);
      } else {
        const errorData = await response.json();
        Alert.alert(
          "Erro",
          errorData.message || "Erro ao atualizar os contextos."
        );
      }
    } catch (error) {
      console.error("Erro ao atualizar contextos:", error);
      Alert.alert("Erro", "Erro na conexão com o servidor.");
    } finally {
      setLoading(false);
    }
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

        {expanded && (
          <View style={styles.itemDetails}>
            <Text style={styles.itemText}>
              {item.descricao ? item.descricao : "Sem descrição disponível"}
            </Text>

            {/* Container para botões de edição */}
            <View style={styles.buttonRow}>
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
            </View>

            {/* Botão "Excluir" */}
            <TouchableOpacity
              style={[
                styles.editButton,
                { backgroundColor: "#D32F2F", marginRight: 0 },
              ]}
              onPress={() => {
                setSelectedChatbot(item);
                setDeleteTriggered(true); // Ativa o gatilho em vez de chamar handleDelete
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
            <Text style={styles.emptyText}>
              Nenhum chatbot treinado encontrado.
            </Text>
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
            <Text style={styles.title}>Editar Chatbot</Text>
            <TextInput
              style={styles.contextInput}
              placeholder="Nome"
              placeholderTextColor="#ccc"
              value={updatedName}
              onChangeText={setUpdatedName}
            />
            <TextInput
              style={styles.contextInput}
              placeholder="Descrição"
              placeholderTextColor="#ccc"
              value={updatedDescription}
              onChangeText={setUpdatedDescription}
            />
            <TouchableOpacity style={styles.button} onPress={handleSave}>
              <Text style={styles.actionButtonText}>Salvar</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.closeButton}
              onPress={() => setModalVisible(false)}
            >
              <Text style={styles.closeButtonText}>Cancelar</Text>
            </TouchableOpacity>

            {loading && (
              <View style={styles.loadingOverlay}>
                <ActivityIndicator size="large" color="#fff" />
              </View>
            )}
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
            <Text style={styles.title}>Editar Contexto</Text>
            <TextInput
              style={[styles.contextInput, { height: 150 }]}
              placeholder="Digite no formato: Pergunta || Resposta (uma por linha)"
              placeholderTextColor="#ccc"
              multiline={true}
              value={rawContextText}
              onChangeText={setRawContextText}
              autoCorrect={false}
              autoCapitalize="none"
            />
            <TouchableOpacity style={styles.button} onPress={handleSaveContext}>
              <Text style={styles.actionButtonText}>Salvar</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.closeButton}
              onPress={() => setContextModalVisible(false)}
            >
              <Text style={styles.closeButtonText}>Cancelar</Text>
            </TouchableOpacity>

            {loading && (
              <View style={styles.loadingOverlay}>
                <ActivityIndicator size="large" color="#fff" />
              </View>
            )}
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#282828", padding: 20 },
  title: {
    fontSize: 24,
    color: "#fff",
    textAlign: "center",
    marginVertical: 10,
  },
  itemContainer: {
    backgroundColor: "#444",
    padding: 15,
    borderRadius: 5,
    marginBottom: 10,
  },
  itemHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  itemTitle: { fontSize: 20, color: "#fff", fontWeight: "bold" },
  itemFrases: { fontSize: 16, color: "#ccc", marginTop: 5 },
  itemDetails: {
    marginTop: 10,
    borderTopWidth: 1,
    borderTopColor: "#666",
    paddingTop: 10,
  },
  itemText: { fontSize: 14, color: "#ccc", marginTop: 3 },
  emptyText: {
    fontSize: 18,
    color: "gray",
    textAlign: "center",
    marginTop: 20,
  },

  editButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#282828",
    padding: 8,
    borderRadius: 5,
    marginTop: 10,
    marginRight: 15, // Adiciona espaço horizontal entre os botões
    alignSelf: "flex-start",
    paddingHorizontal: 15,
    minWidth: 120,
    minHeight: 40,
    justifyContent: "center",
  },

  editButtonText: { color: "#fff", marginLeft: 5, fontSize: 14 },
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
  buttonRow: {
    flexDirection: "row",
    justifyContent: "flex-start",
    flexWrap: "wrap",
    marginTop: 10,
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
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  contextInput: {
    width: "100%",
    borderColor: "#fff",
    borderWidth: 1,
    marginBottom: 10,
    paddingHorizontal: 10,
    borderRadius: 5,
    color: "#fff",
    padding: 10,
  },
  button: {
    backgroundColor: "#F5F5F5",
    padding: 10,
    borderRadius: 5,
    alignItems: "center",
    marginVertical: 10,
    width: "100%",
  },
  actionButtonText: {
    color: "#212121",
    fontSize: 16,
  },
  closeButton: {
    padding: 10,
    borderRadius: 5,
    borderWidth: 1,
    borderColor: "#fff",
    backgroundColor: "#282828",
    alignItems: "center",
    width: "100%",
  },
  closeButtonText: {
    color: "#fff",
    fontSize: 16,
  },
  loadingOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0, 0, 0, 0.7)",
    justifyContent: "center",
    alignItems: "center",
  },
});

export default Chatbots;
