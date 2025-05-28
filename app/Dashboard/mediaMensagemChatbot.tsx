import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  TouchableOpacity,
  Platform,
  ScrollView,
  Dimensions,
} from "react-native";
import { Picker } from "@react-native-picker/picker";
import { makeAuthenticatedRequest } from "../../config/tokenService";
import DateTimePicker from "@react-native-community/datetimepicker";
import { Ionicons } from "@expo/vector-icons";
import SimpleBarChart from "./simpleBarChart";

export default function MediaMensagemChatbot() {
  const [agentes, setAgentes] = useState<
    { id: number | string; nome: string }[]
  >([]);
  const [agenteSelecionado, setAgenteSelecionado] = useState<string | null>(
    null
  );
  const [inicio, setInicio] = useState<Date | null>(null);
  const [fim, setFim] = useState<Date | null>(null);
  const [showInicio, setShowInicio] = useState(false);
  const [showFim, setShowFim] = useState(false);
  const [loading, setLoading] = useState(false);
  const [metricas, setMetricas] = useState<any[]>([]);
  const [mensagemErro, setMensagemErro] = useState<string | null>(null);

  // Para comparação
  const [agentesSelecionados, setAgentesSelecionados] = useState<string[]>([]);
  const [compararInicio, setCompararInicio] = useState<Date | null>(null);
  const [compararFim, setCompararFim] = useState<Date | null>(null);
  const [showCompararInicio, setShowCompararInicio] = useState(false);
  const [showCompararFim, setShowCompararFim] = useState(false);
  const [metricasComparacao, setMetricasComparacao] = useState<any[]>([]);
  const [loadingComparar, setLoadingComparar] = useState(false);
  const [mensagemErroComparacao, setMensagemErroComparacao] = useState<
    string | null
  >(null);

  useEffect(() => {
    (async () => {
      const resp = await makeAuthenticatedRequest("/api/agente/listar-todos");
      if (resp.ok) {
        const data = await resp.json();
        setAgentes(data);
      }
    })();
  }, []);

  const buscarMetricas = async () => {
    setMensagemErro(null);

    if (!inicio || !fim) {
      setMetricas([]);
      setMensagemErro("Por favor, selecione um período.");
      return;
    }

    if (!agenteSelecionado) {
      setMetricas([]);
      setMensagemErro("Por favor, selecione um chatbot para buscar os dados.");
      return;
    }

    setLoading(true);

    try {
      let url = `/api/dashboard/media_mensagens_por_agente/?`;
      url += `agente_id=${agenteSelecionado}&`;
      if (inicio) url += `inicio=${inicio.toISOString().slice(0, 10)}&`;
      if (fim) url += `fim=${fim.toISOString().slice(0, 10)}`;

      console.log("Buscando dados de:", url);

      // Tenta buscar os dados normalmente
      const resp = await makeAuthenticatedRequest(url);

      if (resp.ok) {
        const data = await resp.json();
        processarDadosRecebidos(data);
      } else if (resp.status === 500) {
        console.log(
          "Erro 500 detectado, possivelmente divisão por zero. Retornando dados vazios."
        );

        const dadoSimulado = {
          agentes: {
            [agenteSelecionado]: {
              media_de_mensagens_por_usuario: 0,
            },
          },
        };

        processarDadosRecebidos(dadoSimulado);
        setMensagemErro(
          "Não há mensagens para este chatbot no período selecionado."
        );
      } else {
        console.error("Erro na requisição:", resp.status);
        setMetricas([]);
        setMensagemErro(`Erro ao buscar dados do servidor (${resp.status}).`);
      }
    } catch (error) {
      console.error("Exceção ao buscar métricas:", error);
      setMetricas([]);
      setMensagemErro("Erro de conexão ao buscar dados.");
    } finally {
      setLoading(false);
    }
  };

  // Função auxiliar para processar os dados recebidos
  const processarDadosRecebidos = (data: any) => {
    if (
      agenteSelecionado !== null &&
      data &&
      data.agentes &&
      data.agentes[agenteSelecionado]
    ) {
      const agenteDados = data.agentes[agenteSelecionado];
      const metricaFormatada = {
        agente_id: agenteSelecionado,
        agente_nome:
          agentes.find((a: any) => a.id.toString() === agenteSelecionado)
            ?.nome || "Chatbot",
        media_mensagens: agenteDados.media_de_mensagens_por_usuario,
      };

      setMetricas([metricaFormatada]);

      // Feedback se a média for zero
      if (metricaFormatada.media_mensagens === 0) {
        setMensagemErro(
          "Não há mensagens para este chatbot no período selecionado."
        );
      }
    } else {
      setMetricas([]);
      setMensagemErro(
        "Não foram encontrados dados para este chatbot no período selecionado."
      );
    }
  };

  // Multi-select de agentes para comparação
  const renderAgentesMultiSelect = () => (
    <View style={styles.multiSelectContainer}>
      {agentes.map((agente: any) => (
        <TouchableOpacity
          key={agente.id}
          style={[
            styles.multiSelectItem,
            agentesSelecionados.includes(agente.id.toString()) &&
              styles.multiSelectItemSelected,
          ]}
          onPress={() => {
            setAgentesSelecionados((prev) =>
              prev.includes(agente.id.toString())
                ? prev.filter((id) => id !== agente.id.toString())
                : [...prev, agente.id.toString()]
            );
          }}
        >
          <Ionicons
            name={
              agentesSelecionados.includes(agente.id.toString())
                ? "checkbox"
                : "square-outline"
            }
            size={18}
            color="#fff"
            style={{ marginRight: 6 }}
          />
          <Text style={{ color: "#fff" }}>{agente.nome}</Text>
        </TouchableOpacity>
      ))}
    </View>
  );

  // DatePicker para comparação
  const renderCompararDatePicker = (type: "inicio" | "fim") => {
    const value = type === "inicio" ? compararInicio : compararFim;
    const setValue = type === "inicio" ? setCompararInicio : setCompararFim;
    const show = type === "inicio" ? showCompararInicio : showCompararFim;
    const setShow =
      type === "inicio" ? setShowCompararInicio : setShowCompararFim;
    const label = type === "inicio" ? "Início" : "Fim";
    if (Platform.OS === "web") {
      return (
        <input
          type="date"
          value={value ? value.toISOString().slice(0, 10) : ""}
          onChange={(e) => {
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
            marginRight: 8,
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
            <Ionicons
              name="calendar-outline"
              size={18}
              color="#B8B8B8"
              style={{ marginRight: 6 }}
            />
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

  const buscarMetricasComparacao = async () => {
    setMensagemErroComparacao(null);
    // Exige pelo menos dois chatbots
    if (agentesSelecionados.length < 2) {
      setMetricasComparacao([]);
      setMensagemErroComparacao(
        "Por favor, selecione pelo menos dois chatbots para comparar."
      );
      return;
    }
    // Verifica se período foi selecionado
    if (!compararInicio || !compararFim) {
      setMetricasComparacao([]);
      setMensagemErroComparacao(
        "Por favor, selecione o período de comparação."
      );
      return;
    }

    setLoadingComparar(true);
    let url = `/api/dashboard/media_mensagens_por_agente/?`;

    try {
      // Buscar dados para cada agente selecionado
      const resultados = [];

      for (const agenteId of agentesSelecionados) {
        const urlAgente = `${url}agente_id=${agenteId}&inicio=${compararInicio
          .toISOString()
          .slice(0, 10)}&fim=${compararFim.toISOString().slice(0, 10)}`;
        const resp = await makeAuthenticatedRequest(urlAgente);

        if (resp.ok) {
          const data = await resp.json();
          if (data && data.agentes && data.agentes[agenteId]) {
            const agenteNome =
              agentes.find((a: any) => a.id.toString() === agenteId)?.nome ||
              `Chatbot ${agenteId}`;
            resultados.push({
              agente_id: agenteId,
              agente_nome: agenteNome,
              media_mensagens:
                data.agentes[agenteId].media_de_mensagens_por_usuario,
            });
          }
        }
      }

      setMetricasComparacao(resultados);
      if (resultados.length === 0) {
        setMensagemErroComparacao(
          "Não foram encontrados dados para os chatbots selecionados no período indicado."
        );
      }
    } catch (error) {
      console.error("Erro ao buscar comparação:", error);
      setMensagemErroComparacao(
        "Ocorreu um erro ao buscar os dados para comparação."
      );
    } finally {
      setLoadingComparar(false);
    }
  };

  // Dados para gráfico de comparação
  const chartDataComparacao = React.useMemo(() => {
    if (!metricasComparacao || metricasComparacao.length === 0) return null;
    const labels = metricasComparacao.map(
      (m: any) => m.agente_nome || `Chatbot ${m.agente_id}`
    );
    const data = metricasComparacao.map((m: any) => m.media_mensagens);
    return {
      labels,
      datasets: [{ data }],
    };
  }, [metricasComparacao]);

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
          onChange={(e) => {
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
            <Ionicons
              name="calendar-outline"
              size={18}
              color="#B8B8B8"
              style={{ marginRight: 6 }}
            />
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

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Média de Mensagens por Chatbot</Text>
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
              <Picker.Item
                key={agente.id}
                label={agente.nome}
                value={agente.id.toString()}
              />
            ))}
          </Picker>
        </View>
        <Text style={styles.label}>Período</Text>
        <View style={styles.dateRow}>
          {renderDatePicker("inicio")}
          <Text style={styles.dateSeparator}>até</Text>
          {renderDatePicker("fim")}
        </View>
        <TouchableOpacity
          style={styles.button}
          onPress={buscarMetricas}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <>
              <Ionicons
                name="search"
                size={18}
                color="#fff"
                style={{ marginRight: 6 }}
              />
              <Text style={styles.buttonText}>Buscar</Text>
            </>
          )}
        </TouchableOpacity>
      </View>
      <View style={styles.metricas}>
        {loading ? (
          <ActivityIndicator size="large" color="#007bff" />
        ) : mensagemErro ? (
          <Text style={styles.emptyText}>{mensagemErro}</Text>
        ) : metricas.length === 0 ? (
          <Text style={styles.emptyText}>
            Faça as seleções para buscar os dados.
          </Text>
        ) : (
          metricas.map((m, idx) => (
            <View key={idx} style={styles.metricItem}>
              <Text style={styles.metricDate}>
                {m.agente_nome || `Chatbot ${m.agente_id}`}
              </Text>
              <Text style={styles.metricLabel}>
                Média de mensagens por usuário:{" "}
                <Text style={styles.metricValue}>{m.media_mensagens}</Text>
              </Text>
            </View>
          ))
        )}
      </View>

      {/* Painel de comparação fixo */}
      <View style={styles.compararPanel}>
        <Text style={styles.label}>Comparação entre chatbots</Text>
        <Text style={styles.label}>Selecione os chatbots para comparar:</Text>
        {renderAgentesMultiSelect()}
        <Text style={styles.label}>Período de comparação:</Text>
        <View style={styles.dateRow}>
          {renderCompararDatePicker("inicio")}
          <Text style={styles.dateSeparator}>até</Text>
          {renderCompararDatePicker("fim")}
        </View>
        <TouchableOpacity
          style={styles.button}
          onPress={buscarMetricasComparacao}
          disabled={loadingComparar}
        >
          {loadingComparar ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <>
              <Ionicons
                name="analytics"
                size={18}
                color="#fff"
                style={{ marginRight: 6 }}
              />
              <Text style={styles.buttonText}>Comparar</Text>
            </>
          )}
        </TouchableOpacity>
      </View>

      <View style={styles.metricas}>
        {loadingComparar ? (
          <ActivityIndicator size="large" color="#007bff" />
        ) : mensagemErroComparacao ? (
          <Text style={styles.emptyText}>{mensagemErroComparacao}</Text>
        ) : metricasComparacao.length === 0 ? (
          <Text style={styles.emptyText}>
            Faça as seleções para comparar os chatbots.
          </Text>
        ) : null}
      </View>

      {/* Gráfico de comparação */}
      {chartDataComparacao && (
        <View style={{ marginTop: 24 }}>
          <Text style={styles.chartTitle}>
            Gráfico de Comparação de Média de Mensagens
          </Text>
          <SimpleBarChart
            data={chartDataComparacao}
            width={Dimensions.get("window").width - 40}
            height={220}
            yAxisSuffix="s"
          />
        </View>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#282828", padding: 20 },
  title: {
    fontSize: 24,
    color: "#fff",
    marginBottom: 20,
    fontWeight: "bold",
    alignSelf: "center",
  },
  filtros: {
    marginBottom: 20,
    backgroundColor: "#212121",
    borderRadius: 10,
    padding: 16,
  },
  label: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 6,
    marginTop: 10,
  },
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
    minHeight: 50,
  },
  dateRow: { flexDirection: "row", alignItems: "center", marginBottom: 10 },
  dateInput: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#444",
    borderRadius: 6.5,
    paddingHorizontal: 3,
    paddingVertical: 2,
    minWidth: 120,
    borderWidth: 1,
    borderColor: "#444",
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
  metricas: { marginTop: 20 },
  metricItem: {
    backgroundColor: "#333",
    padding: 16,
    borderRadius: 8,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: "#444",
  },
  metricDate: { color: "#fff", fontSize: 16, marginBottom: 4 },
  metricLabel: { color: "#fff", fontSize: 16 },
  metricValue: { color: "#B8B8B8", fontWeight: "bold" },
  emptyText: {
    color: "#ccc",
    fontSize: 16,
    textAlign: "center",
    marginTop: 0,
    marginBottom: 5,
  },

  multiSelectContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginBottom: 10,
  },
  multiSelectItem: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#333",
    borderRadius: 5,
    paddingHorizontal: 10,
    paddingVertical: 6,
    margin: 4,
    borderWidth: 1,
    borderColor: "#444",
  },
  multiSelectItemSelected: {
    backgroundColor: "#000",
    borderColor: "#000",
  },
  compararPanel: {
    backgroundColor: "#232323",
    borderRadius: 10,
    padding: 16,
    marginTop: 24,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: "#444",
  },
  chartTitle: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 12,
    alignSelf: "center",
  },
});
