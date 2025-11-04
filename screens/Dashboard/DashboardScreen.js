import React from "react";
import { View, StyleSheet, Text, FlatList } from 'react-native';
import { useFinancas } from '../../context/FinanceContext'; // importa o Hook

const DashboardScreen = () => {
    // chama o Hook para pegar as categorias e outros dados
    const { categorias, transacoes, carregando } = useFinancas();

    // função utilitária para encontrar o nome da categoria pelo ID
    const getCategoryName = (categoryId) => {
        const categoria = categorias.find(category => category.id === categoryId);
        return categoria ? categoria.nome : 'Sem Categoria';
    };

    // renderiza cada item da lista de transações
    const renderItem = ({ item }) => {
        const isExpense = item.tipo === 'expense';
        const itemColor = isExpense ? '#DC3545' : '#28A745';

        return (
            <View style={styles.transactionItem}>
                <View style={styles.descriptionContainer}>
                    <Text style={styles.descriptionText}>• {item.descricao} ({getCategoryName(item.categoriaId)})</Text>
                </View>
                <Text style={[styles.amountText, { color: itemColor }]}> {isExpense ? '- ' : '+ '}R$ {item.valor.toFixed(2).replace('.', ',')}</Text>
            </View>
        );
    };


    return (
        <View style={styles.container}>
            <View style={{ padding: 20 }}>
                <Text style={styles.titulo}>Página Inicial (Dashboard)</Text>
                <Text style={styles.subtitulo}>Aqui você verá o saldo total e um resumo dos gastos do mês.</Text>
            </View>

            {carregando ? (
                <Text>Carregando dados...</Text>
            ) : (
                <>
                    <Text style={styles.titleCategories}>Categorias Carregadas ({categorias.length}):</Text>
                    <FlatList
                        style={styles.lista}
                        data={categorias}
                        keyExtractor={item => item.id}
                        renderItem={({ item }) => (
                            <Text style={[styles.itemCategoria, { color: item.cor }]}>• {item.nome} ({item.tipo})</Text>
                        )}
                    />
                    <Text style={styles.titleCategories}>Transações Carregadas ({transacoes.length}):</Text>
                    <FlatList
                        style={styles.lista}
                        data={transacoes}
                        keyExtractor={item => item.id}
                        renderItem={renderItem}
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
    },
    titulo: {
        fontSize: 24,
        fontWeight: 'bold',
        textAlign: 'center',
        width: '100%',
        color: '#333',
    },
    subtitulo: {
        fontSize: 20,
        textAlign: 'center',
        width: '100%',
        color: '#555',
    },
    lista: {
        marginTop: 20,
        textAlign: 'center',
        width: '100%',
    },
    titleCategories: {
        fontSize: 20,
        fontWeight: 'bold',
        marginTop: 30,
        textAlign: 'center',
        width: '100%',
    },
    itemCategoria: {
        fontSize: 16,
        marginVertical: 4,
        backgroundColor: '#fff',
        padding: 10,
        borderRadius: 5,
    },
    transactionItem: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        backgroundColor: '#fff',
        padding: 15,
        borderRadius: 8,
        marginBottom: 10,
        elevation: 2,
    },
});

export default DashboardScreen;