import React from 'react';
import { Text, View } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome5';
import { Link } from 'expo-router';
import { DrawerNavigationProp } from '@react-navigation/drawer';
import { stylesHome as styles, cores } from '../../../styles';
import BaseScreen from '../../../components/baseScreen';

type HomeProps = {
  navigation: DrawerNavigationProp<any>;
};

export default function Home({ }: HomeProps) {
  return (
    <BaseScreen>
      <Link href="/MeusChatbots/meusChatbots" style={styles.card}>
        <Icon name="robot" size={40} color={cores.cor8} />
        <Text style={styles.cardText}>Chatbots</Text>
      </Link>
      <Link href="/CadastroUsuario/listarUsuario" style={styles.card}>
        <Icon name="users" size={40} color={cores.cor8} />
        <Text style={styles.cardText}>Usuários</Text>
      </Link>
      <Link href="/(drawer)/Dashboard" style={styles.card}>
        <Icon name="chart-bar" size={40} color="#fff" />
        <Text style={styles.cardText}>Dashboard</Text>
      </Link>
    </BaseScreen >
  );
};