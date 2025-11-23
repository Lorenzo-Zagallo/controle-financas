import React from "react";
import { View, StyleSheet, Text, Dimensions, ScrollView } from 'react-native';
import { useFinancas } from "../../context/ContextoFinancas";
import { PieChart } from "react-native-chart-kit";
import { Ionicons } from '@expo/vector-icons';

// pega a largura da tela do dispositivo
const screenWidth = Dimensions.get('window').width;

const TelaRelatorio = () => {

    // 1. Pega os dados de gráfico do contexto
    const { dadosGraficoDespesas, dadosGraficoReceitas, despesaTotal, receitaTotal } = useFinancas();

    const chartConfig = {
        color: (opacity = 1) => `rgba(26, 255, 146, ${opacity})`,
        strokeWidth: 2,
    };

    // 2. Verifica se há dados para exibir
    // (A Variável 'dadosGraficoDespesas' vem do contexto)
    const haDadosDespesas = dadosGraficoDespesas && dadosGraficoDespesas.length > 0;
    const haDadosReceitas = dadosGraficoReceitas && dadosGraficoReceitas.length > 0;

    return (
        <ScrollView>
            <View style={styles.container}>
                <View>
                    <Text style={styles.titulo}>{/* Tela de  */}Relatórios do Mês {/* (Reports) */}</Text>
                    <Text style={styles.subtitulo}>Aqui você poderá visualizar gráficos e análises das suas finanças.</Text>
                </View>
                <View style={styles.containerReports}>
                    <Text style={styles.titulo}>Relatório de Despesas</Text>
                    <Text style={styles.subtitulo}>Distribição de gastos do mês atual</Text>

                    {haDadosDespesas ? (
                        <View>
                            <PieChart
                                data={dadosGraficoDespesas}
                                width={screenWidth - 40} // largura do grafico
                                height={220}
                                chartConfig={chartConfig}
                                accessor={"population"} // propriedade que contém o valor
                                backgroundColor={"transparent"}
                                paddingLeft={"15"}
                                center={[10, 0]} // posição do gráfico
                                absolute // mostra os valores absolutos (R$)
                            />
                            <Text style={styles.textoRelatorio}>Despesa Total:
                                <Text style={[styles.resultadoRelatorio, { color: '#ec283cff' }]}>
                                    R$ {despesaTotal.toFixed(2).replace('.', ',')}
                                </Text>
                            </Text>
                        </View>
                    ) : (
                        // mensagem de "Sem dados"
                        <View style={styles.emptyContainer}>
                            <Ionicons name="pie-chart-outline" size={80} color="gray" />
                            <Text style={styles.emptyText}>Sem despesas registradas este mês</Text>
                            <Text style={styles.emptyTextHint}>Adicione transações para ver o gráfico.</Text>
                        </View>
                    )}

                </View>
                <View style={styles.containerReports}>
                    <Text style={styles.titulo}>Relatório de Receitas</Text>
                    <Text style={styles.subtitulo}>Distribição de ganhos do mês atual</Text>

                    {haDadosReceitas ? (
                        <View>
                            <PieChart
                                data={dadosGraficoReceitas}
                                width={screenWidth - 40} // largura do grafico
                                height={220}
                                chartConfig={chartConfig}
                                accessor={"population"} // propriedade que contém o valor
                                backgroundColor={"transparent"}
                                paddingLeft={"15"}
                                center={[10, 0]} // posição do gráfico
                                absolute // mostra os valores absolutos (R$)
                            />
                            <Text style={styles.textoRelatorio}>Receita Total:
                                <Text style={[styles.resultadoRelatorio, { color: '#39b84aff' }]}>
                                    R$ {receitaTotal.toFixed(2).replace('.', ',')}
                                </Text>
                            </Text>
                        </View>
                    ) : (
                        // mensagem de "Sem dados"
                        <View style={styles.emptyContainer}>
                            <Ionicons name="pie-chart-outline" size={80} color="gray" />
                            <Text style={styles.emptyText}>Sem receitas registradas este mês</Text>
                            <Text style={styles.emptyTextHint}>Adicione transações para ver o gráfico.</Text>
                        </View>
                    )}
                </View>
            </View>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f5f5f5',
        padding: 20,
    },
    titulo: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 10,
        textAlign: 'center',
        width: '100%',
    },
    subtitulo: {
        fontSize: 20,
        marginTop: 20,
        textAlign: 'center',
        width: '100%',
        color: '#555',
    },
    // estilo para os relatórios
    containerReports: {
        marginTop: 50,
        borderColor: 'rgba(59, 59, 59, 0.00)',
        borderWidth: 1,
        borderRadius: 15,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
    },
    textoRelatorio: {
        fontSize: 20,
        padding: 25,
        alignSelf: 'center'
    },
    resultadoRelatorio: {
        marginLeft: 15,
        fontWeight: 'bold',
    },
    // estilos para a lista vazia
    emptyContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
        marginTop: 50,
    },
    emptyText: {
        fontSize: 18,
        color: 'gray',
        marginTop: 20,
        textAlign: 'center',
    },
    emptyTextHint: {
        fontSize: 14,
        color: 'lightgray',
        marginTop: 5,
        textAlign: 'center',
    },
});

export default TelaRelatorio;