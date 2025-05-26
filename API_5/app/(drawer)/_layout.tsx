import React from 'react';
import { Drawer } from 'expo-router/drawer';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { Image, StyleSheet, View, Text, Pressable } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome5';
import { DrawerContentScrollView, DrawerItemList } from '@react-navigation/drawer';
import { useRouter } from 'expo-router';
import { DrawerContentComponentProps } from '@react-navigation/drawer';


export default function Layout() {
  const CustomDrawerContent = (props: DrawerContentComponentProps) => {
    const router = useRouter();

    const handleLogout = () => {
      router.replace('/');
    };

    return (
      <DrawerContentScrollView {...props} contentContainerStyle={{ flex: 1 }}>
        <View style={{ flex: 1 }}>
          <DrawerItemList {...props} />
        </View>

        <View style={styles.logoutContainer}>
          <Pressable onPress={handleLogout} style={styles.logoutButton}>
            <Icon name="door-open" size={20} color="white" />
            <Text style={styles.logoutText}>Sair</Text>
          </Pressable>
        </View>
      </DrawerContentScrollView>
    );
  };

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <Drawer
        drawerContent={(props) => <CustomDrawerContent {...props} />}
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
              <Icon name="home" size={24} color={color} />
            ),
          }}
        />

        <Drawer.Screen
          name="Usuarios/index"
          options={{
            drawerLabel: 'Usuários',
            title: 'Usuários',
            drawerIcon: ({ color }) => (
              <Icon name="users" size={24} color={color} />
            ),
          }}
        />

        <Drawer.Screen
          name="CadastroBot/index"
          options={{
            drawerLabel: 'Cadastrar Bot',
            title: 'Cadastrar Bot',
            drawerIcon: ({ color }) => (
              <Icon name="plus" size={24} color={color} />
            ),
          }}
        />

        <Drawer.Screen
          name="Chatbots/index"
          options={{
            drawerLabel: 'Chatbots',
            title: 'Chatbots',
            drawerIcon: ({ color }) => (
              <Icon name="robot" size={24} color={color} />
            ),
          }}
        />

        <Drawer.Screen
          name="Dashboard/index"
          options={{
            drawerLabel: 'Dashboard',
            title: 'Dashboard',            
            drawerIcon: ({ color }) => (
              <Icon name="chart-bar" size={24} color={color} />
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
  logoutContainer: {
    padding: 20,
    borderTopWidth: 1,
    borderTopColor: '#444',
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  logoutText: {
    color: 'white',
    marginLeft: 10,
    fontSize: 16,
  },
});
