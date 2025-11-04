import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, ScrollView, Platform, Pressable } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { useFinancas } from '../../context/FinanceContext';
import { Ionicons } from '@expo/vector-icons';

const AddTransactionScreen = ({ navigation }) => {
    const { categorias, salvarNovaTransacao } = useFinancas();

    const [tipo, setTipo] = useState('income'); // expense (despesa) ou income (receita)
    const [valor, setValor] = useState('');
    const [descricao, setDescricao] = useState('');
    const [categoriaId, setCategoriaId] = useState(''); // id da categoria selecionada

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
            Alert.alert('Erro', 'O valor deve ser um número positivo.');
            return;
        }
        if (!descricao.trim()) {
            Alert.alert('Erro', 'A descrição não pode estar vazia.');
            return;
        }
        if (!categoriaId) {
            Alert.alert('Erro', 'Selecione uma categoria.');
            return;
        }

        const novaTransacao = {
            tipo,
            valor: valorNumerico,
            descricao: descricao.trim(),
            categoriaId,
        };

        salvarNovaTransacao(novaTransacao);

        Alert.alert('Sucesso', `${tipo === 'expense' ? 'Despesa' : 'Receita'} de R$ ${valorNumerico.toFixed(2)} salva!`);
        navigation.goBack();
    };

    return (
        <ScrollView contentContainerStyle={styles.scrollContainer} style={styles.screen}>

            <Text style={styles.title}>Nova Transação</Text>

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
    // Estilos para Radio Buttons (Tipo)
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
    // Estilos para Picker
    pickerWrapper: {
        backgroundColor: '#fff',
        borderWidth: 1,
        borderColor: '#ddd',
        borderRadius: 8,
        overflow: 'hidden',
    },
    picker: {
        height: Platform.OS === 'ios' ? 150 : 50, // Altura diferente para iOS (wheel picker)
        width: '100%',
    },
    noCategoriesText: {
        padding: 12,
        color: '#dc3545',
        textAlign: 'center',
    },
    // Estilos para o botão Salvar
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
    }
});

export default AddTransactionScreen;
