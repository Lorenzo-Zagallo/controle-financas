import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import TabNavigation from "./navigation/TabNavigation";
import { ActivityIndicator, View, StyleSheet, LogBox, Platform } from "react-native";

// Importa o Provedor
import { ProvedorFinancas, useFinancas } from "./context/ContextoFinancas";

// --- CONFIGURAÇÃO DE LOGS (LIMPEZA) ---

// 1. Para Mobile (Android/iOS): Ignora avisos amarelos na tela
LogBox.ignoreLogs([
  "Warning: Unknown event handler property",
  "props.pointerEvents is deprecated",
]);

// 2. Para Web (Navegador): Filtra os erros vermelhos falsos do console
if (Platform.OS === 'web') {
  const originalError = console.error;
  console.error = (...args) => {
    // Lista de erros que queremos ignorar na Web
    const errosParaIgnorar = [
      "Unknown event handler property",
      "Invalid DOM property",
      "props.pointerEvents is deprecated",
      "Expected server HTML to contain a matching"
    ];

    if (typeof args[0] === 'string') {
      const deveIgnorar = errosParaIgnorar.some(erro => args[0].includes(erro));
      if (deveIgnorar) return;
    }
    
    originalError(...args);
  };
}

// Componente que gerencia o carregamento inicial
const AppContent = () => {
    const { carregando } = useFinancas();

    if (carregando) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color="#007bff" />
            </View>
        );
    }

    return <TabNavigation />
}

export default function App() {
    return (
        <NavigationContainer>
            <ProvedorFinancas>
                <AppContent />
            </ProvedorFinancas>
        </NavigationContainer>
    );
}

const styles = StyleSheet.create({
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#f5f5f5',
    },
});