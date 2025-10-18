import React from "react";
import { View, StyleSheet, Text } from 'react-native';

const DashboardScreen = () => {
    return (
        <View style={styles.container}>
            <Text style={styles.title}>Página Inicial (Dashboard)</Text>
            <Text>Aqui você verá o saldo total e um resumo dos gastos do mês.</Text>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#f5f5f5',
        padding: 20,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 10,
    },
});

export default DashboardScreen;