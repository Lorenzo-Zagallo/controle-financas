import React, { createContext, useState, useEffect, useContext } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

// 1. Cria o Contexto
const FinanceContext = createContext();

// Dados Iniciais/Padrão (Fallback caso não haja nada salvo)
const INITIAL_CATEGORIES = [
  { id: '1', name: 'Alimentação', type: 'expense', color: '#FF6384' },
  { id: '2', name: 'Salário', type: 'income', color: '#36A2EB' },
  { id: '3', name: 'Transporte', type: 'expense', color: '#FF0056' },
];

// 2. Cria o Provider (o componente que fornece os dados)
export const FinanceProvider = ({ children }) => {
  const [categories, setCategories] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  // Você pode adicionar mais estados aqui, como transações:
  // const [transactions, setTransactions] = useState([]);

  // Função Assíncrona para Carregar Categorias
  const loadCategories = async () => {
    try {
      const jsonValue = await AsyncStorage.getItem('@finance_app_categories');

      if (jsonValue !== null) {
        // Se houver dados salvos, use-os
        setCategories(JSON.parse(jsonValue));
      } else {
        // Se for a primeira vez, use os dados iniciais e salve-os
        await AsyncStorage.setItem('@finance_app_categories', JSON.stringify(INITIAL_CATEGORIES));
        setCategories(INITIAL_CATEGORIES);
      }
    } catch (e) {
      console.error('Erro ao carregar dados do AsyncStorage:', e);
      // Em caso de erro, ainda definimos um valor padrão
      setCategories(INITIAL_CATEGORIES);
    } finally {
      setIsLoading(false); // Indica que o carregamento terminou
    }
  };

  useEffect(() => {
    loadCategories();
  }, []);

  // Exemplo de função para adicionar/salvar novas categorias
  const saveNewCategory = async (newCategory) => {
    const updatedCategories = [...categories, { ...newCategory, id: Date.now().toString() }];
    setCategories(updatedCategories);
    try {
      await AsyncStorage.setItem('@finance_app_categories', JSON.stringify(updatedCategories));
    } catch (e) {
      console.error('Erro ao salvar nova categoria:', e);
    }
  };

  // Objeto de valor a ser fornecido para a aplicação
  const contextValue = {
    categories,
    isLoading,
    saveNewCategory,
    // Outros métodos e estados virão aqui
  };

  return (
    <FinanceContext.Provider value={contextValue}>
      {children}
    </FinanceContext.Provider>
  );
};

// 3. Cria um Hook Customizado para usar o Contexto facilmente
export const useFinance = () => {
  return useContext(FinanceContext);
};
