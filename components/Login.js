// Login.js
import React, { useState } from 'react';
import { StyleSheet, View, Text, TextInput, TouchableOpacity, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const Login = ({ navigation }) => {
  const [nombre, setNombre] = useState('');
  const [contraseña, setContraseña] = useState('');

  const iniciarSesion = async () => {
    if (!nombre || !contraseña) {
      Alert.alert('Error', 'El nombre y la contraseña son obligatorios.');
      return;
    }

    try {
      const usuarios = JSON.parse(await AsyncStorage.getItem('usuarios')) || [];
      const usuarioValido = usuarios.find(user => user.nombre === nombre && user.contraseña === contraseña);

      if (usuarioValido) {
        Alert.alert('Éxito', 'Inicio de sesión exitoso.');
        navigation.navigate('Inicio');
      } else {
        Alert.alert('Error', 'Nombre de usuario o contraseña incorrectos.');
      }
    } catch (error) {
      console.error('Error al iniciar sesión:', error);
      Alert.alert('Error', 'Ocurrió un error al iniciar sesión.');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.titulo}>Inicio de Sesión</Text>
      <TextInput
        style={styles.input}
        placeholder="Nombre"
        value={nombre}
        onChangeText={setNombre}
        placeholderTextColor='black'
      />
      <TextInput
        style={styles.input}
        placeholder="Contraseña"
        value={contraseña}
        onChangeText={setContraseña}
        secureTextEntry
        placeholderTextColor='black'
      />
      <TouchableOpacity style={styles.button} onPress={iniciarSesion}>
        <Text style={styles.buttonText}>Iniciar Sesión</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('RegistroUsuario')}>
        <Text style={styles.buttonText}>Registrar Usuario</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#f4f4f4',
  },
  titulo: {
    fontSize: 24,
    marginBottom: 20,
    fontWeight: 'bold',
    color: '#333',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 12,
    marginBottom: 15,
    width: '100%',
    borderRadius: 8,
    backgroundColor: 'white',
  },
  button: {
    backgroundColor: '#3498db',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    marginVertical: 10,
    width: '100%',
    alignItems: 'center',
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default Login;
