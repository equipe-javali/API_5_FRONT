import React, { useState, useCallback } from "react";
import { View, SafeAreaView, StyleSheet, Text } from "react-native";
import { GiftedChat, IMessage } from "react-native-gifted-chat";
import { Ionicons } from "@expo/vector-icons";

const ChatScreen = () => {
  const [messages, setMessages] = useState<IMessage[]>([]);

  const onSend = useCallback((newMessages: IMessage[] = []) => {
    setMessages((previousMessages) => GiftedChat.append(previousMessages, newMessages));
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <GiftedChat
        messages={messages}
        onSend={(messages) => onSend(messages)}
        user={{ _id: 1, name: "Usuário" }}
        placeholder="Mensagem para (nome)"
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
              <Text style={styles.text}>{props.currentMessage?.text}</Text>
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
  text: { color: "#fff" },
});

export default ChatScreen;
