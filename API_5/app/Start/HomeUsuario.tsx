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

const MeusChatbots = () => {
  const [chatbots, setChatbots] = useState<Chatbot[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

    useEffect(() => {
    const fetchChatbots = async () => {
      try {
        // Usar o makeAuthenticatedRequest em vez de apiCall direto
        const response = await makeAuthenticatedRequest("/api/chat/listar");
  
        if (response.ok) {
          const data = await response.json();
          
          // Verificar se data é um array
          if (Array.isArray(data)) {
            // Filtrar itens inválidos que não têm ID
            const validChatbots = data.filter(item => 
              item && typeof item === 'object' && item.id !== undefined && item.id !== null
            ) as Chatbot[];
            
            setChatbots(validChatbots);
          } else if (data && typeof data === 'object') {
            // Se for um objeto, talvez a lista esteja em uma propriedade específica
            const chatbotList = Array.isArray(data.results) ? data.results : 
                                Array.isArray(data.chatbots) ? data.chatbots : 
                                Array.isArray(data.data) ? data.data : [];
            
            const validChatbots = chatbotList.filter((item: Chatbot) => 
              item && typeof item === 'object' && item.id !== undefined && item.id !== null
            ) as Chatbot[];
            
            setChatbots(validChatbots);
          } else {
            console.error("Formato de dados inesperado:", data);
            setChatbots([]);
          }
        } else {
          console.error("Erro ao listar chatbots:", response.status, await response.text());
          setChatbots([]);
        }
      } catch (error) {
        console.error("Erro na conexão:", error);
        setChatbots([]);
      } finally {
        setLoading(false);
      }
    };
  
    fetchChatbots();
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

  if (loading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#fff" />
      </View>
    );
  }

  if (chatbots.length === 0) {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>Meus Chatbots</Text>
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>Você ainda não possui nenhum chatbot.</Text>  
          <TouchableOpacity style={styles.button} onPress={() => router.push("/Chat")}>
            <Text style={styles.buttonText}>Criar Chatbot</Text>
          </TouchableOpacity>        
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Meus Chatbots</Text>
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
                {backgroundColor: item.tipo === 'rh' ? '#007BFF' : '#FF9500'}
              ]}>
                <Text style={styles.chatbotBadgeText}>
                  {item.tipo === 'rh' ? 'RH' : 'Contabilidade'}
                </Text>
              </View>
            </View>
            <Text style={styles.chatbotDescription}>{item.descricao || "Sem descrição"}</Text>
            <View style={styles.chatActions}>
              <TouchableOpacity style={styles.chatAction}>
                <Ionicons name="chatbubble-outline" size={18} color="#fff" />
                <Text style={styles.chatActionText}>Conversar</Text>
              </TouchableOpacity>
            </View>
          </TouchableOpacity>
        )}
      />
      <TouchableOpacity 
        style={styles.fab}
        onPress={() => router.push("/CadastroBot/cadastrarBot")}
      >
        <Ionicons name="add" size={24} color="#fff" />
      </TouchableOpacity>
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
});

export default MeusChatbots;