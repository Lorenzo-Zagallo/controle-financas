import { collection, deleteDoc, doc, onSnapshot, setDoc } from "firebase/firestore";
import { db } from "../config/firebaseConfig";

const COLECAO = "orcamentos";
const colecaoRef = collection(db, COLECAO);

export function ouvirOrcamentos(callback) {
    return onSnapshot(colecaoRef, (snapshot) => {
        const itens = snapshot.docs.map((documento) => ({ id: documento.id, ...documento.data() }));
        callback(itens);
    });
}

export function salvarOuAtualizarOrcamento(categoriaId, valorLimite) {
    const referencia = doc(db, COLECAO, categoriaId);
    return setDoc(referencia, { categoriaId, valorLimite });
}

export function apagarOrcamento(categoriaId) {
    const referencia = doc(db, COLECAO, categoriaId);
    return deleteDoc(referencia);
}
