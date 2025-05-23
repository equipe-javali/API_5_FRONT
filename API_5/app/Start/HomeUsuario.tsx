import React, { useState, useEffect } from "react";
import { View, Text, FlatList, StyleSheet, ActivityIndicator, TouchableOpacity, Alert } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";
import { apiCall } from "../../config/api";
import { Ionicons } from "@expo/vector-icons";
import { makeAuthenticatedRequest } from "../../config/tokenService";

// Defina a interface com tipos explícitos para garantir consistência
interface Chatbot {
  id: number;
  nome: string;
  descricao: string;
  tipo: string;
}

interface Usuario {
  id: number;
  nome: string;
  email: string;
  admin: boolean;
  permissoes: number[];
}

const MeusChatbots = () => {
  const [chatbots, setChatbots] = useState<Chatbot[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  // Função de logout
  const handleLogout = async () => {
    // Limpa armazenamento (tokens, userId etc.)
    await AsyncStorage.multiRemove([
      "access_token",
      "refresh_token",
      "userId",
      "isAdmin",
      "currentChatbotId",
      "currentChatbotName",
    ]);
    // Redireciona para login
    router.replace("/Start/login");
  };

  // Header customizado
  const renderHeader = () => (
    <View style={styles.header}>
      <TouchableOpacity style={styles.headerIconPlaceholder} disabled>
        <Ionicons name="chatbubbles-outline" size={24} color="#444" />
      </TouchableOpacity>

      <Text style={styles.headerTitle}>Meus Chatbots</Text>

      <TouchableOpacity onPress={handleLogout} style={styles.logoutButton}>
        <Ionicons name="log-out-outline" size={24} color="#fff" />
      </TouchableOpacity>
    </View>
  );

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
              await AsyncStorage.setItem('userId', userId);
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

  // Resto do código permanece igual...
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

  if (loading) {
    return (
      <View style={styles.container}>
        {renderHeader()}
        <ActivityIndicator size="large" color="#fff" />
      </View>
    );
  }

  if (chatbots.length === 0) {
    return (
      <View style={styles.container}>
        {renderHeader()}
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>Você ainda não possui nenhum chatbot. Peça para algum administrador liberar um chat para você utilizar!</Text>
          {/* <TouchableOpacity style={styles.button} onPress={() => router.push("/Chat")}>
            <Text style={styles.buttonText}>Criar Chatbot</Text>
          </TouchableOpacity>         */}
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {renderHeader()}

      <FlatList
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
                { backgroundColor: item.tipo === 'rh' ? '#007BFF' : '#FF9500' }
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
                <Ionicons name="chatbubble-outline" size={18} color="#fff" />
                <Text style={styles.chatActionText}>Conversar</Text>
              </TouchableOpacity>
            </View>
          </TouchableOpacity>
        )}
      />
      {/* <TouchableOpacity 
        style={styles.fab}
        onPress={() => router.push("/CadastroBot/cadastrarBot")}
      >
        <Ionicons name="add" size={24} color="#fff" />
      </TouchableOpacity> */}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#282828",
    paddingHorizontal: 20      // mantém o padding para o conteúdo
  },
  content: {
    flex: 1,
    padding: 20
  },
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

  chatbotCard: {
    backgroundColor: "#444",
    padding: 15,
    borderRadius: 5,
    marginBottom: 10,
  },
  chatbotHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  chatbotName: {
    fontSize: 20,
    color: "#fff",
    fontWeight: "bold",
  },
  chatbotBadge: {
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: 5,
  },
  chatbotBadgeText: {
    color: "#fff",
    fontSize: 14,
  },
  chatbotDescription: {
    fontSize: 16,
    color: "#ccc",
    marginTop: 5,
  },
  chatActions: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 10,
  },
  chatActionText: {
    color: "#fff",
    marginLeft: 5,
    fontSize: 14,
  },
  fab: {
    position: "absolute",
    bottom: 20,
    right: 20,
    backgroundColor: "#007BFF",
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: "center",
    alignItems: "center",
    elevation: 5,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },

  button: {
    backgroundColor: "#007BFF",
    padding: 10,
    borderRadius: 5,
    marginTop: 20,
    alignItems: "center",
    minWidth: 150,
  },
  buttonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
  chatAction: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#007BFF",
    padding: 8,
    borderRadius: 5,
    marginTop: 10,
    alignSelf: "flex-start",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "#1e1e1e",
    paddingVertical: 15,
    paddingHorizontal: 20,
    marginHorizontal: -20,
    marginBottom: 10,
    marginTop: 0
  },
  headerTitle: {
    flex: 1,
    color: "#fff",
    fontSize: 20,
    fontWeight: "bold",
    textAlign: "center",
  },
  logoutButton: {
    padding: 8,
  },
  headerIconPlaceholder: {
    width: 32,
    height: 32,
    justifyContent: "center",
    alignItems: "center",
  }
});

export default MeusChatbots;