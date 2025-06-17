import { StatusBar } from 'expo-status-bar';
import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Dimensions, Platform } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome5';
import { Link } from 'expo-router';
import { DrawerNavigationProp } from '@react-navigation/drawer';

// Detecte a plataforma e largura da tela para adaptar layout
const { width } = Dimensions.get('window');
// Calcula a largura do card baseado em porcentagem da tela
const cardWidth = Math.min(300, width * 0.8);

type HomeProps = {
  navigation: DrawerNavigationProp<any>;
};

export default function Home({ navigation }: HomeProps) {
  // Estado para controlar as dimensões da tela (caso mude orientação)
  const [screenWidth, setScreenWidth] = useState(width);

  useEffect(() => {
    const subscription = Dimensions.addEventListener('change', ({ window }) => {
      setScreenWidth(window.width);
    });
    return () => subscription?.remove();
  }, []);

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <Link href="/MeusChatbots/meusChatbots" asChild>
          <TouchableOpacity style={styles.cardWrapper}>
            <View style={[styles.card, { width: cardWidth }]}>
              <Icon name="robot" size={40} color="#fff" />
              <Text style={styles.cardText}>Chatbots</Text>
            </View>
          </TouchableOpacity>
        </Link>

        <Link href="/CadastroUsuario/listarUsuario" asChild>
          <TouchableOpacity style={styles.cardWrapper}>
            <View style={[styles.card, { width: cardWidth }]}>
              <Icon name="users" size={40} color="#fff" />
              <Text style={styles.cardText}>Usuários</Text>
            </View>
          </TouchableOpacity>
        </Link>

        <Link href="/(drawer)/Dashboard" asChild>
          <TouchableOpacity style={styles.cardWrapper}>
            <View style={[styles.card, { width: cardWidth }]}>
              <Icon name="chart-bar" size={40} color="#fff" />
              <Text style={styles.cardText}>Dashboard</Text>
            </View>
          </TouchableOpacity>
        </Link>
      </View>
      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#282828',
  },
  content: {
    flex: 1,
    paddingTop: 20,
    alignItems: 'center',
  },
  cardWrapper: {
    width: '100%',
    alignItems: 'center',
    marginBottom: 15,
  },
  card: {
    backgroundColor: '#212121',
    height: 120,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 10,
    // Força tamanho fixo e centralizado
    marginHorizontal: 'auto',
  },
  cardText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 5,
    textAlign: 'center',
  },
});