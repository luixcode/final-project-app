import React, { useState } from 'react';
import { StyleSheet, View, Text, TextInput, TouchableOpacity, Image, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as ImagePicker from 'expo-image-picker';
import * as DocumentPicker from 'expo-document-picker';

const Registro = () => {
  const [cedulaDirector, setCedulaDirector] = useState('');
  const [codigoCentro, setCodigoCentro] = useState('');
  const [motivo, setMotivo] = useState('');
  const [foto, setFoto] = useState(null);
  const [comentario, setComentario] = useState('');
  const [audio, setAudio] = useState(null);
  const [latitud, setLatitud] = useState('');
  const [longitud, setLongitud] = useState('');
  const [fecha, setFecha] = useState('');
  const [hora, setHora] = useState('');

  const guardarVisita = async () => {
    if (!cedulaDirector || !codigoCentro || !motivo || !fecha || !hora || !latitud || !longitud) {
      Alert.alert('Error', 'Todos los campos son obligatorios.');
      return;
    }
    const visita = { cedulaDirector, codigoCentro, motivo, foto, comentario, audio, latitud, longitud, fecha, hora };
    try {
      await AsyncStorage.setItem(`visita_${Date.now()}`, JSON.stringify(visita));
      setCedulaDirector('');
      setCodigoCentro('');
      setMotivo('');
      setFoto(null);
      setComentario('');
      setAudio(null);
      setLatitud('');
      setLongitud('');
      setFecha('');
      setHora('');
      Alert.alert('Éxito', 'Visita guardada correctamente.');
    } catch (error) {
      console.error('Error al guardar la visita:', error);
      Alert.alert('Error', 'Ocurrió un error al guardar la visita.');
    }
  };

  const seleccionarFoto = async () => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 1,
      });
      if (!result.canceled && result.assets && result.assets.length > 0) {
        setFoto(result.assets[0].uri);
      }
    } catch (error) {
      console.error('Error al Seleccionar la foto:', error);
      Alert.alert('Error', 'Ocurrió un error al seleccionar la foto.');
    }
  };

  const seleccionarAudio = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: 'audio/*',
        copyToCacheDirectory: false,
      });
      if (!result.canceled) {
        setAudio(result.assets[0].uri);
        Alert.alert('Éxito', 'Audio seleccionado correctamente.');
      } else {
        console.log('Selección de audio cancelada.');
      }
    } catch (error) {
      console.error('Error al seleccionar el audio:', error);
      Alert.alert('Error', 'Ocurrió un error al seleccionar el audio.');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.titulo}>REGISTRO DE VISITA</Text>
      <TextInput
        style={styles.input}
        placeholder="Cédula del Director"
        value={cedulaDirector}
        onChangeText={setCedulaDirector}
        placeholderTextColor='white'
      />
      <TextInput
        style={styles.input}
        placeholder="Código del Centro"
        value={codigoCentro}
        onChangeText={setCodigoCentro}
        placeholderTextColor='white'
      />
      <TextInput
        style={styles.input}
        placeholder="Motivo de la Visita"
        value={motivo}
        onChangeText={setMotivo}
        placeholderTextColor='white'
      />
      <TextInput
        style={styles.input}
        placeholder="Comentario"
        value={comentario}
        onChangeText={setComentario}
        multiline
        placeholderTextColor='white'
      />
      <TextInput
        style={styles.input}
        placeholder="Latitud"
        value={latitud}
        onChangeText={setLatitud}
        keyboardType="numeric"
        placeholderTextColor='white'
      />
      <TextInput
        style={styles.input}
        placeholder="Longitud"
        value={longitud}
        onChangeText={setLongitud}
        keyboardType="numeric"
        placeholderTextColor='white'
      />
      <TextInput
        style={styles.input}
        placeholder="Fecha"
        value={fecha}
        onChangeText={setFecha}
        placeholderTextColor='white'
      />
      <TextInput
        style={styles.input}
        placeholder="Hora"
        value={hora}
        onChangeText={setHora}
        placeholderTextColor='white'
      />
      <TouchableOpacity style={styles.button} onPress={seleccionarFoto}>
        <Text style={styles.buttonText}>Seleccionar Foto</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.button} onPress={seleccionarAudio}>
        <Text style={styles.buttonText}>Seleccionar Audio</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.buttonGuardar} onPress={guardarVisita}>
        <Text style={styles.buttonText}>Guardar Visita</Text>
      </TouchableOpacity>
      {foto && <Image source={{ uri: foto }} style={styles.image} />}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: 'black',
  },
  titulo: {
    color: 'white',
    fontSize: 25,
    marginBottom: 30,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 10,
    marginBottom: 10,
    color: 'white',
    width: '80%',
    textAlign: 'center',
  },
  image: {
    width: 200,
    height: 200,
    marginTop: 20,
  },
  button: {
    backgroundColor: '#3498db',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    marginBottom: 10,
  },
  buttonGuardar: {
    backgroundColor: '#27ae60',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    marginBottom: 10,
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    textAlign: 'center',
  },
});

export default Registro;
