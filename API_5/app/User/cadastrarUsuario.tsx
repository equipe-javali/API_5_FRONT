import React, { useState } from "react";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { View, Text, TextInput, TouchableOpacity, Modal, ActivityIndicator } from "react-native";
import * as SplashScreen from "expo-splash-screen";
import { router } from "expo-router";
import { makeAuthenticatedRequest } from "../../config/tokenService";
import styles, { fontsLoaded } from "./style";

export default function SignUpScreen() {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [modalVisible, setModalVisible] = useState(false);
    const [modalMessage, setModalMessage] = useState("");
    const [isError, setIsError] = useState(false);
    const [loading, setLoading] = useState(false);

    const [senhaValida, setSenhaValida] = useState({
        tamanho: false,
        maiuscula: false,
        minuscula: false,
        numero: false,
        especial: false,
    });

    const validarSenha = (senha: string) => {
        setSenhaValida({
            tamanho: senha.length >= 8,
            maiuscula: /[A-Z]/.test(senha),
            minuscula: /[a-z]/.test(senha),
            numero: /\d/.test(senha),
            especial: /[@$!%*#?&]/.test(senha),
        });
    };

    if (!fontsLoaded) {
        SplashScreen.preventAutoHideAsync();
        return null;
    }

    const handleSignUp = async () => {
        if (!name || !email || !password) {
            setModalMessage("Por favor, preencha todos os campos.");
            setIsError(true);
            setModalVisible(true);
            return;
        }

        if (Object.values(senhaValida).includes(false)) {
            setModalMessage("A senha não atende aos requisitos de segurança.");
            setIsError(true);
            setModalVisible(true);
            return;
        }

        // Verificar autenticação antes de começar
        const token = await AsyncStorage.getItem('access_token');
        if (!token) {
            setModalMessage("Você não está autenticado. Faça login novamente.");
            setIsError(true);
            setModalVisible(true);
            setTimeout(() => router.push('/Start/login'), 2000);
            return;
        }

        // Verificar se o usuário é admin
        const isAdmin = await AsyncStorage.getItem('isAdmin');
        if (isAdmin !== 'true') {
            setModalMessage("Apenas administradores podem cadastrar novos usuários.");
            setIsError(true);
            setModalVisible(true);
            return;
        }

        setLoading(true); // Ativa o carregamento

        try {
            console.log("Enviando requisição com token:", token.substring(0, 15) + "...");

            const response = await makeAuthenticatedRequest('/api/usuario/cadastrar', {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    nome: name,
                    email: email,
                    senha: password,
                    permissoes: [],
                    // admin: false, 
                }),
            });

            const data = await response.json();
            console.log("Resposta da API:", response.status, data);

            if (response.ok) {
                setModalMessage("Usuário cadastrado com sucesso!");
                setIsError(false);
                setName("");
                setEmail("");
                setPassword("");
            } else if (response.status === 401) {
                setModalMessage("Sessão expirada. Por favor, faça login novamente.");
                setIsError(true);
                setTimeout(() => router.push('/Start/login'), 2000);
            } else {
                // Exibir detalhes do erro para diagnóstico
                let errorMsg = "Erro ao cadastrar usuário.";
                if (data && typeof data === 'object') {
                    // Extrair todas as mensagens de erro para ajudar no diagnóstico
                    const errorDetails = Object.entries(data)
                        .map(([field, errors]) => `${field}: ${Array.isArray(errors) ? errors.join(", ") : errors}`)
                        .join("\n");
                    errorMsg = errorDetails || data.message || data.msg || data.detail || errorMsg;
                }
                setModalMessage(errorMsg);
                setIsError(true);
            }
        } catch (error) {
            console.error("Erro na requisição:", error);
            setModalMessage("Erro na conexão com o servidor.");
            setIsError(true);
        } finally {
            setLoading(false);
            setModalVisible(true);
        }
    };
    return (
        <View style={styles.container}>
            <Text style={styles.text}>
                Cadastrar usuário
            </Text>
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
                placeholder="Senha"
                placeholderTextColor="#B8B8B8"
                value={password}
                onChangeText={(text) => {
                    setPassword(text);
                    validarSenha(text);
                }}
                secureTextEntry
            />
            <View style={styles.senhaDicasContainer}>
                <Text style={[styles.senhaDica, senhaValida.tamanho ? styles.valido : styles.invalido]}>
                    {senhaValida.tamanho ? '✓' : '✗'} Pelo menos 8 caracteres
                </Text>
                <Text style={[styles.senhaDica, senhaValida.maiuscula ? styles.valido : styles.invalido]}>
                    {senhaValida.maiuscula ? '✓' : '✗'} Pelo menos uma letra maiúscula
                </Text>
                <Text style={[styles.senhaDica, senhaValida.minuscula ? styles.valido : styles.invalido]}>
                    {senhaValida.minuscula ? '✓' : '✗'} Pelo menos uma letra minúscula
                </Text>
                <Text style={[styles.senhaDica, senhaValida.numero ? styles.valido : styles.invalido]}>
                    {senhaValida.numero ? '✓' : '✗'} Pelo menos um número
                </Text>
                <Text style={[styles.senhaDica, senhaValida.especial ? styles.valido : styles.invalido]}>
                    {senhaValida.especial ? '✓' : '✗'} Pelo menos um caractere especial
                </Text>
            </View>

            <View style={styles.buttonContainer}>
                <TouchableOpacity style={styles.button} onPress={handleSignUp}>
                    <Text style={styles.buttonText}>Cadastrar</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.cancelButton} onPress={() => router.push('/CadastroUsuario/listarUsuario')}>
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
                onRequestClose={() => setModalVisible(false)}
            >
                <View style={styles.modalOverlay}>
                    <View style={styles.modalContainer}>
                        <Text style={[styles.modalText, isError ? styles.errorText : styles.successText]}>
                            {modalMessage}
                        </Text>
                        <TouchableOpacity
                            style={styles.closeButton}
                            onPress={() => setModalVisible(false)}
                        >
                            <Text style={styles.closeButtonText}>Fechar</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>
        </View>
    );
};