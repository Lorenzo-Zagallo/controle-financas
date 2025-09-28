import React, { use, useState } from "react";
import { View, StyleSheet, Text, TextInput, Image, StatusBar, ScrollView } from 'react-native';
import { SafeAreaView } from "react-native-web";

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

// Calculadora
const Soma = () => {
	const [parc1, setParc1] = useState("Valor1");
	/*const [parc1, setParc1] = useState("Valor1");
	useState("Valor1"): O hook useState é usado para adicionar estado a um componente funcional. O valor inicial do estado é passado como argumento para useState. Neste caso, o valor inicial de parc1 é a string "Valor1".

	const [parc1, setParc1]: A sintaxe const [variavel, setVariavel] é uma maneira de desestruturar o retorno de useState. O primeiro valor, parc1, é a variável que armazena o estado atual. O segundo valor, setParc1, é a função que será usada para atualizar o valor de parc1.

	Como funciona:
	Inicialização: Quando o componente for renderizado pela primeira vez, o valor inicial de parc1 será "Valor1".

	Alteração de estado: Você pode alterar o valor de parc1 chamando a função setParc1, passando um novo valor como argumento. Por exemplo:

	javascript
	Copiar código
	setParc1("Novo Valor");
	Após essa linha ser executada, o valor de parc1 será atualizado para "Novo Valor", e o componente será re-renderizado com o novo valor.

	Exemplo de uso no React Native:
	javascript
	Copiar código
	import React, { useState } from 'react';
	import { View, Text, Button } from 'react-native';

	const MeuComponente = () => {
	const [parc1, setParc1] = useState("Valor1");

	return (
		<View>
		<Text>{parc1}</Text>
		<Button title="Alterar valor" onPress={() => setParc1("Novo Valor")} />
		</View>
	);
	};

	export default MeuComponente;
	Neste exemplo:

	O estado parc1 começa com o valor "Valor1".

	Quando o botão é pressionado, a função setParc1("Novo Valor") é chamada, o que altera o estado para "Novo Valor", e o texto na tela será atualizado.
	*/
	const [parc2, setParc2] = useState("Valor2");
	const [somaR, setSomaR] = useState("Toque aqui para somar.");

	function executarSoma() {
		let p1 = parseInt(parc1);
		console.log("Valor de p1: ", p1);
		let p2 = parseInt(parc2);
		console.log("Valor de p2: ", p2);
		let resultado = p1 + " + " + p2 + " = " + (p1 + p2);
		setSomaR(resultado);
	}

	return (
		<View style={styles.container}>
			<TextInput style={styles.entrada} value={parc1} onChangeText={setParc1} keyboardType="numeric"/>
			<TextInput style={styles.entrada} value={parc2} onChangeText={setParc2} keyboardType="numeric"/>
			<Text styles={styles.texto} onPress={executarSoma}>{somaR}</Text>
		</View>
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
			<Soma />
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
		flex: 1, paddingTop: StatusBar.currentHeight,
	},
	containerScrollView: {
		backgroundColor: 'grey', marginHorizontal: 20,
	},
	text: {
		fontSize: 26,
	},
	entrada: {
		height: 40, borderWidth: 1,
	},
	texto: {
		fontFamily: "Verdana", fontSize: 24,
	}
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