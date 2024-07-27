import React, { useState } from 'react';
import { StyleSheet, View, Text, TextInput, TouchableOpacity, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const RegistroUsuario = ({ navigation }) => {
  const [nombre, setNombre] = useState('');
  const [contraseña, setContraseña] = useState('');

  const registrarUsuario = async () => {
    if (!nombre || !contraseña) {
      Alert.alert('Error', 'El nombre y la contraseña son obligatorios.');
      return;
    }

    try {
      const usuarios = JSON.parse(await AsyncStorage.getItem('usuarios')) || [];
      const usuarioExistente = usuarios.find(user => user.nombre === nombre);

      if (usuarioExistente) {
        Alert.alert('Error', 'El usuario ya está registrado.');
        return;
      }

      const nuevoUsuario = { nombre, contraseña };
      usuarios.push(nuevoUsuario);
      await AsyncStorage.setItem('usuarios', JSON.stringify(usuarios));
      Alert.alert('Éxito', 'Usuario registrado correctamente.');
      setNombre('');
      setContraseña('');
      navigation.navigate('Login');
    } catch (error) {
      console.error('Error al registrar el usuario:', error);
      Alert.alert('Error', 'Ocurrió un error al registrar el usuario.');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.titulo}>Registro de Usuario</Text>
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
      <TouchableOpacity style={styles.button} onPress={registrarUsuario}>
        <Text style={styles.buttonText}>Registrar</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('Login')}>
        <Text style={styles.buttonText}>Ir a Login</Text>
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

export default RegistroUsuario;
