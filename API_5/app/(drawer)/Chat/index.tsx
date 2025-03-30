import React, { useState, useCallback, useEffect } from "react";
import { View, SafeAreaView, StyleSheet, Text } from "react-native";
import { GiftedChat, IMessage } from "react-native-gifted-chat";
import { Ionicons } from "@expo/vector-icons";
import { apiCall } from "../../../config/api"

const Chat = () => {
  const [messages, setMessages] = useState<IMessage[]>([]);
  // const [chatId, setChatId] = useState<number | null>(null);
  var chatId = 1;

  const fetchMessages = async (usuarioId: number, agenteId: number) => {
    try {
      const response = await apiCall('/chat/visualizar', {
        method: 'POST',
        body: JSON.stringify({ Usuario_id: usuarioId, Agente_id: agenteId }),
      });
      const data = await response.json();
      if (data.mensagens) {
        const formattedMessages = data.mensagens.map((msg: any) => ({
          _id: msg.id,
          text: msg.texto,
          // createdAt: new Date(msg.created_at),
          user: {
            _id: msg.usuario ? 1 : 2, // 1 para usuário, 2 para agente
            name: msg.usuario ? "Usuário" : "Agente",
          },
        }));
        setMessages(formattedMessages);
      }

    } catch (error) {
      console.error("Erro ao buscar mensagens: ", error);
    }
  };

 const onSend = useCallback(async (newMessages: IMessage[] = []) => {
    const message = newMessages[0];
    setMessages((previousMessages) => GiftedChat.append(previousMessages, newMessages));

    // Enviar mensagem do usuário
    try {
      const response = await apiCall('/api/chat/enviar-mensagem', {
        method: 'POST',
        body: JSON.stringify({
          texto: message.text,
          Chat_id: chatId,
          usuario: true
        }),
      });

      const data = await response.json();
      // Espaço para fetch com o retorno da IA fetchIAResponse()
      
    } catch (error) {
      console.error("Erro ao enviar mensagem:", error);
    }
  }, [chatId]);
  
  useEffect(() => {
    const usuarioId = 47;
    const agenteId = 1; 
    fetchMessages(usuarioId, agenteId);
  }, []);


  return (
    <SafeAreaView style={styles.container}>
      <GiftedChat
        messages={messages}
        onSend={(messages) => onSend(messages)}
        user={{ _id: 1, name: "Usuário" }}
        placeholder="Mensagem para (nome do agente)"
        alwaysShowSend
        renderSend={(props) => (
          <View style={styles.sendContainer}>
            <Ionicons name="send" size={24} color="white" onPress={() => props.onSend?.({ text: props.text }, true)} />
          </View>
        )}
        renderBubble={(props) => {
          return (
            <View
              style={[
                styles.bubble,
                props.currentMessage?.user._id === 1 ? styles.bubbleRight : styles.bubbleLeft,
              ]}
            >
              <Text>{props.currentMessage?.text}</Text>
            </View>
          );
        }}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#1e1e1e" },
  sendContainer: { padding: 8, backgroundColor: "#222", borderRadius: 50, marginRight: 10 },
  bubble: { padding: 10, borderRadius: 8, maxWidth: "75%" },
  bubbleRight: { backgroundColor: "#fff", alignSelf: "flex-end" },
  bubbleLeft: { backgroundColor: "#333", alignSelf: "flex-start" },
});

export default Chat;
