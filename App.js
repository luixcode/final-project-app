import 'react-native-gesture-handler';
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { createStackNavigator } from '@react-navigation/stack';
import RegistroUsuario from './components/RegistroUsuario';
import Login from './components/Login';
import Registro from './components/Registro';
import Mapa from './components/Mapa';
import Lista from './components/ListarRegistros';
import Noticias from './components/Noticas';

const Drawer = createDrawerNavigator();
const Stack = createStackNavigator();

const App = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Login">
        <Stack.Screen name="Login" component={Login} options={{ headerShown: false }} />
        <Stack.Screen name="RegistroUsuario" component={RegistroUsuario} options={{ headerShown: false }} />
        <Stack.Screen name="Inicio">
          {() => (
            <Drawer.Navigator initialRouteName="Registro">
              <Drawer.Screen name="Registro" component={Registro} />
              <Drawer.Screen name="Mapa" component={Mapa} />
              <Drawer.Screen name="Lista de Visitas" component={Lista} />
              <Drawer.Screen name="Noticias" component={Noticias} />
            </Drawer.Navigator>
          )}
        </Stack.Screen>
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;
