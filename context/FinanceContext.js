import React, { createContext, useState, useEffect, useContext } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

// 1. Cria o Contexto
const ContextoFinancas = createContext();

// Dados Iniciais/Padrão (Fallback caso não haja nada salvo)
const CATEGORIAS_INICIAIS = [
    { id: '1', nome: 'Salário', tipo: 'income', cor: '#36A2EB' }, // income = receita
    { id: '2', nome: 'Alimentação', tipo: 'expense', cor: '#FF6384' }, // expense = despesa
    { id: '3', nome: 'Transporte', tipo: 'expense', cor: '#ff7856ff' },
    { id: '4', nome: 'Refeição', tipo: 'expense', cor: '#FF0056' },
];

// 2. Cria o Provedor (o componente que fornece os dados)
export const ProvedorFinancas = ({ children }) => {
    // Estados para Categorias
    const [categorias, setCategorias] = useState([]);

    const [transacoes, setTransacoes] = useState([]);

    const [carregando, setCarregando] = useState(true);

    /**
     * Carrega as categorias salvas no AsyncStorage.
     * Se não houver dados salvos, salva e usa as categorias iniciais.
     */
    const carregarCategorias = async () => {
        try {
            // Linha de teste (descomente para limpar o AsyncStorage)
            // await AsyncStorage.removeItem('@finance_app_categories');

            const valorJson = await AsyncStorage.getItem('@finance_app_categories');

            if (valorJson !== null) {
                // Dados encontrados, desserializa (converte string para objeto)
                setCategorias(JSON.parse(valorJson));
                console.log('Categorias carregadas do AsyncStorage.');
            } else {
                // Primeira vez executando, salva os dados iniciais
                await AsyncStorage.setItem('@finance_app_categories', JSON.stringify(CATEGORIAS_INICIAIS));
                setCategorias(CATEGORIAS_INICIAIS);
                console.log('Categorias iniciais salvas no AsyncStorage.');
            }
        } catch (e) {
            console.error('Erro ao carregar categorias do AsyncStorage:', e);
            // Fallback: em caso de erro, usa as categorias iniciais
            setCategorias(CATEGORIAS_INICIAIS);
        } finally {
            // Garante que o 'loading' termine, mesmo se der erro
            setCarregando(false);
        }
    };

    const carregarTransacoes = async () => {
        try {
            const valorJson = await AsyncStorage.getItem('@finance_app_transactions');
            if (valorJson !== null) {
                // ordena por data (mais recente primeiro)
                const loadedTransactions = JSON.parse(valorJson);
                setTransacoes(loadedTransactions.sort((a, b) => new Date(b.date) - new Date(a.date)))
                console.log('Transações carregadas do AsyncStorage.');
            }
        } catch (e) {
            console.error('Erro ao carregar transações do AsyncStorage:', e);
            // Fallback: em caso de erro, usa array vazio
            setTransacoes([]);
        } finally {
            setCarregando(false); // Garante que o 'loading' termine, mesmo se der erro
        }
    }

    /**
     * Hook de Efeito: Executa a função de carregamento de dados
     * O array de dependências vazio `[]` faz com que rode apenas uma vez,
     * quando o componente é montado.
     */
    useEffect(() => {
        carregarCategorias();
        carregarTransacoes();
    }, []);

    /**
     * Adiciona uma nova categoria ao estado e persiste no AsyncStorage.
     * @param {object} novaCategoria - O objeto da nova categoria (sem id)
     */
    const salvarNovaCategoria = async (novaCategoria) => {
        // Cria um novo array (imutabilidade) com a nova categoria e um id único
        const categoriasAtualizadas = [
            ...categorias, 
            { ...novaCategoria, id: Date.now().toString() }
        ];

        console.log('Salvando nova categoria:', novaCategoria);
        console.log('Categorias atualizadas:', categoriasAtualizadas);

        // 1. Atualiza o estado (UI) imediatamente para feedback rápido
        setCategorias(categoriasAtualizadas);
        
        // 2. Salva no disco (persistência)
        try {
            await AsyncStorage.setItem('@finance_app_categories', JSON.stringify(categoriasAtualizadas));
        } catch (e) {
            console.error('Erro ao salvar nova categoria:', e);
        }
    };

    /**
     * Salva uma nova transação (Receita/Despesa) ao estado e persiste no AsyncStorage.
     * @param {object} novaTransacao - O objeto da nova transação.
     */
    const salvarNovaTransacao = async (novaTransacao) => {
        const transacaoCompleta = {
            ...novaTransacao,
            id: Date.now().toString(),
            data: new Date().toISOString(), // Adiciona o timestamp atual
        }

        // 1. Cria um novo array, adicionando a nova transação no início (mais recente)
        const transacoesAtualizadas = [transacaoCompleta, ...transacoes];

        console.log('Nova transação(novaTransacao): ', novaTransacao);
        console.log('Salvando nova transação(transacaoCompleta):', transacaoCompleta);
        console.log('Transacoes(transacoes): ', transacoes)
        console.log('Transações atualizadas(transacoesAtualizadas):', transacoesAtualizadas);

        // 2. Atualiza o estado (UI) imediatamente para feedback rápido
        setTransacoes(transacoesAtualizadas);

        // 3. Salva no disco (persistência)
        try {
            await AsyncStorage.setItem('@finance_app_transactions', JSON.stringify(transacoesAtualizadas));
        } catch (e) {
            console.error('Erro ao salvar nova transação:', e);
        }
    }

    // 4. Objeto de valor que será fornecido a todos os componentes filhos
    const valorContexto = {
        categorias, // Adiciona categorias ao contexto
        transacoes, // Adiciona transacoes ao contexto
        carregando, // Estado de carregamento
        salvarNovaCategoria, // Função para salvar nova categoria
        salvarNovaTransacao, // Função para salvar nova transação
        // Outros métodos e estados virão aqui
    };

    return (
        // O Provedor "disponibiliza" o valorContexto para todos os {children}
        <ContextoFinancas.Provider value={valorContexto}>
            {children}
        </ContextoFinancas.Provider>
    );
};

// 3. Cria um Hook Customizado para facilitar o uso do Contexto
/**
 * Hook customizado para consumir o ContextoFinancas.
 * Facilita o acesso aos dados em qualquer componente.
 */
export const useFinancas = () => {
    return useContext(ContextoFinancas);
};