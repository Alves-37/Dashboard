# Dashboard de Administração

Sistema completo de dashboard para gestão de usuários e denúncias com autenticação.

## 🚀 Tecnologias Utilizadas

- **React 19** - Framework frontend
- **Vite** - Build tool e dev server
- **React Router DOM** - Navegação e rotas
- **TailwindCSS** - Estilização
- **Context API** - Gerenciamento de estado

## 📁 Estrutura do Projeto

```
src/
├── components/          # Componentes reutilizáveis
│   ├── Card.jsx        # Card de estatísticas
│   ├── Layout.jsx      # Layout principal (Sidebar + Navbar)
│   ├── Navbar.jsx      # Barra de navegação superior
│   ├── Sidebar.jsx     # Menu lateral
│   └── ProtectedRoute.jsx  # Proteção de rotas
├── context/
│   └── AuthContext.jsx # Contexto de autenticação
├── pages/              # Páginas da aplicação
│   ├── Login.jsx       # Tela de login
│   ├── Dashboard.jsx   # Dashboard principal
│   ├── Usuarios.jsx    # Gestão de usuários
│   └── Denuncias.jsx   # Gestão de denúncias
├── App.jsx             # Configuração de rotas
└── main.jsx            # Entry point
```

## 🎯 Funcionalidades

### ✅ Autenticação
- Login com email e senha
- Proteção de rotas privadas
- Logout com limpeza de sessão
- Persistência de login (localStorage)

### 📊 Dashboard Principal
- Cards com estatísticas gerais
- Atividades recentes
- Gráficos de progresso
- Visão geral do sistema

### 👥 Gestão de Usuários
- Listagem de usuários
- Busca por nome/email
- Filtro por status (Ativo/Inativo)
- Ativar/Desativar usuários
- Editar e excluir usuários
- Paginação

### ⚠️ Gestão de Denúncias
- Listagem de denúncias
- Busca e filtros múltiplos (status, prioridade)
- Visualização detalhada
- Alteração de status
- Resolução de denúncias
- Exclusão de denúncias
- Painel lateral com detalhes

## 🛠️ Instalação e Execução

### 1. Instalar dependências
```bash
npm install
```

**Nota:** O projeto requer `axios` para comunicação com a API. Certifique-se de que está instalado:
```bash
npm install axios
```

### 2. Configurar variáveis de ambiente
Copie o arquivo `.env.example` para `.env` e configure a URL da sua API:
```bash
cp .env.example .env
```

Edite o arquivo `.env`:
```env
VITE_API_BASE_URL=http://localhost:5000/api
```

### 3. Executar em modo desenvolvimento
```bash
npm run dev
```

### 4. Build para produção
```bash
npm run build
```

### 5. Preview do build
```bash
npm run preview
```

## 🔐 Autenticação

O sistema utiliza autenticação via API REST com JWT (JSON Web Token).

### Endpoints esperados:
- **POST** `/auth/login` - Login com email e senha
  ```json
  {
    "email": "usuario@email.com",
    "senha": "senha123"
  }
  ```
  Resposta esperada:
  ```json
  {
    "token": "jwt_token_aqui",
    "user": {
      "id": 1,
      "nome": "Nome do Usuário",
      "email": "usuario@email.com",
      "tipo": "admin"
    }
  }
  ```

- **POST** `/auth/register` - Registro de novo usuário
- **GET** `/users/:id` - Buscar dados do usuário
- **PUT** `/users/:id` - Atualizar perfil
- **DELETE** `/users/:id` - Excluir conta

## 🎨 Rotas da Aplicação

- `/login` - Tela de login
- `/dashboard` - Dashboard principal (protegida)
- `/usuarios` - Gestão de usuários (protegida)
- `/denuncias` - Gestão de denúncias (protegida)

## 📝 Próximos Passos para Produção

1. **Integrar com API Backend**
   - Substituir dados simulados por chamadas reais
   - Implementar autenticação JWT
   - Adicionar tratamento de erros

2. **Melhorias de UX**
   - Adicionar loading states
   - Implementar toasts/notificações
   - Adicionar confirmações de ações

3. **Funcionalidades Adicionais**
   - Exportar relatórios (PDF/Excel)
   - Gráficos interativos (Chart.js/Recharts)
   - Upload de imagens
   - Sistema de permissões por role

4. **Segurança**
   - Validação de formulários
   - Sanitização de inputs
   - Rate limiting
   - HTTPS obrigatório

5. **Performance**
   - Lazy loading de componentes
   - Virtualização de listas grandes
   - Cache de dados
   - Otimização de imagens

## 🐛 Observações

- Os dados são simulados e armazenados apenas no estado local
- O localStorage é usado apenas para persistir o login
- Em produção, integre com uma API REST ou GraphQL
- Adicione variáveis de ambiente para configurações sensíveis

## 📦 Dependências Principais

```json
{
  "react": "^19.1.1",
  "react-dom": "^19.1.1",
  "react-router-dom": "^7.9.3",
  "tailwindcss": "^3.4.1"
}
```

## 🎯 Design System

O projeto utiliza TailwindCSS com as seguintes cores principais:
- **Primary**: Blue (600, 700)
- **Success**: Green (500, 600)
- **Warning**: Yellow (500)
- **Danger**: Red (500, 600)
- **Background**: Gray (50, 100, 900)

## 📱 Responsividade

O dashboard é totalmente responsivo e funciona em:
- Desktop (1280px+)
- Tablet (768px - 1279px)
- Mobile (< 768px)

---

**Desenvolvido com ❤️ usando React + Vite + TailwindCSS**
