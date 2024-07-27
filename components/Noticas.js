import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text, FlatList, TouchableOpacity, Linking, ActivityIndicator } from 'react-native';
import axios from 'axios';

const Noticias = () => {
  const [noticias, setNoticias] = useState([]);
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    const obtenerNoticias = async () => {
      try {
        const response = await axios.get('https://remolacha.net/wp-json/wp/v2/posts?search=minerd');
        setNoticias(response.data);
      } catch (error) {
        console.error('Error al obtener noticias:', error);
      } finally {
        setCargando(false);
      }
    };

    obtenerNoticias();
  }, []);

  const renderNoticia = ({ item }) => (
    <View style={styles.noticiaContainer}>
      <Text style={styles.titulo}>{item.title.rendered}</Text>
      <Text style={styles.descripcion}>{item.excerpt.rendered.replace(/<[^>]*>/g, '')}</Text>
      <TouchableOpacity
        style={styles.button}
        onPress={() => Linking.openURL(item.link)}
      >
        <Text style={styles.buttonText}>Leer Más</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={styles.container}>
      {cargando ? (
        <ActivityIndicator size="large" color="#3498db" />
      ) : (
        <FlatList
          data={noticias}
          renderItem={renderNoticia}
          keyExtractor={(item) => item.id.toString()}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f4f4f4',
  },
  noticiaContainer: {
    backgroundColor: 'white',
    padding: 15,
    marginBottom: 15,
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 2,
  },
  titulo: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  descripcion: {
    fontSize: 14,
    color: '#333',
    marginBottom: 10,
  },
  button: {
    backgroundColor: '#3498db',
    paddingVertical: 10,
    borderRadius: 8,
    alignItems: 'center',
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default Noticias;
