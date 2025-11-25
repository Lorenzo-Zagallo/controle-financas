# 💰 FinTrack: Seu Assistente de Finanças Pessoais (Projeto Mobile Android)

## 🎯 Sobre o Projeto

**FinTrack** é um aplicativo mobile de controle financeiro desenvolvido em **React Native + Expo** para o ambiente Android. O objetivo é fornecer uma ferramenta completa para a gestão de suas finanças pessoais (receitas e despesas), utilizando o **React Context API** para gerenciar o estado global da aplicação e o **Firebase Firestore** para persistência de dados em nuvem com sincronização em tempo real.

Este projeto foi criado para a disciplina de **Desenvolvimento em Dispositivos Mobile Android**, demonstrando proficiência no uso de tecnologias híbridas e integração com serviços em nuvem para a criação de soluções robustas e escaláveis.


### Funcionalidades Essenciais

O aplicativo visa cobrir as seguintes áreas:

1.  **CRUD de Transações:** Adicionar, listar (com ordenação por data), editar e excluir receitas e despesas com sincronização em tempo real.
2.  **CRUD de Categorias:** Adicionar, editar e excluir categorias personalizadas com ícones do Ionicons.
3.  **Gestão de Orçamento:** Definir um limite (meta) de gasto por categoria e acompanhar o progresso com uma barra visual e alertas de excedente.
4.  **Dashboard (Visão Geral):** Exibe o saldo total, receita total e despesa total calculados dinamicamente.
5.  **Relatórios (Gráficos):** Exibe gráficos de pizza mostrando a distribuição de receitas e despesas do mês atual, além de gráfico de evolução financeira.
6.  **Persistência em Nuvem:** Utiliza **Firebase Firestore** para salvar todas as transações, categorias e orçamentos com sincronização automática entre dispositivos.
7.  **Sincronização em Tempo Real:** Alterações nos dados aparecem instantaneamente em todos os dispositivos conectados.
8.  **Suporte Offline:** O Firestore mantém cache local, permitindo uso offline com sincronização automática ao retornar a conexão.

---
 Se estiver lendo pelo VS Code, peço que retire o Alt+z, foi chato de arrumar essa tabela...
---

## 🛠️ Stack Tecnológica

|          Categoria             |           Tecnologia            |                                Justificativa                                                                  |
|------------------------------- |-------------------------------- |---------------------------------------------------------------------------------------------------------------|
| **Framework Mobile**           | React Native (com Expo)         | Permite criar aplicativos nativos para Android (e iOS) usando JavaScript.                                     |
| **Linguagem**                  | JavaScript (ES6+)               | Padrão do React Native.                                                                                       |
| **Navegação**                  | React Navigation (Tabs & Stack) | Gerencia o fluxo entre as telas (principal e adicionar).                                                      |
| **Gerenciamento de Estado**    | React Context API               | Usado para centralizar e fornecer o estado global (transações, categorias, orçamentos) e as funções de CRUD.  |
| **Backend/Database**           | Firebase Firestore              | Banco de dados NoSQL em nuvem com sincronização em tempo real e suporte offline.                              |
| **Camada de Acesso a Dados**   | Padrão DAO (Data Access Object) | Isola a lógica de acesso ao banco em módulos dedicados (CategoriaDAO, TransacaoDAO, OrcamentoDAO, MetaDAO).   |
| **Autenticação**               | Firebase Authentication         | (Planejado para versão futura) Gerenciamento de usuários e controle de acesso.                                |
| **Hosting**                    | Firebase Hosting                | Deploy da versão web do aplicativo.                                                                           | 
| **Visualização**               | `react-native-chart-kit`        | Biblioteca para criar gráficos de pizza e linha.                                                              | 
| **Componentes de UI**          | `@react-native-picker/picker`   | Componente nativo para seleção de categorias nos formulários.                                                 |
| **Ícones**                     | `@expo/vector-icons` (Ionicons) | Biblioteca de ícones vetoriais para categorias e interface.                                                   |

---

## 🚀 Como Rodar o Projeto (Ambiente de Desenvolvimento)

### Pré-requisitos

Certifique-se de ter os seguintes softwares instalados:

1.  **Node.js (LTS):** Ambiente de execução JavaScript - [Download](https://nodejs.org/)
2.  **npm** (ou Yarn): Gerenciador de pacotes (vem com Node.js)
3.  **Expo CLI (Globalmente):** `npm install -g expo-cli`
4.  **Visual Studio Code (VS Code):** Editor de código recomendado
5.  **App Expo Go:** Instalado no seu celular Android (Google Play Store) ou em um emulador Android
6.  **Conta Google/Firebase:** Para configurar o projeto no Firebase Console

### Configuração do Firebase

1.  **Crie um projeto no [Firebase Console](https://console.firebase.google.com/)**
2.  **Ative o Firestore Database:**
    - Vá em "Build" → "Firestore Database" → "Create database"
    - Escolha modo de teste (temporariamente) ou configure as regras de segurança
3.  **Registre o app Web:**
    - Em "Project Overview" → "Add app" → selecione Web (</>)
    - Copie as credenciais do `firebaseConfig`
4.  **Configure as credenciais:**
    - Abra o arquivo `config/firebaseConfig.js`
    - Substitua as credenciais placeholder pelas suas credenciais reais do Firebase
5.  **Configure as Regras do Firestore (opcional):**
    - No Firebase Console, vá em "Firestore Database" → "Rules"
    - Para desenvolvimento, use:
      ```javascript
      rules_version = '2';
      service cloud.firestore {
        match /databases/{database}/documents {
          match /{document=**} {
            allow read, write: true;
          }
        }
      }
      ```
    - **⚠️ Importante:** Para produção, implemente regras de segurança adequadas

### Passos de Execução

1.  **Clone o Repositório:**
    ```bash
    git clone [LINK DO SEU REPOSITÓRIO]
    cd controle-financas-main
    ```

2.  **Instale as Dependências:**
    ```bash
    npm install
    ```

3.  **Configure o Firebase:**
    - Edite `config/firebaseConfig.js` com suas credenciais

4.  **Inicie o Servidor de Desenvolvimento:**
    ```bash
    npm start
    ```
    ou para limpar o cache:
    ```bash
    npm start -c
    ```

5.  **Execute no Dispositivo/Emulador Android:**

    * **No Celular Android:** Abra o aplicativo **Expo Go** e escaneie o QR Code exibido no terminal
    * **No Emulador Android:** Pressione a letra `a` no terminal onde o Expo está rodando
    * **No Navegador Web:** Pressione a letra `w` no terminal (apenas para testes, algumas funcionalidades nativas podem não funcionar)

### Comandos Úteis

```bash
npm start          # Inicia o servidor de desenvolvimento
npm start -c       # Inicia com cache limpo
npx expo start     # Alternativa ao npm start
```

### Solução de Problemas

- **Erro de conexão com Firebase:** Verifique se as credenciais em `firebaseConfig.js` estão corretas
- **Erro de cache:** Execute `npm start -c` para limpar o cache do Metro Bundler
- **QR Code não funciona:** Certifique-se de que o celular e o computador estão na mesma rede Wi-Fi
- **Dependências faltando:** Delete `node_modules` e `package-lock.json`, depois execute `npm install` novamente

---

## 📂 Estrutura de Pastas

```
.
├── assets/             # Ícones, fontes e imagens estáticas 
├── config/             # Configuração do Firebase
│   └── firebaseConfig.js
├── context/            # Lógica para gerenciamento de estado global 
│   └── ContextoFinancas.js
├── dao/                # Camada de acesso ao banco de dados (Data Access Object)
│   ├── CategoriaDAO.js
│   ├── TransacaoDAO.js
│   ├── OrcamentoDAO.js
│   └── MetaDAO.js
├── navigation/         # Configuração da navegação (Tabs e Stacks)
│   ├── TabNavigation.js
│   ├── StackTransacao.js
│   ├── StackOrcamento.js
│   ├── StackPainel.js
│   └── StackRelatorio.js
├── screens/            # Telas principais e formulários
│   ├── Dashboard/      # Tela principal com resumo financeiro
│   │   └── TelaPainel.js
│   ├── Transactions/   # Gestão de transações
│   │   ├── TelaTransacao.js
│   │   └── TelaAddTransacao.js
│   ├── Budgets/        # Gestão de orçamentos e categorias
│   │   ├── TelaOrcamento.js
│   │   └── TelaAddCategoria.js
│   └── Reports/        # Gráficos e relatórios
│       └── TelaRelatorio.js
├── .firebaserc         # Configuração do projeto Firebase
├── firebase.json       # Configuração do Firebase Hosting
├── App.js              # Ponto de entrada principal
├── index.js            # Bootstrap do aplicativo
└── package.json        # Dependências e scripts do projeto
```

---

## 🔥 Arquitetura do Projeto

### Padrão DAO (Data Access Object)

O projeto implementa o padrão **DAO** para separar a lógica de negócio da lógica de acesso aos dados:

- **CategoriaDAO.js**: CRUD de categorias (adicionar, atualizar, apagar, ouvir)
- **TransacaoDAO.js**: CRUD de transações com ordenação por data
- **OrcamentoDAO.js**: CRUD de orçamentos por categoria
- **MetaDAO.js**: CRUD de metas financeiras

### Fluxo de Dados

1. **UI (Screens)** → dispara ação (ex: adicionar transação)
2. **Context (ContextoFinancas.js)** → valida e chama o DAO apropriado
3. **DAO** → executa operação no Firestore (addDoc, updateDoc, deleteDoc)
4. **Firestore** → persiste os dados e notifica os listeners
5. **DAO (onSnapshot)** → detecta mudança e chama callback
6. **Context** → atualiza estado global (setState)
7. **UI** → re-renderiza automaticamente com os novos dados

### Sincronização em Tempo Real

O Context estabelece **listeners** (via `onSnapshot`) para todas as coleções do Firestore:

```javascript
useEffect(() => {
    const unsubscribeCategorias = CategoriaDAO.ouvirCategorias(setCategorias);
    const unsubscribeTransacoes = TransacaoDAO.ouvirTransacoes(setTransacoes);
    const unsubscribeOrcamentos = OrcamentoDAO.ouvirOrcamentos(setOrcamentos);
    
    return () => {
        unsubscribeCategorias();
        unsubscribeTransacoes();
        unsubscribeOrcamentos();
    };
}, []);
```

Qualquer alteração no banco (de qualquer dispositivo) atualiza automaticamente todos os clientes conectados.

---

## 🗄️ Estrutura do Banco de Dados (Firebase Firestore)

### Coleções:

#### 1. `categorias`
```javascript
{
  id: "auto-gerado",        // ID único do Firestore
  nome: "Alimentação",      // Nome da categoria
  tipo: "expense",          // "income" | "expense"
  cor: "#FF6384"           // Cor para gráficos (hex)
}
```

#### 2. `transacoes`
```javascript
{
  id: "auto-gerado",        // ID único do Firestore
  tipo: "expense",          // "income" | "expense"
  valor: 150.50,            // Valor da transação
  descricao: "Almoço",      // Descrição
  categoriaId: "ref-id",    // Referência à categoria
  data: "2025-11-24"        // Data formato YYYY-MM-DD
}
```

#### 3. `orcamentos`
```javascript
{
  id: "categoria-id",       // ID da categoria (documento)
  categoriaId: "ref-id",    // Referência à categoria
  valorLimite: 500.00       // Limite de gasto
}
```

#### 4. `metas`
```javascript
{
  id: "auto-gerado",        // ID único do Firestore
  nome: "Viagem 2025",      // Nome da meta
  descricao: "...",         // Descrição detalhada
  valorAlvo: 5000.00,       // Valor objetivo
  valorAtual: 1200.00,      // Valor já economizado
  prazo: "2025-12-31"       // Data limite
}
```

---

## 🎨 Funcionalidades Detalhadas

### 1. Gestão de Transações
- ✅ Adicionar receitas e despesas com validação de campos
- ✅ Listar todas as transações ordenadas por data (mais recentes primeiro)
- ✅ Editar transações existentes
- ✅ Excluir transações com confirmação
- ✅ Filtro por categoria no picker (apenas categorias do tipo selecionado)
- ✅ Máscara de entrada de data (DD/MM/AAAA)

### 2. Gestão de Categorias
- ✅ Criar categorias personalizadas (receita ou despesa)
- ✅ Seleção de ícones do Ionicons
- ✅ Edição de categorias existentes
- ✅ Deleção em cascata (remove transações e orçamentos associados)
- ✅ Validação de duplicidade de nomes

### 3. Gestão de Orçamentos
- ✅ Definir limite de gastos por categoria
- ✅ Barra de progresso visual (% gasto vs. orçamento)
- ✅ Alertas visuais (80% = amarelo, >100% = vermelho)
- ✅ Cálculo automático de gastos por categoria no mês atual

### 4. Dashboard
- ✅ Saldo total (receitas - despesas)
- ✅ Total de receitas do período
- ✅ Total de despesas do período
- ✅ Atualização em tempo real

### 5. Relatórios e Gráficos
- ✅ Gráfico de pizza: distribuição de despesas por categoria (mês atual)
- ✅ Gráfico de pizza: distribuição de receitas por categoria (mês atual)
- ✅ Gráfico de linha: evolução financeira (últimos 6 meses)
- ✅ Cores personalizadas por categoria

---

## 🔒 Segurança e Boas Práticas

### Implementado:
- ✅ Validação de entrada em todos os formulários
- ✅ Tratamento de erros com try/catch em operações Firebase
- ✅ Estado de erro global (`erro`) exposto no Context
- ✅ Normalização de valores numéricos antes de salvar
- ✅ Deleção em cascata para manter consistência de dados

### A Implementar (Roadmap):
- 🔜 Firebase Authentication (login com Google/email)
- 🔜 Regras de segurança do Firestore (acesso apenas aos próprios dados)
- 🔜 Validação de permissões por usuário
- 🔜 Criptografia de dados sensíveis
- 🔜 Rate limiting e proteção contra abuso

---

## 👥 Equipe de Desenvolvimento

### **Matheus Almeida**
- 🔥 Integração completa com Firebase (Firestore + Hosting)
- 🗄️ Implementação do padrão DAO
- 🔄 Migração de AsyncStorage para Firebase
- 📊 Sistema de sincronização em tempo real
- 📝 Documentação técnica e relatório de extensão

### **Lorenzo Zagallo**
- 🎨 Desenvolvimento do Frontend e Interface de Usuário
- 📱 Implementação das telas e navegação
- 🎯 Lógica de apresentação e componentes visuais
- 💡 UX/UI Design e usabilidade

---

## 📚 Recursos e Documentação

- [React Native Documentation](https://reactnative.dev/)
- [Expo Documentation](https://docs.expo.dev/)
- [Firebase Documentation](https://firebase.google.com/docs)
- [React Navigation](https://reactnavigation.org/)
- [Firestore Guide](https://firebase.google.com/docs/firestore)

---

## 📄 Licença

Este projeto foi desenvolvido para fins acadêmicos na disciplina de **Programação Para Dispositivos Móveis em Android**.

---

## 👨‍💻 Contato e Autor

* **Alunos:** Lorenzo Zagallo & Matheus Fonseca
* **Disciplina:** Programação Para Dispositivos Móveis em Android
* **Instituição:** UNESA - Universidade Estácio de Sá
* **Ano:** 2025
  
Este projeto não está mais em desenvolvimento. Contribuições, sugestões e críticas construtivas são bem-vindas!