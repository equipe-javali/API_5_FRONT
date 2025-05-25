import React, { useState, useEffect } from "react";
import { View, Text, FlatList, ActivityIndicator, TouchableOpacity, Alert } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { makeAuthenticatedRequest } from "../../config/tokenService";
import styles, { cores } from "./style";
import { BaseScreen } from "../../components";

interface Chatbot {
  id: number;
  nome: string;
  descricao: string;
  tipo: string;
}

export default function MeusChatbots() {
  const [chatbots, setChatbots] = useState<Chatbot[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  const handleLogout = async () => {
    await AsyncStorage.multiRemove([
      "access_token",
      "refresh_token",
      "userId",
      "isAdmin",
      "currentChatbotId",
      "currentChatbotName",
    ]);
    router.replace("/Start/login");
  };

  const renderHeader = (
    <View style={styles.header}>
      <TouchableOpacity style={styles.headerIconPlaceholder} disabled>
        <Ionicons name="chatbubbles-outline" size={24} color={cores.cor4} />
      </TouchableOpacity>

      <Text style={styles.headerTitle}>Meus Chatbots</Text>

      <TouchableOpacity onPress={handleLogout} style={styles.logoutButton}>
        <Ionicons name="log-out-outline" size={24} color={cores.cor9} />
      </TouchableOpacity>
    </View>
  )

  useEffect(() => {
    const fetchChatbotsComPermissao = async () => {
      try {
        // 1. Primeiro, obter informações do usuário logado
        let userId = await AsyncStorage.getItem('userId');
        if (!userId) {
          console.log("ID não encontrado no AsyncStorage, tentando extrair do token");
          const token = await AsyncStorage.getItem('access_token');

          if (token) {
            try {
              const tokenParts = token.split('.');
              const payloadBase64 = tokenParts[1];
              const payloadString = atob ? atob(payloadBase64) :
                Buffer.from(payloadBase64, 'base64').toString('ascii');
              const payload = JSON.parse(payloadString);

              if (payload.user_id) {
                userId = payload.user_id.toString();
                if (userId) {
                  if (userId) {
                    if (userId) {
                      if (userId) {
                        await AsyncStorage.setItem('userId', userId);
                      }
                    }
                  }
                }
                console.log("ID extraído do token atual:", userId);
              }
            } catch (error) {
              console.error("Erro ao decodificar token:", error);
            }
          }
        }

        // 2. Se ainda não tem ID, tentar buscar do endpoint current
        if (!userId) {
          console.log("Buscando ID do usuário atual da API");
          const userInfoResponse = await makeAuthenticatedRequest("/api/usuario/current");

          if (userInfoResponse.ok) {
            const currentUserData = await userInfoResponse.json();
            console.log("Dados do usuário atual:", currentUserData);

            if (currentUserData && currentUserData.id) {
              userId = currentUserData.id.toString();
              await AsyncStorage.setItem('userId', userId ?? '');
              console.log("ID do usuário salvo:", userId);
            } else {
              throw new Error("ID não encontrado na resposta de usuario/current");
            }
          } else {
            throw new Error("Falha ao buscar usuário atual");
          }
        }

        // 3. Verificação final para garantir que temos um ID
        if (!userId) {
          throw new Error("Não foi possível obter o ID do usuário");
        }

        console.log("Buscando dados do usuário com ID:", userId);

        // 2. Buscar detalhes do usuário, incluindo suas permissões
        const userResponse = await makeAuthenticatedRequest(`/api/usuario/listagem/${userId}`);
        if (!userResponse.ok) {
          throw new Error("Falha ao buscar detalhes do usuário");
        }

        const userData = await userResponse.json();
        console.log("Dados do usuário:", JSON.stringify(userData, null, 2));

        // Extrair permissões do usuário, dependendo da estrutura da resposta
        let userPermissions: number[] = [];
        if (userData.usuarios && userData.usuarios.permissoes) {
          userPermissions = userData.usuarios.permissoes;
        } else if (userData.usuario && userData.usuario.permissoes) {
          userPermissions = userData.usuario.permissoes;
        } else if (userData.permissoes) {
          userPermissions = userData.permissoes;
        }

        console.log("Permissões do usuário:", userPermissions);

        // 3. Buscar todos os chatbots/agentes
        const agentsResponse = await makeAuthenticatedRequest("/api/agente/listar-todos");
        if (!agentsResponse.ok) {
          throw new Error("Falha ao buscar agentes");
        }

        const agentsData = await agentsResponse.json();
        console.log("Total de agentes:", Array.isArray(agentsData) ? agentsData.length : 0);

        // 4. Filtrar apenas os agentes que o usuário tem permissão para acessar
        const allowedAgents = Array.isArray(agentsData)
          ? agentsData.filter(agent =>
            agent &&
            agent.id &&
            userPermissions.includes(agent.id))
          : [];

        console.log(`Agentes permitidos: ${allowedAgents.length} de ${Array.isArray(agentsData) ? agentsData.length : 0}`);

        // 5. Converter para o formato de chatbot esperado
        const formattedChatbots = allowedAgents.map(agent => ({
          id: agent.id,
          nome: agent.nome || "Sem nome",
          descricao: agent.descricao || "Sem descrição",
          tipo: agent.tipo || "geral"
        }));

        setChatbots(formattedChatbots);
      } catch (error) {
        console.error("Erro ao carregar chatbots com permissão:", error);
        setChatbots([]);
      } finally {
        setLoading(false);
      }
    };

    fetchChatbotsComPermissao();
  }, []);

  const iniciarChat = async (chatbot: Chatbot) => {
    try {
      // Garantir que chatbot.id existe antes de usar toString()
      if (chatbot && chatbot.id !== undefined && chatbot.id !== null) {
        await AsyncStorage.setItem("currentChatbotId", chatbot.id.toString());
        await AsyncStorage.setItem("currentChatbotName", chatbot.nome || "Chatbot");
        router.push({
          pathname: "/Chat",
          params: {
            agenteId: chatbot.id.toString(),
            chatbotName: chatbot.nome || "Chatbot"
          }
        });
      } else {
        Alert.alert("Erro", "ID do chatbot inválido");
      }
    } catch (error) {
      console.error("Erro ao iniciar chat:", error);
      Alert.alert("Erro", "Não foi possível iniciar o chat");
    }
  };

  return (
    <BaseScreen header={renderHeader}>
      {loading ?
        <ActivityIndicator size="large" color={cores.cor9} /> :
        chatbots.length === 0 ?
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>Você ainda não possui nenhum chatbot. Peça para algum administrador liberar um chat para você utilizar!</Text>
          </View> :
          <FlatList
            style={styles.chatContainer}
            data={chatbots}
            keyExtractor={(item) => `chatbot-${item.id || Math.random().toString()}`}
            renderItem={({ item }) => (
              <TouchableOpacity
                style={styles.chatbotCard}
                onPress={() => iniciarChat(item)}
              >
                <View style={styles.chatbotHeader}>
                  <Text style={styles.chatbotName}>{item.nome || "Sem nome"}</Text>
                  <View style={[
                    styles.chatbotBadge,
                    { backgroundColor: item.tipo === 'rh' ? cores.cor11 : cores.cor12 }
                  ]}>
                    <Text style={styles.chatbotBadgeText}>
                      {item.tipo === 'rh' ? 'RH' : 'Contabilidade'}
                    </Text>
                  </View>
                </View>
                <Text style={styles.chatbotDescription}>{item.descricao || "Sem descrição"}</Text>
                <View style={styles.chatActions}>
                  <TouchableOpacity
                    style={styles.chatAction}
                    onPress={() => iniciarChat(item)}
                  >
                    <Ionicons name="chatbubble-outline" size={18} color={cores.cor9} />
                    <Text style={styles.chatActionText}>Conversar</Text>
                  </TouchableOpacity>
                </View>
              </TouchableOpacity>
            )}
          />
      }
    </BaseScreen>
  );
};