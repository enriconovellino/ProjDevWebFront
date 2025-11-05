# 🔧 COMO CONFIGURAR CORS NO BACKEND - PASSO A PASSO

## ❌ Problema Atual
```
Erro: Tempo de resposta esgotado. Tente novamente.
```

Este erro acontece porque o navegador **BLOQUEIA** requisições do frontend para o backend por segurança (política de CORS).

---

## ✅ Solução (5 minutos)

### Passo 1: Abra o Terminal do Backend

```bash
cd d:\ProjDevWebBack  # Ajuste o caminho se necessário
```

### Passo 2: Instale o Pacote CORS

```bash
npm install cors
npm install --save-dev @types/cors  # Se usar TypeScript
```

### Passo 3: Encontre o Arquivo Principal

Procure por um destes arquivos na pasta `src/`:
- `server.ts` ou `server.js`
- `index.ts` ou `index.js`
- `app.ts` ou `app.js`
- `main.ts` ou `main.js`

### Passo 4: Adicione CORS

#### Se for TypeScript (.ts):

```typescript
import express from 'express';
import cors from 'cors';

const app = express();

// ⚠️ IMPORTANTE: CORS DEVE VIR ANTES DE TUDO ⚠️
app.use(cors({
  origin: [
    'http://localhost:5173',
    'http://localhost:5174',
    'http://localhost:5175',
    'http://localhost:5176'
  ],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// Depois vem o resto
app.use(express.json());

// Suas rotas...
```

#### Se for JavaScript (.js):

```javascript
const express = require('express');
const cors = require('cors');

const app = express();

// ⚠️ IMPORTANTE: CORS DEVE VIR ANTES DE TUDO ⚠️
app.use(cors({
  origin: [
    'http://localhost:5173',
    'http://localhost:5174',
    'http://localhost:5175',
    'http://localhost:5176'
  ],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// Depois vem o resto
app.use(express.json());

// Suas rotas...
```

### Passo 5: Reinicie o Backend

No terminal do backend, pare (Ctrl+C) e reinicie:

```bash
npm run dev
# ou
npm start
```

### Passo 6: Teste Novamente

1. Acesse: http://localhost:5175/
2. Tente fazer login com:
   - Email: admin@clinica.com
   - Senha: Admin@123

---

## 🧪 Como Saber se Funcionou?

### ❌ ANTES (sem CORS):
```
Erro: Tempo de resposta esgotado. Tente novamente.
```

### ✅ DEPOIS (com CORS):
```
Usuário ou senha inválidos
OU
Login bem-sucedido (se as credenciais estiverem corretas)
```

Se ainda der "Usuário ou senha inválidos", significa que:
- ✅ CORS está funcionando!
- ❌ Precisa criar o usuário admin no banco de dados

---

## 📋 Checklist

- [ ] Instalei o pacote cors no backend
- [ ] Adicionei `app.use(cors({...}))` no arquivo principal
- [ ] Coloquei o CORS ANTES de `app.use(express.json())`
- [ ] Reiniciei o backend
- [ ] Testei no frontend

---

## 🆘 Se Ainda Não Funcionar

1. **Verifique o terminal do backend** - Deve mostrar que o servidor reiniciou
2. **Abra o DevTools no navegador** (F12)
3. **Vá na aba Network** (Rede)
4. **Tente fazer login**
5. **Clique na requisição `/api/auth/login`**
6. **Veja os Headers (Cabeçalhos) da resposta**

Você DEVE ver:
```
Access-Control-Allow-Origin: http://localhost:5175
Access-Control-Allow-Credentials: true
```

Se não vir esses headers, o CORS não foi configurado corretamente.

---

## 📸 Exemplo Visual

### Localização do Código:

```
ProjDevWebBack/
  └── src/
      └── server.ts  ← Adicione CORS aqui (linha 5-15 aproximadamente)
```

### Como Deve Ficar:

```typescript
import express from 'express';
import cors from 'cors';        // ← 1. Import
import routes from './routes';

const app = express();

app.use(cors({                  // ← 2. Configure (ANTES de tudo)
  origin: ['http://localhost:5173', 'http://localhost:5174', 'http://localhost:5175'],
  credentials: true
}));

app.use(express.json());        // ← 3. Depois vem o resto
app.use('/api', routes);

app.listen(3000, () => {
  console.log('Server running on port 3000');
});
```

---

## ⚠️ IMPORTANTE

**SEM CORS NO BACKEND, NUNCA VAI FUNCIONAR!**

O navegador bloqueia requisições cross-origin por segurança. Não há como contornar isso no frontend. A única solução é configurar CORS no backend.
