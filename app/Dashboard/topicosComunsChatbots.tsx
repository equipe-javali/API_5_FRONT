import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, ActivityIndicator, TouchableOpacity, Platform, ScrollView } from "react-native";
import { Picker } from "@react-native-picker/picker";
import { makeAuthenticatedRequest } from "../../config/tokenService";
import DateTimePicker from "@react-native-community/datetimepicker";
import { Ionicons } from "@expo/vector-icons";

export default function TopicosComunsChatbot() {
  const [agentes, setAgentes] = useState([]);
  const [agenteSelecionado, setAgenteSelecionado] = useState<string | null>(null);
  const [inicio, setInicio] = useState<Date | null>(null);
  const [fim, setFim] = useState<Date | null>(null);
  const [showInicio, setShowInicio] = useState(false);
  const [showFim, setShowFim] = useState(false);
  const [loading, setLoading] = useState(false);
  const [topicos, setTopicos] = useState<any>({});
  const [mensagemErro, setMensagemErro] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      const resp = await makeAuthenticatedRequest("/api/agente/listar-todos");
      if (resp.ok) {
        const data = await resp.json();
        setAgentes(data);
      }
    })();
  }, []);

  const buscarTopicos = async () => {
    setMensagemErro(null);

    if (!agenteSelecionado) {
      setTopicos({});
      setMensagemErro("Por favor, selecione um chatbot.");
      return;
    }

    if (!inicio || !fim) {
      setTopicos({});
      setMensagemErro("Por favor, selecione um período.");
      return;
    }

    setLoading(true);
    try {
      let url = `/api/dashboard/topico_mais_comum_por_agente/?`;
      url += `agente_id=${agenteSelecionado}&`;
      if (inicio) url += `inicio=${inicio.toISOString().slice(0, 10)}&`;
      if (fim) url += `fim=${fim.toISOString().slice(0, 10)}`;
      // Removido o parâmetro usuario_id pois não vamos filtrar por usuário

      const resp = await makeAuthenticatedRequest(url);
      
      if (resp.ok) {
        const data = await resp.json();
        console.log("Dados de tópicos recebidos:", data);
        
        if (data.agentes && data.agentes[agenteSelecionado]) {
          const dadosAgente = data.agentes[agenteSelecionado];
          
          // Simplificamos o tratamento dos dados - não processamos informações de usuário
          setTopicos(dadosAgente);
        } else {
          setTopicos({});
          setMensagemErro("Não foram encontrados tópicos para este chatbot no período selecionado.");
        }
      } else {
        console.error("Erro ao buscar tópicos, status:", resp.status);
        setTopicos({});
        setMensagemErro("Erro ao buscar dados do servidor.");
      }
    } catch (error) {
      console.error("Erro ao buscar tópicos:", error);
      setMensagemErro("Ocorreu um erro ao buscar os tópicos.");
      setTopicos({});
    } finally {
      setLoading(false);
    }
  };

  // DatePicker padrão
  const renderDatePicker = (type: "inicio" | "fim") => {
    const value = type === "inicio" ? inicio : fim;
    const setValue = type === "inicio" ? setInicio : setFim;
    const show = type === "inicio" ? showInicio : showFim;
    const setShow = type === "inicio" ? setShowInicio : setShowFim;
    const label = type === "inicio" ? "Início" : "Fim";
    if (Platform.OS === "web") {
      return (
        <input
          type="date"
          value={value ? value.toISOString().slice(0, 10) : ""}
          onChange={e => {
            const date = e.target.value ? new Date(e.target.value) : null;
            setValue(date);
          }}
          style={{
            backgroundColor: "#222",
            color: "#fff",
            border: "none",
            borderRadius: 5,
            padding: 8,
            fontSize: 16,
            width: 120,
          }}
        />
      );
    } else {
      return (
        <>
          <TouchableOpacity
            style={styles.dateInput}
            onPress={() => setShow(true)}
          >
            <Ionicons name="calendar-outline" size={18} color="#B8B8B8" style={{ marginRight: 6 }} />
            <Text style={styles.dateInputText}>
              {value ? value.toLocaleDateString("pt-BR") : label}
            </Text>
          </TouchableOpacity>
          {show && (
            <DateTimePicker
              value={value || new Date()}
              mode="date"
              display="default"
              onChange={(_event, date) => {
                setShow(false);
                if (date) setValue(date);
              }}
            />
          )}
        </>
      );
    }
  };

  // Renderizar os tópicos encontrados - simplificado sem a parte de usuários
  const renderizarTopicos = () => {
    // Se não houver topicos ou estiver vazio
    if (!topicos || Object.keys(topicos).length === 0) {
      return <Text style={styles.emptyText}>Não foram encontrados tópicos para este chatbot.</Text>;
    }

    // Se ainda tem a estrutura de usuários no objeto retornado (dependendo da sua API)
    if (topicos.usuarios) {
      // Agrupar todos os tópicos de todos os usuários em uma lista única
      let todosTopicos: string[] = [];
      Object.values(topicos.usuarios).forEach((topicosUsuario: any) => {
        if (Array.isArray(topicosUsuario)) {
          todosTopicos = todosTopicos.concat(topicosUsuario);
        }
      });

      if (todosTopicos.length === 0) {
        return <Text style={styles.emptyText}>Não foram encontrados tópicos para este chatbot.</Text>;
      }

      // Remover duplicatas
      todosTopicos = [...new Set(todosTopicos)];
      
      return (
        <>
          {todosTopicos.map((topico, idx) => (
            <View key={idx} style={styles.topicoItem}>
              <Text style={styles.topicoTexto}>{String(topico)}</Text>
            </View>
          ))}
        </>
      );
    }
    
    // Para o caso em que a API retorna uma lista simples de tópicos
    const todosTopicos = Array.isArray(topicos) ? topicos : Object.values(topicos).flat();
    
    if (todosTopicos.length === 0) {
      return <Text style={styles.emptyText}>Não foram encontrados tópicos.</Text>;
    }

    return (
      <>
        {todosTopicos.map((topico, idx) => (
          <View key={idx} style={styles.topicoItem}>
            <Text style={styles.topicoTexto}>{String(topico)}</Text>
          </View>
        ))}
      </>
    );
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Tópicos Mais Comuns por Chatbot</Text>
      <View style={styles.filtros}>
        <Text style={styles.label}>Agente</Text>
        <View style={styles.pickerContainer}>
          <Picker
            selectedValue={agenteSelecionado}
            style={styles.picker}
            dropdownIconColor="#fff"
            onValueChange={setAgenteSelecionado}
          >
            <Picker.Item label="Selecione um chatbot" value={null} />
            {agentes.map((agente: any) => (
              <Picker.Item key={agente.id} label={agente.nome} value={agente.id.toString()} />
            ))}
          </Picker>
        </View>

        <Text style={styles.label}>Período</Text>
        <View style={styles.dateRow}>
          {renderDatePicker("inicio")}
          <Text style={styles.dateSeparator}>até</Text>
          {renderDatePicker("fim")}
        </View>

        <TouchableOpacity style={styles.button} onPress={buscarTopicos} disabled={loading}>
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <>
              <Ionicons name="search" size={18} color="#fff" style={{ marginRight: 6 }} />
              <Text style={styles.buttonText}>Buscar Tópicos</Text>
            </>
          )}
        </TouchableOpacity>
      </View>

      <View style={styles.topicosContainer}>
        <Text style={styles.subTitle}>Tópicos mais frequentes</Text>

        {loading ? (
          <ActivityIndicator size="large" color="#007bff" style={styles.loading} />
        ) : mensagemErro ? (
          <Text style={styles.emptyText}>{mensagemErro}</Text>
        ) : renderizarTopicos()}
      </View>
    </ScrollView>
  );
}

// Estilos permanecem os mesmos
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#282828", padding: 20 },
  title: { fontSize: 24, color: "#fff", marginBottom: 20, fontWeight: "bold", alignSelf: "center" },
  subTitle: { fontSize: 18, color: "#fff", marginBottom: 12, fontWeight: "bold" },
  filtros: { marginBottom: 20, backgroundColor: "#212121", borderRadius: 10, padding: 16 },
  label: { color: "#fff", fontSize: 16, fontWeight: "bold", marginBottom: 6, marginTop: 10 },
  pickerContainer: {
    backgroundColor: "#333",
    borderRadius: 5,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: "#444",
    overflow: "hidden",
  },
  picker: {
    color: "#fff",
    backgroundColor: "#333",
    width: "100%",
    height: 44,
  },
  dateRow: { flexDirection: "row", alignItems: "center", marginBottom: 10},
  dateInput: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#444",
    borderRadius: 6.5,
    paddingHorizontal: 3,
    paddingVertical: 2,
    minWidth: 120,
    borderWidth: 1,
    borderColor: "#444"
  },
  dateInputText: { color: "#fff", fontSize: 16 },
  dateSeparator: { color: "#fff", marginHorizontal: 8, fontSize: 16 },
  button: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#444",
    padding: 12,
    borderRadius: 5,
    marginTop: 10,
    justifyContent: "center",
  },
  buttonText: { color: "#fff", fontSize: 16, fontWeight: "bold" },
  topicosContainer: {
    backgroundColor: "#212121",
    borderRadius: 10,
    padding: 16,
  },
  topicoItem: {
    backgroundColor: "#333",
    padding: 12,
    borderRadius: 8,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: "#444",
  },
  topicoTexto: {
    color: "#fff",
    fontSize: 15,
  },
  emptyText: { color: "#ccc", fontSize: 16, textAlign: "center", marginTop: 20, marginBottom: 20 },
  loading: {
    marginVertical: 30,
  },
});