import React from 'react';
import { Drawer } from 'expo-router/drawer';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

export default function Layout() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <Drawer>
        {/* Rota principal */}
        <Drawer.Screen
          name="index"
          options={{
            drawerLabel: 'Home',
            title: 'Home',
          }}
        />

        {/* Adicione a rota para o Chat */}
        <Drawer.Screen
          name="Chat/index"
          options={{
            drawerLabel: 'Chat',
            title: 'Chat',
          }}
        />

        {/* Rotas para login e registro */}
        <Drawer.Screen
          name="Start/login"
          options={{
            drawerLabel: 'Login',
            title: 'Login',
          }}
        />

        <Drawer.Screen
          name="Start/register"
          options={{
            drawerLabel: 'Registro',
            title: 'Registro',
          }}
        />

        <Drawer.Screen
          name="cadastroBot/cadastrarBot"
          options={{
            drawerLabel: 'Cadastrar Bot',
            title: 'Cadastrar Bot',
          }}
        />

        <Drawer.Screen
          name="cadastroUsuario/cadastrarUsuario"
          options={{
            drawerLabel: 'Cadastrar Usuário',
            title: 'Cadastrar Usuário',
          }}
        />


      </Drawer>
    </GestureHandlerRootView>
  );
}