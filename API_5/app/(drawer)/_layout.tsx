import React from 'react';
import { Drawer } from 'expo-router/drawer';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

export default function Layout() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <Drawer>
        <Drawer.Screen
          name="Home/index"
          options={{
            drawerLabel: 'Home',
            title: 'Home',
          }}
        />

        <Drawer.Screen
          name="Chat/index"
          options={{
            drawerLabel: 'Chat',
            title: 'Chat',
          }}
        />

        <Drawer.Screen
          name="CadastroBot/cadastrarBot"
          options={{
            drawerLabel: 'Cadastrar Bot',
            title: 'Cadastrar Bot',
          }}
        />

        <Drawer.Screen
          name="CadastroUsuario/cadastrarUsuario"
          options={{
            drawerLabel: 'Cadastrar Usuário',
            title: 'Cadastrar Usuário',
          }}
        />


      </Drawer>
    </GestureHandlerRootView>
  );
}