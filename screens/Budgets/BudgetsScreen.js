import React from "react";
import { View, StyleSheet, Text } from 'react-native';

const BudgetsScreen = () => {
    return (
        <View style={styles.container}>
            <Text style={styles.title}>Tela de Orçamentos</Text>
            <Text>Aqui você poderá gerenciar seus orçamentos mensais.</Text>
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
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 10,
    },
});

export default BudgetsScreen;