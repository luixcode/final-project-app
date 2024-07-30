import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text, TextInput, TouchableOpacity, Image, Alert, ScrollView } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as ImagePicker from 'expo-image-picker';
import * as DocumentPicker from 'expo-document-picker';
import { Audio } from 'expo-av';
import { useNavigation } from '@react-navigation/native';
import * as MediaLibrary from 'expo-media-library';

const Registro = () => {
  const [nombreTecnico, setNombreTecnico] = useState('');
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
  const [sound, setSound] = useState(null);
  const navigation = useNavigation();

  useEffect(() => {
    const requestPermissions = async () => {
      const { status } = await MediaLibrary.requestPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permiso denegado', 'Necesitamos acceso a tus archivos para continuar.');
      }
    };

    requestPermissions();
  }, []);

  const guardarCoordenadas = async () => {
    try {
      await AsyncStorage.setItem('latitud', latitud);
      await AsyncStorage.setItem('longitud', longitud);
    } catch (error) {
      console.error('Error al guardar las coordenadas:', error);
    }
  };

  const guardarVisita = async () => {
    if (!nombreTecnico || !cedulaDirector || !codigoCentro || !motivo || !fecha || !hora || !latitud || !longitud) {
      Alert.alert('Error', 'Todos los campos son obligatorios.');
      return;
    }
    const visita = { nombreTecnico, cedulaDirector, codigoCentro, motivo, foto, comentario, audio, latitud, longitud, fecha, hora };
    try {
      await AsyncStorage.setItem(`visita_${Date.now()}`, JSON.stringify(visita));
      await guardarCoordenadas();
      setNombreTecnico('');
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
      setSound(null);
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
      console.error('Error al seleccionar la foto:', error);
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
        console.log(audio);
        Alert.alert('Éxito', 'Audio seleccionado correctamente.');
      } else {
        console.log('Selección de audio cancelada.');
      }
    } catch (error) {
      console.error('Error al seleccionar el audio:', error);
      Alert.alert('Error', 'Ocurrió un error al seleccionar el audio.');
    }
  };

  const reproducirAudio = async () => {
    console.log(audio);
    if (audio) {
      try {
        const { sound } = await Audio.Sound.createAsync({ uri: audio });
        setSound(sound);
        await sound.playAsync();
      } catch (error) {
        console.error('Error al reproducir el audio:', error);
        Alert.alert('Error', 'Ocurrió un error al reproducir el audio.');
      }
    } else {
      Alert.alert('Error', 'No se ha seleccionado ningún audio.');
    }
  };

  const detenerAudio = async () => {
    if (sound) {
      try {
        await sound.stopAsync();
        await sound.unloadAsync();
        setSound(null);
      } catch (error) {
        console.error('Error al detener el audio:', error);
        Alert.alert('Error', 'Ocurrió un error al detener el audio.');
      }
    } else {
      Alert.alert('Error', 'No hay audio en reproducción.');
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.titulo}>Registro de Visita</Text>
      <TextInput
        style={styles.input}
        placeholder="Nombre del Técnico"
        value={nombreTecnico}
        onChangeText={setNombreTecnico}
        placeholderTextColor='black'
      />
      <TextInput
        style={styles.input}
        placeholder="Cédula del Director"
        value={cedulaDirector}
        onChangeText={setCedulaDirector}
        placeholderTextColor='black'
      />
      <TextInput
        style={styles.input}
        placeholder="Código del Centro"
        value={codigoCentro}
        onChangeText={setCodigoCentro}
        placeholderTextColor='black'
      />
      <TextInput
        style={styles.input}
        placeholder="Motivo de la Visita"
        value={motivo}
        onChangeText={setMotivo}
        placeholderTextColor='black'
      />
      <TextInput
        style={styles.input}
        placeholder="Comentario"
        value={comentario}
        onChangeText={setComentario}
        multiline
        placeholderTextColor='black'
      />
      <TextInput
        style={styles.input}
        placeholder="Latitud"
        value={latitud}
        onChangeText={setLatitud}
        keyboardType="numeric"
        placeholderTextColor='black'
      />
      <TextInput
        style={styles.input}
        placeholder="Longitud"
        value={longitud}
        onChangeText={setLongitud}
        keyboardType="numeric"
        placeholderTextColor='black'
      />
      <TextInput
        style={styles.input}
        placeholder="Fecha"
        value={fecha}
        onChangeText={setFecha}
        placeholderTextColor='black'
      />
      <TextInput
        style={styles.input}
        placeholder="Hora"
        value={hora}
        onChangeText={setHora}
        placeholderTextColor='black'
      />
      <TouchableOpacity style={styles.button} onPress={seleccionarFoto}>
        <Text style={styles.buttonText}>Seleccionar Foto</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.button} onPress={seleccionarAudio}>
        <Text style={styles.buttonText}>Seleccionar Audio</Text>
      </TouchableOpacity>
      {foto && <Image source={{ uri: foto }} style={styles.image} />}
      {audio && (
        <View>
          <TouchableOpacity style={styles.button} onPress={reproducirAudio}>
            <Text style={styles.buttonText}>Reproducir Audio</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.button} onPress={detenerAudio}>
            <Text style={styles.buttonText}>Detener Audio</Text>
          </TouchableOpacity>
        </View>
      )}
      <TouchableOpacity style={styles.buttonGuardar} onPress={guardarVisita}>
        <Text style={styles.buttonText}>Guardar Visita</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    justifyContent: 'flex-start',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#f4f4f4',
  },
  titulo: {
    color: '#333',
    fontSize: 24,
    marginBottom: 20,
    fontWeight: 'bold',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 12,
    marginBottom: 15,
    color: '#333',
    borderRadius: 5,
    width: '100%',
    backgroundColor: 'white',
  },
  button: {
    backgroundColor: '#007bff',
    padding: 10,
    borderRadius: 5,
    marginBottom: 15,
    width: '100%',
    alignItems: 'center',
  },
  buttonGuardar: {
    backgroundColor: 'green',
    padding: 10,
    borderRadius: 5,
    marginBottom: 15,
    width: '100%',
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  image: {
    width: 200,
    height: 200,
    marginBottom: 15,
  },
});

export default Registro;
