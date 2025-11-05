-- Script para criar usuário ADMIN de teste
-- Execute este script no banco de dados do backend

-- Credenciais de teste:
-- Email: admin@clinica.com
-- Senha: Admin@123

-- IMPORTANTE: A senha precisa estar em hash bcrypt
-- Use o backend para criar o hash ou execute um script Node.js

-- Exemplo de como criar o hash com Node.js:
-- const bcrypt = require('bcrypt');
-- const hash = await bcrypt.hash('Admin@123', 10);
-- console.log(hash);

-- Para PostgreSQL:
INSERT INTO usuarios (nome, email, senha, perfil, cpf, ativo, criado_em, atualizado_em)
VALUES (
  'Administrador do Sistema',
  'admin@clinica.com',
  '$2b$10$YourHashedPasswordHere', -- Substitua pelo hash real
  'ADMIN',
  '12345678900',
  true,
  NOW(),
  NOW()
)
ON CONFLICT (email) DO NOTHING;

-- Se você já tiver uma tabela de usuários, ajuste conforme necessário
