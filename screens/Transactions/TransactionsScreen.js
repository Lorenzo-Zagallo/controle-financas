import { View, Text, StyleSheet, Pressable, FlatList } from "react-native";
import { useFinancas } from "../../context/FinanceContext";
import { Ionicons } from '@expo/vector-icons';

const TransactionsScreen = ({ navigation }) => {

    // pega as transações e categorias do contexto
    const { transacoes, categorias } = useFinancas(); // hook para acessar transações e categorias

    // função utilitária para encontrar o nome da categoria pelo ID
    const getCategoryName = (categoryId) => {
        const categoria = categorias.find(category => category.id === categoryId);
        return categoria ? categoria.nome : 'Sem Categoria';
    };

    // função para navegar para a tela de adicionar transação
    const handleNavigateToAddTransaction = () => {
        navigation.navigate('AddTransaction');
    }

    // renderiza cada item da lista de transações
    const renderItem = ({ item }) => {
        const isExpense = item.tipo === 'expense';
        const itemColor = isExpense ? '#DC3545' : '#28A745';

        return (
            <View style={styles.transactionItem}>
                <View style={styles.descriptionContainer}>
                    <Text style={styles.descriptionText}>{item.descricao}</Text>
                    <Text style={styles.categoryText}>{getCategoryName(item.categoriaId)}</Text>
                </View>
                <Text style={[styles.amountText, { color: itemColor }]}>
                    {isExpense ? '- ' : '+ '}
                    R$ {item.valor.toFixed(2).replace('.', ',')}
                </Text>
            </View>
        );
    };

    return (
        <View style={styles.container}>
            <View style={{ padding: 20 }}>
                <Text style={styles.title}>Tela de Transações (Transactions)</Text>
                <Text style={styles.subtitle}>Aqui você poderá ver suas transações financeiras.</Text>
            </View>
            
            <Text style={styles.title}>Minhas Transações ({transacoes.length})</Text>

            {transacoes.length > 0 ? (
                <FlatList
                    data={transacoes}
                    keyExtractor={item => item.id}
                    renderItem={renderItem}
                    contentContainerStyle={{ paddingBottom: 80 }}
                    style={styles.list}
                />
            ) : (
                <View style={styles.emptyContainer}>
                    <Ionicons name="cash-outline" size={80} color="gray" />
                    <Text style={styles.emptyText}>Você ainda não tem transações registradas.</Text>
                    <Text style={styles.emptyTextHint}>Clique no '+' para começar.</Text>
                </View>
            )}

            <Pressable style={styles.addButton} onPress={handleNavigateToAddTransaction}>
                <Ionicons name="add" size={30} color="#fff" />
            </Pressable>
        </View>
    );
};

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
        padding: 10,
    },
    // Estilos do Item de Transação
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
    descriptionContainer: {
        flex: 1,
    },
    descriptionText: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#333',
    },
    categoryText: {
        fontSize: 12,
        color: '#888',
        marginTop: 2,
    },
    amountText: {
        fontSize: 18,
        fontWeight: 'bold',
        marginLeft: 10,
    },
    // Estilos para a lista vazia
    emptyContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
    },
    emptyText: {
        fontSize: 18,
        color: 'gray',
        marginTop: 20,
        textAlign: 'center', // Para evitar cortes de texto
        width: '100%',
    },
    emptyTextHint: {
        fontSize: 14,
        color: 'lightgray',
        marginTop: 5,
        textAlign: 'center',
        width: '100%',
    },
    // Estilos do Botão Flutuante
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
    }
});

export default TransactionsScreen;
