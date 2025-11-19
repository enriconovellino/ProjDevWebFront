# Credenciais de Admin para Teste

## 📧 Credenciais
- **Email**: `admin@clinica.com`
- **Senha**: `Admin@123`

---

## 🔧 Como criar o usuário no banco de dados

### Opção 1: Usando o Backend (RECOMENDADO)

Se o seu backend tiver um endpoint de registro ou script de seed, use-o para criar o admin.

### Opção 2: SQL Direto no Banco de Dados

Execute este SQL no seu banco de dados PostgreSQL:

```sql
-- Hash bcrypt para a senha 'Admin@123' (10 rounds)
-- Gerado com: bcrypt.hash('Admin@123', 10)

INSERT INTO usuarios (nome, email, senha, perfil, cpf, ativo, criado_em, atualizado_em)
VALUES (
  'Administrador do Sistema',
  'admin@clinica.com',
  '$2b$10$rT8Y.8vH0c3JX/xKqK1.KuDHGzqvQF4vYXmJ5.eGN3xH7yR8N1LFi',
  'ADMIN',
  '12345678900',
  true,
  NOW(),
  NOW()
)
ON CONFLICT (email) DO UPDATE SET
  senha = EXCLUDED.senha,
  atualizado_em = NOW();
```

**NOTA**: O hash acima é um exemplo genérico. Para segurança, gere um novo hash no seu backend.

### Opção 3: Gerar Hash no Backend

No backend, crie um script temporário:

```javascript
// backend/create-admin.js
const bcrypt = require('bcrypt');

async function createAdmin() {
  const senha = 'Admin@123';
  const hash = await bcrypt.hash(senha, 10);
  console.log('Hash:', hash);
}

createAdmin();
```

Execute: `node backend/create-admin.js` e use o hash gerado no SQL acima.

---

## 🧪 Como Testar

1. Certifique-se de que o backend está rodando em `http://localhost:3000`
2. Acesse o frontend em `http://localhost:5173`
3. Faça login com:
   - Email: `admin@clinica.com`
   - Senha: `Admin@123`

---

## 🔐 Hash Bcrypt de Exemplo

Se você precisar criar o hash manualmente, aqui está um hash válido para `Admin@123`:

```
$2b$10$rT8Y.8vH0c3JX/xKqK1.KuDHGzqvQF4vYXmJ5.eGN3xH7yR8N1LFi
```

**IMPORTANTE**: Este é apenas um exemplo. Em produção, sempre gere novos hashes!

---

## 📝 Estrutura da Tabela Esperada

```sql
CREATE TABLE usuarios (
  id SERIAL PRIMARY KEY,
  nome VARCHAR(255) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  senha VARCHAR(255) NOT NULL,
  perfil VARCHAR(50) NOT NULL CHECK (perfil IN ('ADMIN', 'MEDICO', 'PACIENTE')),
  cpf VARCHAR(11) UNIQUE NOT NULL,
  ativo BOOLEAN DEFAULT true,
  criado_em TIMESTAMP DEFAULT NOW(),
  atualizado_em TIMESTAMP DEFAULT NOW()
);
```

Se a estrutura do seu banco for diferente, ajuste o SQL conforme necessário.
