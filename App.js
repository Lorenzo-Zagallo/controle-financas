import React, { useState } from "react";
import { StyleSheet, Text, View, Image, StatusBar } from 'react-native';
import { SafeAreaView, ScrollView, TextInput } from "react-native-web";

// Text
const TextoAninhado = () => {
	const [titulo, setTitulo] = useState("Texto do elemento filho");

	const modificaTexto = () => {
		setTitulo("Esse texto está sendo exibido pois o primeiro elemento do texto foi pressionado/tocado");
	};

	return (
		<SafeAreaView>
			<Text style={styles.baseText}>
				<Text style={styles.titulo} onPress={modificaTexto}>
					{titulo}
					{"\n"}
				</Text>
			</Text>
		</SafeAreaView>
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
		<SafeAreaView>
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
		</SafeAreaView>
	);
};

// ScrollView
const Lista = () => {
	return (
		<SafeAreaView style={styles.safeContainer}>
			<ScrollView style={styles.containerScrollView}>
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
			</ScrollView>
		</SafeAreaView>
	);
};

// View
const Main = () => {
	return (
		<View style={styles.container}>
			<TextoAninhado />
			<Imagem />
			<MeuTextoInput />
			<Lista />
		</View>
	);
};

export default Main;

const styles = StyleSheet.create({
	container: {
		flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20,
	},
	baseText: {
		fontSize: 18, margin: 10, color: 'black',
	},
	titulo: {
		fontSize: 20, fontWeight: 'bold', color: 'blue',
	},
	meuTextInput: {
		height: 40, borderColor: 'gray', borderWidth: 1, marginBottom: 10, paddingLeft: 10, width: '100%',
	},
	valueText: {
		fontSize: 16, marginTop: 10, color: 'green',
	},
	imagem: {
		margin: 10, width: 50, height: 50, alignSelf: 'center'
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
});


/*  
<View>	      =	  <div>
<Text>	      =	  <p>
<Image>       =	  <img>
<TextInput>	  =   <input type=”text”>
<ScrollView>  =	  <div>

View
A View é o principal componente na construção de uma interface gráfica de usuário (GUI, do inglês graphical use interface). Esse componente se relacionará diretamente com seu equivalente nas plataformas em que o aplicativo React estiver rodando (veja a tabela anterior). Em termos de organização do layout, ele pode ser utilizado de forma aninhada com outras views, podendo ainda ter como filhos elementos de qualquer tipo.

Text
Este componente é utilizado para a apresentação de textos. Ele suporta aninhamento, estilização e manuseio de toque.

Image
Assim como a tag HTML <img>, este componente permite a exibição de diferentes tipos de imagens com origens distintas — e aqui o destaque fica por conta da possibilidade de utilização até mesmo das imagens armazenadas no próprio dispositivo móvel. O Image herda as propriedades do componente View, além de possuir uma série de outros atributos.

TextInput
Este componente permite a entrada de textos por meio do teclado, provendo ainda uma série de funcionalidades, por exemplo, autocorreção, autocapitalização e utilização de diferentes tipos de teclado, assim como apenas do teclado numérico (digite algum texto no segundo input no exemplo).

ScrollView
Este componente também é um contêiner, sendo, a exemplo da View, utilizado para armazenar conteúdo — e outros elementos —, permitindo a interação na tela por meio de rolagem (scrolling). Logo, o ScrollView, para funcionar corretamente, precisa ter uma altura limitada/definida, já que sua serventia é justamente conter elementos filhos com altura ilimitada. Teste o código a seguir, modificando o tamanho do texto (aumentando-o e o diminuindo) a fim de visualizar, na prática, como tal componente se comporta:

*/