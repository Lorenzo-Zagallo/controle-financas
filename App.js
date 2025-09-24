import React, { useState } from "react";
import { StyleSheet, Text, View, Image } from 'react-native';
import { SafeAreaView, TextInput } from "react-native-web";

const MeuTextoInput = () => {
	const [texto, setTexto] = React.useState(null);
	const [numero, setNumero] = React.useState(0);

	return (
		<SafeAreaView>
			<TextInput 
				style={styles.meuTextInput} 
				value={texto || ''} 
				onChangeText={setTexto} 
				placeholder="Digite um texto"/>
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

const TextoAninhado = () => {
	const [titulo, setTitulo] = useState("Texto do elemento filho");

	const modificaTexto = () => {
		setTitulo("Esse texto está sendo exibido pois o primeiro elemento do texto foi pressionado/tocado");
	};

	return (
		<View style={styles.container}>
			<Text style={styles.baseText}>
				<Text style={styles.titulo} onPress={modificaTexto}>
					{titulo}
					{"\n"}
				</Text>
			</Text>
			<Image style={styles.imagem} source={{ uri: 'https://reactnative.dev/img/tiny_logo.png' }} />
			<MeuTextoInput />
		</View>
	);
};

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
});

export default TextoAninhado;


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

*/