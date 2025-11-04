import React from "react";
import { View, StyleSheet, Text, FlatList, Pressable } from 'react-native';
import { useFinancas } from "../../context/FinanceContext";
import { Ionicons } from '@expo/vector-icons';

const BudgetsScreen = ({ navigation }) => {
    const { categorias } = useFinancas(); // Usa o hook para acessar categorias

    const handleNavigateToAddCategory = () => {
        // Navega para a tela AddCategory, que está definida no BudgetStack
        navigation.navigate('AddCategory');
    }

    return (
        <View style={styles.container}>
            <View style={{ padding: 20 }}>
                <Text style={styles.title}>Tela de Orçamentos (Budgets)</Text>
                <Text style={styles.subtitle}>Aqui você poderá gerenciar seus orçamentos mensais.</Text>
            </View>

            <Text style={styles.title}>Minhas Categorias ({categorias.length})</Text>

            <FlatList
                data={categorias}
                keyExtractor={item => item.id}
                renderItem={({ item }) => (
                    <View style={styles.categoryItem}>
                        <View style={[styles.colorIndicator, { backgroundColor: item.cor }]} />
                        <Text style={styles.categoryName}>{item.nome}</Text>
                        <Text style={[styles.categoryType, item.tipo === 'income' ? styles.income : styles.expense]}>
                            {item.tipo === 'income' ? 'Receita' : 'Despesa'}
                        </Text>
                    </View>
                )}
                style={styles.list}
            />

            {/* Botão Flutuante para Adicionar Categoria */}
            <Pressable style={styles.addButton} onPress={handleNavigateToAddCategory}>
                <Ionicons name="add" size={30} color="#fff" />
            </Pressable>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f5f5f5',
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        textAlign: 'center',
        width: '100%',
        color: '#333',
    },
    subtitle: {
        fontSize: 20,
        textAlign: 'center',
        width: '100%',
        color: '#555',
    },
    list: {
        paddingHorizontal: 20,
    },
    categoryItem: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#fff',
        padding: 15,
        borderRadius: 8,
        marginBottom: 10,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 2,
        elevation: 2,
    },
    colorIndicator: {
        width: 10,
        height: 10,
        borderRadius: 5,
        marginRight: 10,
    },
    categoryName: {
        flex: 1,
        fontSize: 16,
        fontWeight: '600',
    },
    categoryType: {
        fontSize: 14,
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 4,
        fontWeight: 'bold',
        color: '#fff',
    },
    income: {
        backgroundColor: '#28a745', // Verde
    },
    expense: {
        backgroundColor: '#dc3545', // Vermelho
    },
    addButton: {
        position: 'absolute',
        bottom: 30,
        right: 30,
        backgroundColor: '#007bff',
        width: 60,
        height: 60,
        borderRadius: 30,
        justifyContent: 'center',
        alignItems: 'center',
        elevation: 5,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.3,
        shadowRadius: 3,
    }
});

export default BudgetsScreen;