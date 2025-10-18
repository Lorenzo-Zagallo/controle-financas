# 💰 FinTrack: Seu Assistente de Finanças Pessoais (Projeto Mobile Android)

## 🎯 Sobre o Projeto

**FinTrack** (Finance Tracker) é um aplicativo mobile desenvolvido em **React Native + Expo** com o objetivo de auxiliar o usuário na gestão completa de suas finanças pessoais. Este projeto foi criado para a disciplina de **Desenvolvimento em Dispositivos Mobile Android** , demonstrando proficiência no uso de tecnologias híbridas para a criação de soluções robustas.

### Funcionalidades Essenciais

O aplicativo visa cobrir as seguintes áreas:

1.  **Registro de Transações:** Adicionar e editar receitas e despesas com data, valor e descrição.
2.  **Categorização:** Associar transações a categorias personalizáveis (Ex: Alimentação, Transporte, Lazer, Salário).
3.  **Gestão de Orçamento:** Criação de orçamentos mensais para categorias específicas, com acompanhamento em tempo real.
4.  **Visualização de Dados:** Geração de gráficos e relatórios (Gráficos de Pizza/Barra) que mostram a distribuição dos gastos e o saldo.
5.  **Persistência de Dados:** Uso de um banco de dados local para armazenar todas as informações financeiras.

---

## 🛠️ Stack Tecnológica

| Categoria | Tecnologia | Justificativa |
| :--- | :--- | :--- |
| **Framework Mobile** | React Native (com Expo) | Permite criar aplicativos nativos para Android (e iOS) usando JavaScript. |
| **Linguagem** | JavaScript (ES6+) | Padrão do React Native. |
| **Navegação** | React Navigation | Gerencia o fluxo entre as telas (Tabs, Stack). |
| **Gerenciamento de Estado** | React Context API / Zustand | Para gerenciar o estado global da aplicação (transações, orçamentos, saldo). |
| **Persistência de Dados** | Expo-SQLite (ou AsyncStorage) | Armazenamento persistente e estruturado de dados (transações, categorias). |
| **Visualização** | React Native Chart Kit | Geração de gráficos para relatórios visuais. |

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
    cd fint-rack
    ```

2.  **Instale as Dependências:**
    ```bash
    npm install
    # ou yarn install
    ```

3.  **Inicie o Servidor de Desenvolvimento:**
    ```bash
    npm start
    # ou expo start
    ```

    Ao executar este comando, um QR Code será exibido no seu terminal e/ou no seu navegador.

4.  **Execute no Dispositivo/Emulador Android:**

    * **No Celular Android:** Abra o aplicativo **Expo Go** e escaneie o QR Code exibido. O aplicativo será carregado automaticamente.
    * **No Emulador Android:** Se você tiver o Android Studio configurado, pressione a letra `a` no terminal onde o Expo está rodando.

---

## 📂 Estrutura de Pastas (Sugestão Inicial)

```
.
├── assets/         # Ícones, fontes e imagens estáticas 
├── components/     # Elementos de UI reutilizáveis (Card, Botão, Input) 
├── screens/        # Componentes que representam telas inteiras 
│ ├── Dashboard/ 
│ ├── Transactions/ 
│ ├── Budgets/ 
│ └── Reports/ 
├── context/        # Lógica para gerenciamento de estado global (Ex: FinanceContext) 
├── data/           # Funções de acesso ao banco de dados (AsyncStorage) 
├── navigation/     # Configuração da navegação (Tabs, Stacks) 
└── App.js          # Ponto de entrada principal
```

---

## 👨‍💻 Contato e Autor

* **Alunos(a):** Lorenzo Zagallo & Matheus Fonseca
* **Disciplina:** Programação Para Dispositivos Móveis em Android

Este projeto está em desenvolvimento. Contribuições, sugestões e críticas construtivas são bem-vindas!