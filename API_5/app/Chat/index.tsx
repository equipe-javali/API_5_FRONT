import React, { useState, useEffect, useRef, useMemo } from 'react';
import { View, Text, SafeAreaView, TouchableOpacity, TextInput, FlatList, KeyboardAvoidingView, Platform, ActivityIndicator, SectionList } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { apiCall } from '../../config/api';
import { makeAuthenticatedRequest } from '../../config/tokenService';
import { BaseScreen, Loading } from '../../components';
import styles, { cores } from './style';

export default function Chat() {
  const params = useLocalSearchParams();
  const router = useRouter();
  // Parâmetros e estados
  const agenteId = params.agenteId ? Number(params.agenteId) : null;
  const chatbotName = params.chatbotName as string;
  const [chatId, setChatId] = useState<number | null>(null);
  const [messages, setMessages] = useState<{ id: string; text: string; sender: string; timestamp: Date }[]>([]);
  const [inputText, setInputText] = useState('');
  const [loading, setLoading] = useState(true);
  const [isProcessing, setIsProcessing] = useState(false); // Estado para controlar respostas em processamento
  const flatListRef = useRef<FlatList>(null);
  // Iniciar chat - sem alterações, já funciona para iniciar a conversa
  useEffect(() => {
    const startChat = async () => {
      if (!agenteId) return;

      // 1) tenta ler userId do AsyncStorage
      let userId = await AsyncStorage.getItem('userId');

      // 2) se não existir, busca no endpoint /api/usuario/current
      if (!userId) {
        const resp = await makeAuthenticatedRequest('/api/usuario/current');
        if (resp.ok) {
          const data = await resp.json();
          const newUserId = data.id.toString();
          await AsyncStorage.setItem('userId', newUserId);
          userId = newUserId;
        }
      }

      // 3) converte para number e chama o backend
      const usuarioId = userId ? Number(userId) : null;
      if (!usuarioId) {
        console.error('Não foi possível obter userId');
        setLoading(false);
        return;
      }

      try {
        const response = await apiCall("/api/chat/iniciar-conversa", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            agenteId,
            usuarioId
          }),
        });

        if (response.ok) {
          const data = await response.json();
          setChatId(data.chat_id);

          if (Array.isArray(data.messages) && data.messages.length > 0) {
            // formata o histórico vindo do back
            const history = data.messages.map((msg: any) => ({
              id: msg.id.toString(),
              text: msg.texto,
              sender: msg.usuario ? "user" : "bot",
              timestamp: new Date(msg.dataCriacao),
            }));
            setMessages(history);
          } else {
            // primeira conversa: mensagem de boas-vindas
            setMessages([{
              id: 'welcome',
              text: 'Olá! Como posso ajudar você hoje?',
              sender: 'bot',
              timestamp: new Date()
            }]);
          }
        } else {
          console.error("Falha ao iniciar conversa:", await response.text());
        }
      } catch (err) {
        console.error("Erro na inicialização:", err);
      } finally {
        setLoading(false);
      }
    };
    startChat();
  }, [agenteId]);
  // Enviar mensagem - modificado para processar respostas do Gemini
  const sendMessage = async () => {
    if (!inputText.trim() || !chatId || isProcessing) return;
    // Salva o texto antes de limpar o input
    const messageText = inputText;
    // Adiciona mensagem do usuário
    const newUserMessage = {
      id: Date.now().toString(),
      text: messageText,
      sender: 'user',
      timestamp: new Date()
    };
    setMessages(currentMessages => [...currentMessages, newUserMessage]);
    setInputText('');
    setIsProcessing(true); // Inicia processamento
    // Indicador visual temporário de processamento
    const processingId = `processing-${Date.now()}`;
    setMessages(msgs => [...msgs, {
      id: processingId,
      text: "Digitando...",
      sender: 'bot',
      timestamp: new Date()
    }]);
    try {
      const response = await apiCall("/api/chat/enviar-mensagem", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          texto: messageText,
          Chat_id: chatId,
          usuario: true,
        }),
      });
      // Remove o indicador de processamento
      setMessages(msgs => msgs.filter(m => m.id !== processingId));
      if (response.ok) {
        const data = await response.json();
        if (data.ai_message) {
          const botMessage = {
            id: (Date.now() + 1).toString(),
            text: data.ai_message.texto,
            sender: 'bot',
            timestamp: new Date()
          };
          setMessages(currentMessages => [...currentMessages, botMessage]);
        } else if (data.error) {
          // Feedback em caso de erro específico do backend
          handleErrorMessage(`Erro: ${data.error}`);
        }
      } else {
        // Feedback em caso de erro de resposta HTTP
        handleErrorMessage("Não foi possível obter resposta do servidor.");
      }
    } catch (error) {
      console.error("Erro ao enviar mensagem:", error);
      // Remove o indicador de processamento
      setMessages(msgs => msgs.filter(m => m.id !== processingId));
      handleErrorMessage("Erro de comunicação com o servidor.");
    } finally {
      setIsProcessing(false); // Finaliza processamento
    }
  };
  // Função para lidar com mensagens de erro
  const handleErrorMessage = (errorText: string) => {
    setMessages(currentMessages => [...currentMessages, {
      id: `error-${Date.now()}`,
      text: errorText,
      sender: 'bot',
      timestamp: new Date()
    }]);
  };
  // Renderizar item da mensagem - modificado para exibir estado de processamento
  const renderMessageItem = ({ item }: { item: { id: string; text: string; sender: string; timestamp: Date } }) => (
    <View style={[
      styles.messageBubble,
      item.sender === 'user' ? styles.userMessage : styles.botMessage
    ]}>
      <Text style={styles.dateLabel}>
        {new Date(item.timestamp).toLocaleDateString('pt-BR', {
          hour: '2-digit',
          minute: '2-digit'
        })}
      </Text>

      {item.text === "Processando..." ? (
        <Loading textLoading='Escrevendo'/>
      ) : (
        <Text style={styles.messageText}>{item.text}</Text>
      )}
    </View>
  );
  const renderHeader = () => (
    <View style={styles.header}>
      <TouchableOpacity
        style={styles.backButton}
        onPress={() => router.push('/Start/HomeUsuario')}
      >
        <Ionicons name="arrow-back" size={24} color={cores.cor9} />
      </TouchableOpacity>
      <Text style={styles.headerTitle}>{chatbotName || "Chat"}</Text>
      <View style={styles.placeholder} />
    </View>
  );
  // Agrupa as mensagens por dia
  const sections = useMemo(() => {
    const groups = messages.reduce((acc, msg) => {
      const day = msg.timestamp.toLocaleDateString('pt-BR', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
      });
      if (!acc[day]) acc[day] = []
      acc[day].push(msg)
      return acc
    }, {} as Record<string, typeof messages>)
    return Object
      .entries(groups)
      .map(([title, data]) => ({ title, data }))
      .sort((a, b) =>
        //datas mais antigas primeiro
        new Date(a.title.split('/').reverse().join('-')).getTime() -
        new Date(b.title.split('/').reverse().join('-')).getTime()
      )
  }, [messages])

  // render de cada seção (data)
  const renderSectionHeader = ({
    section: { title }
  }: { section: { title: string; data: any[] } }) => (
    <View style={styles.sectionHeaderContainer}>
      <Text style={styles.sectionHeader}>{title}</Text>
    </View>
  )

  return (
    <BaseScreen alternative header={renderHeader()}>
      {loading ? (
        <Loading textLoading="Conectando" />
      ) : (
        <KeyboardAvoidingView
          style={styles.chatContainer}
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
          keyboardVerticalOffset={80}
        >
          <SectionList
            sections={sections}
            keyExtractor={item => item.id}
            renderSectionHeader={renderSectionHeader}
            renderItem={renderMessageItem}
            contentContainerStyle={styles.messagesContainer}
            onContentSizeChange={() => flatListRef.current?.scrollToEnd()}
            onLayout={() => flatListRef.current?.scrollToEnd()}
          />
          <View style={styles.inputContainer}>
            <TextInput
              style={styles.input}
              value={inputText}
              onChangeText={setInputText}
              placeholder="Digite sua mensagem..."
              placeholderTextColor={cores.cor6}
              editable={!isProcessing}
            />
            <TouchableOpacity
              style={[
                styles.sendButton,
                (!inputText.trim() || !chatId || isProcessing) &&
                { backgroundColor: cores.cor5 }
              ]}
              onPress={sendMessage}
              disabled={!inputText.trim() || !chatId || isProcessing}
            >
              <Ionicons name="send" size={24} color={cores.cor9} />
            </TouchableOpacity>
          </View>
        </KeyboardAvoidingView>
      )}
    </BaseScreen>
  );
};