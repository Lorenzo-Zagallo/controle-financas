import React from "react";
import { View, StyleSheet, Text, ScrollView, Pressable, Dimensions } from 'react-native';
import { useFinancas } from '../../context/ContextoFinancas'; 
import { LineChart } from "react-native-chart-kit";
import { Ionicons } from '@expo/vector-icons';

const screenWidth = Dimensions.get("window").width;

// Formata moeda
const formatarMoeda = (value) => `R$ ${value.toFixed(2).replace('.', ',')}`;

// Componente Barra de Progresso (Reutilizado)
const BarraProgresso = ({ progresso }) => {
    let corBarra = '#28a745';
    if (progresso > 75) corBarra = '#ffc107';
    if (progresso > 90) corBarra = '#dc3545';
    const progressoLimitado = Math.min(progresso, 100);
    return (
        <View style={styles.barraContainer}>
            <View style={[styles.barraProgressoPreenchimento, { width: `${progressoLimitado}%`, backgroundColor: corBarra }]} />
        </View>
    );
};

const TelaPainel = ({ navigation }) => {
    const { 
        saldoTotal, receitaTotal, despesaTotal, 
        transacoes, orcamentos, gastosDoMesPorCategoria, categorias,
        dadosEvolucaoFinanceira 
    } = useFinancas();

    // Filtra as 5 últimas transações
    const ultimasTransacoes = transacoes.slice(0, 5);

    // Filtra categorias com orçamento definido
    const categoriasComOrcamento = categorias.filter(c => orcamentos[c.id] > 0).slice(0, 3); // Mostra apenas 3

    return (
        <ScrollView style={styles.screen} contentContainerStyle={styles.container}>
            
            {/* --- CARD DE SALDO --- */}
            <View style={styles.saldoContainer}>
                <Text style={styles.saldoTexto}>Saldo Atual</Text>
                <Text style={styles.saldoValor}>{formatarMoeda(saldoTotal)}</Text>

                <View style={styles.incomeExpenseContainer}>
                    <View style={styles.incomeContainer}>
                        <Text style={styles.incomeExpenseTexto}>Receitas</Text>
                        <Text style={[styles.incomeExpenseValor, styles.receitaTexto]}>
                            {formatarMoeda(receitaTotal)}
                        </Text>
                    </View>
                    <View style={styles.expenseContainer}>
                        <Text style={styles.incomeExpenseTexto}>Despesas</Text>
                        <Text style={[styles.incomeExpenseValor, styles.despesaTexto]}>
                            {formatarMoeda(despesaTotal)}
                        </Text>
                    </View>
                </View>
            </View>

            {/* --- EVOLUÇÃO FINANCEIRA --- */}
            <View style={styles.containerDivisoria}>
                <Text style={styles.containerTitulo}>Evolução Financeira</Text>
                <Text style={styles.containerSubtitulo}>Saldo líquido dos últimos meses</Text>
                
                <LineChart
                    data={dadosEvolucaoFinanceira}
                    width={screenWidth - 40}
                    height={220}
                    yAxisLabel="R$ "
                    yAxisSuffix=""
                    yAxisInterval={1}
                    chartConfig={{
                        backgroundColor: "#ffffff",
                        backgroundGradientFrom: "#ffffff",
                        backgroundGradientTo: "#ffffff",
                        decimalPlaces: 0,
                        color: (opacity = 1) => `rgba(174, 0, 255, ${opacity})`, // Cor da linha (Roxo)
                        labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
                        style: { borderRadius: 16 },
                        propsForDots: { r: "4", strokeWidth: "2", stroke: "#ae00ff" }
                    }}
                    bezier // Linha curva suave
                    style={{ marginVertical: 8, borderRadius: 16 }}
                />
            </View>

            {/* --- RESUMO DE METAS (Top 3) --- */}
            <View style={styles.containerDivisoria}>
                <Text style={styles.containerTitulo}>Metas (Resumo)</Text>
                {categoriasComOrcamento.length > 0 ? (
                    categoriasComOrcamento.map(cat => {
                        const meta = orcamentos[cat.id];
                        const gasto = gastosDoMesPorCategoria[cat.id] || 0;
                        const percent = (gasto / meta) * 100;
                        
                        return (
                            <View key={cat.id} style={styles.itemMeta}>
                                <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
                                    <Text style={{fontWeight: 'bold'}}>{cat.nome}</Text>
                                    <Text style={{color: '#666'}}>{Math.round(percent)}%</Text>
                                </View>
                                <BarraProgresso progresso={percent} />
                            </View>
                        );
                    })
                ) : (
                    <Text style={styles.textoVazio}>Nenhuma meta definida.</Text>
                )}
                <Pressable onPress={() => navigation.navigate('Orçamentos')}>
                    <Text style={styles.linkVerMais}>Ver todas as metas</Text>
                </Pressable>
            </View>

            {/* --- GASTOS RECENTES --- */}
            <View style={styles.containerDivisoria}>
                <Text style={styles.containerTitulo}>Atividade Recente</Text>
                {ultimasTransacoes.length > 0 ? (
                    ultimasTransacoes.map(item => (
                        <View key={item.id} style={styles.itemTransacaoMini}>
                            <View>
                                <Text style={{fontWeight: 'bold'}}>{item.descricao}</Text>
                                <Text style={{fontSize: 12, color: '#888'}}>{item.data.split('-').reverse().slice(0,2).join('/')}</Text>
                            </View>
                            <Text style={{ 
                                color: item.tipo === 'expense' ? '#DC3545' : '#28A745',
                                fontWeight: 'bold' 
                            }}>
                                {item.tipo === 'expense' ? '- ' : '+ '}{formatarMoeda(item.valor)}
                            </Text>
                        </View>
                    ))
                ) : (
                    <Text style={styles.textoVazio}>Nenhuma transação recente.</Text>
                )}
                <Pressable onPress={() => navigation.navigate('Transações')}>
                    <Text style={styles.linkVerMais}>Ver extrato completo</Text>
                </Pressable>
            </View>

        </ScrollView>
    );
};

const styles = StyleSheet.create({
    // ... (Seus estilos anteriores: screen, container, saldoContainer, etc.)
    screen: { flex: 1, backgroundColor: '#f5f5f5' },
    container: { paddingHorizontal: 20, paddingTop: 30, paddingBottom: 50 },
    
    // Estilos do Saldo (Mantidos)
    saldoContainer: { backgroundColor: '#fff', borderRadius: 12, padding: 20, marginBottom: 20, elevation: 4 },
    saldoTexto: { fontSize: 16, color: '#555', fontWeight: '600' },
    saldoValor: { fontSize: 36, fontWeight: 'bold', color: '#222', marginTop: 4 },
    incomeExpenseContainer: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 20, borderTopWidth: 1, borderTopColor: '#eee', paddingTop: 15 },
    incomeContainer: { alignItems: 'flex-start' },
    expenseContainer: { alignItems: 'flex-end' },
    incomeExpenseTexto: { fontSize: 14, color: '#888' },
    incomeExpenseValor: { fontSize: 18, fontWeight: 'bold', marginTop: 4 },
    receitaTexto: { color: '#28a745' },
    despesaTexto: { color: '#dc3545' },

    // Estilos das Seções
    containerDivisoria: { 
        backgroundColor: '#fff', 
        borderRadius: 12, 
        padding: 15, 
        marginBottom: 20,
        elevation: 2 
    },
    containerTitulo: { fontSize: 18, fontWeight: 'bold', color: '#333', marginBottom: 5 },
    containerSubtitulo: { fontSize: 14, color: '#888', marginBottom: 15 },
    
    // Estilos Específicos
    itemMeta: { marginBottom: 10 },
    barraContainer: { height: 8, width: '100%', backgroundColor: '#e9ecef', borderRadius: 4, marginTop: 5, overflow: 'hidden' },
    barraProgressoPreenchimento: { height: '100%', borderRadius: 4 },
    
    itemTransacaoMini: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: 10,
        borderBottomWidth: 1,
        borderBottomColor: '#f0f0f0'
    },
    
    textoVazio: { color: '#999', fontStyle: 'italic', marginVertical: 10 },
    linkVerMais: { color: '#ae00ff', fontWeight: 'bold', marginTop: 10, textAlign: 'right' }
});

export default TelaPainel;