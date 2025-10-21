import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import TabNavigation from "./navigation/TabNavigation";
import { ActivityIndicator, View, StyleSheet } from "react-native";

// importa o Provider e o Hook
import { FinanceProvider, useFinance } from "./context/FinanceContext";

// componente que renderiza a navegação APENAS DEPOIS de carregar os dados
const AppContent = () => {
	const { isLoading } = useFinance();

	// enquanto os dados estiverem sendo carregados, mostra um indicador de loading
	if (isLoading) {
		return (
			<View style={styles.loadingContainer}>
				<ActivityIndicator size="large" color="007bff" />
			</View>
		);
	}

	// quando o carregamento terminar, renderiza a navegação
	return <TabNavigation />
}

export default function App() {
	return (
		<NavigationContainer>
			{/** envolve TUDO no provider */}
			<FinanceProvider>
				<TabNavigation /> {/** aqui a navegação por abas será renderizada */}
			</FinanceProvider>
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
