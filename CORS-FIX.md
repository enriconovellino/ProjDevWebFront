# Como Corrigir o Erro de CORS no Backend

## 🔴 Problema
O frontend em `http://localhost:5173` não consegue fazer requisições para o backend em `http://localhost:3000` devido a bloqueio de CORS.

## ✅ Solução

### 1. Instalar o pacote CORS no backend

No terminal, vá para a pasta do **backend** e execute:

```bash
cd ../ProjDevWebBack  # Ajuste o caminho se necessário
npm install cors
```

### 2. Configurar CORS no Backend

Adicione a configuração de CORS no arquivo principal do backend (geralmente `server.js`, `app.js`, ou `index.js`):

#### Para Express.js:

```javascript
const express = require('express');
const cors = require('cors');

const app = express();

// Configuração de CORS - ADICIONE ISSO ANTES DAS ROTAS
app.use(cors({
  origin: 'http://localhost:5173', // URL do frontend
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// Resto da configuração...
app.use(express.json());

// Suas rotas aqui...
```

#### Se estiver usando TypeScript no backend:

```typescript
import express from 'express';
import cors from 'cors';

const app = express();

// Configuração de CORS
app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json());

// Suas rotas aqui...
```

### 3. Alternativa: CORS para Múltiplas Origens

Se você quiser permitir múltiplas origens (desenvolvimento + produção):

```javascript
const corsOptions = {
  origin: function (origin, callback) {
    const allowedOrigins = [
      'http://localhost:5173',
      'http://localhost:5174',
      'http://localhost:3000',
      // Adicione outras URLs se necessário
    ];

    if (!origin || allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
};

app.use(cors(corsOptions));
```

### 4. Reiniciar o Backend

Depois de fazer as alterações, reinicie o backend:

```bash
# No terminal do backend
npm run dev
# ou
npm start
```

---

## 🧪 Testar se Funcionou

Depois de configurar o CORS:

1. ✅ Backend rodando em `http://localhost:3000`
2. ✅ Frontend rodando em `http://localhost:5173`
3. ✅ Tente fazer login no frontend com:
   - Email: `admin@clinica.com`
   - Senha: `Admin@123`

Abra o DevTools (F12) → **Network** e verifique:
- A requisição para `/api/auth/login` deve retornar status **200** (sucesso) ou **401** (credenciais inválidas)
- **NÃO** deve mais aparecer erro de CORS

---

## 📝 Exemplo Completo

Aqui está um exemplo completo de como deve ficar o arquivo principal do backend:

```javascript
const express = require('express');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3000;

// CORS - DEVE VIR ANTES DE TUDO
app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// Body parser
app.use(express.json());

// Rotas
app.get('/health', (req, res) => {
  res.json({
    name: 'API Sistema de Gestão Clínica',
    version: '1.0.0',
    status: 'online',
    timestamp: new Date().toISOString()
  });
});

// Suas rotas de API aqui
app.use('/api/auth', authRoutes);
app.use('/api/medicos', medicosRoutes);
// ... outras rotas

// Iniciar servidor
app.listen(PORT, () => {
  console.log(`Servidor rodando em http://localhost:${PORT}`);
});
```

---

## 🔍 Verificar se o CORS foi Aplicado

Execute este comando no terminal para testar:

```bash
curl -I -X OPTIONS http://localhost:3000/api/auth/login \
  -H "Origin: http://localhost:5173" \
  -H "Access-Control-Request-Method: POST"
```

Se o CORS estiver configurado corretamente, você verá headers como:
- `Access-Control-Allow-Origin: http://localhost:5173`
- `Access-Control-Allow-Methods: GET, POST, PUT, DELETE, PATCH, OPTIONS`
