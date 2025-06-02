# 🏠 HomeManager

**HomeManager** é uma plataforma web desenvolvida para auxiliar na gestão de contas e despesas domésticas, proporcionando maior organização financeira para famílias, casais ou grupos que compartilham moradia.

---

## 📐 Arquitetura do Sistema

O HomeManager adota uma arquitetura baseada inteiramente em tecnologias JavaScript, com separação clara entre os módulos de frontend, backend e persistência de dados. Essa abordagem permite maior coesão entre as camadas e facilidade na manutenção e evolução da aplicação.

### 🔸 Frontend
- Desenvolvido com **Vue.js 3**, framework progressivo que favorece a criação de interfaces reativas.
- A biblioteca **Vuetify** foi utilizada para garantir responsividade e consistência visual, com base em Material Design.

### 🔸 Backend
- Implementado em **Node.js**, utilizando o framework **Express** para construção de APIs REST.
- Uso da arquitetura modular baseada em `controllers`, `routes`, `services` e `middlewares`, proporcionando separação de responsabilidades e escalabilidade.

### 🔸 Banco de Dados
- Utiliza o **MongoDB**, um banco de dados NoSQL flexível e orientado a documentos.
- A integração com o backend é feita com **Mongoose**, que provê schemas e modelos para validação e manipulação dos dados.
- O banco está hospedado em **MongoDB Atlas**, serviço em nuvem que oferece segurança, escalabilidade e alta disponibilidade.

### 🔸 Autenticação e Segurança
- O sistema utiliza **JSON Web Tokens (JWT)** para autenticação stateless.
- As senhas dos usuários são protegidas por meio de criptografia com a biblioteca **bcryptjs**.
- Middleware dedicado garante o acesso seguro às rotas autenticadas, validando tokens e prevenindo acessos não autorizados.

### 🔸 Testes Automatizados
- **Frontend:** testado com **Cypress**, permitindo testes end-to-end e simulação de fluxos reais de usuário.
- **Backend:** validado com **Jest** e **Supertest**, cobrindo testes unitários e de integração com banco e autenticação.

### 🔸 Integração e Deploy (CI/CD)
- O projeto utiliza **CI (Integração Contínua)** via GitHub Actions para execução automática de testes.
- Deploys automatizados em ambientes distintos:
  - **Render.com** para backend;
  - **GitHub Pages** para frontend.

Essa arquitetura foi planejada para facilitar o desenvolvimento incremental, garantir a segurança dos dados, manter a escalabilidade da aplicação e permitir a colaboração por múltiplos desenvolvedores em diferentes camadas do sistema.

---

## 🚀 Tecnologias Utilizadas

- Vue 3
- Vuetify
- Node.js
- Express
- MongoDB + Mongoose
- JWT (`jsonwebtoken`)
- Criptografia (`bcryptjs`)
- Testes: Cypress, Jest, Supertest

---

## 👥 Guia de Instalação e Uso

Este guia fornece instruções passo a passo para configurar, executar e testar o HomeManager, seja para fins de uso pessoal ou colaboração no desenvolvimento.

### 🔧 Requisitos
- Node.js (v18 ou superior)
- Yarn (como gerenciador de pacotes)
- Conta no MongoDB Atlas (ou instância local)

### 1️⃣ Clonar o Repositório
```bash
git clone https://github.com/gabriellopesweber/home-manager.git
cd home-manager
```

### 2️⃣ Configurar o Backend
```bash
cd backend
yarn install
yarn dev
```
O backend será iniciado em: `http://localhost:5002`

**Variáveis de Ambiente necessárias (criar arquivo `.env`):**
```
FRONTEND_URL=http://localhost:5173
EMAIL_USER=seu_email@gmail.com
EMAIL_PASS=sua_senha_de_app
JWT_SECRET=uma_chave_secreta_segura
PORT=5002
NODE_ENV=development
MONGO_URI=sua_string_de_conexao_mongodb
```

### 3️⃣ Configurar o Frontend
```bash
cd ../frontend
yarn install
yarn dev
```
O frontend será iniciado em: `http://localhost:5173`

**Variáveis de Ambiente necessárias (criar arquivo `.env`):**
```
VITE_API_URL=http://localhost:5002
BASE_URL=/
```

### ✅ Verificação Rápida
Após executar ambos os serviços, acesse:
- Frontend: [http://localhost:5173](http://localhost:5173)
- Backend (API base): [http://localhost:5002](http://localhost:5002)

### 🧪 Executar Testes
Para garantir que tudo esteja funcionando corretamente:

#### Backend:
```bash
cd backend
yarn test       # Executa testes via Jest + Supertest
yarn test-local # Executa testes em ambiente de desenvolvimento
```

#### Frontend:
```bash
cd frontend
yarn test       # Executa testes E2E com Cypress (se configurado)
```

Com essas etapas, a aplicação estará pronta para uso e desenvolvimento contínuo. Lembre-se de manter suas variáveis seguras e usar arquivos `.env` corretamente em cada ambiente.

## 🌟 Funcionalidades Principais

- ✅ Login, cadastro e recuperação de senha por e-mail
- ✅ Dashboard com:
  - Saldo atual e saldo previsto
  - Últimos lançamentos
  - Gráfico de evolução financeira
  - Resumo de receitas, despesas e transferências
- ✅ Relatórios com gráficos e tabela por período
- ✅ Lançamentos de receitas, despesas e transferências (CRUD)
- ✅ Gerenciamento de contas bancárias (CRUD)

---

## 🛠️ Manual do Desenvolvedor

Este manual é dedicado aos desenvolvedores que desejam entender o funcionamento interno do projeto e contribuir com seu desenvolvimento.

### 📁 Estrutura do Projeto

A estrutura segue o padrão de monorepositório com duas pastas principais:
- `frontend/`: código do cliente desenvolvido com Vue 3 e Vuetify;
- `backend/`: API construída com Node.js, Express e Mongoose.

### 🧭 Organização do Código
- O backend utiliza `module-alias` para facilitar a organização de imports.
- Arquivos e módulos seguem padrão semântico de responsabilidade (ex: `/controllers`, `/models`, `/routes`).
- Uso de middleware para autenticação, tratamento de erros e rotas protegidas.

### 🔐 Segurança
- As senhas dos usuários são criptografadas com `bcryptjs`.
- A autenticação e controle de acesso são realizados via JWT (`jsonwebtoken`).
- Middleware personalizado garante que apenas usuários autenticados acessem rotas restritas.

### ✅ Testes Automatizados
- **Backend**: `Jest` + `Supertest` para testes unitários e de integração.
- **Frontend**: `Cypress` para testes end-to-end.
- Testes são executados localmente ou via CI/CD em pushes.

### 🔀 Fluxo de Trabalho (GitFlow)
O repositório segue o modelo de ramificação GitFlow:
- `develop`: ambiente de desenvolvimento contínuo;
- `release`: versão de homologação para testes e QA;
- `master`: versão estável em produção.

### ⚙️ Integração Contínua
- CI configurada para execução automática de testes após cada commit/push.
- Deploy contínuo via:
  - **Render.com** (backend);
  - **GitHub Pages** (frontend).

### 🧪 Como Rodar os Testes
```bash
yarn test       # executa testes em modo CI
yarn test-local # para rodar testes locais com ambiente de desenvolvimento
```

Para garantir qualidade e padronização, recomenda-se seguir convenções de código, fazer commits descritivos e abrir PRs com contexto claro e checklist de verificação.

---

## 💡 Como Contribuir?
1. Faça um **fork** deste repositório.
2. Crie uma **branch**: `git checkout -b minha-feature`
3. Commit suas mudanças: `git commit -m "feat: minha nova funcionalidade"`
4. Faça um **push**: `git push origin minha-feature`
5. Abra um **Pull Request**

---

## 🐜 Licença
Este projeto está licenciado sob a **MIT License**. Sinta-se à vontade para utilizá-lo e melhorá-lo! 🚀

---

💡 **Desenvolvido por Gabriel Lopes Weber**  
📧 Contato: [gabriellw.grb@gmail.com](mailto:gabriellw.grb@gmail.com)
