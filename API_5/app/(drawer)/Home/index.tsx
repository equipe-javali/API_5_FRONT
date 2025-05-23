import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { Text, View } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome5'; // Importa o pacote de ícones
import { Link } from 'expo-router';
import { DrawerNavigationProp } from '@react-navigation/drawer';
import styles from '../../../styles/HomeStyle';

type HomeProps = {
  navigation: DrawerNavigationProp<any>;
};

export default function Home({ }: HomeProps) {
  return (
    <View style={styles.container}>
      <View style={styles.grid}>
        <Link href="/MeusChatbots/meusChatbots" style={styles.link}>
          <View style={styles.card}>
            <Icon name="robot" size={40} color="#fff" />
            <Text style={styles.cardText}>Chatbots</Text>
          </View>
        </Link>

        <Link href="/CadastroUsuario/listarUsuario" style={styles.link}>
          <View style={styles.card}>
            <Icon name="users" size={40} color="#fff" />
            <Text style={styles.cardText}>Usuários</Text>
          </View>
        </Link>
      </View>
      <StatusBar style="auto" />
    </View>
  );
};