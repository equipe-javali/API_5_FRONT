import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, ActivityIndicator, TouchableOpacity, Platform } from "react-native";
import { Picker } from "@react-native-picker/picker";
import { makeAuthenticatedRequest } from "../../../config/tokenService";
import DateTimePicker from "@react-native-community/datetimepicker";
import { Ionicons } from "@expo/vector-icons";

export default function DesempenhoChatbot() {
  const [agentes, setAgentes] = useState([]);
  const [agenteSelecionado, setAgenteSelecionado] = useState<string | null>(null);
  const [inicio, setInicio] = useState<Date | null>(null);
  const [fim, setFim] = useState<Date | null>(null);
  const [showInicio, setShowInicio] = useState(false);
  const [showFim, setShowFim] = useState(false);
  const [loading, setLoading] = useState(false);
  const [metricas, setMetricas] = useState<any[]>([]);

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
    setLoading(true);
    let url = `/api/metricas/tempo-resposta?`;
    if (agenteSelecionado) url += `agente_id=${agenteSelecionado}&`;
    if (inicio) url += `inicio=${inicio.toISOString().slice(0, 10)}&`;
    if (fim) url += `fim=${fim.toISOString().slice(0, 10)}`;
    const resp = await makeAuthenticatedRequest(url);
    if (resp.ok) {
      setMetricas(await resp.json());
    } else {
      setMetricas([]);
    }
    setLoading(false);
  };

  const renderDatePicker = (type: "inicio" | "fim") => {
    const value = type === "inicio" ? inicio : fim;
    const setValue = type === "inicio" ? setInicio : setFim;
    const show = type === "inicio" ? showInicio : showFim;
    const setShow = type === "inicio" ? setShowInicio : setShowFim;
    const label = type === "inicio" ? "Início" : "Fim";

    if (Platform.OS === "web") {
      return (
        <TouchableOpacity
          style={styles.dateInput}
          onPress={() => {
            // Não há datepicker nativo web, então exibe input puro
          }}
        >
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
        </TouchableOpacity>
      );
    } else {
      return (
        <>
          <TouchableOpacity
            style={styles.dateInput}
            onPress={() => setShow(true)}
          >
            <Ionicons name="calendar-outline" size={18} color="#fff" style={{ marginRight: 6 }} />
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
    <View style={styles.container}>
      <Text style={styles.title}>Desempenho dos Chatbots</Text>
      <View style={styles.filtros}>
        <Text style={styles.label}>Agente</Text>
        <View style={styles.pickerContainer}>
          <Picker
            selectedValue={agenteSelecionado}
            style={styles.picker}
            dropdownIconColor="#fff"
            onValueChange={setAgenteSelecionado}
          >
            <Picker.Item label="Todos" value={null} />
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
        <TouchableOpacity style={styles.button} onPress={buscarMetricas} disabled={loading}>
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <>
              <Ionicons name="search" size={18} color="#fff" style={{ marginRight: 6 }} />
              <Text style={styles.buttonText}>Buscar</Text>
            </>
          )}
        </TouchableOpacity>
      </View>
      <View style={styles.metricas}>
        {loading ? (
          <ActivityIndicator size="large" color="#007bff" />
        ) : metricas.length === 0 ? (
          <Text style={styles.emptyText}>Nenhum dado encontrado.</Text>
        ) : (
          metricas.map((m, idx) => (
            <View key={idx} style={styles.metricItem}>
              <Text style={styles.metricDate}>Data: <Text style={styles.metricValue}>{m.data}</Text></Text>
              <Text style={styles.metricLabel}>Tempo médio de resposta: <Text style={styles.metricValue}>{m.tempo_medio} s</Text></Text>
            </View>
          ))
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#282828", padding: 20 },
  title: { fontSize: 24, color: "#fff", marginBottom: 20, fontWeight: "bold", alignSelf: "center" },
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
    backgroundColor: "#444", // borda do input de data
    borderRadius: 5,
    paddingHorizontal: 2,
    paddingVertical: 2,
    minWidth: 120,
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
  emptyText: { color: "#ccc", fontSize: 16, textAlign: "center", marginTop: 20 },
});