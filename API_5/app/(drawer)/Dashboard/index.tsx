import React, { useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import DesempenhoChatbot from "../../Dashboard/desempenhoChatbot";
import MediaMensagemChatbot from "../../Dashboard/mediaMensagemChatbot";
import TopicosComunsChatbot from "../../Dashboard/topicosComunsChatbots";

// Definições das métricas
const metricas = [
  {
    id: "tempo",
    nome: "Tempo de Resposta",
    descricao: "Analise o tempo médio que os chatbots levam para responder às mensagens dos usuários. Identifique quais chatbots são mais eficientes e rápidos nas respostas.",
    icone: "time-outline"
  },
  {
    id: "media",
    nome: "Média de Mensagens",
    descricao: "Visualize a média de mensagens trocadas por conversa para cada chatbot. Identifique padrões de uso e quais chatbots estão gerando maior engajamento.",
    icone: "chatbubbles-outline"
  },
  {
    id: "topicos",
    nome: "Tópicos Comuns",
    descricao: "Descubra quais são os tópicos mais frequentemente discutidos em cada chatbot. Identifique as principais dúvidas e interesses dos usuários.",
    icone: "list-outline"
  }
];

export default function Dashboard() {
  const [metricaSelecionada, setMetricaSelecionada] = useState<string | null>(null);

  // Renderiza o seletor de métricas
  const renderSeletorMetricas = () => (
    <View style={styles.metricsSelector}>
      <Text style={styles.instrucao}>Selecione uma métrica para analisar:</Text>
      
      {metricas.map(metrica => (
        <TouchableOpacity
          key={metrica.id}
          style={styles.metricaCard}
          onPress={() => setMetricaSelecionada(metrica.id)}
        >
          <View style={styles.metricaHeader}>
            <Ionicons name={metrica.icone as any} size={24} color="#fff" style={styles.metricaIcone} />
            <Text style={styles.metricaTitulo}>{metrica.nome}</Text>
          </View>
          <Text style={styles.metricaDescricao}>{metrica.descricao}</Text>
          <View style={styles.metricaFooter}>
            <Text style={styles.metricaVer}>Analisar dados</Text>
            <Ionicons name="chevron-forward" size={20} color="#7986CB" />
          </View>
        </TouchableOpacity>
      ))}
    </View>
  );

  // Renderiza o componente da métrica selecionada
  const renderMetricaAtiva = () => {
    switch (metricaSelecionada) {
      case "tempo":
        return (
          <View style={styles.metricaContainer}>
            <DesempenhoChatbot />
            <TouchableOpacity 
              style={styles.botaoVoltar}
              onPress={() => setMetricaSelecionada(null)}
            >
              <Ionicons name="arrow-back" size={20} color="#fff" />
              <Text style={styles.botaoVoltarTexto}>Voltar ao menu</Text>
            </TouchableOpacity>
          </View>
        );
      case "media":
        return (
          <View style={styles.metricaContainer}>
            
            <MediaMensagemChatbot />
            <TouchableOpacity 
              style={styles.botaoVoltar}
              onPress={() => setMetricaSelecionada(null)}
            >
              <Ionicons name="arrow-back" size={20} color="#fff" />
              <Text style={styles.botaoVoltarTexto}>Voltar ao menu</Text>
            </TouchableOpacity>
          </View>
        );
      case "topicos":
        return (
          <View style={styles.metricaContainer}>
            <TopicosComunsChatbot />
            <TouchableOpacity 
              style={styles.botaoVoltar}
              onPress={() => setMetricaSelecionada(null)}
            >
              <Ionicons name="arrow-back" size={20} color="#fff" />
              <Text style={styles.botaoVoltarTexto}>Voltar ao menu</Text>
            </TouchableOpacity>
          </View>
        );
      default:
        return renderSeletorMetricas();
    }
  };

  return (
    <View style={styles.container}>     
      {renderMetricaAtiva()}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#222",
  },
  title: {
    fontSize: 26,
    color: "#fff",
    fontWeight: "bold",
    textAlign: "center",
    marginVertical: 16,
  },
  metricsSelector: {
    flex: 1,
    padding: 16,
  },
  instrucao: {
    fontSize: 18,
    color: "#ccc",
    marginBottom: 20,
    textAlign: "center",
  },
  metricaCard: {
    backgroundColor: "#333",
    borderRadius: 12,
    padding: 18,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: "#444",
  },
  metricaHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  metricaIcone: {
    marginRight: 10,
  },
  metricaTitulo: {
    fontSize: 18,
    color: "#fff",
    fontWeight: "bold",
  },
  metricaDescricao: {
    color: "#B8B8B8",
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 16,
  },
  metricaFooter: {
    flexDirection: "row",
    justifyContent: "flex-end",
    alignItems: "center",
  },
  metricaVer: {
    color: "#7986CB",
    fontSize: 14,
    fontWeight: "bold",
    marginRight: 4,
  },
  metricaContainer: {
    flex: 1,
  },
  botaoVoltar: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 10,
  },
  botaoVoltarTexto: {
    color: "#fff",
    marginLeft: 8,
    fontSize: 16,
  },
});