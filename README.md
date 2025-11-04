# 💰 FinTrack: Seu Assistente de Finanças Pessoais (Projeto Mobile Android)

## 🎯 Sobre o Projeto

**FinTrack** é um aplicativo mobile de controle financeiro desenvolvido em **React Native + Expo** para o ambiente Android. O objetivo é fornecer uma ferramenta completa para a gestão de suas finanças pessoais (receitas e despesas), utilizando o **React Context API** para gerenciar o estado global da aplicação e o **AsyncStorage** para persistência de dados. 

Este projeto foi criado para a disciplina de **Desenvolvimento em Dispositivos Mobile Android** , demonstrando proficiência no uso de tecnologias híbridas para a criação de soluções robustas.


### Funcionalidades Essenciais

O aplicativo visa cobrir as seguintes áreas:

1.  **Registro de Transações:** Adicionar e editar receitas e despesas com data, valor e descrição.
2.  **Categorização:** Associar transações a categorias personalizáveis (Ex: Alimentação, Transporte, Lazer, Salário).
3.  **Gestão de Orçamento:** Criação de orçamentos mensais para categorias específicas, com acompanhamento em tempo real.
4.  **Visualização de Dados:** Geração de gráficos e relatórios (Gráficos de Pizza/Barra) que mostram a distribuição dos gastos e o saldo.
5.  **Persistência de Dados:** Utiliza **AsyncStorage** como um banco de dados local para armazenar todas as informações financeiras.

---

## 🛠️ Stack Tecnológica

| Categoria | Tecnologia | Justificativa |
| :--- | :--- | :--- |
| **Framework Mobile** | React Native (com Expo) | Permite criar aplicativos nativos para Android (e iOS) usando JavaScript. |
| **Linguagem** | JavaScript (ES6+) | Padrão do React Native. |
| **Navegação** | React Navigation | Gerencia o fluxo entre as telas e a abertura de formulários (Tabs, Stack). |
| **Gerenciamento de Estado** | React Context API | Usado para centralizar e fornecer o estado global da aplicação (transações, orçamentos, saldo). |
| **Persistência de Dados** | AsyncStorage | Utilizado para armazenamento persistente e assíncrono de dados leves (transações, categorias). |
| **Visualização** | *indefinido* | Geração de gráficos para relatórios visuais. |
| **Componentes de UI** | `@react-native-picker/picker`, `react-native-gesture-handler` (Pressable) | Componentes essenciais para formulários e interação mobile. |

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
    # Execute também para garantir a compatibilidade das dependências:
    expo install @react-native-picker/picker react-native-screens react-native-safe-area-context @react-navigation/native @react-navigation/bottom-tabs @react-navigation/stack
    ```

3.  **Inicie o Servidor de Desenvolvimento:**
    ```bash
    npm start -- --clear
    # ou expo start -c
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
├── context/            # Lógica para gerenciamento de estado global (FinanceContext.js) 
├── navigation/         # Configuração da navegação (TabNavigation.js, TransactionStack.js, BudgetStack.js) 
├── screens/            # Telas principais e formulários
│   ├── Dashboard/ 
│   ├── Transactions/   # Transações, Adicionar Transação
│   ├── Budgets/        # Orçamentos, Adicionar Categoria
│   └── Reports/        
└── App.js              # Ponto de entrada principal
```

---

## 👨‍💻 Contato e Autor

* **Alunos(a):** Lorenzo Zagallo & Matheus Fonseca
* **Disciplina:** Programação Para Dispositivos Móveis em Android

Este projeto está em desenvolvimento. Contribuições, sugestões e críticas construtivas são bem-vindas!