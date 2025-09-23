import React, { useState } from "react";
import { StyleSheet, Text, View } from 'react-native';

const TextoAninhado = () => {
	const [titulo, setTitulo] = useState("Texto do elemento filho");

	const modificaTexto = () => {
		setTitulo("Esse texto está sendo exibido pois o primeiro elemento do texto foi pressionado/tocado");
	};

	return (
		<Text style={styles.baseText}>
			<Text style={styles.titulo} onPress={modificaTexto}>
				{titulo}
				{"\n"}
				{"\n"}
			</Text>
		</Text>
	);
};


const styles = StyleSheet.create({
	
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


*/