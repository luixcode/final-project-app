import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Alert } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import AsyncStorage from '@react-native-async-storage/async-storage';

const Mapa = () => {
  const [marcadores, setMarcadores] = useState([]);
  const [region, setRegion] = useState(null);

  useEffect(() => {
    cargarMarcadores();
  }, []);

  const cargarMarcadores = async () => {
    try {
      const keys = await AsyncStorage.getAllKeys();
      const visitasKeys = keys.filter(key => key.startsWith('visita_'));
      const visitas = await AsyncStorage.multiGet(visitasKeys);

      const marcadores = visitas.map(([key, value]) => {
        const visita = JSON.parse(value);
        return {
          latitud: parseFloat(visita.latitud),
          longitud: parseFloat(visita.longitud),
          codigoCentro: visita.codigoCentro,
          motivo: visita.motivo,
        };
      });

      if (marcadores.length > 0) {
        // Centrar el mapa en la primera ubicación
        const primeraUbicacion = marcadores[0];
        setRegion({
          latitude: primeraUbicacion.latitud,
          longitude: primeraUbicacion.longitud,
          latitudeDelta: 0.0922,
          longitudeDelta: 0.0421,
        });
      }

      setMarcadores(marcadores);
    } catch (error) {
      console.error('Error al cargar los marcadores:', error);
      Alert.alert('Error', 'Ocurrió un error al cargar los marcadores.');
    }
  };

  return (
    <View style={styles.container}>
      <MapView
        style={styles.map}
        region={region || {
          latitude: 37.78825,
          longitude: -122.4324,
          latitudeDelta: 0.0922,
          longitudeDelta: 0.0421,
        }}
      >
        {marcadores.map((marcador, index) => (
          <Marker
            key={index}
            coordinate={{
              latitude: marcador.latitud,
              longitude: marcador.longitud,
            }}
            title={`Centro: ${marcador.codigoCentro}`}
            description={`Motivo: ${marcador.motivo}`}
          />
        ))}
      </MapView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'center',
  },
  map: {
    width: '100%',
    height: '100%',
  },
});

export default Mapa;
