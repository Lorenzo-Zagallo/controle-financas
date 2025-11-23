import React, { createContext, useState, useEffect, useContext, useMemo } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

// 1. Cria o Contexto
// O Contexto é o "túnel" que permite que os dados passem do Provedor para os componentes.
const ContextoFinancas = createContext();

// Dados Iniciais/Padrão (Fallback caso não haja nada salvo)
const CATEGORIAS_INICIAIS = [
    { id: '1', nome: 'Salário', tipo: 'income', cor: '#36A2EB' }, // income = receita
    { id: '2', nome: 'Alimentação', tipo: 'expense', cor: '#FF6384' }, // expense = despesa
    { id: '3', nome: 'Transporte', tipo: 'expense', cor: '#ff7856ff' },
    { id: '4', nome: 'Refeição', tipo: 'expense', cor: '#FF0056' },
];

// 2. Cria o Provedor (o componente que fornece os dados)
// O Provedor é o "Guardião" qe armazena o estado (useState) e as funçoes.
export const ProvedorFinancas = ({ children }) => {
    
    // --- ESTADOS GLOBAIS ---
    // O useState é o "cérebro" do Provedor, guardando os dados que mudam.
    const [categorias, setCategorias] = useState([]);
    const [transacoes, setTransacoes] = useState([]);
    const [carregando, setCarregando] = useState(true); // Controla a tela de loading inicial
    const [orcamentos, setOrcamentos] = useState({});  // Guarda as metas. Ex: { 'categoriaId_2': 500, 'categoriaId_3': 200 }

    // --- FUNÇÕES DE CARREGAMENTO DE DADOS (AsyncStorage) ---

    /**
     * Carrega as categorias salvas no AsyncStorage.
     * Se não houver dados salvos, salva e usa as categorias iniciais.
     */
    const carregarCategorias = async () => {
        try {
            // Linha de teste (descomente para limpar o AsyncStorage)
            // await AsyncStorage.removeItem('@finance_app_categories');

            // Tenta ler a chave '@finance_app_categories' do disco
            const valorJson = await AsyncStorage.getItem('@finance_app_categories');

            if (valorJson !== null) {
                // Se encontrou dados, converte a string JSON de volta para um array/objeto.
                setCategorias(JSON.parse(valorJson));
                console.log('CATEGORIAS carregadas do AsyncStorage!');
            } else {
                // Se for a primeira vez, salva as categorias padrão no disco.
                await AsyncStorage.setItem('@finance_app_categories', JSON.stringify(CATEGORIAS_INICIAIS));
                setCategorias(CATEGORIAS_INICIAIS);
                console.log('CATEGORIAS iniciais salvas no AsyncStorage!');
            }
        } catch (e) {
            console.error('Erro ao carregar CATEGORIAS do AsyncStorage:', e);
            // Fallback: se der erro na leitura, usa as categorias padrão.
            setCategorias(CATEGORIAS_INICIAIS);
        }
    };

    /**
     * Carrega as transações salvas no AsyncStorage.
     */
    const carregarTransacoes = async () => {
        try {
            const valorJson = await AsyncStorage.getItem('@finance_app_transactions');
            if (valorJson !== null) {
                const loadedTransactions = JSON.parse(valorJson);

                // LÓGICA COMPLEXA: ORDENAÇÃO DE DATAS
                // Ordena as transações para que as mais recentes (b) apareçam antes das mais antigas (a).
                setTransacoes(loadedTransactions.sort((a, b) => new Date(b.data) - new Date(a.data)))
                console.log('TRANSAÇÕES carregadas do AsyncStorage!');
            }
        } catch (e) {
            console.error('Erro ao carregar TRANSAÇÕES do AsyncStorage:', e);
            setTransacoes([]); // Começa o array vazio se der erro.
        }
    }

    /**
     * Carrega as metas de orçamento salvas.
     */
    const carregarOrcamentos = async () => {
        try {
            const valorJson = await AsyncStorage.getItem('@finance_app_budgets');
            if (valorJson !== null) {
                setOrcamentos(JSON.parse(valorJson))
                console.log('ORÇAMENTOS carregados do AsyncStorage!');
            }
        } catch (e) {
            console.error('Erro ao carregar ORÇAMENTOS do AsyncStorage: ', e);
            setOrcamentos({}); // Começa com objeto vazio se der erro
        }
    }

    /**
     * LÓGICA COMPLEXA: CARREGAMENTO INICIAL (useEffect)
     * O useEffect com `[]` (array de dependências vazio) roda APENAS UMA VEZ,
     * quando o ProvedorFinancas é montado (quando o app abre).
     * * Criamos uma função `async carregarDados` interna para garantir que TODAS
     * as funções de carregamento (categorias, transações, orçamentos)
     * terminem (await) ANTES de `setCarregando(false)`.
     */
    useEffect(() => {        
        const carregarDados = async () => {
            await carregarCategorias(); // Espera carregar categorias
            await carregarTransacoes(); // Espera carregar transações
            await carregarOrcamentos(); // Espera carregar orçamentos
            setCarregando(false); // Libera a tela de loading
        };
        carregarDados();
    }, []); // 0 `[]` vazio garante que isso roda só uma vez.


    // --- FUNÇÕES DE SALVAMENTO DE DADOS (AsyncStorage) ---

    /**
     * Adiciona uma nova categoria ao estado e persiste no AsyncStorage.
     */
    const salvarNovaCategoria = async (novaCategoria) => {
        // LÓGICA DE IMUTABILIDADE:
        // 1. Cria um NOVO array (categoriasAtualizadas) copiando tudo de `...categorias`
        // e adicionando o novo item. O React SÓ atualiza a tela se o array for novo.
        const categoriasAtualizadas = [
            ...categorias, 
            { ...novaCategoria, id: Date.now().toString() } // Adiciona um ID único
        ];

        // 2. Atualiza o estado (UI) imediatamente para feedback rápido
        setCategorias(categoriasAtualizadas);
        
        // 3. Salva no disco (persistência)
        try {
            await AsyncStorage.setItem('@finance_app_categories', JSON.stringify(categoriasAtualizadas));
            console.log('CATEGORIA salva com sucesso!');
        } catch (e) {
            console.error('Erro ao salvar nova CATEGORIA:', e);
        }
    };

    /**
     * Salva uma nova transação (Receita/Despesa) ao estado e persiste no AsyncStorage.
     */
    const salvarNovaTransacao = async (novaTransacao) => {
        const transacaoCompleta = {
            ...novaTransacao, // `novaTransacao` já contém a data (YYYY-MM-DD) vinda do formulário
            id: Date.now().toString(),
            // A linha abaixo foi comentada pois a data agora vem do formulário (TextInput)
            /* data: new Date().toISOString(), */
        }

        // LÓGICA DE IMUTABILIDADE (com ordenação):
        // 1. Cria um novo array, colocando a `transacaoCompleta` PRIMEIRO,
        // e depois copiando o resto `...transacoes`. Isso mantém a lista ordenada (mais recentes no topo).
        const transacoesAtualizadas = [transacaoCompleta, ...transacoes];

        // 2. Atualiza o estado (UI)
        setTransacoes(transacoesAtualizadas);

        // 3. Salva no disco (persistência)
        try {
            await AsyncStorage.setItem('@finance_app_transactions', JSON.stringify(transacoesAtualizadas));
            console.log('TRANSAÇÃO salva com sucesso!');
        } catch (e) {
            console.error('Erro ao salvar nova TRANSAÇÃO:', e);
        }
    }

    /**
     * Salva/Atualiza o valor de uma meta de orçamento. 
     */
    const salvarOrcamento = async (categoriaId, valor) => {
        // LÓGICA DE IMUTABILIDADE (OBJETO/MAPA):
        // 1. Cria um NOVO objeto, copiando tdo de `...orcamentos`,
        //e depois ATUALIZA A CHAVE DINÂMICA `[categoriaId]` com o novo `valor`
        const orcamentosAtualizados = {
            ...orcamentos,
            [categoriaId]: Number(valor) || 0
        }

        // 2. Atualiza o estado (UI)
        setOrcamentos(orcamentosAtualizados);

        // 3. Salva no disco (persistência)
        try {
            await AsyncStorage.setItem('@finance_app_budgets', JSON.stringify(orcamentosAtualizados));
            console.log('ORÇAMENTO salvo com sucesso!');
        } catch (e) {
            console.error('Erro ao salvar ORÇAMENTO: ', e);
        }
    };


    // --- FUNÇÕES DE EDIÇÃO E DELEÇÃO (CRUD) ---

    /**
     * Deleta uma transação específica.
     * @param {string} idParaEditar - O ID da transação a ser modificada.
     * @param {object} dadosAtualizados - O objeto com os novos dados da transação
     */
    const editarTransacao = async (idParaEditar, dadosAtualizados) => {
        // LÓGICA COMPLEXTA (MAP): Cria um novo array.
        // Itera por todas as transações, se o ID bater, retorna o item antigo
        // mesclado com os novos dados (`...t, ...dadosAtualizados`).
        const transacoesAtualizadas = transacoes.map(t => {
            if (t.id === idParaEditar) {
                return { ...t, ...dadosAtualizados};
            }
            return t;
        });

        // Reordena por data, pois a data pode ter sido editada
        transacoesAtualizadas.sort((a, b) => new Date(b.data) - new Date(a.data));

        setTransacoes(transacoesAtualizadas);
        await AsyncStorage.setItem('@finance_app_transactions', JSON.stringify(transacoesAtualizadas));
    };

    /**
     * Deleta uma transação específica.
     * @param {string} idParaDeletar - O ID da transação a ser removida.
     */
    const deletarTransacao = async (idParaDeletar) => {
        // LÓGICA COMPLEXTA (FILTER): Cria um novo array contendo apenas
        // os itens cujo ID é DIFERENTE do ID a ser deletado.
        const transacoesAtualizadas = transacoes.filter(t => t.id !== idParaDeletar);

        setTransacoes(transacoesAtualizadas);
        await AsyncStorage.setItem('@finance_app_transactions', JSON.stringify(transacoesAtualizadas));
    };
    

    /**
     * Editar uma categoria existente.
     * @param {string} idParaEditar  - O ID da categoria
     * @param {object} dadosAtualizados - O objeto com os novos dados (ex: { nome, cor, tipo }).
     */
    const editarCategoria = async (idParaEditar, dadosAtualizados) => {
        const categoriasAtualizadas = categorias.map(cat => {
            if (cat.id === idParaEditar) {
                return { ...cat, ...dadosAtualizados };
            }
            return cat;
        });
        setCategorias(categoriasAtualizadas);
        await AsyncStorage.setItem('@finance_app_categories', JSON.stringify(categoriasAtualizadas));
    };


    /**
     * LÓGICA COMPLEXA: DELEÇÃO EM CASCATA
     * Deleta uma categoria E TODOS os orçamentos e transações associados a ela.
     * @param {string} idParaDeletar - O ID da categoria a ser removida.
     */
    const deletarCategoria = async (idParaDeletar) => {
        // 1. Deleta a Categoria
        const categoriasAtualizadas = categorias.filter(cat => cat.id !== idParaDeletar);

        // 2. Deleta as Transações associadas
        const transacoesAtualizadas = transacoes.filter(t => t.categoriaId !== idParaDeletar);

        // 3. Deleta o Orçamento (Meta) associado
        const orcamentosAtualizados = { ...orcamentos };
        delete orcamentosAtualizados[idParaDeletar]; // remove a chave do objeto

        // 4. Atualiza todos os estado
        setCategorias(categoriasAtualizadas);
        setTransacoes(transacoesAtualizadas);
        setOrcamentos(orcamentosAtualizados);

        // 5. Salva todas as mudanças no AsyncStorage
        await AsyncStorage.setItem('@finance_app_categories', JSON.stringify(categoriasAtualizadas));
        await AsyncStorage.setItem('@finance_app_transactions', JSON.stringify(transacoesAtualizadas));
        await AsyncStorage.setItem('@finance_app_budgets', JSON.stringify(orcamentosAtualizados));
    }

    /**
     * Deleta/Reseta uma meta de orçamento (remove a chave do mapa).
     * @param {string} categoriaId - O ID da categoria do orçamento a ser removido.
     */
    const deletarOrcamento = async (categoriaId) => {
        const orcamentosAtualizados = { ...orcamentos};
        delete orcamentosAtualizados[categoriaId];; // remove a chave

        setOrcamentos(orcamentosAtualizados);
        await AsyncStorage.setItem('@finance_app_budgets', JSON.stringify(orcamentosAtualizados));
    };


    // --- CÁLCULOS MEMORIZADOS (useMemo) ---
    // O useMemo é um hook de performance. Ele SÓ recalcula esses valores
    // se os dados dentro do array de dependências (ex: [transacoes]) mudarem.

    /**
     * LÓGICA COMPLEXA: CÁLCULO DE SALDOS TOTAIS
     * Calcula o saldo total, receita total e despesa total.
     * Só é recalculado se a lista de [transacoes] mudar.
     */
    const { saldoTotal, receitaTotal, despesaTotal } = useMemo(() => {
        let receita = 0;
        let despesa = 0;

        // Itera sobre as transações para somar
        transacoes.forEach(transacao => {
            if (transacao.tipo === 'income') receita += transacao.valor;
            else if (transacao.tipo === 'expense') despesa += transacao.valor;
        });

        const saldo = receita - despesa;

        console.log("1. Cálculo de saldos totais => ", { saldoTotal: saldo, receitaTotal: receita, despesaTotal: despesa });

        return { saldoTotal: saldo, receitaTotal: receita, despesaTotal: despesa };
    }, [transacoes]);

    /**
     * LÓGICA COMPLEXA: GASTOS DO MÊS POR CATEGORIA (para Orçamentos)
     * Calcula o total gasto em cada categoria APENAS no mês e ano atuais.
     * Só é recalculado se a lista de [transacoes] mudar.
     */
    const gastosDoMesPorCategoria = useMemo(() => {
        const hoje = new Date();
        const mesAtual = hoje.getMonth() + 1;
        const anoAtual = hoje.getFullYear();

        // 1. Filtra apenas despesas do mês/ano atual
        const despesasDoMes = transacoes.filter(item => {
            const  data = new Date(item.data);
            return item.tipo === 'expense' &&
                data.getMonth() + 1 === mesAtual &&
                data.getFullYear() === anoAtual;
        });

        // 2. LÓGICA DE REDUCE (Agrupamento):
        // Transforma o array [despesasDoMes] em um objeto (mapa)
        // onde a chave é o ID da categoria e o valor é a soma dos gastos
        const gastosPorCategoria = despesasDoMes.reduce((acc, transacao) => {
            const id = transacao.categoriaId;
            if (!acc[id]) { // Se é a primeira vez vendo essa categoria, inicia com 0
                acc[id] = 0;
            }
            acc[id] += transacao.valor; // Soma o valor da transação ao total da categoria
            return acc; // Retorna o acumulador para a próxima iteração
        }, {}); // `{}` é o valor inicial (um objeto vazio)

        console.log("2. Despesas do mês => ", despesasDoMes);
        console.log("2. Gastos do mês por categoria => ", gastosPorCategoria);

        return gastosPorCategoria; // Ex: { '2': 500, '3': 200 }
    }, [transacoes])

    /**
     * LÓGICA COMPLEXA: DADOS DO GRÁFICO (Despesas)
     * Formata os dados já calculados em `gastosDoMesPorCategoria`
     * para o formato que a biblioteca `react-native-chart-kit` espera.
     * Só recalcula se [gastosDoMesPorCategoria] ou [categorias] (para nomes/cores) mudarem.
     */
    const dadosGraficoDespesas = useMemo(() => {
        // Transforma o objeto { '2': 500, '3': 200 } em um array
        const dadosFormatados = Object.keys(gastosDoMesPorCategoria).map(id => {
            const categoria = categorias.find(cat => cat.id === id);
            const total = gastosDoMesPorCategoria[id];

            // Formato exigido pelo PieChart
            return {
                name: categoria ? categoria.nome : 'Outros',
                population: total, // 'population' é o nome da prop que biblioteca usa para o valor
                color: categoria ? categoria.cor : '#585858',
                legendFontColor: '#585858',
                legendFontSize: 16,
            };
        });

        console.log("3. Dados do gráfico de despesas => ", dadosFormatados)
        
        return dadosFormatados;
    }, [gastosDoMesPorCategoria, categorias]); // Depende dos gastos CALCULADOS e das categorias

    /**
     * LÓGICA COMPLEXA: DADOS DO GRÁFICO (Receitas)
     * Faz o mesmo que o cálculo de despesas, mas para 'income'.
     * (Este cálculo é separado pois 'gastosDoMesPorCategoria' só filtra 'expense')
     */
    const dadosGraficoReceitas = useMemo(() => {
        const hoje = new Date();
        const mesAtual = hoje.getMonth() + 1;
        const anoAtual = hoje.getFullYear();

        // 1. Filtra apenas receitas do mês
        const receitasDoMes = transacoes.filter(item => {
            const data = new Date(item.data);
            return item.tipo === 'income' &&
                data.getMonth() + 1 === mesAtual &&
                data.getFullYear() === anoAtual;
        });

        // 2. Agrupa (Reduce)
        const ganhosPorCategoria = receitasDoMes.reduce((acc, transacao) => {
            const id = transacao.categoriaId;
            if (!acc[id]) {
                acc[id] = 0;
            }
            acc[id] += transacao.valor;
            return acc;
        }, {});

        // 3. Formata (Map)
        const dadosFormatados = Object.keys(ganhosPorCategoria).map(id => {
            const categoria = categorias.find(cat => cat.id === id);
            const total = ganhosPorCategoria[id];

            return {
                name: categoria ? categoria.nome : 'Outros',
                population: total,
                color: categoria ? categoria.cor : '#585858',
                legendFontColor: '#585858',
                legendFontSize: 16,
            };
        });

        console.log("4. Receitas do mês => ", receitasDoMes);
        console.log("4. Ganhos do mês por categoria => ", ganhosPorCategoria);
        console.log("4. Dados do gráfico de receitas => ", dadosFormatados)

        return dadosFormatados;
    }, [transacoes, categorias]);


    // ... (dentro de ProvedorFinancas)

    // 🚨 NOVO CÁLCULO: Evolução Financeira (Saldo por Mês)
    const dadosEvolucaoFinanceira = useMemo(() => {
        // Objeto para armazenar saldo por mês: { '2025-10': 500, '2025-11': 1200 }
        const saldoPorMes = {};
        
        // Ordena transações da mais antiga para a mais nova
        const transacoesOrdenadas = [...transacoes].sort((a, b) => new Date(a.data) - new Date(b.data));

        transacoesOrdenadas.forEach(t => {
            const data = new Date(t.data);
            const chaveMes = `${data.getFullYear()}-${String(data.getMonth() + 1).padStart(2, '0')}`; // "2025-11"
            
            if (!saldoPorMes[chaveMes]) {
                saldoPorMes[chaveMes] = 0;
            }
            
            if (t.tipo === 'income') saldoPorMes[chaveMes] += t.valor;
            else saldoPorMes[chaveMes] -= t.valor;
        });

        // Transforma em arrays para o gráfico (últimos 6 meses)
        const labels = Object.keys(saldoPorMes).slice(-6).map(chave => {
            const [ano, mes] = chave.split('-');
            return `${mes}/${ano.substring(2)}`; // Ex: "11/25"
        });
        
        // Acumula o saldo ao longo do tempo (opcional, ou mostra o saldo DO mês)
        // Aqui vamos mostrar o resultado líquido de CADA mês
        const data = Object.values(saldoPorMes).slice(-6);

        // Se não tiver dados suficientes, retorna dados fictícios/vazios para não quebrar o gráfico
        if (labels.length === 0) {
            return { labels: ["Sem dados"], datasets: [{ data: [0] }] };
        }

        return {
            labels,
            datasets: [{ data }]
        };
    }, [transacoes]);

    // ... (Adicione 'dadosEvolucaoFinanceira' ao 'valorContexto')


    // 4. Objeto de valor que será "exportado" pelo Provedor
    const valorContexto = {
        categorias, // Adiciona as categorias ao contexto
        transacoes, // Adiciona as transações ao contexto
        orcamentos, // Adiciona os orçamentos ao contexto
        carregando, // Estado de carregamento
        salvarNovaCategoria, // Função para salvar nova categoria
        editarCategoria, // Função para editar uma categoria existente
        deletarCategoria, // Função para deletar uma categoria existente
        salvarNovaTransacao, // Função para salvar nova transação
        editarTransacao, // Função para editar uma transação existente
        deletarTransacao, // Função para deletar uma transação existente
        salvarOrcamento, // Função para salvar/atualizar orçamentos
        deletarOrcamento, // Função para deletar um orçamento existente
        saldoTotal, // Saldo total calculado
        receitaTotal, // Receita total calculada
        despesaTotal, // Despesa total calculada
        dadosGraficoDespesas, // Dados do Gráfico de Despesa
        dadosGraficoReceitas, // Dados do Gráfico de Receitas
        gastosDoMesPorCategoria,
        dadosEvolucaoFinanceira, // Dados do Gráfico de Evolução Financeira
    };

    return (
        // O Provedor "disponibiliza" o valorContexto para todos os {children} (seu app)
        <ContextoFinancas.Provider value={valorContexto}>
            {children}
        </ContextoFinancas.Provider>
    );
};

// 3. Cria um Hook Customizado para facilitar o uso do Contexto
/**
 * Hook customizado `useFinancas`.
 * Facilita o acesso aos dados do contexto em qualquer componente.
 * Em vez de importar `useContext` e `ContextoFinancas` em toda tela,
 * você só importa e chama `useFinancas()`.
 */
export const useFinancas = () => {
    return useContext(ContextoFinancas);
};