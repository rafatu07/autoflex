# Autoflex Inventory Control System

Sistema web para controle de estoque de matérias-primas e produtos. Backend em Quarkus (API REST) e frontend em React + Redux. Desenvolvido para o teste prático Autoflex.

## Requisitos

- **Java 17+** — Obrigatório para o backend. Configure a variável de ambiente `JAVA_HOME` apontando para a instalação do JDK (ex.: `C:\Program Files\Microsoft\jdk-17.0.18.8-hotspot` no Windows).
- **Maven** — Opcional. O projeto inclui **Maven Wrapper**: na pasta `backend` use `.\mvnw.cmd` (Windows) e não é necessário instalar o Maven. Se quiser usar `mvn` diretamente ou o script `run-dev.ps1`, instale o Maven e adicione ao PATH.
- **Node.js 18+** e **npm** (ou yarn) — Para o frontend.
- **PostgreSQL** — Banco de dados usado em execução normal. Os testes automatizados do backend usam H2 em memória e **não** exigem PostgreSQL rodando.

### Maven Wrapper

Na pasta `backend` use `.\mvnw.cmd` (Windows) ou `./mvnw` (Linux/macOS) em vez de `mvn`. Na **primeira execução** o script baixa o Maven (arquivo zip) da internet e o extrai em `.mvn/wrapper/`. Depois disso, os comandos funcionam sem precisar do Maven instalado. Exemplos: `.\mvnw.cmd test`, `.\mvnw.cmd quarkus:dev`.

### Instalando Maven no Windows (opcional)

Se preferir usar `mvn` ou `run-dev.ps1`:

1. **Java 17+** — Se ainda não tiver: `winget install Microsoft.OpenJDK.17` ou [Adoptium](https://adoptium.net/).
2. **Maven** — O Maven não está no winget. Opções:
   - **Chocolatey** (se tiver): `choco install maven`
   - **Manual:** Baixe o [Maven](https://maven.apache.org/download.cgi) (apache-maven-3.9.x-bin.zip), extraia em uma pasta (ex.: `C:\Program Files\Apache\maven`), adicione a pasta **bin** ao PATH do sistema. Feche e abra o terminal e teste: `mvn -v`.

---

## Como executar o projeto

### 1. Banco de dados (PostgreSQL)

1. Crie o banco no PostgreSQL:
   - **pgAdmin:** Clique com o botão direito em **Databases** → **Create** → **Database** → nome: `inventory` → Save.
   - **psql:** `psql -U postgres -c "CREATE DATABASE inventory;"`
2. Configure a senha para a aplicação:
   - Crie o arquivo `backend/.env` (não é versionado; está no `.gitignore`) com a linha `DB_PASSWORD=sua_senha`. Você pode copiar de `backend/.env.example` se existir.
   - Ou defina no terminal antes de rodar o backend: **PowerShell** `$env:DB_PASSWORD="sua_senha"`; **Linux/macOS** `export DB_PASSWORD=sua_senha`.
3. Em `backend/src/main/resources/application.properties` a URL é `jdbc:postgresql://localhost:5432/inventory` e o usuário padrão é `postgres`; altere se usar outro.

### 2. Backend (API)

A API roda em **http://localhost:8080**.

**Opção A — Com Maven instalado:** Carregue o `.env` (ou defina `DB_PASSWORD`) e use o script:

```powershell
cd backend
.\run-dev.ps1
```

Ou, após definir `DB_PASSWORD` no terminal: `mvn quarkus:dev`.

**Opção B — Sem Maven (Maven Wrapper):** Carregue o `.env` (ou defina `DB_PASSWORD`) e execute:

```powershell
cd backend
.\mvnw.cmd quarkus:dev
```

Na primeira execução o Hibernate cria as tabelas no banco `inventory`.

**Endpoints da API:**

- **Produtos:** `GET/POST /api/products`, `GET/PUT/DELETE /api/products/{id}`. Listagem paginada: `GET /api/products?page=0&size=10`.
- **Matérias-primas:** `GET/POST /api/raw-materials`, `GET/PUT/DELETE /api/raw-materials/{id}`. Listagem paginada: `GET /api/raw-materials?page=0&size=10`.
- **Sugestão de produção:** `GET /api/production-suggestion`.

### 3. Frontend

```powershell
cd frontend
npm install
npm run dev
```

A aplicação fica em **http://localhost:3000**. O servidor de desenvolvimento (Vite) faz proxy de `/api` para `http://localhost:8080`, então o backend deve estar rodando para as chamadas à API funcionarem.

---

## Como executar os testes

### Testes unitários — Backend

Não é necessário PostgreSQL; os testes usam H2 em memória (configuração em `backend/src/test/resources/application.properties`).

```powershell
cd backend
.\mvnw.cmd test
```

Se tiver Maven no PATH: `mvn test`.

### Testes unitários — Frontend

```powershell
cd frontend
npm run test:run
```

Para modo watch (re-executa ao salvar): `npm run test`.

### Testes de integração E2E — Cypress

**Pré-requisito:** Backend e frontend devem estar rodando (em terminais separados).

```powershell
cd frontend
npm run cypress:open
```

Abre a interface do Cypress; escolha E2E, selecione o browser e rode o spec `cypress/e2e/smoke.cy.ts`. Para execução headless (linha de comando):

```powershell
npm run cypress:run
```

A configuração do Cypress está em `frontend/cypress.config.cjs`. Os specs e o arquivo de suporte estão em TypeScript (`.ts`); a dependência `typescript` já está no `package.json`. Os testes E2E verificam a interface em português (ex.: "Estoque Autoflex", "Produtos", "Matérias-primas", "Sugestão de produção").

| Tipo              | Comando                          | Observação                          |
|-------------------|----------------------------------|-------------------------------------|
| Backend (unitários) | `cd backend` → `.\mvnw.cmd test` | Não precisa de PostgreSQL           |
| Frontend (unitários) | `cd frontend` → `npm run test:run` | Vitest                              |
| E2E (Cypress)     | Backend + frontend no ar → `cd frontend` → `npm run cypress:open` ou `npm run cypress:run` | Testa a UI no browser |

---

## Uso da aplicação

A interface está em português.

1. **Matérias-primas:** Abra "Matérias-primas" no menu, cadastre materiais (código, nome, quantidade em estoque). Use "Nova matéria-prima" para adicionar.
2. **Produtos:** Abra "Produtos", cadastre produtos (código, nome, valor). No formulário "Novo produto" (ou ao editar), associe "Matérias-primas" com a quantidade necessária por unidade.
3. **Sugestão de produção:** Abra "Sugestão de produção" para ver quais produtos (e quantidades) podem ser produzidos com o estoque atual de matérias-primas, priorizados pelo valor do produto, e o valor total.

---

## Frontend na Vercel + Backend no Railway

**Frontend:** https://autoflex-teste.vercel.app  
**Backend (API):** https://autoflex-production.up.railway.app

### 1. Variável de ambiente na Vercel

No projeto do frontend na Vercel:

1. Abra **Settings** → **Environment Variables**.
2. Crie uma variável:
   - **Name:** `VITE_API_URL`
   - **Value:** `https://autoflex-production.up.railway.app/api`
   - Marque **Production** (e Preview se quiser).
3. Salve e faça um **redeploy** (Deployments → ⋮ no último deploy → Redeploy) para a variável valer no build.

### 2. CORS no backend

O backend já aceita requisições de `https://autoflex-teste.vercel.app` (`quarkus.http.cors.origins` em `application.properties`). Se mudar o domínio do front, adicione-o nessa lista e faça novo deploy no Railway.

Depois disso, o frontend na Vercel passa a chamar o backend no Railway e o app funciona em produção.

---

## Estrutura do projeto

- **backend/** — API Quarkus (JPA/Hibernate, PostgreSQL): CRUD de produtos e matérias-primas, associação produto–matéria-prima, endpoint de sugestão de produção, paginação nas listagens. Testes em `src/test/java/...` (JUnit 5 + Quarkus Test).
- **frontend/** — React + Redux + Vite: UI responsiva (menu hamburger, layout adaptado), páginas Produtos, Matérias-primas e Sugestão de produção. Testes unitários em `src/**/*.test.ts` (Vitest). Testes E2E em `cypress/e2e/*.cy.ts` (Cypress).

---

## Banco de dados (PostgreSQL)

O projeto está configurado para **PostgreSQL** (RNF004). Em `backend/src/main/resources/application.properties`:

- **URL:** `jdbc:postgresql://localhost:5432/inventory`
- **Usuário:** `postgres` (altere se usar outro)
- **Senha:** use a variável de ambiente `DB_PASSWORD` (recomendado) ou defina `quarkus.datasource.password` no arquivo.

Os **testes** do backend (`.\mvnw.cmd test`) usam H2 em memória via `backend/src/test/resources/application.properties`, sem necessidade de PostgreSQL rodando. Para produção, pode-se trocar `quarkus.hibernate-orm.database.generation` para `none` e usar migrations (ex.: Flyway).

---

## Cobertura de requisitos da atividade

- **RNF001–RNF007:** Aplicação web, separação frontend/API, UI responsiva, SGBD PostgreSQL, Quarkus, React+Redux, inglês em código e banco.
- **RF001–RF004:** Backend: CRUD produtos e matérias-primas, associação produto–matéria-prima, endpoint de sugestão de produção, paginação.
- **RF005–RF008:** Frontend: CRUD produtos e matérias-primas, associação no formulário de produto, tela de sugestão de produção.
- **Desejável:** Testes unitários (backend e frontend), testes de integração E2E com Cypress.
