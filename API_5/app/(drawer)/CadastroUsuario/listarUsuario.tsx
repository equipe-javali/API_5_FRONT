import React, { useEffect, useState } from 'react';
import { Link, useRouter } from 'expo-router';
import { View, Text, FlatList, ActivityIndicator, SafeAreaView, TouchableOpacity, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { makeAuthenticatedRequest } from '../../../config/tokenService';
import styles from './style';

type Usuario = {
  id: number;
  nome: string;
  email: string;
  admin: boolean;
  permissoes: any[];
};

export default function UserListScreen() {
  const [usuarios, setUsuarios] = useState<Usuario[]>([]);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    carregarUsuarios();
  }, []);

  const carregarUsuarios = async () => {
    try {
      const response = await makeAuthenticatedRequest('/api/usuario/listagem-todos');
      
      if (!response.ok) {
        throw new Error('Erro ao carregar usuários');
      }
      
      const data = await response.json();
      console.log('Usuários carregados:', data);
      setUsuarios(data.usuarios);
    } catch (err) {
      console.error(err);
      setErro('Erro ao carregar usuários.');
    } finally {
      setCarregando(false);
    }
  };

  const excluirUsuario = (id: number) => {
    const confirmarExclusao = async () => {
      try {
        console.log('Excluindo usuário com ID:', id);

        const response = await makeAuthenticatedRequest(`/api/usuario/excluir/${id}`, {
          method: 'DELETE',
        });

        if (!response.ok) {
          const errData = await response.json();
          throw new Error(errData.message || 'Erro ao excluir');
        }

        setUsuarios(prev => prev.filter(usuario => usuario.id !== id));
        Alert.alert('Sucesso', 'Usuário excluído com sucesso!');
      } catch (err) {
        console.error('Erro ao excluir:', err);
        Alert.alert('Erro', 'Erro ao excluir usuário.');
      }
    };

    Alert.alert(
      'Confirmar exclusão',
      'Tem certeza que deseja excluir este usuário?',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Excluir',
          style: 'destructive',
          onPress: confirmarExclusao,
        },
      ]
    );
  };
  
  const renderItem = ({ item }: { item: Usuario }) => (
    <View style={styles.item}>
      <Text style={styles.nome}>{item.nome || '(Sem nome)'}</Text>
      <View style={styles.actions}>
        <TouchableOpacity
          style={styles.iconBtn}
          onPress={() =>
            router.push({
              pathname: '/User/editarUsuario/[id]',
              params: { id: item.id.toString() },
            })
          }
        >
          <Ionicons name="pencil-outline" size={18} color="#fff" />
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.iconBtn}
          onPress={() => {
            excluirUsuario(item.id);
          }}
        >
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
        keyExtractor={(item) => item.email}
        renderItem={renderItem}
        contentContainerStyle={{ paddingBottom: 20 }}
      />
    </SafeAreaView>
  );
};