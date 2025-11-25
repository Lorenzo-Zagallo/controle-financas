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

// A TELA RECEBE 'route' PARA VERIFICAR OS PARÂMETROS
const AddCategoryScreen = ({ navigation, route }) => {

    // Pega a categoria passada por parâmetro (se existir)
    const categoriaParaEditar = route.params?.categoria;
    
    // Verifica se estamos em modo de edição
    const isEditing = !!categoriaParaEditar; // true se 'categoriaParaEditar' não for nulo

    // Puxa as funções do contexto
    const { salvarNovaCategoria, editarCategoria } = useFinancas();

    // LÓGICA DE PRÉ-PREENCHIMENTO:
    // Se 'isEditing' for true, usa os valores da categoria. Se não, usa valores padrão.
    const [nome, setNome] = useState(categoriaParaEditar?.nome || '');
    const [tipo, setTipo] = useState(categoriaParaEditar?.tipo || 'expense');
    const [cor, setCor] = useState(categoriaParaEditar?.cor || '#FF6384');

    const salvar = () => {
        if (!nome.trim()) {
            console.log('Nome da categoria vazio');
            console.log('Erro: O nome da categoria não pode estar vazio.');
            return;
        }

        const novaCategoria = {
            nome: nome.trim(),
            tipo,
            cor,
        };

        // LÓGICA DE SALVAR/EDITAR:
        if (isEditing) {
            // Chama a função de EDIÇÃO do contexto
            editarCategoria(categoriaParaEditar.id, novaCategoria);
            console.log(`Sucesso: Categoria "${nome}" atualizada!`);
        } else {
            // Chama a função de CRIAÇÃO do contexto
            salvarNovaCategoria(novaCategoria);
            console.log(`Sucesso: Categoria "${nome}" adicionada!`);
        }

        console.log('Categoria salva:', novaCategoria);
        console.log(`Sucesso: Categoria "${nome}" adicionada e salva!`);

        navigation.goBack();
    };

    return (
        <ScrollView contentContainerStyle={styles.scrollContainer} style={styles.screen}>
            {/* O título muda dependendo do modo */}
            <Text style={styles.title}>{isEditing ? 'Editar Categoria' : 'Nova Categoria'}</Text>

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
                    <Pressable style={[styles.radioButton, tipo === 'expense' && styles.radioActive]}
                        onPress={() => setTipo('expense')}>
                        <Text style={tipo === 'expense' ? styles.radioTextActive : styles.radioText}>Despesa</Text>
                    </Pressable>

                    <Pressable style={[styles.radioButton, tipo === 'income' && styles.radioActive]}
                        onPress={() => setTipo('income')}>
                        <Text style={tipo === 'income' ? styles.radioTextActive : styles.radioText}>Receita</Text>
                    </Pressable>
                </View>
            </View>

            <SeletorDeCor corSelecionada={cor} selecionar={setCor} />

            <Pressable style={styles.saveButton} onPress={salvar}>
                <Text style={styles.saveButtonText}>{isEditing ? 'Atualizar Categoria' : 'Salvar Categoria'}</Text>
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
