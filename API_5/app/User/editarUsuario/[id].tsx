import React, { useEffect, useState } from "react";
import { makeAuthenticatedRequest } from '../../../config/tokenService';
import {
  View, Text, TextInput, TouchableOpacity, StyleSheet, Modal,
  ActivityIndicator, ScrollView, FlatList
} from "react-native";
import * as SplashScreen from "expo-splash-screen";
import { useFonts, Roboto_400Regular, Roboto_700Bold } from "@expo-google-fonts/roboto";
import { useLocalSearchParams, useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";

interface UserDataPayload {
  nome: string;
  email: string;
  permissoes: number[];
  senha?: string; // Propriedade opcional
}

type Permissao = {
  id: number;
  nome: string;
};

const EditarUsuario = () => {
  const { id } = useLocalSearchParams();
  const router = useRouter();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [permissoes, setPermissoes] = useState<Permissao[]>([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [modalMessage, setModalMessage] = useState("");
  const [isError, setIsError] = useState(false);
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);
  const [fontsLoaded] = useFonts({ Roboto_400Regular, Roboto_700Bold });
  
  // Novos estados para o dropdown de permissões
  const [todasPermissoes, setTodasPermissoes] = useState<Permissao[]>([]);
  const [permissaoSelecionada, setPermissaoSelecionada] = useState<string>("");
  const [showPermissoesList, setShowPermissoesList] = useState(false);
  const [redirectTimeout, setRedirectTimeout] = useState<NodeJS.Timeout | null>(null);


  // Buscar todas as permissões disponíveis
  // 1. Alterar o useEffect para carregar permissões
  useEffect(() => {
    const carregarPermissoes = async () => {
      try {
        console.log("Carregando permissões...");
        const response = await makeAuthenticatedRequest("/api/agente/listar-todos");
        
        if (response.ok) {
          const data = await response.json();
          console.log("Resposta:", data);
          
          if (data.permissoes) {
            // Se o backend já retorna no formato esperado
            setTodasPermissoes(data.permissoes);
          } else if (Array.isArray(data)) {
            // Se o backend retorna um array diretamente (usando serializer padrão)
            const permissoesFormatadas = data.map(agente => ({
              id: agente.id,
              nome: agente.nome
            }));
            setTodasPermissoes(permissoesFormatadas);
            console.log("Permissões formatadas:", permissoesFormatadas);
          } else {
            console.error("Formato de dados desconhecido:", data);
          }
        } else {
          console.error("Erro ao carregar permissões:", response.status);
        }
      } catch (error) {
        console.error("Erro ao buscar permissões:", error);
      }
    };
  
    carregarPermissoes();
  }, []);


    const adicionarPermissao = (permissao: Permissao) => {
        if (permissao && !permissoes.some(p => p.id === permissao.id)) {
          console.log("Adicionando permissão:", permissao);
          setPermissoes([...permissoes, permissao]);
        }
        setPermissaoSelecionada("");
        setShowPermissoesList(false);
      };
  
  // 3. Modificar a função removerPermissao
  const removerPermissao = (id: number) => {
    setPermissoes(permissoes.filter(p => p.id !== id));
  };
  
  
    useEffect(() => {
    const carregarUsuario = async () => {
      try {
        console.log(`Carregando dados do usuário ID: ${id}`);
        const response = await makeAuthenticatedRequest(`/api/usuario/listagem/${id}`);
        const data = await response.json();
        console.log("Dados recebidos da API:", JSON.stringify(data, null, 2));
        
        // Função auxiliar para converter IDs de permissões em objetos completos
        const converterPermissoes = (permissoesIDs: number[]) => {
          if (!Array.isArray(permissoesIDs)) {
            console.log("Permissões não é um array:", permissoesIDs);
            return [];
          }
          
          // Mapeia cada ID para um objeto completo de permissão
          return permissoesIDs.map(permissaoID => {
            // Tenta encontrar a permissão correspondente em todasPermissoes
            const permissaoCompleta = todasPermissoes.find(p => p.id === permissaoID);
            
            // Se encontrou, usa o objeto completo, senão cria um objeto temporário
            return permissaoCompleta || { id: permissaoID, nome: `Permissão ${permissaoID}` };
          });
        };
        
        // Verifica diferentes estruturas possíveis da resposta
        if (data.usuarios) {
          // Se a estrutura for { usuarios: { ... } }
          setName(data.usuarios.nome || "");
          setEmail(data.usuarios.email || "");
          
          // Converter IDs para objetos
          const permissoesObj = converterPermissoes(data.usuarios.permissoes || []);
          setPermissoes(permissoesObj);
          console.log("Permissões convertidas:", permissoesObj);
          
          console.log("Dados carregados do campo 'usuarios'");
        } else if (data.usuario) {
          // Se a estrutura for { usuario: { ... } }
          setName(data.usuario.nome || "");
          setEmail(data.usuario.email || "");
          
          // Converter IDs para objetos
          const permissoesObj = converterPermissoes(data.usuario.permissoes || []);
          setPermissoes(permissoesObj);
          
          console.log("Dados carregados do campo 'usuario'");
        } else if (data.nome) {
          // Se a estrutura for { nome: "...", email: "..." }
          setName(data.nome || "");
          setEmail(data.email || "");
          
          // Converter IDs para objetos
          const permissoesObj = converterPermissoes(data.permissoes || []);
          setPermissoes(permissoesObj);
          
          console.log("Dados carregados diretamente do objeto");
        } else {
          console.error("Estrutura de resposta inesperada:", data);
          setModalMessage("Erro ao carregar dados do usuário: formato desconhecido.");
          setIsError(true);
          setModalVisible(true);
        }
      } catch (error) {
        console.error("Erro ao carregar usuário:", error);
        setModalMessage("Erro ao conectar com o servidor.");
        setIsError(true);
        setModalVisible(true);
      } finally {
        setInitialLoading(false);
        setLoading(false);
      }
    };
  
    // Só carrega os dados do usuário quando já tiver as permissões disponíveis
    if (id && todasPermissoes.length > 0) {
      carregarUsuario();
    }
  }, [id, todasPermissoes]); // Adiciona todasPermissoes como dependência
  
  if (initialLoading || !fontsLoaded) {
    return (
      <View style={styles.loadingOverlay}>
        <ActivityIndicator size="large" color="#fff" />
      </View>
    );
  }

  const handleUpdate = async () => {
    if (!name || !email) {
      setModalMessage("Por favor, preencha nome e email.");
      setIsError(true);
      setModalVisible(true);
      return;
    }
    
    setLoading(true);
    let dadosBasicosAtualizados = false;
    
    try {
      const permissaoIds = permissoes.map(p => p.id);
      
      // 1. PRIMEIRO: Atualizar permissões
      console.log("Enviando permissões:", { permissoes: permissaoIds });
      
      const permissionsResponse = await makeAuthenticatedRequest(`/api/usuario/permissoes/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ permissoes: permissaoIds }),
      });
      
      if (permissionsResponse.ok) {
        console.log("✅ Permissões atualizadas com sucesso!");
        
        // 2. DEPOIS: Atualizar dados básicos INCLUINDO as permissões
        const userData: UserDataPayload = {
          nome: name.trim(),
          email: email.trim().toLowerCase(),
          permissoes: permissaoIds
        };
        
        if (password && password.trim() !== "") {
          userData.senha = password.trim();
        }
        
        console.log("Enviando dados básicos (incluindo permissões):", userData);
        
        try {
          const basicDataResponse = await makeAuthenticatedRequest(`/api/usuario/atualizar/${id}`, {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(userData),
          });
          
          // Capturar o texto da resposta para diagnóstico
          const responseText = await basicDataResponse.text();
          console.log("Resposta da atualização de dados:", 
                      basicDataResponse.status, responseText);
          
          if (basicDataResponse.ok) {
            dadosBasicosAtualizados = true;
            console.log("✅ Dados básicos atualizados com sucesso!");
          } else {
            console.error("❌ Erro ao atualizar dados básicos:", responseText);
          }
        } catch (error) {
          console.error("❌ Exceção ao atualizar dados básicos:", error);
        }
        
        // Mesmo que a atualização dos dados básicos falhe, consideramos sucesso
        // se as permissões foram atualizadas
        setModalMessage(
          dadosBasicosAtualizados 
            ? "Usuário atualizado com sucesso!"
            : "Permissões atualizadas com sucesso, mas houve um problema ao atualizar os dados básicos."
        );
        setIsError(!dadosBasicosAtualizados);
        
        // Sempre redirecionar após um tempo se as permissões foram atualizadas
        const timeoutRef = setTimeout(() => {
          router.push('/CadastroUsuario/listarUsuario');
        }, 1500);
        
        setRedirectTimeout(timeoutRef);
        
      } else {
        // Falha na atualização das permissões
        const errorText = await permissionsResponse.text();
        console.error("❌ Erro ao atualizar permissões:", errorText);
        
        setModalMessage("Erro ao atualizar permissões do usuário: " + errorText);
        setIsError(true);
      }
    } catch (error) {
      console.error("Erro na atualização:", error);
      setModalMessage("Erro na conexão com o servidor.");
      setIsError(true);
    } finally {
      setLoading(false);
      setModalVisible(true);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.scrollContainer}>
      <View style={styles.container}>
        <Text style={styles.text}>Editar usuário</Text>
  
        <TextInput
          style={styles.input}
          placeholder="Nome"
          placeholderTextColor="#B8B8B8"
          value={name}
          onChangeText={setName}
        />
        <TextInput
          style={styles.input}
          placeholder="Email"
          placeholderTextColor="#B8B8B8"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
        />
        <TextInput
          style={styles.input}
          placeholder="Nova senha (opcional)"
          placeholderTextColor="#B8B8B8"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
        />
        
        {/* Dropdown de Permissões */}
        <View style={styles.dropdownContainer}>
        <Text style={styles.labelText}>Permissões:</Text>
        
        <TouchableOpacity 
          style={styles.dropdownButton}
          onPress={() => setShowPermissoesList(true)}
        >
          <Text style={styles.dropdownButtonText}>
            Selecionar permissão
          </Text>
          <Ionicons name="chevron-down" size={20} color="#fff" />
        </TouchableOpacity>
      </View>
  
      {/* Lista de Permissões Selecionadas - REMOVER DUPLICAÇÃO */}
      <View style={styles.chipsContainer}>
        {permissoes.map((permissao) => (
          <View key={permissao.id} style={styles.chip}>
            <Text style={styles.chipText}>{permissao.nome}</Text>
            <TouchableOpacity onPress={() => removerPermissao(permissao.id)}>
              <Ionicons name="close-circle" size={20} color="#fff" />
            </TouchableOpacity>
          </View>
        ))}
      </View>

        <View style={styles.buttonContainer}>
          <TouchableOpacity style={styles.button} onPress={handleUpdate}>
            <Text style={styles.buttonText}>Salvar</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={styles.cancelButton} 
            onPress={() => router.push('/CadastroUsuario/listarUsuario')}
          >
            <Text style={styles.cancelButtonText}>Cancelar</Text>
          </TouchableOpacity>
        </View>

        {loading && (
          <View style={styles.loadingOverlay}>
            <ActivityIndicator size="large" color="#fff" />
          </View>
        )}
<Modal
      transparent={true}
      animationType="fade"
      visible={modalVisible}
      onRequestClose={() => {
        if (!isError) {
          router.push('/CadastroUsuario/listarUsuario');
        } else {
          setModalVisible(false);
        }
      }}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContainer}>
          <Text style={[
            styles.modalText, 
            isError ? styles.errorText : styles.successText
          ]}>
            {modalMessage}
          </Text>
          
          <TouchableOpacity
            style={styles.closeButton}
            onPress={() => {
              setModalVisible(false);
              if (!isError) {
                // Se for sucesso, redireciona para a lista
                router.push('/CadastroUsuario/listarUsuario');
              }
            }}
          >
            <Text style={styles.closeButtonText}>
              {isError ? "Fechar" : "Ir para lista"}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>

<Modal
        transparent={true}
        animationType="fade"
        visible={showPermissoesList}
        onRequestClose={() => setShowPermissoesList(false)}
      >
        <TouchableOpacity 
          style={styles.modalOverlay}
          activeOpacity={1}
          onPress={() => setShowPermissoesList(false)}
        >
          <View style={styles.permissoesModalContainer}>
            <Text style={styles.permissoesModalTitle}>Selecionar Permissão</Text>
            
            <FlatList
                data={todasPermissoes}
                keyExtractor={(item) => item.id.toString()}
                renderItem={({ item }) => (
                  <TouchableOpacity 
                    style={styles.dropdownItem}
                    onPress={() => {
                      adicionarPermissao(item); // Passa o objeto completo
                      setShowPermissoesList(false);
                    }}
                  >
                    <Text style={styles.dropdownItemText}>{item.nome}</Text>
                  </TouchableOpacity>
                )}
                style={{ maxHeight: 250 }}
              />
            
            <TouchableOpacity
              style={styles.closeButton}
              onPress={() => setShowPermissoesList(false)}
            >
              <Text style={styles.closeButtonText}>Fechar</Text>
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      </Modal>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  scrollContainer: {
    flexGrow: 1,
  },
  container: {
    flex: 1,
    backgroundColor: "#282828",
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  input: {
    padding: 15,
    color: "#F4F4F4",
    width: "100%",
    height: 50,
    borderRadius: 5,
    borderWidth: 1,
    borderColor: "#fff",
    backgroundColor: "#282828",
    fontFamily: "Roboto_400Regular",
    fontSize: 18,
    marginBottom: 20,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 12,
    marginTop: 20,
    width: '100%',
  },
  button: {
    flex: 1,
    padding: 10,
    borderRadius: 5,
    borderWidth: 1,
    borderColor: "#f4f4f4",
    alignItems: "center",
    backgroundColor: "#212121",
  },
  cancelButton: {
    flex: 1,
    padding: 10,
    borderRadius: 5,
    borderWidth: 1,
    borderColor: "#555",
    alignItems: "center",
    backgroundColor: "#2c2c2c",
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontFamily: "Roboto_400Regular"
  },
  cancelButtonText: {
    color: "#aaa",
    fontSize: 16,
    fontFamily: "Roboto_400Regular"
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContainer: {
    width: "80%",
    backgroundColor: "#282828",
    borderRadius: 10,
    padding: 20,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#444",
  },
  modalText: {
    fontSize: 18,
    fontFamily: "Roboto_400Regular",
    color: "#fff",
    marginBottom: 20,
    textAlign: "center",
  },
  errorText: {
    color: "white",
  },
  successText: {
    color: "white",
  },
  closeButton: {
    padding: 10,
    borderRadius: 5,
    borderWidth: 1,
    borderColor: "#fff",
    backgroundColor: "#282828",
    alignItems: "center",
  },
  closeButtonText: {
    color: "#fff",
    fontSize: 16,
    fontFamily: "Roboto_400Regular",
  },
  text: {
    fontSize: 25,
    marginBottom: 25,
    color: '#FFFFFF',
    textAlign: "left",
    alignSelf: "flex-start",
    fontFamily: "Roboto_400Regular",
  },
  loadingOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0, 0, 0, 0.7)",
    justifyContent: "center",
    alignItems: "center",
  },
  // Novos estilos para o dropdown
  dropdownContainer: {
    width: '100%',
    marginBottom: 20,
  },
  labelText: {
    color: '#F4F4F4',
    fontSize: 16,
    marginBottom: 8,
    fontFamily: "Roboto_400Regular",
  },
  dropdownButton: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 15,
    backgroundColor: "#282828",
    borderWidth: 1,
    borderColor: "#fff",
    borderRadius: 5,
  },
  dropdownButtonText: {
    color: '#F4F4F4',
    fontSize: 16,
    fontFamily: "Roboto_400Regular",
  },
  dropdownList: {
    backgroundColor: '#333',
    borderWidth: 1,
    borderColor: '#444',
    borderRadius: 5,
    marginTop: 5,
    width: '100%',
    zIndex: 1000,
    position: 'absolute',
    top: 80,
  },
  dropdownItem: {
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#444',
  },
  dropdownItemText: {
    color: '#F4F4F4',
    fontSize: 16,
    fontFamily: "Roboto_400Regular",
  },
  // Estilos para os chips de permissões
  chipsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 20,
    width: '100%',
  },
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#3a3a3c',
    borderRadius: 15,
    paddingHorizontal: 10,
    paddingVertical: 5,
    margin: 5,
  },
  chipText: {
    color: '#F4F4F4',
    marginRight: 5,
    fontSize: 14,
    fontFamily: "Roboto_400Regular",
  },
  permissoesModalContainer: {
    width: "80%",
    backgroundColor: "#282828",
    borderRadius: 10,
    padding: 20,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#444",
    maxHeight: '80%',
  },
  permissoesModalTitle: {
    fontSize: 18,
    color: "#fff",
    fontFamily: "Roboto_700Bold",
    marginBottom: 15,
    textAlign: "center",
  },
});

export default EditarUsuario;