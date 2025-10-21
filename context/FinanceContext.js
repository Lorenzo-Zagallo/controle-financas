import React, { createContext, useState, useEffect, useContext } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

// 1. Cria o Contexto
const FinanceContext = createContext();

// Dados Iniciais/Padrão (Fallback caso não haja nada salvo)
const INITIAL_CATEGORIES = [
    { id: '1', name: 'Alimentação', type: 'expense', color: '#FF6384' },
    { id: '2', name: 'Salário', type: 'income', color: '#36A2EB' },
    { id: '3', name: 'Transporte', type: 'expense', color: '#FFC056' },
    { id: '4', name: 'Refeição', type: 'expense', color: '#FF0056' },
];

// 2. Cria o Provider (o componente que fornece os dados)
export const FinanceProvider = ({ children }) => {
    const [categories, setCategories] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    // Você pode adicionar mais estados aqui, como transações:
    // const [transactions, setTransactions] = useState([]);

    // Função Assíncrona para Carregar Categorias
    // Define a função loadCategories como assíncrona usando a palavra-chave async. Isso é obrigatório porque as operações de disco são lentas e precisam ser executadas sem travar a interface do usuário (UI).
    const loadCategories = async () => {
        try {
            // LINHA TEMPORARIA APENAS PARA LIMPAR O ARMAZENAMENTO
            // await AsyncStorage.removeItem('@finance_app_categories');

            // AsyncStorage.getItem(key): Este é o método que tenta buscar um valor no armazenamento local usando a key fornecida (@finance_app_categories).
            // await: Esta palavra-chave pausa a execução da função loadCategories neste ponto até que o getItem (a promessa) seja concluído e retorne o resultado (o jsonValue).
            // jsonValue: A variável que armazena o valor retornado. O valor será sempre uma string JSON (ou null se a chave não existir).
            const jsonValue = await AsyncStorage.getItem('@finance_app_categories');

            if (jsonValue !== null) {
                // Se houver dados salvos, use-os
                // JSON.parse(string): Converte a string JSON de volta para um objeto ou array JavaScript (o formato original), que é então usado para atualizar o estado global (setCategories). 
                // Este processo é chamado de Desserialização.
                setCategories(JSON.parse(jsonValue));
            } else {
                // Se for a primeira vez, use os dados iniciais e salve-os
                // AsyncStorage.setItem(key, value): Salva um par de chave-valor. O value deve ser uma string.
                // JSON.stringify(INITIAL_CATEGORIES): Converte o objeto/array JavaScript (INITIAL_CATEGORIES) em uma string JSON antes de salvar. 
                // Este processo é chamado de Serialização.
                await AsyncStorage.setItem('@finance_app_categories', JSON.stringify(INITIAL_CATEGORIES));
                // Atualiza o estado da aplicação com os dados padrão que acabaram de ser salvos.
                setCategories(INITIAL_CATEGORIES);
            }
        } catch (e) {
            console.error('Erro ao carregar dados do AsyncStorage:', e);
            // Em caso de erro, ainda definimos um valor padrão
            // Uma lógica de fallback (segurança): em caso de falha de leitura, o app ainda tenta usar os dados padrão para não quebrar.
            setCategories(INITIAL_CATEGORIES);
        } finally {
            setIsLoading(false); // Indica que o carregamento terminou
        }

        // A chave para entender o AsyncStorage é dominar o conceito de Assincronicidade (async/await) e o par Serialização/Desserialização (JSON.stringify/JSON.parse).
    };

    // Hook de Efeito: Define um "efeito colateral" (algo que interage com o mundo externo, como a leitura de dados).
    useEffect(() => {
        // A função é executada dentro do efeito. No seu caso, ela lê os dados do AsyncStorage.
        loadCategories();
    }, []); // Array de Dependências Vazio '[]': Significa que o useEffect será executado apenas uma vez quando o componente FinanceProvider for montado (o equivalente ao componentDidMount em classes). Isso é perfeito para carregar dados iniciais.

    // Exemplo de função para adicionar/salvar novas categorias
    // Define uma função para adicionar uma nova categoria. Ela é async porque usará o await para a operação de escrita no AsyncStorage.
    const saveNewCategory = async (newCategory) => {
        // Criação de Novo Estado: Utiliza o Spread Operator (...) para criar um novo array. Isso garante que o estado do React seja tratado como imutável (o que é uma prática fundamental). Ele pega todas as categorias antigas, adiciona a 'newCategory' e atribui um 'id' único baseado no tempo atual.
        const updatedCategories = [...categories, { ...newCategory, id: Date.now().toString() }];

        // Atualiza o Estado (UI): Imediatamente atualiza o estado 'categories' no React. Isso faz com que todos os componentes que usam o 'useFinance()' sejam re-renderizados com a nova categoria, dando um feedback instantâneo ao usuário.
        setCategories(updatedCategories);
        try {
            // Persistência no Disco: Usa o await para pausar a função e garantir que o novo array de categorias ('updatedCategories'), já convertido para string com 'JSON.stringify()', seja salvo no 'AsyncStorage'.
            await AsyncStorage.setItem('@finance_app_categories', JSON.stringify(updatedCategories));
        } catch (e) {
            console.error('Erro ao salvar nova categoria:', e);
        }
    };

    // Objeto de valor a ser fornecido para a aplicação
    // Define o objeto de valor que será fornecido pelo contexto. Ele contém todos os estados e funções que outras partes do aplicativo precisam.
    const contextValue = {
        // categories, isLoading, saveNewCategory -> São as propriedades do objeto 'contextValue'. Ao listar essas variáveis e funções aqui, você as torna acessíveis através do 'useFinance()'.
        categories,
        isLoading,
        saveNewCategory,
        // Outros métodos e estados virão aqui
    };

    return (
        // Componente Provider: Este componente, fornecido pelo React Context API, "envolve" os filhos ('{children}') e faz com que o objeto definido em 'value (contextValue)' seja injetado em toda a sub-árvore de componentes.
        <FinanceContext.Provider value={contextValue}>
            {/* children -> Representa todos os componentes filhos que estão envolvidos pelo FinanceProvider (que, no seu caso, é o AppContent e toda a navegação). */}
            {children}
        </FinanceContext.Provider>
    );
};

// 3. Cria um Hook Customizado para usar o Contexto facilmente
// Hook Customizado: Define uma função auxiliar simples que torna o uso do contexto mais limpo e legível.
export const useFinance = () => {
    // Uso do Contexto: O Hook 'useContext' do React é chamado para "consumir" os dados do 'FinanceContext' e retornar o 'contextValue' (ou seja, '{ categories, isLoading, saveNewCategory }'). Em vez de escrever essa linha em cada tela, você apenas escreve 'const { categories } = useFinance();'.
    return useContext(FinanceContext);
};
