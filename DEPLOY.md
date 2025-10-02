# Deploy do Dashboard no Vercel

## Pré-requisitos
- Conta no [Vercel](https://vercel.com)
- Projeto backend hospedado (Railway, Render, etc.)
- Node.js 18+ instalado

## Configuração

### 1. Arquivos de Configuração
- ✅ `vercel.json` - configuração do Vercel
- ✅ `vite.config.js` - otimizado para produção
- ✅ `.env.production` - variáveis de produção
- ✅ `.env.example` - template das variáveis

### 2. Variáveis de Ambiente no Vercel
No painel do Vercel, vá em **Settings > Environment Variables** e adicione:

```
VITE_API_BASE_URL=https://seu-backend-domain.vercel.app/api
```

Substitua pela URL real do seu backend.

### 3. Deploy
```bash
# Instalar Vercel CLI (se não tiver)
npm i -g vercel

# Deploy inicial
vercel --prod

# Ou conectar projeto existente
vercel link
vercel --prod
```

## Estrutura de Produção
- **Build**: `npm run build` gera arquivos em `dist/`
- **SPA Routing**: `vercel.json` redireciona todas as rotas para `index.html`
- **Segurança**: headers de segurança configurados
- **Otimizações**: code splitting automático com Vite

## Troubleshooting
- **Build falha**: verifique logs no painel do Vercel
- **API não conecta**: confirme `VITE_API_BASE_URL` no painel
- **CORS**: backend deve permitir origem do Vercel (`*.vercel.app`)

## URLs de Exemplo
- Dashboard: `https://seu-dashboard.vercel.app`
- Backend: `https://seu-backend.vercel.app/api`

## Comandos Úteis
```bash
vercel logs --follow    # acompanhar logs
vercel env ls          # listar variáveis
vercel env rm VAR      # remover variável
vercel --version       # versão do CLI
```
