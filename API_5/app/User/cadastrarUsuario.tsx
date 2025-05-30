import React, { useState } from "react";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { View, Text, TextInput, TouchableOpacity, ActivityIndicator } from "react-native";
import { router } from "expo-router";
import { makeAuthenticatedRequest } from "../../config/tokenService";
import styles, { cores } from "./style";
import { BaseScreen, Loading, Modal } from "../../components";

export default function SignUpScreen() {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [modalVisible, setModalVisible] = useState(false);
    const [modalMessage, setModalMessage] = useState("");
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

    const handleSignUp = async () => {
        if (!name || !email || !password) {
            setModalMessage("Por favor, preencha todos os campos.");
            setModalVisible(true);
            return;
        }

        if (Object.values(senhaValida).includes(false)) {
            setModalMessage("A senha não atende aos requisitos de segurança.");
            setModalVisible(true);
            return;
        }

        // Verificar autenticação antes de começar
        const token = await AsyncStorage.getItem('access_token');
        if (!token) {
            setModalMessage("Você não está autenticado. Faça login novamente.");
            setModalVisible(true);
            setTimeout(() => router.push('/Start/login'), 2000);
            return;
        }

        // Verificar se o usuário é admin
        const isAdmin = await AsyncStorage.getItem('isAdmin');
        if (isAdmin !== 'true') {
            setModalMessage("Apenas administradores podem cadastrar novos usuários.");
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
                setName("");
                setEmail("");
                setPassword("");
            } else if (response.status === 401) {
                setModalMessage("Sessão expirada. Por favor, faça login novamente.");
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
            }
        } catch (error) {
            console.error("Erro na requisição:", error);
            setModalMessage("Erro na conexão com o servidor.");
        } finally {
            setLoading(false);
            setModalVisible(true);
        }
    };
    return (
        <BaseScreen>
            <TextInput
                style={styles.input}
                placeholder="Nome"
                placeholderTextColor={cores.cor6}
                value={name}
                onChangeText={setName}
            />
            <TextInput
                style={styles.input}
                placeholder="Email"
                keyboardType="email-address"
                placeholderTextColor={cores.cor6}
                value={email}
                onChangeText={setEmail}
            />
            <TextInput
                style={styles.input}
                placeholder="Senha"
                secureTextEntry
                placeholderTextColor={cores.cor6}
                value={password}
                onChangeText={(text) => {
                    setPassword(text);
                    validarSenha(text);
                }}
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
                <TouchableOpacity style={styles.button} onPress={handleSignUp} disabled={loading}>
                    {loading ? (
                        <ActivityIndicator color={cores.cor8} />
                    ) : (
                        <Text style={styles.buttonText}>Cadastrar</Text>
                    )}
                </TouchableOpacity>
                <TouchableOpacity style={styles.cancelButton} onPress={() => router.push('/Usuarios')}>
                    <Text style={styles.cancelButtonText}>Cancelar</Text>
                </TouchableOpacity>
            </View>

            {loading && <Loading />}

            <Modal
                show={modalVisible}
                setShow={setModalVisible}
            >
                <Text style={styles.modalText}>
                    {modalMessage}
                </Text>
            </Modal>
        </BaseScreen>
    );
};