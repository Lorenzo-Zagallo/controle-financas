# 💰 FinTrack: Seu Assistente de Finanças Pessoais (Projeto Mobile Android)

## 🎯 Sobre o Projeto

**FinTrack** é um aplicativo mobile de controle financeiro desenvolvido em **React Native + Expo** para o ambiente Android. O objetivo é fornecer uma ferramenta completa para a gestão de suas finanças pessoais (receitas e despesas), utilizando o **React Context API** para gerenciar o estado global da aplicação e o **AsyncStorage** para persistência de dados. 

Este projeto foi criado para a disciplina de **Desenvolvimento em Dispositivos Mobile Android** , demonstrando proficiência no uso de tecnologias híbridas para a criação de soluções robustas.


### Funcionalidades Essenciais

O aplicativo visa cobrir as seguintes áreas:

1.  **CRUD de Transações:**  Adicionar, listar (com filtro de mês), editar e excluir receitas e despesas.
2.  **CRUD de Categorias:** Adicionar e listar categorias (a edição/exclusão está no contexto, mas ainda não implementada na UI).
3.  **Gestão de Orçamento:** Definir um limite (meta) de gasto por categoria e acompanhar o progresso com uma barra visual.
4.  **Dashboard (Visão Geral):** Exibe o saldo total, receita total e despesa total.
5.  **Relatórios (Gráficos):** Exibe gráficos de pizza mostrando a distribuição de receitas e despesas do mês.
6.  **Persistência de Dados:** Utiliza **AsyncStorage** para salvar todas as transações, categorias e metas de orçamento.

---

## 🛠️ Stack Tecnológica

| Categoria | Tecnologia | Justificativa |
| :--- | :--- | :--- |
| **Framework Mobile** | React Native (com Expo) | Permite criar aplicativos nativos para Android (e iOS) usando JavaScript. |
| **Linguagem** | JavaScript (ES6+) | Padrão do React Native. |
| **Navegação** | React Navigation (Tabs & Stack) | Gerencia o fluxo entre as telas (principal e adicionar). |
| **Gerenciamento de Estado** | React Context API | Usado para centralizar e fornecer o estado global (transações, categorias, orçamentos) e as funções de CRUD. |
| **Persistência de Dados** | AsyncStorage | Utilizado para armazenamento persistente e assíncrono de todos os dados do usuário. |
| **Visualização** | `react-native-pie-chart` | Biblioteca leve e simples para criar os gráficos de pizza. |
| **Componentes de UI** | `@react-native-picker/picker` | Componente nativo para seleção de categorias nos formulários. |

---

## 🚀 Como Rodar o Projeto (Ambiente de Desenvolvimento)

### Pré-requisitos

Certifique-se de ter os seguintes softwares instalados:

1.  **Node.js (LTS):** Ambiente de execução JavaScript.
2.  **npm** (ou Yarn): Gerenciador de pacotes.
3.  **Expo CLI (Globalmente):** `npm install -g expo-cli`
4.  **Visual Studio Code (VS Code):** Editor de código.
5.  **App Expo Go:** Instalado no seu celular Android (Google Play Store) ou em um emulador Android.

### Passos de Execução

1.  **Clone o Repositório:**
    ```bash
    git clone [LINK DO SEU REPOSITÓRIO]
    cd controle-financas
    ```

2.  **Instale as Dependências:**
    ```bash
    npm install
    ```

3.  **Inicie o Servidor de Desenvolvimento:**
    ```bash
    npm start -c
    ```

4.  **Execute no Dispositivo/Emulador Android:**

    * **No Celular Android:** Abra o aplicativo **Expo Go** e escaneie o QR Code exibido.
    * **No Emulador Android:** Pressione a letra `a` no terminal onde o Expo está rodando.

---

## 📂 Estrutura de Pastas

```
.
├── assets/             # Ícones, fontes e imagens estáticas 
├── components/         # Elementos de UI reutilizáveis (Ainda não implementado) 
├── context/            # Lógica para gerenciamento de estado global 
├── navigation/         # Configuração da navegação 
├── screens/            # Telas principais e formulários
│   ├── Dashboard/      # Tela principal com informações essenciais
│   ├── Transactions/   # Transações e Adicionar Transação
│   ├── Budgets/        # Orçamentos e Adicionar Categoria
│   └── Reports/        # Gráficos de Receitas e Despesas
└── App.js              # Ponto de entrada principal
```

---

## 👨‍💻 Contato e Autor

* **Alunos(a):** Lorenzo Zagallo & Matheus Fonseca
* **Disciplina:** Programação Para Dispositivos Móveis em Android

Este projeto está em desenvolvimento. Contribuições, sugestões e críticas construtivas são bem-vindas!