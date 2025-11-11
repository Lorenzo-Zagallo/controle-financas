import { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, ScrollView, Pressable } from 'react-native';
import { useFinancas } from '../../context/ContextoFinancas';
import { Ionicons } from '@expo/vector-icons';

const SeletorDeCor = ({ corSelecionada, selecionar }) => {

    // cores para o usuário escolher uma nova categoria
    const cores = ['#FF6384', '#36A2EB', '#FFCD56', '#4BC0C0', '#9966FF', '#FF0056', '#2E8B57', '#FFA07A'];

    return (
        <View style={styles.colorPickerContainer}>
            <Text style={styles.label}>Escolha a Cor (Cor do Gráfico):</Text>
            <View style={styles.palette}>
                {cores.map(cor => (
                    <TouchableOpacity
                        key={cor}
                        style={[ styles.colorOption, { backgroundColor: cor }, corSelecionada === cor && styles.corSelecionada ]}
                        onPress={() => selecionar(cor)}>
                            
                        {/* ícone para marcar quando a cor está selecionada */}
                        {corSelecionada === cor && <Ionicons name="checkmark-circle-outline" size={24} cor="#fff" />}
                    </TouchableOpacity>
                ))}
            </View>
        </View>
    );
};

const AddCategoryScreen = ({ navigation }) => {

    const { salvarNovaCategoria } = useFinancas();

    const [nome, setNome] = useState('');
    const [tipo, setTipo] = useState('expense'); // expense (despesa) ou income (receita)
    const [cor, setCor] = useState('#FF6384');

    const salvar = () => { // handleSave para salvar a nova categoria
        if (!nome.trim()) {
            console.log('Nome da categoria vazio');
            Alert.alert('Erro', 'O nome da categoria não pode estar vazio.');
            return;
        }

        const novaCategoria = {
            nome: nome.trim(),
            tipo,
            cor,
        };

        // chama a função FinanceContext.js para salvar e persistir a nova categoria
        salvarNovaCategoria(novaCategoria);

        console.log('Categoria salva:', novaCategoria);
        Alert.alert('Sucesso', `Categoria "${nome}" adicionada e salva!`);

        // volta para a tela anterior (BudgetsScreen)
        navigation.goBack();
    };

    return (
        <ScrollView contentContainerStyle={styles.scrollContainer} style={styles.screen}>
            <Text style={styles.title}>Nova Categoria</Text>

            {/* Grupo de Input: Nome */}
            <View style={styles.inputGroup}>
                <Text style={styles.label}>Nome da Categoria:</Text>
                <TextInput style={styles.input} placeholder="Ex: Refeição, Renda Extra, Investimentos"
                    value={nome} onChangeText={setNome}/>
            </View>

            {/* Grupo de Input: Tipo (Receita/Despesa) */}
            <View style={styles.inputGroup}>
                <Text style={styles.label}>Tipo de Transação:</Text>
                <View style={styles.radioContainer}>
                    <TouchableOpacity style={[styles.radioButton, tipo === 'expense' && styles.radioActive]}
                        onPress={() => setTipo('expense')}>
                        <Text style={tipo === 'expense' ? styles.radioTextActive : styles.radioText}>Despesa</Text>
                    </TouchableOpacity>

                    <TouchableOpacity style={[styles.radioButton, tipo === 'income' && styles.radioActive]}
                        onPress={() => setTipo('income')}>
                        <Text style={tipo === 'income' ? styles.radioTextActive : styles.radioText}>Receita</Text>
                    </TouchableOpacity>
                </View>
            </View>

            <SeletorDeCor corSelecionada={cor} selecionar={setCor} />

            <Pressable style={styles.saveButton} onPress={salvar}>
                <Text style={styles.saveButtonText}>Salvar Categoria</Text>
            </Pressable>
        </ScrollView>
    );
};

// Estilos
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
    // Estilos para o Color Picker
    colorPickerContainer: {
        marginBottom: 30,
    },
    palette: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
    },
    colorOption: {
        width: 40,
        height: 40,
        borderRadius: 20,
        margin: 5,
        borderWidth: 3,
        borderColor: 'transparent',
        justifyContent: 'center',
        alignItems: 'center',
    },
    selectedColor: {
        borderColor: '#333',
    },
    // Estilos para o botão Salvar
    saveButton: {
        backgroundColor: '#28a745',
        padding: 15,
        borderRadius: 8,
        alignItems: 'center',
        marginTop: 20,
    },
    saveButtonText: {
        color: '#fff',
        fontSize: 18,
        fontWeight: 'bold',
    }
});

export default AddCategoryScreen;
