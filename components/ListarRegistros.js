import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text, TextInput, FlatList, TouchableOpacity, Image, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Audio } from 'expo-av';

const Lista = () => {
  const [visitas, setVisitas] = useState([]);
  const [mostrarDetalle, setMostrarDetalle] = useState(false);
  const [visitaSeleccionada, setVisitaSeleccionada] = useState(null);
  const [sound, setSound] = useState(null);
  const [codigoBusqueda, setCodigoBusqueda] = useState('');
  const [resultadoBusqueda, setResultadoBusqueda] = useState(null);

  useEffect(() => {
    cargarVisitas();
  }, []);

  const cargarVisitas = async () => {
    try {
      const keys = await AsyncStorage.getAllKeys();
      const visitasGuardadas = await AsyncStorage.multiGet(keys);
      const visitasParseadas = visitasGuardadas.map(([key, value]) => {
        return value ? JSON.parse(value) : null;
      }).filter(visita => visita !== null);
      setVisitas(visitasParseadas);
    } catch (error) {
      console.error('Error al cargar visitas:', error);
    }
  };

  const buscarVisita = () => {
    const resultado = visitas.find(visita => visita.codigoCentro === codigoBusqueda || visita.cedulaDirector === codigoBusqueda);
    if (resultado) {
        setVisitaSeleccionada(resultado);
      setMostrarDetalle(true);
    } else {
      Alert.alert('No encontrado', 'No se encontraron detalles para el código de centro o Cedula proporcionado.');
    }
  };

  const renderItemVisita = ({ item }) => (
    <TouchableOpacity style={styles.itemContainer} onPress={() => verDetalleVisita(item)}>
      <View style={styles.item}>
        <Text>{item.codigoCentro}</Text>
      </View>
    </TouchableOpacity>
  );

  const verDetalleVisita = (visita) => {
    setVisitaSeleccionada(visita);
    setMostrarDetalle(true);
  };

  const regresarAVisitas = async () => {
    setMostrarDetalle(false);
    setVisitaSeleccionada(null);
    setResultadoBusqueda(null);
    if (sound) {
      await sound.stopAsync();
      await sound.unloadAsync();
      setSound(null);
    }
  };

  const reproducirAudio = async () => {
    if (visitaSeleccionada?.audio) {
      const { sound } = await Audio.Sound.createAsync({ uri: visitaSeleccionada.audio });
      setSound(sound);
      await sound.playAsync();
    } else {
      Alert.alert('Error', 'No hay audio disponible para esta visita.');
    }
  };

  const borrarTodasLasVisitas = async () => {
    try {
      await AsyncStorage.clear();
      setVisitas([]);
      Alert.alert('Éxito', 'Todas las visitas han sido borradas correctamente.');
    } catch (error) {
      console.error('Error al borrar las visitas:', error);
      Alert.alert('Error', 'Ocurrió un error al intentar borrar las visitas.');
    }
  };

  return (
    <View style={styles.container}>
      {!mostrarDetalle ? (
        <View style={styles.listaContainer}>
              <Text style={styles.text}>Visitas</Text>
          <TextInput
            style={styles.input}
            placeholder="Código del Centro o Cedula Del Director"
            value={codigoBusqueda}
            onChangeText={setCodigoBusqueda}
            placeholderTextColor='white'
          />
          <TouchableOpacity style={styles.button} onPress={buscarVisita}>
            <Text style={styles.buttonText}>Buscar</Text>
          </TouchableOpacity>
        
          <FlatList
            data={visitas}
            renderItem={renderItemVisita}
            keyExtractor={(item, index) => `${index}`}
          />
          <TouchableOpacity style={styles.button} onPress={borrarTodasLasVisitas}>
            <Text style={styles.buttonText}>Borrar Visitas</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <View style={styles.detalleVisita}>
          {visitaSeleccionada?.foto && <Image source={{ uri: visitaSeleccionada.foto }} style={styles.image} />}
          <Text style={styles.textD}>Cédula del Director: {visitaSeleccionada?.cedulaDirector}</Text>
          <Text style={styles.textD}>Código del Centro: {visitaSeleccionada?.codigoCentro}</Text>
          <Text style={styles.textD}>Motivo: {visitaSeleccionada?.motivo}</Text>
          <Text style={styles.textD}>Comentario: {visitaSeleccionada?.comentario}</Text>
          <Text style={styles.textD}>Latitud: {visitaSeleccionada?.latitud}</Text>
          <Text style={styles.textD}>Longitud: {visitaSeleccionada?.longitud}</Text>
          <Text style={styles.textD}>Fecha: {visitaSeleccionada?.fecha}</Text>
          <Text style={styles.textD}>Hora: {visitaSeleccionada?.hora}</Text>
          {visitaSeleccionada?.audio && (
            <TouchableOpacity style={styles.button} onPress={reproducirAudio}>
              <Text style={styles.buttonText}>Reproducir Audio</Text>
            </TouchableOpacity>
          )}
          <TouchableOpacity style={styles.button} onPress={regresarAVisitas}>
            <Text style={styles.buttonText}>Regresar</Text>
          </TouchableOpacity>
        </View>
      )}
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
  listaContainer: {
    flex: 1,
    width: '100%',
    alignItems: 'center',
  },
  itemContainer: {
    width: '100%',
  },
  item: {
    backgroundColor: 'white',
    padding: 20,
    marginVertical: 10,
    borderRadius: 10,
  },
  detalleVisita: {
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  text: {
    fontSize: 25,
    marginBottom: 10,
    color: 'white',
    textAlign: 'center',
  },
  textD: {
    fontSize: 20,
    marginBottom: 10,
    color: 'white',
    textAlign: 'center',
  },
  image: {
    width: 300,
    height: 300,
    marginBottom: 20,
    borderRadius: 20,
    borderWidth: 2,
    borderColor: '#3498db',
  },
  button: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    marginVertical: 10,
    backgroundColor: '#3498db',
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    textAlign: 'center',
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
});

export default Lista;
