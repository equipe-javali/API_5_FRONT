import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome5'; // Importa o pacote de ícones
import { Link } from 'expo-router';
import { DrawerNavigationProp } from '@react-navigation/drawer';

type HomeProps = {
  navigation: DrawerNavigationProp<any>;
};

export default function Home({ navigation }: HomeProps) {
  return (
    <View style={styles.container}>
      <View style={styles.grid}>
        <Link href="/MeusChatbots/meusChatbots" style={styles.link}>
          <View style={styles.card}>
            <Icon name="robot" size={40} color="#fff" />
            <Text style={styles.cardText}>Chatbots</Text>
          </View>
        </Link>

        <Link href="/CadastroUsuario/cadastrarUsuario" style={styles.link}>
          <View style={styles.card}>
            <Icon name="users" size={40} color="#fff" />
            <Text style={styles.cardText}>Usuários</Text>
          </View>
        </Link>

        {/* Quadrado 3 */}
        <View style={styles.card}>
          <Icon name="building" size={40} color="#fff" />
          <Text style={styles.cardText}>Departamentos</Text>
        </View>

        {/* Quadrado 4 */}
        <View style={styles.card}>
          <Icon name="briefcase" size={40} color="#fff" />
          <Text style={styles.cardText}>Empresas</Text>
        </View>
      </View>
      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#282828',
    alignItems: 'center',
    justifyContent: 'flex-start',
    paddingTop: 50,
  },
  grid: {
    width: '100%', 
    paddingHorizontal: 20, 
  },
  link: {
    width: '100%',
    marginBottom: 15, 
  },
  card: {
    backgroundColor: '#212121', 
    width: '100%', 
    height: 120, 
    marginBottom: 10, 
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 10, 
  },
  cardText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 5,
    textAlign: 'center', 
  },
});
