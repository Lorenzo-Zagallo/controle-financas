import React from "react";
import { View, StyleSheet, Text } from 'react-native';
import { useFinance } from '../../context/FinanceContext'; // importa o Hook
import { FlatList } from "react-native-web";

const DashboardScreen = () => {
    // chama o Hook para pegar as categorias e outros dados
    const { categories, isLoading } = useFinance();

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Página Inicial (Dashboard)</Text>
            <Text>Aqui você verá o saldo total e um resumo dos gastos do mês.</Text>

            {isLoading ? (
                <Text>Carregando dados...</Text>
            ) : (
                <>
                    <Text style={styles.subtitle}>Categorias Carregadas ({categories.length}):</Text>
                    <FlatList 
                        data={categories}
                        keyExtractor={item => item.id}
                        renderItem={({ item }) => (
                            <Text style={{ color: item.color, fontSize: 18 }}>• {item.name} ({item.type})</Text>
                        )} 
                        style={{ marginTop: 10 }}
                    />
                </>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#f5f5f5',
        paddingHorizontal: 20,
        paddingTop: 50,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 10,
    },
    subtitle: {
        fontSize: 20,
        marginTop: 20,
        fontWeight: '600',
    }
});

export default DashboardScreen;