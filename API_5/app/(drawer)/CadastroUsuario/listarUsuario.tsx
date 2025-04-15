import React, { useEffect, useState } from 'react';
import { apiCall } from '../../../config/api';
import { Link } from 'expo-router';

import { View, Text, FlatList, ActivityIndicator, StyleSheet, SafeAreaView, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

type Usuario = {
  nome: string;
  email: string;
};

const UserListScreen = () => {
  const [usuarios, setUsuarios] = useState<Usuario[]>([]);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState<string | null>(null);

  useEffect(() => {
    const carregarUsuarios = async () => {
      try {
        const response = await apiCall('/api/agente/listar-usuario');
        const data = await response.json();
        setUsuarios(data);
      } catch (err) {
        console.error(err);
        setErro('Erro ao carregar usuários.');
      } finally {
        setCarregando(false);
      }
    };

    carregarUsuarios();
  }, []);

  const renderItem = ({ item }: { item: Usuario }) => (
    <View style={styles.item}>
      <Text style={styles.nome}>{item.nome}</Text>
      <View style={styles.actions}>
        <TouchableOpacity style={styles.iconBtn}>
          <Ionicons name="pencil-outline" size={18} color="#fff" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.iconBtn}>
          <Ionicons name="trash-outline" size={18} color="#fff" />
        </TouchableOpacity>
      </View>
    </View>
  );

  if (carregando) {
    return (
      <View style={styles.loading}>
        <ActivityIndicator size="large" color="#1E90FF" />
        <Text style={{ marginTop: 10, color: '#ccc' }}>Carregando usuários...</Text>
      </View>
    );
  }

  if (erro) {
    return (
      <View style={styles.loading}>
        <Text style={{ color: '#F4F4F4' }}>{erro}</Text>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.titulo}>Usuários</Text>
        <Link href="/User/cadastrarUsuario" style={styles.addBtn}>
            <Text style={styles.addBtnText}>Adicionar</Text>
        </Link>
      </View>
      <FlatList
        data={usuarios}
        keyExtractor={(item, index) => index.toString()}
        renderItem={renderItem}
        contentContainerStyle={{ paddingBottom: 20 }}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
    container: {
      flex: 1,
      paddingHorizontal: 16,
      paddingTop: 20,
      backgroundColor: '#1c1c1e',
    },
    header: {
      marginHorizontal: 10,

      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: 20,
    },
    titulo: {
      fontSize: 24,
      fontWeight: 'bold',
      color: '#fff',
    },
    addBtn: {
      borderColor: '#fff',
      borderWidth: 1,
      borderRadius: 6,
      paddingVertical: 6,
      paddingHorizontal: 12,
    },
    addBtnText: {
      color: '#fff',
      fontSize: 16,
    },
    item: {
      backgroundColor: '#2c2c2e',
      padding: 14,
      borderRadius: 8,
      marginBottom: 12,
      marginHorizontal: 10,
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
    },
    nome: {
      fontSize: 16,
      color: '#fff',
    },
    actions: {
      flexDirection: 'row',
      gap: 12,
    },
    iconBtn: {
      backgroundColor: '#3a3a3c',
      padding: 8,
      borderRadius: 6,
      marginLeft: 8,
    },
    loading: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: '#1c1c1e',
    },
  });
  

export default UserListScreen;
