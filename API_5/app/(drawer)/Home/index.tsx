import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome5'; // Importa o pacote de ícones
import { Link } from 'expo-router'
import { DrawerNavigationProp } from '@react-navigation/drawer';

type HomeProps = {
  navigation: DrawerNavigationProp<any>;
};

export default function Home({ navigation }: HomeProps) {
  return (
    <View style={styles.container}>
      <View style={styles.grid}>
        {/* Quadrado 1 */}
        <Link href="/CadastroBot/cadastrarBot" style={styles.square}>
          <View style={styles.content}>
            <Icon name="robot" size={40} color="#fff" />
            <Text style={styles.squareText}></Text>
          </View>
        </Link>

        {/* Quadrado 2 */}
        <Link href="/CadastroUsuario/cadastrarUsuario" style={styles.square}>
          <View style={styles.content}>
            <Icon name="users" size={40} color="#fff" />
            <Text style={styles.squareText}></Text>
          </View>
        </Link>
        {/* Quadrado 3 */}
        <View style={styles.square}>
          <Icon name="building" size={40} color="#fff" />
          <Text style={styles.squareText}>Departamentos</Text>
        </View>

        {/* Quadrado 4 */}
        <View style={styles.square}>
          <Icon name="briefcase" size={40} color="#fff" />
          <Text style={styles.squareText}>Empresas</Text>
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
  content: {
    marginTop: 45,
    marginLeft: 45,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    alignItems: 'center',
    width: '80%',
  },
  square: {
    width: 140,
    height: 140,
    backgroundColor: '#181818',
    margin: 10,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 10,
  },
  squareText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
    marginTop: 5,
  },
});