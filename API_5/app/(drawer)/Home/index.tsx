import React from 'react';
import { Text, View } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome5';
import { Link } from 'expo-router';
import { DrawerNavigationProp } from '@react-navigation/drawer';
import { stylesHome, cores } from '../../../styles';
import { BaseScreen } from '../../../components';

type HomeProps = {
  navigation: DrawerNavigationProp<any>;
};

export default function Home({ }: HomeProps) {
  return (
    <BaseScreen>
      <View style={stylesHome.cardContainers}>
        <Link href="/Chatbots">
          <View style={stylesHome.card}>
            <Icon name="robot" size={40} color={cores.cor9} />
            <Text style={stylesHome.cardText}>Chatbots</Text>
          </View>
        </Link>
        <Link href="/CadastroBot">
          <View style={stylesHome.card}>
            <Icon name="plus" size={40} color={cores.cor9} />
            <Text style={stylesHome.cardText}>Cadastrar Bot</Text>
          </View>
        </Link>
        <Link href="/Usuarios">
          <View style={stylesHome.card}>
            <Icon name="users" size={40} color={cores.cor9} />
            <Text style={stylesHome.cardText}>Usuários</Text>
          </View>
        </Link>
        <Link href="/Dashboard">
          <View style={stylesHome.card}>
            <Icon name="chart-bar" size={40} color={cores.cor9} />
            <Text style={stylesHome.cardText}>Dashboard</Text>
          </View>
        </Link>
      </View>
    </BaseScreen>
  );
};