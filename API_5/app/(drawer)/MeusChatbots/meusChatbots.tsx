import React, { useState, useEffect } from "react";
import { View, Text, FlatList, TouchableOpacity, StyleSheet, ActivityIndicator } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { apiCall } from "../../../config/api";
import { useRouter } from "expo-router";

const MeusChatbots = () => {
  const [chatbots, setChatbots] = useState([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const fetchChatbots = async () => {
      try {
        // Fetch model data with full agent details
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

  const ChatbotItem = ({ item }: { item: any }) => {
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
            {/* Dedicated "Chat" button that navigates to Chat screen */}
            <TouchableOpacity
              style={styles.chatButton}
              onPress={() => {
                // Add debugging to see the entire item object
                console.log("Chatbot item:", JSON.stringify(item, null, 2));
                
                // Get the correct agent ID, using multiple fallbacks
                const agentId = item.Agente_id_id || item.agent_id || item.agente_id;
                
                console.log("Navigating with params:", {
                  agenteId: agentId,
                  chatbotName: item.Agente_nome
                });
                
                if (!agentId) {
                  console.error("No agent ID found in item:", item);
                  return;
                }
                
                // Navigate with the correct agent ID
                router.push({
                  pathname: "/(drawer)/Chat",
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
          </View>
        )}
      </TouchableOpacity>
    ); 
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Meus Chatbots</Text>
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
  emptyText: { color: "#fff", textAlign: "center", marginTop: 20 },
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
});

export default MeusChatbots;