import React from "react";
import { View, Text, StyleSheet } from "react-native";

const TransactionsScreen = () => {
    return (
        <View style={styles.container}>
            <Text style={styles.title}>Tela de Transações</Text>
            <Text style={styles.subtitle}>Aqui você poderá ver suas transações financeiras.</Text>
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
        textAlign: 'center',
        width: '100%',
    },
    subtitle: {
        fontSize: 20,
        marginTop: 20,
        textAlign: 'center',
        width: '100%',
        color: '#555',
    }
});

export default TransactionsScreen;
