import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text, TextInput, FlatList, TouchableOpacity, Image, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Audio } from 'expo-av';
import * as MediaLibrary from 'expo-media-library';
import EstadoDelClima from './EstadoDeClima';

const ListaRegistro = () => {
  const [visitas, setVisitas] = useState([]);
  const [mostrarDetalle, setMostrarDetalle] = useState(false);
  const [visitaSeleccionada, setVisitaSeleccionada] = useState(null);
  const [sound, setSound] = useState(null);
  const [codigoBusqueda, setCodigoBusqueda] = useState('');
  const [mostrarClima, setMostrarClima] = useState(false);

  useEffect(() => {
    cargarVisitas();
    requestPermissions();
  }, []);

  const requestPermissions = async () => {
    const { status } = await MediaLibrary.requestPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permiso denegado', 'Necesitamos acceso a tus archivos para continuar.');
    }}

  const cargarVisitas = async () => {
    try {
      const keys = await AsyncStorage.getAllKeys();
      const visitasKeys = keys.filter(key => key.startsWith('visita_'));
      const visitasGuardadas = await AsyncStorage.multiGet(visitasKeys);
      const visitasParseadas = visitasGuardadas
        .map(([key, value]) => (value ? JSON.parse(value) : null))
        .filter(visita => visita !== null);
      setVisitas(visitasParseadas);
    } catch (error) {
      console.error('Error al cargar visitas:', error);
      Alert.alert('Error', 'Ocurrió un error al cargar las visitas.');
    }
  };

  const buscarVisita = () => {
    const resultado = visitas.find(visita => visita.codigoCentro === codigoBusqueda || visita.cedulaDirector === codigoBusqueda);
    if (resultado) {
      setVisitaSeleccionada(resultado);
      setMostrarDetalle(true);
      setMostrarClima(false);
    } else {
      Alert.alert('No encontrado', 'No se encontraron detalles para el código de centro o Cédula proporcionado.');
    }
  };

  const renderItemVisita = ({ item }) => (
    <View style={styles.itemContainer}>
      <View style={styles.item}>
        {item.foto && <Image source={{ uri: item.foto }} style={styles.image} />}
        <Text style={styles.itemText}>Código del Centro: {item.codigoCentro}</Text>
        <Text style={styles.itemSubtext}>Motivo: {item.motivo}</Text>
        <TouchableOpacity
          style={styles.button}
          onPress={() => verDetalleVisita(item)}
        >
          <Text style={styles.buttonText}>Ver Detalle</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  const verDetalleVisita = (visita) => {
    setVisitaSeleccionada(visita);
    setMostrarDetalle(true);
    setMostrarClima(false);
  };

  const regresarAVisitas = async () => {
    setMostrarDetalle(false);
    setVisitaSeleccionada(null);
    if (sound) {
      await sound.stopAsync();
      await sound.unloadAsync();
      setSound(null);
    }
  };

  const reproducirAudio = async () => {
    if (visitaSeleccionada?.audio) {
      try {
        if (sound) {
          // Si ya hay un audio en reproducción, detenerlo
          await sound.stopAsync();
          await sound.unloadAsync();
          setSound(null);
        }

        const { sound: newSound } = await Audio.Sound.createAsync({ uri: visitaSeleccionada.audio });
        setSound(newSound);
        await newSound.playAsync();

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
      await sound.stopAsync();
      await sound.unloadAsync();
      setSound(null);
    }
  };

  const borrarTodasLasVisitas = async () => {
    try {
      const keys = await AsyncStorage.getAllKeys();
      const visitasKeys = keys.filter(key => key.startsWith('visita_'));
      await AsyncStorage.multiRemove(visitasKeys);
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
          <Text style={styles.title}>Visitas Registradas</Text>
          <TextInput
            style={styles.input}
            placeholder="Código del Centro o Cédula del Director"
            value={codigoBusqueda}
            onChangeText={setCodigoBusqueda}
            placeholderTextColor='black'
          />
          <TouchableOpacity style={styles.button} onPress={buscarVisita}>
            <Text style={styles.buttonText}>Buscar</Text>
          </TouchableOpacity>
          <FlatList
            data={visitas}
            renderItem={renderItemVisita}
            keyExtractor={(item) => item.codigoCentro || item.cedulaDirector}
          />
          <TouchableOpacity style={styles.button} onPress={cargarVisitas}>
            <Text style={styles.buttonText}>Actualizar</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.button2} onPress={borrarTodasLasVisitas}>
            <Text style={styles.buttonText}>Borrar Visitas</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <View style={styles.detalleVisita}>
          {visitaSeleccionada?.foto && <Image source={{ uri: visitaSeleccionada.foto }} style={styles.image} />}
          <Text style={styles.detailText}>Cédula del Director: {visitaSeleccionada?.cedulaDirector}</Text>
          <Text style={styles.detailText}>Código del Centro: {visitaSeleccionada?.codigoCentro}</Text>
          <Text style={styles.detailText}>Motivo: {visitaSeleccionada?.motivo}</Text>
          <Text style={styles.detailText}>Comentario: {visitaSeleccionada?.comentario}</Text>
          <Text style={styles.detailText}>Latitud: {visitaSeleccionada?.latitud}</Text>
          <Text style={styles.detailText}>Longitud: {visitaSeleccionada?.longitud}</Text>
          <Text style={styles.detailText}>Fecha: {visitaSeleccionada?.fecha}</Text>
          <Text style={styles.detailText}>Hora: {visitaSeleccionada?.hora}</Text>
          {visitaSeleccionada?.audio && (
            <View>
              <TouchableOpacity style={styles.button} onPress={reproducirAudio}>
                <Text style={styles.buttonText}>{sound ? 'Detener Audio' : 'Reproducir Audio'}</Text>
              </TouchableOpacity>
              {sound && (
                <TouchableOpacity style={styles.button} onPress={detenerAudio}>
                  <Text style={styles.buttonText}>Detener Audio</Text>
                </TouchableOpacity>
              )}
            </View>
          )}
          <TouchableOpacity
            style={styles.button}
            onPress={() => setMostrarClima(!mostrarClima)}
          >
            <Text style={styles.buttonText}>Ver Clima</Text>
          </TouchableOpacity>
          {mostrarClima && visitaSeleccionada && (
            <EstadoDelClima latitud={visitaSeleccionada.latitud} longitud={visitaSeleccionada.longitud} />
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
    backgroundColor: '#eaeaea',
  },
  listaContainer: {
    flex: 1,
    width: '100%',
    alignItems: 'center',
    paddingHorizontal: 10,
  },
  itemContainer: {
    width: '100%',
    marginBottom: 10,
  },
  item: {
    backgroundColor: '#ffffff',
    padding: 15,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  itemText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  itemSubtext: {
    fontSize: 16,
    color: '#666',
  },
  button: {
    backgroundColor: '#3498db',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
    marginVertical: 5,
    alignItems: 'center',
  },
  button2: {
    backgroundColor: 'red',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
    marginVertical: 5,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  image: {
    width: '100%',
    height: 200,
    marginBottom: 20,
    borderRadius: 8,
  },
  detalleVisita: {
    width: '100%',
    alignItems: 'center',
    paddingHorizontal: 10,
  },
  detailText: {
    fontSize: 16,
    marginBottom: 5,
    color: '#333',
  },
  input: {
    height: 40,
    borderColor: '#ddd',
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 10,
    marginBottom: 10,
    width: '100%',
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#333',
  },
});

export default ListaRegistro;
