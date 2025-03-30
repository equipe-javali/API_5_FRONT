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
          name="CadastroUsuario/cadastrarUsuario"
          options={{
            drawerLabel: 'Cadastrar Usuário',
            title: 'Cadastrar Usuário',
          }}
        />

        <Drawer.Screen
          name="MeusChatbots/meusChatbots"
          options={{
            drawerLabel: 'Meus Chatbots',
            title: 'Meus Chatbots',
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
          name="CadastroContexto/cadastrarContexto"
          options={{
            drawerLabel: 'Cadastrar Contexto',
            title: 'Cadastrar Contexto',
          }}
        />

        <Drawer.Screen
          name="TreinoBot/treinarBot"
          options={{
            drawerLabel: 'Treinar Bot',
            title: 'Treinar Bot',
          }}
        />




      </Drawer>
    </GestureHandlerRootView>
  );
}