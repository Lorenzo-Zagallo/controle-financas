import { collection, addDoc, deleteDoc, updateDoc, doc, onSnapshot } from "firebase/firestore";
import { db } from "../config/firebaseConfig";

const COLECAO = "categorias";
const colecaoRef = collection(db, COLECAO);

export function ouvirCategorias(callback) {
    return onSnapshot(colecaoRef, (snapshot) => {
        const itens = snapshot.docs.map((documento) => ({ id: documento.id, ...documento.data() }));
        callback(itens);
    });
}

export function adicionarCategoria(categoria) {
    return addDoc(colecaoRef, categoria);
}

export function atualizarCategoria(id, categoria) {
    const referencia = doc(db, COLECAO, id);
    return updateDoc(referencia, categoria);
}

export function apagarCategoria(id) {
    const referencia = doc(db, COLECAO, id);
    return deleteDoc(referencia);
}
