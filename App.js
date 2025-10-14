import React, { useState } from "react";
import {
	View, StyleSheet, Text, TextInput, Image,
	StatusBar, ScrollView, Button, Modal, ActivityIndicator, FlatList
} from 'react-native';
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

const Stack = createNativeStackNavigator();

const TelaDetalhes = () => <Text>Detalhes de um item</Text>;

// NOVA TELA DE CÁLCULO
const TelaSoma = () => {
	const [parc1, setParc1] = useState("Valor1");
	const [parc2, setParc2] = useState("Valor2");
	const [somaR, setSomaR] = useState("Toque aqui para somar.");
	const [isLoading, setIsLoading] = useState(false);

	function executarSoma() {
		// ... (Mantenha toda a lógica do cálculo e do setTimeout aqui)
		setIsLoading(true);
		setSomaR("Calculando...");

		setTimeout(() => {
			let p1 = parseInt(parc1) || 0;
			let p2 = parseInt(parc2) || 0;
			let resultado = p1 + " + " + p2 + " = " + (p1 + p2);
			setSomaR(resultado);
			setIsLoading(false);
		}, 2000);
	}

	return (
		<View style={styles.telaSomaContainer}>
			<TextInput style={styles.entrada} value={parc1} onChangeText={setParc1} keyboardType="numeric" />
			<TextInput style={styles.entrada} value={parc2} onChangeText={setParc2} keyboardType="numeric" />

			{isLoading ? (
				<ActivityIndicator size="large" color="#0000ff" style={{ marginTop: 10 }} />
			) : (
				<Text style={styles.texto} onPress={executarSoma}>{somaR}</Text>
			)}
		</View>
	);
};

const AppNavigator = () => {
	return (
		<NavigationContainer>
			<Stack.Navigator>
				{/*
					Cada Screen (Tela) é um item na sua pilha.
					A primeira Screen listada é a tela inicial (a base da pilha).
				*/}
				<Stack.Screen
					name="Principal"
					component={TelaPrincipal} // <--- COMPONENTE PRINCIPAL É A TELA INICIAL
					options={{ title: 'Início do App' }}
				/>
				<Stack.Screen
					name="Detalhes"
					component={TelaDetalhes}
					options={{ title: 'Tela de Detalhes' }}
				/>
				<Stack.Screen
					name="Soma"
					component={TelaSoma}
					options={{ title: 'Calculadora de Soma' }}
				/>
			</Stack.Navigator>
		</NavigationContainer>
	)
}

// Text
const TextoAninhado = () => {
	const [titulo, setTitulo] = useState("Texto do elemento filho");

	const modificaTexto = () => {
		setTitulo("Esse texto está sendo exibido pois o primeiro elemento do texto foi pressionado/tocado");
	};

	return (
		<View>
			<Text style={styles.baseText}>
				<Text style={styles.titulo} onPress={modificaTexto}>
					{titulo}
					{"\n"}
				</Text>
			</Text>
		</View>
	);
};

// Image
const Imagem = () => {
	return (
		<Image style={styles.imagem} source={{ uri: 'https://reactnative.dev/img/tiny_logo.png' }} />
	);
}

// TextInput
const MeuTextoInput = () => {
	const [texto, setTexto] = React.useState(null);
	const [numero, setNumero] = React.useState(0);

	return (
		<View>
			<TextInput
				style={styles.meuTextInput}
				value={texto || ''}
				onChangeText={setTexto}
				placeholder="Digite um texto" />
			<TextInput
				style={styles.meuTextInput}
				value={String(numero)}
				onChangeText={text => setNumero(Number(text))}
				keyboardType="numeric" />
			<Text style={styles.valueText}>
				Texto: {texto}
			</Text>
			<Text style={styles.valueText}>
				Número: {numero}
			</Text>
		</View>
	);
};

// ScrollView
const Lista = () => {
	return (
		<View style={[styles.containerScrollView, styles.listaContent]}>
			<Text style={styles.text}>
				Lorem ipsum dolor sit amet, consectetur adipiscing elit.
				Pellentesque id dui sed nulla imperdiet scelerisque.
				Integer malesuada facilisis nibh varius eleifend.
				Cras a velit laoreet dui interdum consectetur.
				Pellentesque volutpat placerat mauris in interdum.
				Pellentesque non egestas sem. Suspendisse malesuada at augue
				sit amet pretium.
				Praesent odio nisl, semper vitae purus a, elementum ultrices arcu.
				Praesent blandit lectus et aliquet posuere.
				Nulla dictum, nisi id feugiat suscipit, mi sem maximus turpis,
				vel aliquet massa ex sit amet sem.
				Sed ullamcorper enim non elit vestibulum, feugiat euismod elit
				consectetur. In et pulvinar eros.
			</Text>
		</View>
	);
};

// Calculadora
const Soma = () => {
	const [parc1, setParc1] = useState("Valor1");
	const [parc2, setParc2] = useState("Valor2");
	const [somaR, setSomaR] = useState("Toque aqui para somar.");

	// estado para controlar a visibilidade do ActivityIndicator
	const [isLoading, setIsLoading] = useState(false);

	function executarSoma() {
		// 1. Inicia o carregamento (mostra o ActivityIndicator)
		setIsLoading(true);
		setSomaR("Calculando..."); // Feedback imediato

		// simula um atraso de 2 segundos (como se estivesse buscando uma API)
		setTimeout(() => {

			let p1 = parseInt(parc1);
			// Verifica se o valor é um número válido (para evitar NaN)
			if (isNaN(p1)) p1 = 0;
			console.log("Valor de p1: ", p1);

			let p2 = parseInt(parc2);
			if (isNaN(p2)) p2 = 0;
			console.log("Valor de p2: ", p2);

			// 2. Calcula o resultado
			let resultado = p1 + " + " + p2 + " = " + (p1 + p2);
			setSomaR(resultado);

			// 3. Finaliza o carregamento (esconde o ActivityIndicator)
			setIsLoading(false);
		}, 2000); // 2000 milissegundos = 2 segundos
	}

	return (
		<View style={styles.container}>
			<TextInput style={styles.entrada} value={parc1} onChangeText={setParc1} keyboardType="numeric" />
			<TextInput style={styles.entrada} value={parc2} onChangeText={setParc2} keyboardType="numeric" />

			{/* Renderização Condicional: Se estiver carregando, mostra o indicador; senão, mostra o texto */}
			{isLoading ? (
				// ActivityIndicator enquanto carrega o resultado da soma
				<ActivityIndicator
					size="large" // Grande
					color="#0000ff" // Azul
					style={{ marginTop: 10 }}
				/>
			) : (
				// Texto que exibe o resultado ou a mensagem inicial
				<Text styles={styles.texto} onPress={executarSoma}>{somaR}</Text>
			)
			}

		</View>
	);
};

// Modal
// class MeuModal extends Component {
// 	constructor(props) {
// 		super(props);
// 		this.state = { isVisible: false };// O estado que controla a visibilidade
// 	}
// 		render() {
// 			return (
// 				<View style={styles.container}>
// 					<Modal
// 						animationType={'slide'}
// 						transparent={false}
// 						visible={this.state.isVisible} // Conexão chave: Controla a exibição
// 						onRequestClose={() => {
// 							this.setState({ isVisible: false });
// 						}}
// 					>
// 						<View style={styles.modal}>
// 							<Text style={styles.text}>Modal está aberto!</Text>
// 							<Button title="Clique para fechar o Modal" onPress={() => {
// 								this.setState({ isVisible: false });
// 							}} />
// 						</View>
// 					</Modal>
// 				</View>
// 			)
// 		}
// }

// componentes do flatlist (simula uma base de dados)
const COMPONENTES = [
	{ id: '1', component: Imagem },
	{ id: '2', component: TextoAninhado },
	{ id: '3', component: MeuTextoInput },
	{ id: '4', component: Lista },
	{ id: '5', component: Soma },
	{ id: '6', component: 'NAVIGATE_SOMA' },
	{ id: '7', component: 'MODAL_BUTTON' },
];

// tela principal que usa o FlatList para renderizar os componentes da array COMPONENTES acima
const TelaPrincipal = ({ navigation }) => {

	// adicionar o estado do modal
	const [isModalVisible, setIsModalVisible] = useState(false);

	// função para alternar a visibilidade do modal
	const toggleModal = () => {
		setIsModalVisible(!isModalVisible);
	};

	// renderiza cada item do array como um componente
	const renderizarItem = ({ item }) => {
		if (item.component === 'MODAL_BUTTON') {
			return (
				<View style={{ marginVertical: 10, width: '80%', alignSelf: 'center' }}>
					<Button title="Abrir Modal" onPress={toggleModal} color="#841584" />
				</View>
			);
		}

		// 2. Lógica para o botão de Navegação (Soma)
		if (item.component === 'NAVIGATE_SOMA') {
			return (
				<View style={{ marginVertical: 10, width: '80%', alignSelf: 'center' }}>
					<Button
						title="Abrir Calculadora (Soma)"
						onPress={() => navigation.navigate('Soma')} // <--- NAVEGAÇÃO AQUI!
						color="blue"
					/>
				</View>
			);
		}

		const ComponentToRender = item.component;
		return (
			// renderiza o componente real. adicione um view ou estilo se necessário
			<View style={{ width: '100%', alignItems: 'center' }}>
				<ComponentToRender />
			</View>
		);
	};

	return (
		<View style={styles.container}>
			<FlatList
				data={COMPONENTES} // O array de componentes
				renderItem={renderizarItem} // Função que renderiza cada item (componente)
				keyExtractor={item => item.id} // Chave única para cada item
				// Adiciona espaçamento entre os itens e um cabeçalho
				ItemSeparatorComponent={() => <View style={{ height: 20 }} />}
				// Cabeçalho e rodapé da lista
				ListHeaderComponent={<Text style={styles.header}>Meu Aplicativo React Native</Text>}
				// Estilo do container do FlatList
				contentContainerStyle={styles.flatListContentContainer}
			/>

			{/* Botão para abrir o modal */}
			{/* <Button title="Abrir Modal" onPress={() => setIsModalVisible(true)} color="#841584" /> */}

			{/* Modal */}
			<Modal animationType="slide"
				transparent={false}
				visible={isModalVisible}
				// Essencial para o botão 'voltar' do Android
				onRequestClose={() => setIsModalVisible(false)}>

				<View style={styles.modalCenteredView}>
					<View style={styles.modalView}>
						<Text style={styles.modalText}>MODAL ESTÁ ABERTO!</Text>
						<Button
							title="Fechar Modal"
							onPress={() => setIsModalVisible(false)} // Fecha ao pressionar
						/>
					</View>
				</View>

			</Modal>
		</View>
	);
};

export default AppNavigator;

const styles = StyleSheet.create({
	container: {
		flex: 1, // essencial para Flatlist
		// justifyContent e alignItems não é necessário pois o FlatList os gerencia
	},
	telaDetalhes: {
		flex: 1,
		justifyContent: 'center',
		alignItems: 'center'
	},
	header: {
		fontSize: 24,
		fontWeight: 'bold',
		textAlign: 'center',
		marginVertical: 15,
	},
	baseText: {
		fontSize: 18,
		margin: 10,
		color: 'black',
	},
	titulo: {
		fontSize: 20,
		fontWeight: 'bold',
		color: 'blue',
	},
	meuTextInput: {
		height: 40,
		borderColor: 'gray',
		borderWidth: 1,
		marginBottom: 10,
		paddingLeft: 10,
		width: '100%',
	},
	valueText: {
		fontSize: 16,
		marginTop: 10,
		color: 'green',
	},
	imagem: {
		margin: 10,
		width: 50,
		height: 50,
		alignSelf: 'center'
	},
	safeContainer: {
		flex: 1,
		paddingTop: StatusBar.currentHeight,
	},
	containerScrollView: {
		backgroundColor: 'grey',
		marginHorizontal: 20,
	},
	text: {
		fontSize: 26,
	},
	entrada: {
		height: 40,
		borderWidth: 1,
	},
	texto: {
		fontFamily: "Verdana", fontSize: 24,
	},
	modalCenteredView: {
		flex: 1,
		justifyContent: 'center',
		alignItems: 'center',
		marginTop: 22,
		backgroundColor: 'rgba(0,0,0,0.5)'
	},
	modalView: {
		margin: 20,
		backgroundColor: 'white',
		borderRadius: 20,
		padding: 35,
		alignItems: 'center',
		shadowColor: '#000',
		shadowOffset: { width: 0, height: 2 },
		shadowOpacity: 0.25,
		shadowRadius: 4,
		elevation: 5,
	},
	modalText: {
		marginBottom: 15,
		textAlign: 'center',
		fontSize: 18,
		fontWeight: 'bold',
	},
	flatListContentContainer: {
		paddingHorizontal: 20,
		paddingBottom: 50,
	},
	telaSomaContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
    },
});