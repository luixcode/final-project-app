import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ActivityIndicator } from 'react-native';

const Horoscopo = () => {
    const [horoscope, setHoroscope] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchHoroscope = async () => {
            try {
                const response = await fetch('https://horoscopeapi-horoscope-v1.p.rapidapi.com/daily?date=today', {
                    method: 'GET',
                    headers: {
                        'x-rapidapi-host': 'horoscopeapi-horoscope-v1.p.rapidapi.com',
                        'x-rapidapi-key': 'b94b65bc44msh3765c827b66eea0p1780cdjsnb2cf113fce9e',
                    },
                });
                const data = await response.json();
                setHoroscope(data);
            } catch (error) {
                console.error(error);
            } finally {
                setLoading(false);
            }
        };

        fetchHoroscope();
    }, []);

    if (loading) {
        return <ActivityIndicator size="large" color="#0000ff" />;
    }

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Horóscopo de Hoy</Text>
            {horoscope ? (
                Object.entries(horoscope).map(([sign, details]) => (
                    <View key={sign} style={styles.horoscopeContainer}>
                        <Text style={styles.sign}>{sign}</Text>
                        <Text style={styles.description}>{details.daily_horoscope}</Text>
                    </View>
                ))
            ) : (
                <Text>No se pudo cargar el horóscopo.</Text>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 16,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 16,
    },
    horoscopeContainer: {
        marginBottom: 16,
        alignItems: 'center',
    },
    sign: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 8,
    },
    description: {
        fontSize: 16,
        textAlign: 'center',
    },
});

export default Horoscopo;
