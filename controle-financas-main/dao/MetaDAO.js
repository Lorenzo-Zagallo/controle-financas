import { collection, addDoc, deleteDoc, updateDoc, doc, onSnapshot } from "firebase/firestore";
import { db } from "../config/firebaseConfig";

const COLECAO = "metas";
const colecaoRef = collection(db, COLECAO);

export function ouvirMetas(callback) {
    return onSnapshot(colecaoRef, (snapshot) => {
        const itens = snapshot.docs.map((documento) => ({ id: documento.id, ...documento.data() }));
        callback(itens);
    });
}

export function adicionarMeta(meta) {
    return addDoc(colecaoRef, { ...meta, valorAtual: meta.valorAtual ?? 0 });
}

export function atualizarMeta(id, meta) {
    const referencia = doc(db, COLECAO, id);
    return updateDoc(referencia, meta);
}

export function atualizarProgressoMeta(id, valorAtual) {
    const referencia = doc(db, COLECAO, id);
    return updateDoc(referencia, { valorAtual });
}

export function apagarMeta(id) {
    const referencia = doc(db, COLECAO, id);
    return deleteDoc(referencia);
}
