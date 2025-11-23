import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Modal, 
    StyleSheet, Alert, ScrollView, Platform, Pressable } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { useFinancas } from '../../context/ContextoFinancas';
import { Ionicons } from '@expo/vector-icons';

// definição do formato inicial da data
const hoje = new Date();
// formato DD/MM/AAAA para exibição
const dataPadrao = `${hoje.getDate().toString().padStart(2, '0')}/${(hoje.getMonth() + 1).toString().padStart(2, '0')}/${hoje.getFullYear()}`;

// função de validação de data no formato DD/MM/AAAA
const validarFormatoData = (dataString) => {
    // regex para checar DD/MM/AAAA (ex: 07/11/2025)
    const regex = /^(\d{2})\/(\d{2})\/(\d{4})$/;
    if (!regex.test(dataString)) return false;

    const partes = dataString.split('/');
    const dia = parseInt(partes[0], 10);
    const mes = parseInt(partes[1], 10);
    const ano = parseInt(partes[2], 10);

    // checa se o mês está entre 1 e 12
    if (mes < 1 || mes > 12) return false;

    // cria um objeto Date para verificar se a data é válida (ex: evita 30/02)
    const dataObj = new Date(ano, mes - 1, dia);
    return dataObj.getDate() === dia && dataObj.getMonth() === mes - 1 && dataObj.getFullYear() === ano;
};

const TelaAddTransacao = ({ navigation }) => {
    const { categorias, salvarNovaTransacao } = useFinancas();

    const [tipo, setTipo] = useState('income'); // expense (despesa) ou income (receita)
    const [valor, setValor] = useState('');
    const [descricao, setDescricao] = useState('');
    const [categoriaId, setCategoriaId] = useState(''); // id da categoria selecionada
    
    // data é um textInput simples
    const [dataInput, setDataInput] = useState(dataPadrao);
    
    // formatação de entrada (máscara DD/MM/AAAA)
    const formatarDataInput = (text) => {
        // remove tudo que não for dígito
        let cleanText = text.replace(/[^0-9]/g, '');

        if (cleanText.length > 8) {
            cleanText = cleanText.substring(0, 8);
        } 

        let formattedText = '';
        if (cleanText.length > 4) {
            formattedText = `${cleanText.substring(0, 2)}/${cleanText.substring(2, 4)}/${cleanText.substring(4)}`;
        } else if (cleanText.length > 2) {
            formattedText = `${cleanText.substring(0,2)}/${cleanText.substring(2)}`;
        } else {
            formattedText = cleanText;
        }

        setDataInput(formattedText);
    }

    // filtra categorias baseadas no tipo selecionado (receita ou despesa)
    const categoriasFiltradas = categorias.filter(cat => cat.tipo === tipo);

    // garante que a categoriaId esteja sempre na lista filtrada (ou vazia)
    useState(() => {
        if (categoriasFiltradas.length > 0 && !categoriasFiltradas.find(cat => cat.id === categoriaId)) {
            setCategoriaId(categoriasFiltradas[0].id);
        } else if (categoriasFiltradas.length === 0) {
            setCategoriaId('');
        }
    }, [tipo, categoriasFiltradas]);

    // função para salvar a nova transação após validação dos dados inseridos pelo usuário
    const handleSave = () => {

        const valorNumerico = parseFloat(valor.replace(',', '.'));

        if (!valorNumerico || valorNumerico <= 0) {
            console.log('Erro', 'O valor deve ser um número positivo.');
            return;
        }
        if (!descricao.trim()) {
            console.log('Erro', 'A descrição não pode estar vazia.');
            return;
        }
        if (!categoriaId) {
            console.log('Erro', 'Selecione uma categoria.');
            return;
        }

        // converte DD/MM/AAAA para o formato YYYY-MM-DD para salvar no Contexto/AsyncStorage
        const [dia, mes, ano] = dataInput.split('/');
        const dataParaSalvar = `${ano}-${mes}-${dia}`;

        const novaTransacao = {
            tipo,
            valor: valorNumerico,
            descricao: descricao.trim(),
            categoriaId,
            data: dataParaSalvar,
        };

        salvarNovaTransacao(novaTransacao);

        Alert.alert('Sucesso', `${tipo === 'expense' ? 'Despesa' : 'Receita'} de R$ ${valorNumerico.toFixed(2)} salva!`);
        navigation.goBack();
    };

    return (
        <ScrollView contentContainerStyle={styles.scrollContainer} style={styles.screen}>

            <Text style={styles.title}>Nova Transação</Text>

            {/* ... (Tipo, Valor, Descrição, Categoria) ... */}

            {/* tipo: receita ou despesa */}
            <View style={styles.inputGroup}>
                <Text style={styles.label}>Tipo de Transação:</Text>
                <View style={styles.radioContainer}>
                    <TouchableOpacity style={[styles.radioButton, tipo === 'income' && styles.radioActive]} onPress={() => setTipo('income')}>
                        <Text style={tipo === 'income' ? styles.radioTextActive : styles.radioText}>Receita</Text>
                    </TouchableOpacity>

                    <TouchableOpacity style={[styles.radioButton, tipo === 'expense' && styles.radioActive]} onPress={() => setTipo('expense')}>
                        <Text style={tipo === 'expense' ? styles.radioTextActive : styles.radioText}>Despesa</Text>
                    </TouchableOpacity>
                </View>
            </View>

            {/* valor da transação */}
            <View style={styles.inputGroup}>
                <Text style={styles.label}>Valor (R$):</Text>
                <TextInput style={styles.input} placeholder="Ex: 50.00" value={valor} onChangeText={setValor} keyboardType="numeric" />
            </View>

            {/* descrição da transação */}
            <View style={styles.inputGroup}>
                <Text style={styles.label}>Descrição:</Text>
                <TextInput style={styles.input} placeholder="Ex: Almoço no restaurante" value={descricao} onChangeText={setDescricao} />
            </View>

            {/* seleção de categoria */}
            <View style={styles.inputGroup}>
                <Text style={styles.label}>Categoria:</Text>
                <View style={styles.pickerWrapper}>
                    {categoriasFiltradas.length > 0 ? (
                        // picker de categorias disponíveis para o tipo selecionado
                        <Picker style={styles.picker} selectedValue={categoriaId} onValueChange={(itemValue) => setCategoriaId(itemValue)}>
                            {categoriasFiltradas.map((cat) => (
                                <Picker.Item key={cat.id} label={cat.nome} value={cat.id} />
                            ))
                            }
                        </Picker>
                    ) : (
                        // mensagem caso não haja categorias disponíveis para o tipo selecionado
                        <Text style={styles.noCategoriesText}>
                            Nenhuma categoria de {tipo === 'expense' ? 'despesa' : 'receita'} encontrada.
                        </Text>
                    )}
                </View>
            </View>

            {/* Data */}
            <View style={styles.inputGroup}>
                <Text style={styles.label}>Data (DD/MM/AAAA):</Text>
                <TextInput 
                    style={styles.input}
                    placeholder="Ex: 07/11/2025"
                    value={dataInput}
                    onChangeText={formatarDataInput}
                    keyboardType="number-pad" // teclado numérico
                    maxLength={10} // DD/MM/AAAA
                />
            </View>

            {/* botão salvar transação */}
            <Pressable style={[styles.saveButton, { backgroundColor: tipo === 'income' ? '#28a745' : '#dc3545' }]} onPress={handleSave}>
                <Text style={styles.saveButtonText}>Salvar {tipo === 'income' ? 'Receita' : 'Despesa'}</Text>
            </Pressable>

        </ScrollView>
    );
};

const styles = StyleSheet.create({
    screen: {
        flex: 1,
        backgroundColor: '#f5f5f5',
    },
    scrollContainer: {
        padding: 20,
    },
    title: {
        fontSize: 28,
        fontWeight: 'bold',
        marginBottom: 30,
        color: '#333',
        textAlign: 'center',
    },
    inputGroup: {
        marginBottom: 20,
    },
    label: {
        fontSize: 16,
        fontWeight: '600',
        marginBottom: 8,
        color: '#555',
    },
    input: {
        backgroundColor: '#fff',
        borderWidth: 1,
        borderColor: '#ddd',
        borderRadius: 8,
        padding: 12,
        fontSize: 16,
    },

    // estilos para radio buttons (tipo)
    radioContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        backgroundColor: '#fff',
        borderRadius: 8,
        padding: 4,
        borderWidth: 1,
        borderColor: '#ddd',
    },
    radioButton: {
        flex: 1,
        alignItems: 'center',
        paddingVertical: 10,
        borderRadius: 6,
        marginHorizontal: 2,
    },
    radioActive: {
        backgroundColor: '#007bff',
    },
    radioText: {
        fontSize: 16,
        color: '#555',
        fontWeight: '500',
    },
    radioTextActive: {
        color: '#fff',
        fontWeight: 'bold',
    },

    // estilos para Picker
    pickerWrapper: {
        backgroundColor: '#fff',
        borderWidth: 1,
        borderColor: '#ddd',
        borderRadius: 8,
        overflow: 'hidden',
    },
    picker: {
        height: Platform.OS === 'ios' ? 150 : 50, // altura diferente para iOS (wheel picker)
        width: '100%',
    },
    noCategoriesText: {
        padding: 12,
        color: '#dc3545',
        textAlign: 'center',
    },

    // estilos para o botão Salvar
    saveButton: {
        padding: 15,
        borderRadius: 8,
        alignItems: 'center',
        marginTop: 30,
    },
    saveButtonText: {
        color: '#fff',
        fontSize: 18,
        fontWeight: 'bold',
    },
});

export default TelaAddTransacao;