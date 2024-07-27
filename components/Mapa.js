import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Alert, Text } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import AsyncStorage from '@react-native-async-storage/async-storage';

const Mapa = () => {
  const [coordenadas, setCoordenadas] = useState([]);
  const [selectedCoordinates, setSelectedCoordinates] = useState(null);

  useEffect(() => {
    cargarCoordenadas();
  }, [coordenadas]);

  const cargarCoordenadas = async () => {
    try {
      const keys = await AsyncStorage.getAllKeys();
      const visitasGuardadas = await AsyncStorage.multiGet(keys);
      const visitasParseadas = visitasGuardadas
        .map(([key, value]) => (value ? JSON.parse(value) : null))
        .filter(visita => visita && !isNaN(parseFloat(visita.latitud)) && !isNaN(parseFloat(visita.longitud)));
      
      if (visitasParseadas.length === 0) {
        Alert.alert('No hay registros', 'No se encontraron coordenadas para mostrar en el mapa.');
      }

      setCoordenadas(visitasParseadas);
    } catch (error) {
      console.error('Error al cargar coordenadas:', error);
      Alert.alert('Error', 'Ocurrió un error al cargar las coordenadas.');
    }
  };

  const seleccionarCoordenadas = (lat, long) => {
    setSelectedCoordinates({ latitud: lat, longitud: long });
  };

  if (coordenadas.length === 0) {
    return (
      <View style={styles.container}>
        <Text style={styles.mensaje}>No hay coordenadas para mostrar en el mapa.</Text>
      </View>
    );
  }

  const initialRegion = {
    latitude: coordenadas[0].latitud,
    longitude: coordenadas[0].longitud,
    latitudeDelta: 0.0922,
    longitudeDelta: 0.0421,
  };

  return (
    <View style={styles.container}>
      <MapView
        style={styles.map}
        initialRegion={initialRegion}
      >
        {coordenadas.map((visita, index) => (
          <Marker
            key={index}
            coordinate={{
              latitude: parseFloat(visita.latitud),
              longitude: parseFloat(visita.longitud),
            }}
            title={`Visita de ${visita.nombreTecnico}`}
            description={`Código: ${visita.codigoCentro}\nMotivo: ${visita.motivo}`}
            onPress={() => seleccionarCoordenadas(parseFloat(visita.latitud), parseFloat(visita.longitud))}
          />
        ))}
        {selectedCoordinates && (
          <Marker
            coordinate={{
              latitude: selectedCoordinates.latitud,
              longitude: selectedCoordinates.longitud,
            }}
            title="Ubicación Seleccionada"
            description="Esta es la ubicación seleccionada."
          />
        )}
      </MapView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'black',
  },
  map: {
    width: '100%',
    height: '100%',
  },
  mensaje: {
    color: 'white',
    fontSize: 18,
    textAlign: 'center',
  },
});

export default Mapa;
