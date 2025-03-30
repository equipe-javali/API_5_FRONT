import React, { useEffect, useState, useCallback } from "react";
import { SafeAreaView, Text, StyleSheet, View } from "react-native";
import { GiftedChat, IMessage, InputToolbar } from "react-native-gifted-chat";
import { useLocalSearchParams } from "expo-router";
import { apiCall } from "../../../config/api";

const Chat = () => {
  const params = useLocalSearchParams();
  // Log everything to debug
  console.log("Received search params:", JSON.stringify(params));
  
  // Extract and convert params properly
  const agenteId = params.agenteId ? Number(params.agenteId) : null;
  const chatbotName = params.chatbotName as string;
  
  // Then use these values in your component
  const [messages, setMessages] = useState<IMessage[]>([]);
  const [chatId, setChatId] = useState<number | null>(null);

  useEffect(() => {
    const iniciarChat = async () => {
      if (!chatId && agenteId) {  // Add agenteId check
        console.log("Initiating chat with agent ID:", agenteId);
        try {
          const response = await apiCall("/api/chat/iniciar-conversa", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ 
              agenteId: agenteId,
              usuarioId: 1 
            }),
          });
          if (response.ok) {
            const data = await response.json();
            setChatId(data.chat_id);
          } else {
            console.error("Erro ao iniciar conversa:", await response.text());
          }
        } catch (error) {
          console.error("Erro na conexão ao iniciar conversa:", error);
        }
      }
    };
    iniciarChat();
  }, [chatId, agenteId]);

  const onSend = useCallback(async (newMessages: IMessage[] = []) => {
    // Skip if no chatId is available
    if (!chatId) {
      console.error("Não é possível enviar mensagem: Chat não iniciado.");
      return;
    }
    
    const message = newMessages[0];
    setMessages((previousMessages) =>
      GiftedChat.append(previousMessages, newMessages)
    );

    try {
      const response = await apiCall("/api/chat/enviar-mensagem", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          texto: message.text,
          Chat_id: chatId,
          usuario: true,
        }),
      });
      const data = await response.json();
      
      // Handle the AI response - add it to messages
      if (data.ai_message) {
        const botMessage: IMessage = {
          _id: Math.random().toString(),
          text: data.ai_message.texto,
          createdAt: new Date(),
          user: {
            _id: 2,
            name: chatbotName || "Chatbot",
          }
        };
        
        setMessages(previousMessages => 
          GiftedChat.append(previousMessages, [botMessage])
        );
      }
    } catch (error) {
      console.error("Erro ao enviar mensagem:", error);
    }
  }, [chatId, chatbotName]);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.headerContainer}>
        <Text style={styles.headerText}>
          {chatbotName
            ? `${chatbotName} está online. O que deseja saber?`
            : "Chatbot está online. O que deseja saber?"}
        </Text>
        {!chatId && <Text style={styles.connectingText}>Conectando...</Text>}
      </View>
      <GiftedChat
        messages={messages}
        onSend={(messages) => onSend(messages)}
        user={{ _id: 1, name: "Usuário" }}
        placeholder="Digite sua pergunta..."
        alwaysShowSend
        renderInputToolbar={(props) => 
          chatId ? <InputToolbar {...props} /> : null
        }
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#282828" },
  headerContainer: {
    padding: 10,
    backgroundColor: "#444",
    alignItems: "center",
  },
  headerText: { fontSize: 18, color: "#fff", fontWeight: "bold" },
  connectingText: { fontSize: 14, color: "#aaa", marginTop: 5 },
});

export default Chat;