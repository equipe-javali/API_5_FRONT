import React from 'react';
import { Drawer } from 'expo-router/drawer';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { Image, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';  

export default function Layout() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <Drawer
        screenOptions={{
          drawerStyle: {
            backgroundColor: '#212121',
          },
          drawerActiveTintColor: 'white',
          drawerInactiveTintColor: 'gray',
          headerStyle: {
            backgroundColor: '#212121', 
          },
          headerTintColor: 'white',
          headerTitle: () => (
            <Image 
              source={require('../../assets/project_images/logo.png')} 
              style={styles.logo} 
            />
          ),
          headerTitleAlign: 'center',
        }}
      >
        <Drawer.Screen
          name="Home/index"
          options={{
            drawerLabel: 'Página inicial',
            title: 'Página inicial',
            drawerIcon: ({ color }) => (
              <Ionicons name="home" size={24} color={color} />  
            ),
          }}
        />

        <Drawer.Screen
          name="CadastroUsuario/cadastrarUsuario"
          options={{
            drawerLabel: 'Cadastrar Usuário',
            title: 'Cadastrar Usuário',
            drawerIcon: ({ color }) => (
              <Ionicons name="person-add" size={24} color={color} />  
            ),
          }}
        />

        <Drawer.Screen
          name="CadastroBot/cadastrarBot"
          options={{
            drawerLabel: 'Cadastrar Bot',
            title: 'Cadastrar Bot',
            drawerIcon: ({ color }) => (
              <Ionicons name="logo-reddit" size={24} color={color} />  
            ),
          }}
        />

        <Drawer.Screen
          name="MeusChatbots/meusChatbots"
          options={{
            drawerLabel: 'Meus Chatbots',
            title: 'Meus Chatbots',
            drawerIcon: ({ color }) => (
              <Ionicons name="chatbubbles" size={24} color={color} /> 
            ),
          }}
        />
      </Drawer>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  logo: {
    width: 120,  
    height: 40,  
    resizeMode: 'contain',
  },
});
