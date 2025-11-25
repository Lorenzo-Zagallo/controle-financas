import React, { createContext, useContext, useEffect, useMemo, useRef, useState } from "react";
import * as CategoriaDAO from "../dao/CategoriaDAO";
import * as TransacaoDAO from "../dao/TransacaoDAO";
import * as OrcamentoDAO from "../dao/OrcamentoDAO";

const ContextoFinancas = createContext();

const CATEGORIAS_INICIAIS = [
    { id: "1", nome: "Salário", tipo: "income", cor: "#36A2EB" },
    { id: "2", nome: "Alimentação", tipo: "expense", cor: "#FF6384" },
    { id: "3", nome: "Transporte", tipo: "expense", cor: "#ff7856ff" },
    { id: "4", nome: "Refeição", tipo: "expense", cor: "#FF0056" },
];

const normalizarNumero = (valor) => {
    const numero = Number(valor);
    return Number.isNaN(numero) ? 0 : numero;
};

export const ProvedorFinancas = ({ children }) => {
    const [categorias, setCategorias] = useState([]);
    const [transacoes, setTransacoes] = useState([]);
    const [orcamentos, setOrcamentos] = useState({});
    const [carregando, setCarregando] = useState(true);
    const [erro, setErro] = useState(null);

    const categoriasSeedFeita = useRef(false);
    const carregamentos = useRef({
        categorias: false,
        transacoes: false,
        orcamentos: false,
    });

    const marcarSeCarregado = (chave) => {
        carregamentos.current[chave] = true;
        const tudoCarregado = Object.values(carregamentos.current).every(Boolean);
        if (tudoCarregado) {
            setCarregando(false);
        }
    };

    const executarComFeedback = async (acao, mensagemErro) => {
        setErro(null);
        try {
            await acao();
        } catch (error) {
            console.error(mensagemErro, error);
            setErro(mensagemErro);
            throw error;
        }
    };

    const prepararTransacao = (transacao) => ({
        ...transacao,
        valor: normalizarNumero(transacao.valor),
    });

    useEffect(() => {
        setCarregando(true);
        setErro(null);

        const unsubscribeCategorias = CategoriaDAO.ouvirCategorias(async (lista) => {
            if (lista.length === 0 && !categoriasSeedFeita.current) {
                categoriasSeedFeita.current = true;
                try {
                    await Promise.all(
                        CATEGORIAS_INICIAIS.map((categoria) => CategoriaDAO.adicionarCategoria(categoria))
                    );
                    return;
                } catch (seedError) {
                    console.error("Erro ao criar categorias iniciais:", seedError);
                    setErro("Não foi possível preparar as categorias padrão.");
                }
            }
            setCategorias(lista);
            marcarSeCarregado("categorias");
        });

        const unsubscribeTransacoes = TransacaoDAO.ouvirTransacoes((lista) => {
            setTransacoes(lista);
            marcarSeCarregado("transacoes");
        });

        const unsubscribeOrcamentos = OrcamentoDAO.ouvirOrcamentos((lista) => {
            const mapa = lista.reduce((acc, item) => {
                const chave = item.categoriaId || item.id;
                acc[chave] = normalizarNumero(item.valorLimite);
                return acc;
            }, {});
            setOrcamentos(mapa);
            marcarSeCarregado("orcamentos");
        });

        return () => {
            unsubscribeCategorias();
            unsubscribeTransacoes();
            unsubscribeOrcamentos();
        };
    }, []);

    const salvarNovaCategoria = (novaCategoria) =>
        executarComFeedback(
            () => CategoriaDAO.adicionarCategoria(novaCategoria),
            "Não foi possível salvar a categoria."
        );

    const editarCategoria = (idParaEditar, dadosAtualizados) =>
        executarComFeedback(
            () => CategoriaDAO.atualizarCategoria(idParaEditar, dadosAtualizados),
            "Não foi possível editar a categoria."
        );

    const deletarCategoria = (idParaDeletar) =>
        executarComFeedback(async () => {
            const transacoesRelacionadas = transacoes.filter((t) => t.categoriaId === idParaDeletar);
            const promessas = transacoesRelacionadas.map((t) => TransacaoDAO.apagarTransacao(t.id));
            promessas.push(OrcamentoDAO.apagarOrcamento(idParaDeletar));
            promessas.push(CategoriaDAO.apagarCategoria(idParaDeletar));
            await Promise.all(promessas);
        }, "Não foi possível deletar a categoria.");

    const salvarNovaTransacao = (novaTransacao) =>
        executarComFeedback(
            () => TransacaoDAO.adicionarTransacao(prepararTransacao(novaTransacao)),
            "Não foi possível salvar a transação."
        );

    const editarTransacao = (idParaEditar, dadosAtualizados) =>
        executarComFeedback(
            () => TransacaoDAO.atualizarTransacao(idParaEditar, prepararTransacao(dadosAtualizados)),
            "Não foi possível editar a transação."
        );

    const deletarTransacao = (idParaDeletar) =>
        executarComFeedback(
            () => TransacaoDAO.apagarTransacao(idParaDeletar),
            "Não foi possível deletar a transação."
        );

    const salvarOrcamento = (categoriaId, valor) =>
        executarComFeedback(
            () => OrcamentoDAO.salvarOuAtualizarOrcamento(categoriaId, normalizarNumero(valor)),
            "Não foi possível salvar o orçamento."
        );

    const deletarOrcamento = (categoriaId) =>
        executarComFeedback(
            () => OrcamentoDAO.apagarOrcamento(categoriaId),
            "Não foi possível deletar o orçamento."
        );

    const { saldoTotal, receitaTotal, despesaTotal } = useMemo(() => {
        let receita = 0;
        let despesa = 0;

        transacoes.forEach((transacao) => {
            if (transacao.tipo === "income") receita += transacao.valor;
            else if (transacao.tipo === "expense") despesa += transacao.valor;
        });

        return { saldoTotal: receita - despesa, receitaTotal: receita, despesaTotal: despesa };
    }, [transacoes]);

    const gastosDoMesPorCategoria = useMemo(() => {
        const hoje = new Date();
        const mesAtual = hoje.getMonth() + 1;
        const anoAtual = hoje.getFullYear();

        const despesasDoMes = transacoes.filter((item) => {
            const data = new Date(item.data);
            return (
                item.tipo === "expense" &&
                data.getMonth() + 1 === mesAtual &&
                data.getFullYear() === anoAtual
            );
        });

        return despesasDoMes.reduce((acc, transacao) => {
            const id = transacao.categoriaId;
            if (!acc[id]) {
                acc[id] = 0;
            }
            acc[id] += transacao.valor;
            return acc;
        }, {});
    }, [transacoes]);

    const dadosGraficoDespesas = useMemo(() => {
        return Object.keys(gastosDoMesPorCategoria).map((id) => {
            const categoria = categorias.find((cat) => cat.id === id);
            const total = gastosDoMesPorCategoria[id];

            return {
                name: categoria ? categoria.nome : "Outros",
                population: total,
                color: categoria ? categoria.cor : "#585858",
                legendFontColor: "#585858",
                legendFontSize: 16,
            };
        });
    }, [gastosDoMesPorCategoria, categorias]);

    const dadosGraficoReceitas = useMemo(() => {
        const hoje = new Date();
        const mesAtual = hoje.getMonth() + 1;
        const anoAtual = hoje.getFullYear();

        const receitasDoMes = transacoes.filter((item) => {
            const data = new Date(item.data);
            return (
                item.tipo === "income" &&
                data.getMonth() + 1 === mesAtual &&
                data.getFullYear() === anoAtual
            );
        });

        const ganhosPorCategoria = receitasDoMes.reduce((acc, transacao) => {
            const id = transacao.categoriaId;
            if (!acc[id]) {
                acc[id] = 0;
            }
            acc[id] += transacao.valor;
            return acc;
        }, {});

        return Object.keys(ganhosPorCategoria).map((id) => {
            const categoria = categorias.find((cat) => cat.id === id);
            const total = ganhosPorCategoria[id];

            return {
                name: categoria ? categoria.nome : "Outros",
                population: total,
                color: categoria ? categoria.cor : "#585858",
                legendFontColor: "#585858",
                legendFontSize: 16,
            };
        });
    }, [transacoes, categorias]);

    const dadosEvolucaoFinanceira = useMemo(() => {
        const saldoPorMes = {};
        const transacoesOrdenadas = [...transacoes].sort(
            (a, b) => new Date(a.data) - new Date(b.data)
        );

        transacoesOrdenadas.forEach((transacao) => {
            const data = new Date(transacao.data);
            const chaveMes = `${data.getFullYear()}-${String(data.getMonth() + 1).padStart(2, "0")}`;

            if (!saldoPorMes[chaveMes]) {
                saldoPorMes[chaveMes] = 0;
            }

            if (transacao.tipo === "income") saldoPorMes[chaveMes] += transacao.valor;
            else saldoPorMes[chaveMes] -= transacao.valor;
        });

        const labels = Object.keys(saldoPorMes)
            .slice(-6)
            .map((chave) => {
                const [ano, mes] = chave.split("-");
                return `${mes}/${ano.substring(2)}`;
            });

        const data = Object.values(saldoPorMes).slice(-6);

        if (labels.length === 0) {
            return { labels: ["Sem dados"], datasets: [{ data: [0] }] };
        }

        return {
            labels,
            datasets: [{ data }],
        };
    }, [transacoes]);

    const valorContexto = {
        categorias,
        transacoes,
        orcamentos,
        carregando,
        erro,
        salvarNovaCategoria,
        editarCategoria,
        deletarCategoria,
        salvarNovaTransacao,
        editarTransacao,
        deletarTransacao,
        salvarOrcamento,
        deletarOrcamento,
        saldoTotal,
        receitaTotal,
        despesaTotal,
        dadosGraficoDespesas,
        dadosGraficoReceitas,
        gastosDoMesPorCategoria,
        dadosEvolucaoFinanceira,
    };

    return (
        <ContextoFinancas.Provider value={valorContexto}>
            {children}
        </ContextoFinancas.Provider>
    );
};

export const useFinancas = () => useContext(ContextoFinancas);
