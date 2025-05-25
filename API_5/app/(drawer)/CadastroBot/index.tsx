import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, ActivityIndicator } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { makeAuthenticatedRequest } from '../../../config/tokenService';
import { router } from "expo-router";
import { BaseScreen, Loading, Modal } from "../../../components";
import { stylesCadastroBot as styles, cores } from "../../../styles";

export default function CadastrarBot() {
  const [name, setName] = useState("");
  const [descricao, setDescricao] = useState("");
  const [modalVisible, setModalVisible] = useState(false);
  const [modalMessage, setModalMessage] = useState("");
  const [loading, setLoading] = useState(false); // Estado de carregamento

  const handleSignUp = async () => {
    if (!name || !descricao) {
      setModalMessage("Por favor, preencha todos os campos.");
      setModalVisible(true);
      return;
    }

    const token = await AsyncStorage.getItem('access_token');
    if (!token) {
      setModalMessage("Você não está autenticado. Faça login novamente.");
      setModalVisible(true);
      setTimeout(() => router.push('/Start/login'), 2000);
      return;
    }

    setLoading(true); // Ativar o carregamento

    try {
      // PASSO 1: Criar a permissão
      console.log("Criando permissão com nome:", name);
      const permissaoResponse = await makeAuthenticatedRequest("/api/permissao/cadastrar", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ nome: name }),
      });

      const permissaoData = await permissaoResponse.json();
      console.log("Resposta completa da API de permissão:", JSON.stringify(permissaoData));

      if (!permissaoResponse.ok) {
        if (permissaoResponse.status === 401) {
          setModalMessage("Sessão expirada. Por favor, faça login novamente.");
          setTimeout(() => router.push('/Start/login'), 2000);
          return;
        }

        throw new Error(permissaoData.message || "Erro ao criar permissão.");
      }

      // PASSO 2: Buscar a permissão pelo nome para obter o ID
      console.log("Buscando permissão pelo nome:", name);
      const buscarPermissaoResponse = await makeAuthenticatedRequest(
        `/api/permissao/buscar?nome=${encodeURIComponent(name)}`,
        { method: "GET" }
      );

      const permissoesEncontradas = await buscarPermissaoResponse.json();
      console.log("Permissões encontradas:", JSON.stringify(permissoesEncontradas));

      // PASSO 3: Extrair o ID com tratamento de diferentes formatos
      let permissaoId;
      if (Array.isArray(permissoesEncontradas) && permissoesEncontradas.length > 0) {
        // Se retornou um array de permissões, pegar a primeira
        permissaoId = parseInt(permissoesEncontradas[0].id, 10);
      } else if (permissoesEncontradas && permissoesEncontradas.id) {
        // Se retornou um objeto único
        permissaoId = parseInt(permissoesEncontradas.id, 10);
      }

      // Verificar se obtivemos um ID válido
      if (!permissaoId || isNaN(permissaoId)) {
        console.error("ID da permissão não encontrado:", permissoesEncontradas);
        throw new Error("ID de permissão inválido ou não encontrado");
      }

      console.log("ID da permissão obtido:", permissaoId, "tipo:", typeof permissaoId);

      // PASSO 4: Criar o agente com o ID da permissão
      const agenteResponse = await makeAuthenticatedRequest("/api/agente/cadastrar", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          nome: name,
          descricao: descricao,
          Permissao_id: permissaoId
        }),
      });

      // Resto do código para tratar a resposta...
      const agenteData = await agenteResponse.json();
      console.log("Resposta do cadastro de agente:", JSON.stringify(agenteData));

      if (agenteResponse.ok) {
        // Armazenar o agentId para uso nas telas seguintes
        await AsyncStorage.setItem("agentId", agenteData.id.toString());

        setName("");
        setDescricao("");

        // Redirect to context registration screen
        router.push("/CadastroContexto/cadastrarContexto");
      } else if (agenteResponse.status === 401) {
        setModalMessage("Sessão expirada. Por favor, faça login novamente.");
        setTimeout(() => router.push('/Start/login'), 2000);
      } else {
        setModalMessage(agenteData.message || "Erro ao cadastrar chatbot.");
      }
    } catch (error) {
      console.error("Erro:", error);
      setModalMessage(
        error instanceof Error ? error.message : "Erro ao conectar com o servidor."
      );
    } finally {
      setLoading(false); // Desativar o carregamento
      setModalVisible(true);
    }
  };

  return (
    <BaseScreen>
      <Text style={styles.title}>Cadastrar Bot</Text>
      <TextInput
        style={styles.input}
        placeholder="Nome"
        placeholderTextColor={cores.cor6}
        value={name}
        onChangeText={setName}
      />
      <TextInput
        style={styles.input}
        placeholder="Descrição"
        placeholderTextColor={cores.cor6}
        value={descricao}
        onChangeText={setDescricao}
        autoCapitalize="none"
      />

      <TouchableOpacity style={styles.button} onPress={handleSignUp} disabled={loading}>
        <Text style={styles.buttonText}>Cadastrar</Text>
      </TouchableOpacity>

      <Modal show={loading} setShow={setLoading}>
        <Loading textLoading="novo cadastro" />
      </Modal>

      <Modal
        show={modalVisible}
        setShow={setModalVisible}
      >
        <Text style={styles.errorText}>
          {modalMessage}
        </Text>
      </Modal>
    </BaseScreen>
  );
};