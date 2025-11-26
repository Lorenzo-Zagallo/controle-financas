import { collection, addDoc, deleteDoc, updateDoc, doc, onSnapshot } from "firebase/firestore";
import { db } from "../config/firebaseConfig";

const COLECAO = "transacoes";
const colecaoRef = collection(db, COLECAO);

export function ouvirTransacoes(callback) {
    return onSnapshot(colecaoRef, (snapshot) => {
        const itens = snapshot.docs
            .map((documento) => ({ id: documento.id, ...documento.data() }))
            .sort((a, b) => new Date(b.data) - new Date(a.data));
        callback(itens);
    });
}

export function adicionarTransacao(transacao) {
    return addDoc(colecaoRef, transacao);
}

export function atualizarTransacao(id, transacao) {
    const referencia = doc(db, COLECAO, id);
    return updateDoc(referencia, transacao);
}

export function apagarTransacao(id) {
    const referencia = doc(db, COLECAO, id);
    return deleteDoc(referencia);
}
