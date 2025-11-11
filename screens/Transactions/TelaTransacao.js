import React, { useState } from "react";
import { View, Text, StyleSheet, Pressable, FlatList } from "react-native";
import { useFinancas } from "../../context/ContextoFinancas";
import { Ionicons } from '@expo/vector-icons';

// nome dos meses para exibição
const nomesMeses = ['Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho', 'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'];

const TelaTransacao = ({ navigation }) => {

    // pega as transações e categorias do contexto
    const { transacoes, categorias } = useFinancas(); // hook para acessar transações e categorias

    const hoje = new Date();
    const [mesFiltro, setMesFiltro] = useState(hoje.getMonth() + 1); // mês atual (1-12)
    const [anoFiltro, setAnoFiltro] = useState(hoje.getFullYear()); // ano atual

    const transacoesFiltradas = transacoes.filter(item => {
        const data = new Date(item.data);
        return data.getMonth() + 1 === mesFiltro && data.getFullYear() === anoFiltro;
    });

    // função utilizatária para formatar a data
    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return `${date.getDate().toString().padStart(2, '0')}/${(date.getMonth() + 1).toString().padStart(2, '0')}`
    }

    // função utilitária para encontrar o nome da categoria pelo ID
    const getCategoryName = (categoryId) => {
        const categoria = categorias.find(category => category.id === categoryId);
        return categoria ? categoria.nome : 'Sem Categoria';
    };

    // função para navegar para a tela de adicionar transação
    const handleNavigateToAddTransaction = () => {
        navigation.navigate('AdicionarTransacao');
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
                <View>
                    <Text style={[styles.amountText, { color: itemColor }]}>
                        {isExpense ? '- ' : '+ '}
                        R$ {item.valor.toFixed(2).replace('.', ',')}
                    </Text>
                    <Text>{item.data}</Text>
                </View>
            </View>
        );
    };

    // função para alterar o filtro (para fins ded demonstração, muda apenas o mês)
    const alterarMesFiltro = (passo) => {
        let novoMes = mesFiltro + passo;
        let novoAno = anoFiltro;

        if (novoMes < 1) {
            novoMes = 12;
            novoAno -= 1;
        } else if (novoMes > 12) {
            novoMes = 1;
            novoAno += 1;
        }
        setMesFiltro(novoMes);
        setAnoFiltro(novoAno);
    }

    return (
        <View style={styles.container}>
            {/* <View style={{ padding: 20 }}>
                <Text style={styles.title}>Tela de Transações (Transactions)</Text>
                <Text style={styles.subtitle}>Aqui você poderá ver suas transações financeiras.</Text>
            </View> */}

            <View style={styles.filterControl}>
                <Pressable onPress={() => alterarMesFiltro(-1)}>
                    <Ionicons name="chevron-back" size={24} color="#007bff" />
                </Pressable>
                <Text style={styles.filterText}>
                    {nomesMeses[mesFiltro - 1]} de {anoFiltro}
                </Text>
                <Pressable onPress={() => alterarMesFiltro(1)}>
                    <Ionicons name="chevron-forward" size={24} color="#007bff" />
                </Pressable>
            </View>

            <Text style={styles.title}>Minhas Transações ({transacoes.length})</Text>

            {transacoesFiltradas.length > 0 ? (
                <FlatList
                    data={transacoesFiltradas}
                    keyExtractor={item => item.id}
                    renderItem={renderItem}
                    contentContainerStyle={{ paddingBottom: 80 }}
                    style={styles.list}
                />
            ) : (
                <View style={styles.emptyContainer}>
                    <Ionicons name="cash-outline" size={80} color="gray" />
                    <Text style={styles.emptyText}>Nenhuma transação registrada em {nomesMeses[mesFiltro - 1]}.</Text>
                    <Text style={styles.emptyTextHint}>Mude o mês ou adicione um novo registro.</Text>
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
        marginTop: 10,
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
    },

    // estilos para data
    filterControl: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 20,
        paddingVertical: 15,
        backgroundColor: '#fff',
        borderBottomWidth: 1,
        borderBottomColor: '#ddd',
    },
    filterText: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#333',
    },
});

export default TelaTransacao;
