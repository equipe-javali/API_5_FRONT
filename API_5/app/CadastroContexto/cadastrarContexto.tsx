import React, { useState, useEffect } from "react";
import { View, Text, TextInput, TouchableOpacity, Modal, ActivityIndicator } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { apiCall } from "../../config/api";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import styles from "./style";

export default function CadastroContexto() {
  const router = useRouter();
  const [mode, setMode] = useState<"bulk" | "single">("bulk");
  // For single mode
  const [singlePergunta, setSinglePergunta] = useState("");
  const [singleResposta, setSingleResposta] = useState("");
  // For bulk mode we'll use a multiline text input
  const [bulkText, setBulkText] = useState("");
  const [agentId, setAgentId] = useState("");
  const [modalVisible, setModalVisible] = useState(false);
  const [modalMessage, setModalMessage] = useState("");
  const [isError, setIsError] = useState(false);
  const [loading, setLoading] = useState(false); // Estado para controle do carregamento

  useEffect(() => {
    AsyncStorage.getItem("agentId")
      .then(id => { if (id) setAgentId(id); })
      .catch(error => console.error("Erro ao buscar agentId:", error));
  }, []);

  const handleImportContextosBulk = async () => {
    if (!bulkText.trim()) {
      setModalMessage("Preencha o campo de contextos.");
      setIsError(true);
      setModalVisible(true);
      return;
    }
    const lines = bulkText.split("\n").filter(line => line.trim() !== "");
    const parsedContextos: { pergunta: string; resposta: string }[] = [];
    for (const line of lines) {
      const parts = line.split("||");
      if (parts.length !== 2) {
        setModalMessage("Formato inválido. Cada linha deve conter 'Pergunta || Resposta'.");
        setIsError(true);
        setModalVisible(true);
        return;
      }
      parsedContextos.push({
        pergunta: parts[0].trim(),
        resposta: parts[1].trim()
      });
    }

    setLoading(true); // Ativando o carregamento

    try {
      const payload = {
        Agente_id: agentId,
        contextos: parsedContextos
      };
      const response = await apiCall("/api/contexto/cadastrar-em-massa", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });
      if (response.ok) {
        // After successful import, trigger training automatically
        const trainResponse = await apiCall("/api/contexto/treinar", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ Agente_id: agentId })
        });
        if (trainResponse.ok) {
          setModalMessage("Contextos importados e chatbot treinado com sucesso!");
          setIsError(false);
        } else {
          const trainData = await trainResponse.json();
          setModalMessage(
            "Contextos importados, mas ocorreu um erro ao treinar: " +
            (trainData.message || trainData.error)
          );
          setIsError(true);
        }
        setBulkText("");
      } else {
        const data = await response.json();
        setModalMessage(data.message || "Erro ao importar contextos.");
        setIsError(true);
      }
    } catch (error) {
      console.error(error);
      setModalMessage("Erro na conexão com o servidor.");
      setIsError(true);
    } finally {
      setModalVisible(true);
      setLoading(false); // Desativando o carregamento
    }
  };

  const handleImportContextoSingle = async () => {
    if (!singlePergunta || !singleResposta) {
      setModalMessage("Preencha os campos de pergunta e resposta.");
      setIsError(true);
      setModalVisible(true);
      return;
    }

    setLoading(true); // Ativando o carregamento

    try {
      const payload = {
        Agente_id: agentId,
        pergunta: singlePergunta,
        resposta: singleResposta
      };
      const response = await apiCall("/api/contexto/cadastrar-individual", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });
      if (response.ok) {
        setModalMessage("Contexto cadastrado com sucesso!");
        setIsError(false);
        setSinglePergunta("");
        setSingleResposta("");
      } else {
        const data = await response.json();
        setModalMessage(data.message || "Erro ao cadastrar contexto.");
        setIsError(true);
      }
    } catch (error) {
      console.error(error);
      setModalMessage("Erro na conexão com o servidor.");
      setIsError(true);
    } finally {
      setModalVisible(true);
      setLoading(false); // Desativando o carregamento
    }
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={() => router.push('/CadastroBot/cadastrarBot')} style={styles.btnBack}>
        <Ionicons name="arrow-back" size={24} color="#fff" />
      </TouchableOpacity>

      <View style={styles.middle}>
        <Text style={styles.title}>Inserir Contexto</Text>
        <View style={styles.toggleContainer}>
          <TouchableOpacity onPress={() => setMode("bulk")} style={mode === "bulk" ? styles.activeToggle : styles.toggle}>
            <Text style={styles.toggleText}>Em Massa</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => setMode("single")} style={mode === "single" ? styles.activeToggle : styles.toggle}>
            <Text style={styles.toggleText}>Único</Text>
          </TouchableOpacity>
        </View>
        {mode === "bulk" ? (
          <>
            <TextInput
              style={[styles.input, { height: 150 }]}
              placeholder="Digite cada contexto em uma nova linha no formato: Pergunta || Resposta"
              placeholderTextColor="#ccc"
              multiline={true}
              value={bulkText}
              onChangeText={setBulkText}
            />
            <TouchableOpacity style={styles.button} onPress={handleImportContextosBulk}>
              <Text style={styles.buttonText}>Importar Contextos</Text>
            </TouchableOpacity>
          </>
        ) : (
          <>
            <TextInput
              style={styles.input}
              placeholder="Pergunta"
              placeholderTextColor="#ccc"
              value={singlePergunta}
              onChangeText={setSinglePergunta}
            />
            <TextInput
              style={styles.input}
              placeholder="Resposta"
              placeholderTextColor="#ccc"
              value={singleResposta}
              onChangeText={setSingleResposta}
            />
            <TouchableOpacity style={styles.button} onPress={handleImportContextoSingle}>
              <Text style={styles.buttonText}>Cadastrar Contexto</Text>
            </TouchableOpacity>
          </>
        )}
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
            <TouchableOpacity style={styles.closeButton} onPress={() => setModalVisible(false)}>
              <Text style={styles.closeButtonText}>Fechar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
};