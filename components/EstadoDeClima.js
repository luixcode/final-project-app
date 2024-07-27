import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text, ActivityIndicator, Alert } from 'react-native';

const API_URL = 'https://api.open-meteo.com/v1/forecast';

const EstadoDelClima = ({ latitud, longitud }) => {
  const [clima, setClima] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const obtenerClima = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await fetch(`${API_URL}?latitude=${latitud}&longitude=${longitud}&hourly=temperature_2m,precipitation`);
        if (!response.ok) {
          throw new Error('Error al obtener datos del clima.');
        }
        const data = await response.json();
        setClima(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    obtenerClima();
  }, [latitud, longitud]);

  if (loading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#3498db" />
      </View>
    );
  }

  if (error) {
    Alert.alert('Error', error);
    return null;
  }

  return (
    <View style={styles.container}>
      {clima && clima.hourly && clima.hourly.temperature_2m && clima.hourly.temperature_2m.length > 0 ? (
        <View>
          <Text style={styles.texto}>Temperatura actual: {clima.hourly.temperature_2m[0]} °C</Text>
          <Text style={styles.texto}>Precipitación: {clima.hourly.precipitation[0]} mm</Text>
        </View>
      ) : (
        <Text style={styles.texto}>No se pudieron obtener los datos del clima.</Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: '#ffffff',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ddd',
    marginTop: 20,
  },
  texto: {
    fontSize: 16,
    color: '#333',
  },
});

export default EstadoDelClima;
