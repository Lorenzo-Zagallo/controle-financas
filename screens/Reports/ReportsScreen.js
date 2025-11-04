import React from "react";
import { View, StyleSheet, Text } from 'react-native';

const ReportsScreen = () => {
    return (
        <View style={styles.container}>
            <Text style={styles.titulo}>Tela de Relatórios (Reports)</Text>
            <Text style={styles.subtitulo}>Aqui você poderá visualizar gráficos e análises das suas finanças.</Text>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#f5f5f5',
        padding: 20,
    },
    titulo: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 10,
        textAlign: 'center',
        width: '100%',
    },
    subtitulo: {
        fontSize: 20,
        marginTop: 20,
        textAlign: 'center',
        width: '100%',
        color: '#555',
    }
});

export default ReportsScreen;