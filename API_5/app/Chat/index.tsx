import React, { useEffect, useState, useCallback } from "react";
import { SafeAreaView, Text, StyleSheet, View, TouchableOpacity } from "react-native";
import { GiftedChat, IMessage, InputToolbar } from "react-native-gifted-chat";
import { useLocalSearchParams, useRouter } from "expo-router";
import { apiCall } from "../../config/api"
import { Ionicons } from "@expo/vector-icons";

const Chat = () => {
  const params = useLocalSearchParams();
  const router = useRouter();
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
        <TouchableOpacity onPress={() => router.push('/MeusChatbots/meusChatbots')} style={styles.button}>
          <Ionicons name="arrow-back" size={24} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerText}>
          {chatbotName
            ? `${chatbotName} está online. O que deseja saber?`
            : "Chatbot está online. O que deseja saber?"}
        </Text>
      </View>
      
      {!chatId && <Text style={styles.connectingText}>Conectando...</Text>}

      <GiftedChat
        messages={messages}
        onSend={(messages) => onSend(messages)}
        user={{ _id: 1, name: "Usuário" }}
        placeholder="Digite sua pergunta..."
        alwaysShowSend
        renderInputToolbar={(props) =>
          chatId ? <InputToolbar {...props} /> : null
        }
        renderMessage={(props) => (
          <View style={{ marginVertical: 6 }}>
          <View style={{ 
            backgroundColor: props.currentMessage?.user._id === 1 ? '#282828' : '#212121', // Cor do balão
            borderColor: props.currentMessage?.user._id === 1 ? '#B8B8B8' : '', // Cor da borda
            borderWidth: 1,
            borderRadius: 10,
            padding: 8, // Diminui o padding
            maxWidth: '80%', // Define a largura máxima para não ficar muito grande
            alignSelf: props.currentMessage?.user._id === 1 ? 'flex-end' : 'flex-start', // Alinha à direita para o usuário, à esquerda para o bot
            marginHorizontal: 10, // Espaçamento lateral para não encostar nas bordas
          }}>
        <Text style={{ color: '#F5F5F5' }}>{props.currentMessage?.text}</Text>
      </View>
    </View>
  )}
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
    flexDirection: "row",
  },
  headerText: { fontSize: 18, color: "#fff", fontWeight: "bold", flex: 1, textAlign: "center" },
  connectingText: { fontSize: 14, color: "#aaa", marginTop: 5 },
  button: {
    padding: 10,
    marginRight: 10,
  },
});

export default Chat;