import React, { useState } from "react";
import { View, StyleSheet, Text, FlatList, Pressable, Modal, TextInput, Alert } from 'react-native';
import { useFinancas } from "../../context/ContextoFinancas";
import { Ionicons } from '@expo/vector-icons';


// ===== COMPONENTES AUXILIARES (BarraProgresso e FormatarMoeda) =====

/**
 * Componente simples para renderizar a Barra de Progresso.
 * @param {object} props 
 * @param {number} props.progresso - A porcentagem atual (0-100)
 */
const BarraProgresso = ({ progresso }) => {
    let corBarra = '#28a745';

    // LÓGICA DE MUDANÇA DE COR
    if (progresso > 75) corBarra = '#ffc107';
    if (progresso > 90) corBarra = '#dc3545';

    // GARANTE QUE A BARRA NÃO ULTRAPASSE 100% VISUALMENTE
    const progressoLimitado = Math.min(progresso, 100);

    return (
        <View style={styles.barraProgressoFundo}>
            <View style={[styles.barraProgressoPreenchimento,
            { width: `${progressoLimitado}%`, backgroundColor: corBarra }]} />
        </View>
    );
};

// FUNÇÃO AUXILIAR PARA FORMATAR VALORES MONETÁRIOS
const FormatarMoeda = (value) => `R$ ${value.toFixed(2).replace('.', ',')}`;


// ===============  COMPONENTE PRINCIPAL DA TELA =============== 

const BudgetsScreen = ({ navigation }) => {

    const { categorias, orcamentos, gastosDoMesPorCategoria, salvarOrcamento, deletarCategoria } = useFinancas();

    // ESTADOS PARA O MODAL DE ORÇAMENTO
    const [modalVisivel, setModalVisivel] = useState(false);
    const [categoriaAtual, setCategoriaAtual] = useState(null); // GUARDA A CATEGORIA QUE SENDO EDITADA
    const [valorMetaInput, setValorMetaInput] = useState(''); // GUARDA O TEXTO DO INPUT NO MODAL

    // CONTROLA O MENU DE EDIÇÃO/EXCLUSÃO DA CATEGORIA
    const [idCategoriaSelecionada, setIdCategoriaSelecionada] = useState(null);


    // ===== LÓGICA DE NEGÓCIO ===== 

    // LÓGICA COMPLEXA: FILTRAGEM DE CATEGORIAS
    // Filtramos o array de categorias para exibir APENAS as que são do tipo 'expense' (despesa),
    // pois não faz sentido definir um limite de orçamento para uma 'income' (receita).
    const categoriasDeDespesa = categorias.filter(c => c.tipo === 'expense');


    /**
     * Abre o modal para definir/editar a meta de uma categoria específica.
     * @param {object} categoria - O objeto da categoria selecionada.
     */
    const abrirModalMeta = (categoria) => {
        setCategoriaAtual(categoria); // Guarda qual categoria estamos editando

        // LÓGICA DE PREENCHIMENTO DO MODAL:
        // Verifica se já existe um orçamento salvo para este [categoria.id].
        // Se sim, converte para String e preenche o input. Se não, deixa o input vazio.
        const metaAtual = orcamentos[categoria.id] ? String(orcamentos[categoria.id]) : "";
        setValorMetaInput(metaAtual);

        setModalVisivel(true); // Abre o modal
    }


    /**
     * Valida o input e salva a nova meta (orçamento) no Contexto/AsyncStorage.
     */
    const handleSalvarMeta = () => {
        // LÓGICA DE PARSE (Conversão):
        // Converte o texto do input (ex: "500,50") para um número (500.50).
        // Se o input estiver vazio ou inválido, define como 0.
        const valor = parseFloat(valorMetaInput.replace(',', '.')) || 0;

        if (valor < 0) {
            console.log("Erro: O valor da meta não pode ser negativo.");
            return;
        }

        // Chama a função do Contexto para salvar o dado
        salvarOrcamento(categoriaAtual.id, valor);

        // Reseta os estados e fecha o modal
        setModalVisivel(false);
        setCategoriaAtual(null);
        setValorMetaInput('');
    }


    /**
     * Navega para a tela AddCategory, passando o item para edição.
     */
    const handleEditarCategoria = (categoria) => {
        setIdCategoriaSelecionada(null); // Fecha o menu
        // Navega para a tela de Adicionar, mas passando o item
        navigation.navigate('AdicionarCategoria', { categoria: categoria });
    };


    /**
     * Mostra um alerta e deleta a categoria (e seus dados associados).
     */
    const handleDeletarCategoria = (categoria) => {
        setIdCategoriaSelecionada(null); // Fecha o menu
        deletarCategoria(categoria.id)
        /* Alert.alert(
            `Deletar "${categoria.nome}"?`,
            "Atenção: Deletar esta categoria também irá apagar TODAS as transações e orçamentos associados a ela. Esta ação não pode ser desfeita.",
            [
                { text: "Cancelar", style: "cancel" },
                {
                    text: "Deletar",
                    style: "destructive",
                    onPress: () => deletarCategoria(categoria.id)
                }
            ]
        ); */
    };


    /**
     * Renderiza o card individual para cada item da FlatList de Orçamentos.
     * @param {object} props - Propriedades passadas pela FlatList.
     * @param {object} props.item - A categoria de despesa atual.
     */
    const renderItemOrcamento = ({ item }) => {
        // LÓGICA DE CÁLCULO DE ORÇAMENTO:
        // 1. Pega a meta (limite) que o usuário salvou para este item (ex: 500). Se não houver, é 0.
        const meta = orcamentos[item.id] || 0;
        // 2. Pega o total já gasto (calculado no Contexto) para este item (ex: 250). Se não houver, é 0.
        const gastos = gastosDoMesPorCategoria[item.id] || 0;

        // 3. Calcula a porcentagem gasta (ex: 250 / 500 = 0.5 * 100 = 50%).
        // Evita divisão por zero se a meta for 0.
        const percentagem = meta > 0 ? (gastos / meta) * 100 : 0;

        // Verifica se este é o item com o menu aberto
        const estaSelecionado = idCategoriaSelecionada === item.id;

        return (
            // Card de Orçamento clicável
            <View>
                <Pressable style={styles.cardOrcamentoContainer} 
                    onPress={() => abrirModalMeta(item)} // Clique rápido = Edita a Meta
                    onLongPress={() => setIdCategoriaSelecionada(item.id)} // Clique longo = Abre o Menu
                >
                    {/* Cabeçalho (Nome e Ícone de Lápis) */}
                    <View style={styles.cardOrcamentoCabecalho}>
                        <Text style={styles.cardOrcamentoTitulo}>{item.nome}</Text>
                        <Ionicons name="pencil" size={16} color="#007bff" />
                    </View>

                    {/* Barra de Progresso */}
                    <BarraProgresso progresso={percentagem} />

                    {/* Valores (Gasto / Meta) */}
                    <View style={styles.cardOrcamentoValoresContainer}>
                        <Text style={styles.cardOrcamentoValorGasto}>{FormatarMoeda(gastos)}</Text>
                        <Text style={styles.cardOrcamentoValorMeta}>
                            / {meta > 0 ? FormatarMoeda(meta) : 'Sem meta'}
                        </Text>
                    </View>
                </Pressable>

                {/*  MENU CONDICIONAL (Aparece no clique longo) */}
                {estaSelecionado && (
                    <View style={styles.menuContainer}>
                        <Pressable style={[styles.menuBotao, styles.menuBotaoEditar]} onPress={() => handleEditarCategoria(item)}>
                            <Ionicons name="create-outline" size={20} color="#fff" />
                            <Text style={styles.menuTexto}>Editar Categoria</Text>
                        </Pressable>
                        <Pressable style={[styles.menuBotao, styles.menuBotaoDeletar]} onPress={() => handleDeletarCategoria(item)}>
                            <Ionicons name="trash-outline" size={20} color="#fff" />
                            <Text style={styles.menuTexto}>Excluir</Text>
                        </Pressable>
                        <Pressable style={[styles.menuBotao, styles.menuBotaoCancelar]} onPress={() => setIdCategoriaSelecionada(null)}>
                            <Ionicons name="close-circle-outline" size={20} color="#fff" />
                            <Text style={styles.menuTexto}>Cancelar</Text>
                        </Pressable>
                    </View>
                )}
            </View>
        );
    };


    /**
     * Navega para a tela de Adicionar Categoria.
     */
    const handleNavigateToAddCategory = () => {
        // Navega para a tela 'AddCategory' definida no BudgetStack.js
        navigation.navigate('AdicionarCategoria');
    }


    // --- RENDERIZAÇÃO DA TELA ---
    return (
        <View style={styles.containerPrincipal}>

            {/* Título Principal */}
            <View style={styles.containerCabecalho}>
                <Text style={styles.tituloPrincipal}>Orçamentos do Mês</Text>
                <Text style={styles.subtitulo}>Defina seus limites de gasto para cada categoria de despesa.</Text>
            </View>

            {/* Lista Principal de Orçamentos */}
            <FlatList
                // LÓGICA COMPLEXA: USA APENAS AS CATEGORIAS DE DESPESA
                data={categorias}
                keyExtractor={item => item.id}
                renderItem={renderItemOrcamento} // Usa a função de renderização que criamos
                contentContainerStyle={styles.paddingLista}
                // Componente para caso a lista esteja vazia
                ListEmptyComponent={() => (
                    <View style={styles.containerListaVazia}>
                        <Ionicons name="alert-circle-outline" size={50} color="gray" />
                        <Text style={styles.textoListaVazia}>Nenhuma categoria de despesa encontrada.</Text>
                    </View>
                )}
                // extraData diz à FlatList para re-renderizar quando o item selecionado mudar
                extraData={idCategoriaSelecionada}
            />

            {/* Modal para Definir/Editar Meta */}
            <Modal
                animationType="slide"
                transparent={true}
                visible={modalVisivel}
                onRequestClose={() => setModalVisivel(false)} // Permite fechar no "Voltar" do Android
            >
                {/* Fundo escuro semi-transparente */}
                <View style={styles.modalContainerFundo}>
                    {/* Conteúdo do Modal */}
                    <View style={styles.modalConteudo}>
                        <Text style={styles.modalTitulo}>
                            Definir Meta para <Text style={{ fontWeight: 'bold' }}>{categoriaAtual?.nome}</Text>
                        </Text>

                        <Text style={styles.modalLabelInput}>Valor Limite (R$)</Text>
                        <TextInput
                            style={styles.modalInput}
                            placeholder="Ex: 500.00"
                            keyboardType="numeric"
                            value={valorMetaInput}
                            onChangeText={setValorMetaInput}
                        />

                        {/* Botões do Modal (Cancelar e Salvar) */}
                        <View style={styles.modalContainerBotoes}>
                            <Pressable
                                style={[styles.modalBotao, styles.modalBotaoCancelar]}
                                onPress={() => setModalVisivel(false)}
                            >
                                <Text style={styles.modalTextoBotao}>Cancelar</Text>
                            </Pressable>
                            <Pressable
                                style={[styles.modalBotao, styles.modalBotaoSalvar]}
                                onPress={handleSalvarMeta}
                            >
                                <Text style={styles.modalTextoBotao}>Salvar Meta</Text>
                            </Pressable>
                        </View>
                    </View>
                </View>
            </Modal>

            {/* Botão Flutuante para Adicionar Categoria (leva para a tela AddCategory) */}
            <Pressable style={styles.botaoAdicionarFlutuante} onPress={handleNavigateToAddCategory}>
                <Ionicons name="add" size={30} color="#fff" />
            </Pressable>
        </View>
    );
}

// --- FOLHA DE ESTILOS (StyleSheet) ---
const styles = StyleSheet.create({
    containerPrincipal: {
        flex: 1,
        backgroundColor: '#f5f5f5',
    },
    containerCabecalho: {
        padding: 20,
    },
    tituloPrincipal: {
        fontSize: 24,
        fontWeight: 'bold',
        textAlign: 'center',
        width: '100%',
        color: '#333',
    },
    subtitulo: {
        fontSize: 16, // Reduzido para melhor encaixe
        textAlign: 'center',
        width: '100%',
        color: '#555',
        marginTop: 5,
    },
    paddingLista: {
        paddingBottom: 100, // Espaço para o botão flutuante
        paddingHorizontal: 20, // Margens laterais para a lista
    },
    // Card de Orçamento
    cardOrcamentoContainer: {
        backgroundColor: '#fff',
        borderRadius: 8,
        padding: 15, // Padding interno do card
        marginBottom: 15,
        elevation: 3,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 2,
    },
    cardOrcamentoCabecalho: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 10,
    },
    cardOrcamentoTitulo: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#333',
    },
    cardOrcamentoValoresContainer: {
        flexDirection: 'row',
        alignItems: 'baseline',
        marginTop: 5,
    },
    cardOrcamentoValorGasto: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#333',
    },
    cardOrcamentoValorMeta: {
        fontSize: 14,
        color: '#888',
        marginLeft: 5,
    },
    // Barra de Progresso
    barraProgressoFundo: {
        height: 10,
        width: '100%',
        backgroundColor: '#e9ecef', // Cor de fundo
        borderRadius: 5,
        overflow: 'hidden',
    },
    barraProgressoPreenchimento: {
        height: '100%',
        borderRadius: 5,
    },
    // NOVOS ESTILOS PARA O MENU DE EDIÇÃO/EXCLUSÃO 
    menuContainer: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        backgroundColor: '#4a4a4a', // Cor de fundo do menu
        borderBottomLeftRadius: 8,
        borderBottomRightRadius: 8,
        padding: 5,
        marginHorizontal: 20, // Alinha com o padding da lista
        marginTop: -10, // Puxa o menu para perto do card
        marginBottom: 15, // Empurra o próximo card para baixo
        elevation: 2,
    },
    menuBotao: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 8,
        borderRadius: 5,
        marginHorizontal: 4,
    },
    menuBotaoEditar: { backgroundColor: '#007bff' }, // Azul
    menuBotaoDeletar: { backgroundColor: '#dc3545' }, // Vermelho
    menuBotaoCancelar: { backgroundColor: '#6c757d' }, // Cinza
    menuTexto: {
        color: '#fff',
        fontWeight: 'bold',
        marginLeft: 5,
    },
    // Estilos do Modal
    modalContainerFundo: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)', // Fundo escuro
    },
    modalConteudo: {
        width: '90%',
        backgroundColor: 'white',
        borderRadius: 20,
        padding: 25,
        alignItems: 'center', // Centraliza o conteúdo do modal
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5,
    },
    modalTitulo: {
        fontSize: 20,
        marginBottom: 20,
        textAlign: 'center',
    },
    modalLabelInput: {
        fontSize: 16,
        fontWeight: '600',
        marginBottom: 8,
        color: '#555',
        width: '100%', // Alinha à esquerda
    },
    modalInput: {
        backgroundColor: '#f1f1f1',
        borderWidth: 1,
        borderColor: '#ddd',
        borderRadius: 8,
        padding: 12,
        fontSize: 16,
        width: '100%',
        marginBottom: 20,
    },
    modalContainerBotoes: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: '100%',
    },
    modalBotao: {
        borderRadius: 8,
        padding: 10,
        elevation: 2,
        flex: 1, // Faz os botões dividirem o espaço
        marginHorizontal: 5,
        alignItems: 'center',
    },
    modalBotaoCancelar: {
        backgroundColor: '#6c757d', // Cinza
    },
    modalBotaoSalvar: {
        backgroundColor: '#007bff', // Azul
    },
    modalTextoBotao: {
        color: 'white',
        fontWeight: 'bold',
    },
    // Lista Vazia
    containerListaVazia: {
        marginTop: 50,
        alignItems: 'center',
        padding: 20,
    },
    textoListaVazia: {
        fontSize: 18,
        color: 'gray',
        marginTop: 10,
    },
    // Botão Flutuante
    botaoAdicionarFlutuante: {
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
    },
});

export default BudgetsScreen;