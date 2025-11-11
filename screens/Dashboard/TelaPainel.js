import React from "react";
import { View, StyleSheet, Text, FlatList, Button, ScrollView, Pressable } from 'react-native';
import { useFinancas } from '../../context/ContextoFinancas'; // importa o Hook

// função para auxiliar para formatar como moeda brasileira BRL
const formatarMoeda = (value) => {
    return `R$ ${value.toFixed(2).replace('.', ',')}`;
}

const BotaoCustomizado = ({ onPress, texto, cor }) => (
    <Pressable onPress={onPress} style={[[styles.buttonPressable], { backgroundColor: cor }]}>
        <Text style={styles.buttonTexto}>{texto}</Text>
    </Pressable>
)

const TelaPainel = () => {
    // chama o Hook para pegar as categorias e outros dados
    const { categorias, carregando, transacoes, saldoTotal, receitaTotal, despesaTotal } = useFinancas();

    // função utilitária para encontrar o nome da categoria pelo ID
    const obterNomeCategoria = (categoryId) => {
        const categoria = categorias.find(category => category.id === categoryId);
        return categoria ? categoria.nome : 'Sem Categoria';
    };

    // renderiza cada item da lista de transações
    const renderItem = ({ item }) => {
        const isExpense = item.tipo === 'expense';
        const itemColor = isExpense ? '#DC3545' : '#28A745';

        return (
            <View style={styles.itemTransacao}>
                <View>
                    <Text>• {item.descricao} ({obterNomeCategoria(item.categoriaId)})</Text>
                </View>
                <Text style={{ color: itemColor }}> {isExpense ? '- ' : '+ '}R$ {item.valor.toFixed(2).replace('.', ',')}</Text>
            </View>
        );
    };

    const ganhos = 'R$ 10.000';
    const gastos = 'R$ 2.300';

    return (
        <ScrollView style={styles.screen} contentContainerStyle={styles.container}>
            <View style={styles.saldoContainer}>
                <Text style={styles.saldoTexto}>Saldo Atual</Text>
                <Text style={styles.saldoValor}>{formatarMoeda(saldoTotal)}</Text>

                <View style={styles.incomeExpenseContainer}>
                    {/* Receitas */}
                    <View style={styles.incomeContainer}>
                        <Text style={styles.incomeExpenseTexto}>Receitas</Text>
                        <Text style={[styles.incomeExpenseValor, styles.receitaTexto]}>
                            {formatarMoeda(receitaTotal)}
                        </Text>
                        <BotaoCustomizado texto="Detalhes" cor={'rgba(36, 155, 46, 0.8)'} onPress={""} />
                    </View>
                    {/* Despesas */}
                    <View style={styles.expenseContainer}>
                        <Text style={styles.incomeExpenseTexto}>Despesas</Text>
                        <Text style={[styles.incomeExpenseValor, styles.despesaTexto]}>
                            {formatarMoeda(despesaTotal)}
                        </Text>
                        <BotaoCustomizado texto="Detalhes" cor={'rgba(209, 35, 35, 0.8)'} onPress={""} />
                    </View>
                </View>
            </View>
            {/*
                <Text>Página Inicial (Dashboard)</Text>
                <Text>Aqui você verá o saldo total e um resumo dos gastos do mês.</Text>
             */}
            {/* <View style={styles.containerDivisoria}>
                <Text style={styles.containerTitulo}>Resumo Financeiro</Text>
                <View style={{ marginTop: 10 }}>
                    <Text style={styles.containerSubtitulo}>Período: Novembro 2025</Text>
                    <View style={styles.containersResumoFinanceiro}>
                        <Text style={styles.containerTexto}>{`Ganhos no Mês:`}
                            <Text style={{ fontWeight: 'bold', color: '#28A745' }}>  {`${ganhos}`}</Text>
                        </Text>
                        <Button title="Detalhes" onPress={() => { }} />
                    </View>
                    <View style={styles.containersResumoFinanceiro}>
                        <Text style={styles.containerTexto}>{`Gastos no Mês:`}
                            <Text style={{ fontWeight: 'bold', color: '#DC3545' }}>  {`${gastos}`}</Text>
                        </Text>
                        <Button title="Detalhes" onPress={() => { }} />
                    </View>
                </View>
            </View> */}
            <View style={styles.containerDivisoria}>
                <Text style={styles.containerTitulo}>Evolução Financeira</Text>
                <Text style={styles.containerSubtitulo}>(Gráfico de evolução financeira virá aqui)</Text>
            </View>
            <View style={styles.containerDivisoria}>
                <Text style={styles.containerTitulo}>Metas</Text>
                <Text style={styles.containerSubtitulo}>(Resumo das metas financeiras virá aqui)</Text>
            </View>
            <View style={styles.containerDivisoria}>
                <Text style={styles.containerTitulo}>Gastos Recentes</Text>
                <Text style={styles.containerSubtitulo}>(Lista dos gastos recentes virá aqui)</Text>
            </View>

            {carregando ? (
                <Text>Carregando dados...</Text>
            ) : (
                <>
                    <Text style={[[styles.containerTitulo], { marginTop: 30 }]}>Categorias Carregadas ({categorias.length}):</Text>
                    <FlatList
                        style={{ marginTop: 20, width: '100%' }}
                        data={categorias}
                        keyExtractor={item => item.id}
                        renderItem={({ item }) => (
                            <Text style={[styles.itemCategoria, { color: item.cor }]}>• {item.nome} ({item.tipo})</Text>
                        )}
                    />
                    <Text style={[[styles.containerTitulo], { marginTop: 30 }]}>Transações Carregadas ({transacoes.length}):</Text>
                    <FlatList
                        style={{ marginTop: 20, width: '100%' }}
                        data={transacoes}
                        keyExtractor={item => item.id}
                        renderItem={renderItem}
                    />
                </>
            )}
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    screen: {
        flex: 1,
        backgroundColor: '#f5f5f5',
    },
    container: {
        paddingHorizontal: 20,
        paddingTop: 30
    },
    containerTitulo: {
        fontSize: 24,
        fontWeight: 'bold',
        textAlign: 'center',
        width: '100%',
        color: '#333',
    },
    containerSubtitulo: {
        fontSize: 20,
        textAlign: 'center',
        width: '100%',
        color: '#555',
    },
    containerTexto: {
        fontSize: 16,
        width: '100%',
        color: '#444444ff',
    },
    containerDivisoria: {
        padding: 20,
        width: '100%',
        borderBlockColor: '#ccc',
        borderBottomWidth: 1,
        marginBottom: 20
    },
    containersResumoFinanceiro: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginVertical: 10,
        alignItems: 'center',
    },

    // estilos para itens de listas
    itemCategoria: {
        fontSize: 16,
        marginVertical: 4,
        backgroundColor: '#fff',
        padding: 10,
        borderRadius: 5,
    },
    itemTransacao: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        backgroundColor: '#fff',
        padding: 15,
        borderRadius: 8,
        marginBottom: 10,
        elevation: 2,
    },

    // estilos do saldo
    saldoContainer: {
        backgroundColor: '#fff',
        borderRadius: 12,
        padding: 20,
        marginBottom: 20,
        elevation: 4,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
    },
    saldoTexto: {
        fontSize: 16,
        color: '#555',
        fontWeight: '600',
    },
    saldoValor: {
        fontSize: 36,
        fontWeight: 'bold',
        color: '#222',
        marginTop: 4,
    },
    incomeExpenseContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 20,
        borderTopWidth: 1,
        borderTopColor: '#eee',
        paddingTop: 15,
    },
    incomeContainer: {
        flex: 1,
        alignItems: 'flex-start',
    },
    expenseContainer: {
        flex: 1,
        alignItems: 'flex-end',
    },
    incomeExpenseTexto: {
        fontSize: 14,
        color: '#888',
    },
    incomeExpenseValor: {
        fontSize: 18,
        fontWeight: 'bold',
        marginTop: 4,
    },
    receitaTexto: {
        color: '#28a745',
    },
    despesaTexto: {
        color: '#dc3545',
    },
    buttonPressable: {
        backgroundColor: '#ae00ffff',
        paddingVertical: 8,
        paddingHorizontal: 16,
        borderRadius: 10,
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 10
    },
    buttonTexto: {
        color: 'white',
        fontSize: 16,
        fontWeight: 'bold',
    },
});

export default TelaPainel;