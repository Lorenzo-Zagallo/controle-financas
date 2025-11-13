import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, Pressable, FlatList, Alert, TextInput } from "react-native";
import { useFinancas } from "../../context/ContextoFinancas";
import { Ionicons } from '@expo/vector-icons';
import { Picker } from "@react-native-picker/picker";

const nomesMeses = [
    'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
    'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'
];

const formatarExibicaoDaData = (dateString) => {
    if (!dateString || dateString.length < 10) return dateString; // YYYY-MM-DD
    const [ano, mes, dia] = dateString.split('-');
    return `${dia}/${mes}/${ano}`;
};

// ====== COMPONENTE DE FORMULÁRIO APÓS CLICAR EM EDITAR A TRANSAÇÃO =======
const FormularioEdicaoItem = ({ item, onCancel, onSave }) => {

    // PUXA AS CATEGORIAS (PARA O Picker) E A FUNÇÃO DE EDITAR
    const { categorias, editarTransacao } = useFinancas();

    // ESTADOS LOCAIS PARA CONTROLAR OS INPUT DO FORMULÁRIO
    const [descricao, setDescricao] = useState(item.descricao);
    const [valor, setValor] = useState(String(item.valor));
    const [categoriaId, setCategoriaId] = useState(item.categoriaId);
    const [data, setData] = useState(item.data); // DATA NO FORMATO 'YYYY-MM-DD'
    const [tipo, setTipo] = useState(item.tipo);

    // FILTRA AS CATEGORIAS (RECEITA/DESPESA)
    const categoriasFiltradas = categorias.filter(c => c.tipo === tipo);

    // FUNÇÃO CHAMADA AO SALVAR AS ALTERAÇÕES 
    const handleSaveClick = () => {
        const valorNumerico = parseFloat(valor.replace(',', '.'));
        if (!valorNumerico || valorNumerico <= 0) {
            console.log('Erro: O valor deve ser um número positivo.');
            return;
        }
        if (!descricao.trim()) {
            console.log('Erro: A descrição não pode estar vazia.');
            return;
        }
        if (!data.match(/^\d{4}-\d{2}-\d{2}$/)) { // VALIDA 'YYYY-MM-DD'
            console.log('Erro: O formato da data deve ser AAAA-MM-DD.');
            return;
        }

        // OBJETO COM OS DADOS ATUALIZADOS
        const dadosAtualizados = {
            descricao: descricao.trim(),
            valor: valorNumerico,
            categoriaId,
            tipo,
            data,
        };

        // CHAMA A FUNÇÃO DO CONTEXTO
        editarTransacao(item.id, dadosAtualizados);
        onSave(); // FECHA O MODO DE EDIÇÃO
    };

    return ( // FORMULARIO DO ITEM DE EDIÇÃO
        <View style={styles.edicaoContainer}>

            <TextInput // INPUT DESCRIÇÃO
                style={styles.edicaoInput}
                value={descricao}
                onChangeText={setDescricao}
                placeholder="Descrição"
            />
            <TextInput // INPUT VALOR
                style={styles.edicaoInput}
                value={valor}
                onChangeText={setValor}
                placeholder="Valor (R$)"
                keyboardType="numeric"
            />
            <TextInput // INPUT DATA (SIMPLES)
                style={styles.edicaoInput}
                value={data}
                onChangeText={setData}
                placeholder="Data (AAAA-MM-DD)"
                maxLength={10}
            />

            <View style={styles.edicaoContainerOpcao}>
                <Pressable // BOTÃO DE TIPO "RECEITA" 
                    style={[styles.edicaoBotaoOpcao, tipo === 'income' && styles.edicaoOpcaoAtivo]}
                    onPress={() => setTipo('income')}
                >
                    <Text style={tipo === 'income' ? styles.edicaoOpcaoTextoAtivo : styles.edicaoOpcaoTexto}>Receita</Text>
                </Pressable>
                <Pressable // BOTÃO DE TIPO "DESPESA"
                    style={[styles.edicaoBotaoOpcao, tipo === 'expense' && styles.edicaoOpcaoAtivo]}
                    onPress={() => setTipo('expense')}
                >
                    <Text style={tipo === 'expense' ? styles.edicaoOpcaoTextoAtivo : styles.edicaoOpcaoTexto}>Despesa</Text>
                </Pressable>
            </View>

            <View style={styles.edicaoContainerPickerWrapper}>
                <Picker // ESCOLHE A CATEGORIA
                    selectedValue={categoriaId}
                    onValueChange={(itemValue) => setCategoriaId(itemValue)}
                    style={styles.edicaoPicker}
                >
                    {categoriasFiltradas.map((cat) => (
                        <Picker.Item key={cat.id} label={cat.nome} value={cat.id} />
                    ))}
                </Picker>
            </View>

            <View style={styles.edicaoContainerBotoes}>
                {/* BOTÃO DE CANCELAR */}
                <Pressable style={[styles.edicaoBotao, { backgroundColor: '#6c757d' }]} onPress={onCancel}>
                    <Text style={styles.edicaoBotaoTexto}>Cancelar</Text>
                </Pressable>
                {/* BOTÃO DE SALVAR */}
                <Pressable style={[styles.edicaoBotao, { backgroundColor: '#28a745' }]} onPress={handleSaveClick}>
                    <Text style={styles.edicaoBotaoTexto}>Salvar</Text>
                </Pressable>
            </View>
        </View>
    );
};

// =============== COMPONENTE PRINCIPAL DA TELA DE TRANSAÇÕES ===============
const TelaTransacao = ({ navigation }) => {

    // === ESTADOS DA TELA ===
    const { transacoes, categorias, deletarTransacao } = useFinancas();
    const hoje = new Date();
    const [mesFiltro, setMesFiltro] = useState(hoje.getMonth() + 1); // MÊS ATUAL (1-12)
    const [anoFiltro, setAnoFiltro] = useState(hoje.getFullYear()); // ANO ATUAL (2025)


    // === ESTADOS PARA CONTROLAR A UI ===
    
    // GUARDA O ID DO ITEM QUE ESTÁ...
    const [idItemSelecionado, setIdItemSelecionado] = useState(null); //...COM O MENU (EDITAR/EXCLUIR) ABERTO
    const [idItemEditando, setIdItemEditando] = useState(null); //...SENDO EDITADO (MOSTRANDO O FORMULÁRIO)


    // === LÓGICA DE DADOS ===

    const transacoesFiltradas = transacoes.filter(item => {
        const data = new Date(item.data);
        return data.getMonth() + 1 === mesFiltro && data.getFullYear() === anoFiltro;
    });

    const buscarNomeCategoriaPorId = (categoryId) => {
        const categoria = categorias.find(category => category.id === categoryId);
        return categoria ? categoria.nome : 'Sem Categoria';
    };


    // === FUNÇÕES DE NAVEGAÇÃO E AÇÃO ===

    const handleNavigateToAddTransaction = () => {
        navigation.navigate('AdicionarTransacao');
    }

    const alterarMesFiltro = (passo) => {
        let novoMes = mesFiltro + passo;
        let novoAno = anoFiltro;
        if (novoMes < 1) { novoMes = 12; novoAno -= 1; }
        else if (novoMes > 12) { novoMes = 1; novoAno += 1; }
        setMesFiltro(novoMes);
        setAnoFiltro(novoAno);
    }


    // === LÓGICA DE SELEÇÃO DE ITEM (PARA ABRIR O MENU) ===

    const handleSelectItem = (itemId) => {
        // FECHA QUALQUER ITEM QUE ESTEJA EM EDIÇÃO
        setIdItemEditando(null); 
        // SE O ITEM CLICADO JÁ ESTAVA SELECIONADO, FECHA O MENU (NULL).
        // SE FOR UM ITEM NOVO, ABRE O MENU PARA ELE.
        setIdItemSelecionado(idItemSelecionado === itemId ? null : itemId);
    };


    // === LÓGICA PARA INICIAR A EDIÇÃO ===

    const handleStartEdit = (item) => {
        setIdItemSelecionado(null); // fecha o menu
        setIdItemEditando(item.id); // abre o formulário de edição
    };


    // === LÓGICA PARA DELETAR ===

    const handleDelete = (itemId) => {
        console.log("Item deletado com sucesso!")
        deletarTransacao(itemId);
        setIdItemSelecionado(null);
        /* Alert.alert(
            "Deletar Transação",
            "Você tem certeza que quer deletar esta transação?",
            [
                { text: "Cancelar", style: "cancel", onPress: () => setIdItemSelecionado(null) },
                {
                    text: "Deletar", style: "destructive", onPress: () => {
                        deletarTransacao(itemId);
                        setIdItemSelecionado(null); // Fecha o menu
                    }
                }
            ]
        ); */
    };


    // === RENDERIZAÇÃO ===

    const renderItem = ({ item }) => { // RENDERIZA O ITEM DA LISTA (VISÍVEL OU EM EDIÇÃO) 

        // VERIFICA SE ESTE ITEM É O QUE ESTÁ SENDO EDITADO
        const estaEditando = idItemEditando === item.id;
        // VERIFICA SE ESTE ITEM É O QUE ESTÁ SELECIONADO (MENU ABERTO)
        const estaSelecionado = idItemSelecionado === item.id;

        const isExpense = item.tipo === 'expense';
        const itemColor = isExpense ? '#DC3545' : '#28A745';

        // MODO DE EDIÇÃO (FORMULÁRIO)
        if (estaEditando) {
            return (
                <FormularioEdicaoItem
                    item={item}
                    onCancel={() => setIdItemEditando(null)} // função para o botão Cancelar
                    onSave={() => setIdItemEditando(null)} // função para o botão Salvar
                />
            )
        }

        // MODO DE VISUALIZAÇÃO (NORMAL)
        return (
            <View>
                <Pressable
                    style={styles.itemTransacao}
                    onPress={() => handleSelectItem(item.id)}
                    disabled={estaSelecionado}
                >
                    {/* CONTEÚDO DO ITEM */}
                    <View style={styles.itemContainerDescricao}>
                        <Text style={styles.itemDescricao}>{item.descricao}</Text>
                        <Text style={styles.itemCategoria}>{buscarNomeCategoriaPorId(item.categoriaId)}</Text>
                    </View>
                    <View style={styles.itemContainerValor}>
                        <Text style={[styles.itemValor, { color: itemColor }]}>
                            {isExpense ? '- ' : '+ '}
                            R$ {item.valor.toFixed(2).replace('.', ',')}
                        </Text>
                        <Text style={styles.itemData}>{formatarExibicaoDaData(item.data)}</Text>
                    </View>
                </Pressable>

                {/* MOSTRA O MENU DE OPÇÕES */}
                {estaSelecionado && !estaEditando && (
                    <View style={styles.menuContainer}>
                        <Pressable
                            style={[styles.menuBotao, { backgroundColor: '#007bff' }]}
                            onPress={() => handleStartEdit(item)}
                        >
                            <Ionicons name="pencil" size={20} color="#fff" />
                            <Text style={styles.menuTexto}>Editar</Text>
                        </Pressable>
                        <Pressable
                            style={[styles.menuBotao, { backgroundColor: '#dc3545' }]}
                            onPress={() => handleDelete(item.id)}
                        >
                            <Ionicons name="trash" size={20} color="#fff" />
                            <Text style={styles.menuTexto}>Excluir</Text>
                        </Pressable>
                        <Pressable
                            style={[styles.menuBotao, { backgroundColor: '#6c757d' }]} onPress={() => setIdItemSelecionado(null)}
                        >
                            <Ionicons name="close" size={20} color="#fff" />
                            <Text style={styles.menuTexto}>Cancelar</Text>
                        </Pressable>
                    </View>
                )}
            </View>
        );
    };


    // === JSX PRINCIPAL DA TELA ===

    return (
        <View style={styles.container}>

            {/* FILTRO DE MÊS */}
            <View style={styles.filtroContainer}>
                <Pressable onPress={() => alterarMesFiltro(-1)}>
                    <Ionicons name="chevron-back" size={24} color="#007bff" />
                </Pressable>
                <Text style={styles.filtroTexto}>
                    {nomesMeses[mesFiltro - 1]} de {anoFiltro}
                </Text>
                <Pressable onPress={() => alterarMesFiltro(1)}>
                    <Ionicons name="chevron-forward" size={24} color="#007bff" />
                </Pressable>
            </View>

            <Text style={styles.titulo}>Minhas Transações ({transacoesFiltradas.length})</Text>

            {/* LISTA DE TRANSAÇÕES */}
            {transacoesFiltradas.length > 0 ? (
                <FlatList
                    data={transacoesFiltradas}
                    keyExtractor={item => item.id}
                    renderItem={renderItem}
                    contentContainerStyle={{ paddingBottom: 80 }}
                    style={styles.lista}
                    extraData={{ idItemEditando, idItemSelecionado }} // garante que apenas um item possa ser expandido/editado por vez
                />
            ) : (
                <View style={styles.containerVazio}>
                    <Ionicons name="cash-outline" size={80} color="gray" />
                    <Text style={styles.textoVazio}>Nenhuma transação registrada em {nomesMeses[mesFiltro - 1]}.</Text>
                </View>
            )}

            {/* BOTÃO DE ADICIONAR NOVA TRANSAÇÃO */}
            <Pressable style={styles.botaoAdicionar} onPress={handleNavigateToAddTransaction}>
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
    titulo: {
        fontSize: 24,
        marginTop: 10,
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
        paddingHorizontal: 10,
    },


    // ==================== ITEM DA TRANSAÇÃO ====================

    itemTransacao: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        backgroundColor: '#fff',
        padding: 15,
        borderRadius: 8,
        marginTop: 10,
        elevation: 2,
    },
    itemContainerDescricao: { // CONTAINER DA DESCRIÇÃO DO ITEM
        flex: 1,
    },
    itemDescricao: { // DESCRIÇÃO DA TRANSAÇÃO
        fontSize: 16,
        fontWeight: 'bold',
        color: '#333',
    },
    itemCategoria: { // CATEGORIA DA TRANSAÇÃO
        fontSize: 12,
        color: '#888',
        marginTop: 2,
    },
    itemContainerValor: { // CONTAINER DO VALOR DO ITEM
        alignItems: 'flex-end'
    },
    itemValor: { // VALOR DA TRANSAÇÃO
        fontSize: 18,
        fontWeight: 'bold',
        marginLeft: 10,
    },
    itemData: { // DATA DA TRANSAÇÃO
        fontSize: 12,
        color: '#888',
        marginTop: 2,
    },


    // ========== MENU DE OPÇÕES (EDITAR/EXCLUIR/CANCELAR) ==========
    
    menuContainer: { // CONTAINER DO MENU DE OPÇÕES AO CLICAR NO ITEM
        flexDirection: 'row',
        justifyContent: 'space-around',
        backgroundColor: '#fff',
        borderBottomLeftRadius: 8,
        borderBottomRightRadius: 8,
        padding: 10,
        marginHorizontal: 1, // pequena margem para alinhar com o card
        elevation: 1,
        marginTop: -2, // sobrepõe levemente o card
    },
    menuBotao: { // BOTÕES DE EDITAR, EXCLUIR e CANCELAR
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 8,
        borderRadius: 5,
        marginHorizontal: 4,
    },
    menuTexto: {
        color: '#fff',
        fontWeight: 'bold',
        marginLeft: 5,
    },


    // =============== FORMULARIO DO ITEM DE EDIÇÃO ===============

    edicaoContainer: { // CONTAINER DO FORMULÁRIO
        backgroundColor: '#fff',
        borderRadius: 8,
        padding: 15,
        margin: 10,
        elevation: 3,
        borderWidth: 1,
        borderColor: '#007bff'
    },
    edicaoInput: { // INPUT DESCRIÇÃO, VALOR, DATA (SIMPLES)
        backgroundColor: '#f1f1f1',
        borderWidth: 1,
        borderColor: '#ddd',
        borderRadius: 8,
        padding: 10,
        fontSize: 14,
        marginBottom: 10,
    },

    edicaoContainerOpcao: { // CONTAINER DO BOTÃO DE OPÇÃO (RadioButton)
        flexDirection: 'row',
        marginBottom: 10,
    },
    edicaoBotaoOpcao: { // BOTÕES DE RECEITA e DESPESA
        flex: 1,
        alignItems: 'center',
        paddingVertical: 10,
        borderRadius: 6,
        borderWidth: 1,
        borderColor: '#ddd',
    },
    edicaoOpcaoAtivo: {
        backgroundColor: '#007bff',
        borderColor: '#007bff',
    },
    edicaoOpcaoTexto: {
        color: '#555',
    },
    edicaoOpcaoTextoAtivo: {
        color: '#fff',
        fontWeight: 'bold',
    },

    edicaoContainerPickerWrapper: { // CONTAINER DO PICKER
        borderRadius: 8,
        borderWidth: 1,
        borderColor: '#ddd',
        backgroundColor: '#f1f1f1',
        marginBottom: 10,
    },
    edicaoPicker: { // PICKER PARA SELEÇÃO DE CATEGORIA
        backgroundColor: '#f1f1f1',
        borderWidth: 1,
        borderColor: '#ddd',
        borderRadius: 8,
        padding: 10,
        fontSize: 14
    },
    
    edicaoContainerBotoes: { // CONTAINER DOS BOTÕES PRINCIPAIS
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 10,
    },
    edicaoBotao: { // BOTÕES DE CANCELAR e SALVAR
        flex: 1,
        padding: 10,
        borderRadius: 5,
        alignItems: 'center',
        marginHorizontal: 5,
    },
    edicaoBotaoTexto: {
        color: '#fff',
        fontWeight: 'bold',
    },
    

    // ==================== LISTA VAZIA ====================

    containerVazio: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
    },
    textoVazio: {
        fontSize: 18,
        color: 'gray',
        marginTop: 20,
        textAlign: 'center',
    },


    // =============== BOTÃO ADICIONAR ===============
    
    botaoAdicionar: {
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


    // =============== FILTRO DE MÊS ===============
    
    filtroContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 20,
        paddingVertical: 15,
        backgroundColor: '#fff',
        borderBottomWidth: 1,
        borderBottomColor: '#ddd',
    },
    filtroTexto: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#333',
    },
});

export default TelaTransacao;
