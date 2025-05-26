import React, { useState, useEffect } from "react";
import { View, Text, FlatList, TouchableOpacity, TextInput, Alert, Platform } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { makeAuthenticatedRequest } from "../../../config/tokenService";
import { stylesChatbots as styles } from "../../../styles";
import { BaseScreen, Loading, Modal } from "../../../components";

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

export default function Chatbots() {
  const [chatbots, setChatbots] = useState<Chatbot[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingModal, setLoadingModal] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [contextModalVisible, setContextModalVisible] = useState(false);
  const [selectedChatbot, setSelectedChatbot] = useState<Chatbot | null>(null);
  const [updatedName, setUpdatedName] = useState("");
  const [updatedDescription, setUpdatedDescription] = useState("");
  const [rawContextText, setRawContextText] = useState("");
  const [deleteTriggered, setDeleteTriggered] = useState(false);

  const fetchChatbots = async () => {
    setLoading(true);
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
    }
    setLoading(false);
  };
  useEffect(() => {
    fetchChatbots();
  }, []);

  useEffect(() => {
    if (selectedChatbot && deleteTriggered) {
      console.log("Chatbot selecionado para exclusão:", selectedChatbot);

      if (Platform.OS === 'web') {
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
            // Identificar o ID correto do agente
            const agenteId = selectedChatbot.Agente_id_id ||
              selectedChatbot.agent_id ||
              selectedChatbot.agente_id ||
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
                headers: { "Content-Type": "application/json" }
              }
            );

            if (response.ok) {
              const respData = await response.json();
              window.alert(respData.message || "Chatbot excluído com sucesso!");

              setChatbots(chatbots.filter(bot =>
                (bot.Agente_id_id !== agenteId) &&
                (bot.agent_id !== agenteId) &&
                (bot.agente_id !== agenteId) &&
                (bot.id !== agenteId)
              ));
            } else {
              try {
                const errorData = await response.json();
                window.alert(errorData.error || "Não foi possível excluir o chatbot.");
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
              onPress: () => setDeleteTriggered(false)
            },
            {
              text: "Excluir",
              style: "destructive",
              onPress: async () => {
                try {
                  // Identificar o ID correto do agente
                  const agenteId = selectedChatbot.Agente_id_id ||
                    selectedChatbot.agent_id ||
                    selectedChatbot.agente_id ||
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
                      headers: { "Content-Type": "application/json" }
                    }
                  );

                  if (response.ok) {
                    const respData = await response.json();
                    Alert.alert("Sucesso", respData.message || "Chatbot excluído com sucesso!");

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
                } finally {
                  setDeleteTriggered(false);
                }
              }
            }
          ],
          {
            onDismiss: () => setDeleteTriggered(false)
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
    setRawContextText("");
    setContextModalVisible(true);
    setLoadingModal(true)
    try {
      console.log("ID do agente:", chatbot.Agente_id_id); // Log do ID do agente
      const response = await makeAuthenticatedRequest(`/api/contexto/listar/${chatbot.id}`, {
        method: "GET",
        headers: { "Content-Type": "application/json" },
      });

      if (response.ok) {
        const data = await response.json();
        console.log("Dados do contexto:", data); // Log para verificar a resposta

        // Formata os contextos existentes para exibição no TextInput
        const formattedText = (data.contexts || [])
          .map((context: { pergunta: string; resposta: string }) => `${context.pergunta} || ${context.resposta}`)
          .join("\n");
        setRawContextText(formattedText);

        setSelectedChatbot(chatbot);
      } else {
        Alert.alert("Erro", "Erro ao buscar o contexto do agente.");
      }
    } catch (error) {
      console.error("Erro ao buscar contexto:", error);
      Alert.alert("Erro", "Erro na conexão com o servidor.");
    } finally {
      setLoadingModal(false);
    };
  };

  const handleSave = async () => {
    if (!selectedChatbot) return;
    setLoadingModal(true);
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
    } finally {
      setLoadingModal(false);
    };
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

    setLoadingModal(true);
    try {
      // 1. Primeiro atualiza os contextos
      const response = await makeAuthenticatedRequest(`/api/contexto/atualizar/${selectedChatbot.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ contexts: updatedContexts }),
      });

      if (response.ok) {
        // 2. Se os contextos foram atualizados, treina o modelo
        const trainResponse = await makeAuthenticatedRequest("/api/contexto/treinar", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ Agente_id: selectedChatbot.id })
        });

        if (trainResponse.ok) {
          Alert.alert("Sucesso", "Contextos atualizados e chatbot treinado com sucesso!");
          fetchChatbots()
        } else {
          const trainData = await trainResponse.json();
          Alert.alert(
            "Atenção",
            `Contextos atualizados, mas ocorreu um erro ao treinar: ${trainData.message || trainData.error}`
          );
        }
        setContextModalVisible(false);
      } else {
        const errorData = await response.json();
        Alert.alert("Erro", errorData.message || "Erro ao atualizar os contextos.");
      }
    } catch (error) {
      console.error("Erro ao atualizar contextos:", error);
      Alert.alert("Erro", "Erro na conexão com o servidor.");
    } finally {
      setLoadingModal(false);
    };
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
              style={[styles.editButton, { backgroundColor: "#D32F2F", marginRight: 0 }]}
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
    <BaseScreen>
      {loading ? <Loading textLoading="Carregando chatbots" /> : <FlatList
        data={chatbots}
        scrollEnabled={false}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => <ChatbotItem item={item} />}
        ListEmptyComponent={
          <Text style={styles.emptyText}>Nenhum chatbot treinado encontrado.</Text>
        }
      />}

      {/* Modal de edição de nome e descrição */}
      <Modal
        show={modalVisible}
        setShow={setModalVisible}
        secundaryButton={handleSave}
        title="Editar Chatbot"
        loading={loadingModal}
        setLoading={setLoadingModal}
      >
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
      </Modal>

      {/* Modal de edição de contexto */}
      <Modal
        show={contextModalVisible}
        setShow={setContextModalVisible}
        secundaryButton={handleSaveContext}
        title="Editar Contexto"
        loading={loadingModal}
        setLoading={setLoadingModal}
      >
        <TextInput
          style={[styles.contextInput, { height: 150 }]}
          placeholder="Digite no formato: Pergunta || Resposta (uma por linha)"
          placeholderTextColor="#ccc"
          multiline={true}
          value={rawContextText}
          autoCorrect={false}
          autoCapitalize="none"
          onChangeText={setRawContextText}
        />
      </Modal>
    </BaseScreen>
  );
};