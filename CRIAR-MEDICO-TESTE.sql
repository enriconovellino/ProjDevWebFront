-- ===================================
-- SCRIPT PARA CRIAR USUÁRIO MÉDICO DE TESTE
-- ===================================
-- Credenciais:
-- Email: medico@clinica.com
-- Senha: Medico@123
-- Hash bcrypt: $2b$10$q/VxCWI1DgULKp6iqS0KeulCG2kzj0bO1X1KVYb677M6oGN3aljua
--
-- INSTRUÇÕES:
-- 1. Abra seu gerenciador do PostgreSQL (pgAdmin, DBeaver, etc)
-- 2. Conecte ao banco de dados da clínica
-- 3. Cole este SQL e execute
-- ===================================
-- Antes de executar: verifique o esquema da tabela `usuarios` no seu banco.
-- MySQL:
--   DESCRIBE usuarios;
-- PostgreSQL:
--   SELECT column_name FROM information_schema.columns WHERE table_name = 'usuarios';

-- Verifique se a coluna de senha se chama `senha_hash` ou `senha`,
-- e se as colunas de timestamp se chamam `criado_em`/`atualizado_em` ou `created_at`/`updated_at`.

-- ===================================
-- A) Se a coluna de senha for `senha_hash` (MySQL ou Postgres)
--    Use um UPDATE simples e um INSERT seguro (não depende de colunas de timestamp)
-- ===================================

-- Verifica se o usuário já existe
SELECT id, nome, email, perfil, ativo FROM usuarios WHERE email = 'medico@clinica.com';

-- Se o usuário já existe (apenas atualiza campos essenciais)
UPDATE usuarios
SET
    nome = 'Dr. João Silva',
    senha_hash = '$2b$10$q/VxCWI1DgULKp6iqS0KeulCG2kzj0bO1X1KVYb677M6oGN3aljua',
    perfil = 'MEDICO',
    ativo = 1
WHERE email = 'medico@clinica.com';

-- Se o usuário NÃO existe, insira usando sintaxe segura para MySQL/Postgres
-- MySQL (usa ON DUPLICATE KEY UPDATE)
-- Descomente e execute se estiver usando MySQL
-- INSERT INTO usuarios (nome, email, senha_hash, perfil, cpf, telefone, ativo)
-- VALUES (
--   'Dr. João Silva',
--   'medico@clinica.com',
--   '$2b$10$q/VxCWI1DgULKp6iqS0KeulCG2kzj0bO1X1KVYb677M6oGN3aljua',
--   'MEDICO',
--   '98765432100',
--   '(11) 98765-4321',
--   1
-- )
-- ON DUPLICATE KEY UPDATE
--   senha_hash = VALUES(senha_hash),
--   perfil = VALUES(perfil),
--   ativo = VALUES(ativo);
-- Se o usuário NÃO existe, insira usando sintaxe segura para MySQL/Postgres
-- MySQL (usa ON DUPLICATE KEY UPDATE)
-- Descomente e execute se estiver usando MySQL
-- A partir do MySQL 8.0.19 a função VALUES() está deprecada; use um alias para o VALUES
-- Exemplo com alias (evita aviso depreciação):
-- INSERT INTO usuarios (nome, email, cpf, senha_hash, perfil, ativo)
-- VALUES (
--   'Dr. João Silva',
--   'medico@clinica.com',
--   '98765432100',
--   '$2b$10$q/VxCWI1DgULKp6iqS0KeulCG2kzj0bO1X1KVYb677M6oGN3aljua',
--   'MEDICO',
--   1
-- ) AS new
-- ON DUPLICATE KEY UPDATE
--   nome = new.nome,
--   cpf = new.cpf,
--   senha_hash = new.senha_hash,
--   perfil = new.perfil,
--   ativo = new.ativo;

-- PostgreSQL (usa ON CONFLICT)
-- Descomente e execute se estiver usando PostgreSQL
-- INSERT INTO usuarios (nome, email, senha_hash, perfil, cpf, telefone, ativo, criado_em)
-- VALUES (
--   'Dr. João Silva',
--   'medico@clinica.com',
--   '$2b$10$q/VxCWI1DgULKp6iqS0KeulCG2kzj0bO1X1KVYb677M6oGN3aljua',
--   'MEDICO',
--   '98765432100',
--   '(11) 98765-4321',
--   true,
--   NOW()
-- )
-- ON CONFLICT (email) DO UPDATE SET
--   senha_hash = EXCLUDED.senha_hash,
--   perfil = EXCLUDED.perfil,
--   ativo = EXCLUDED.ativo;

-- ===================================
-- B) Se a coluna de senha for `senha` (hash armazenado em `senha`)
--    Use as mesmas instruções, substituindo `senha_hash` por `senha`.
-- ===================================

-- UPDATE usuarios
-- SET
--     nome = 'Dr. João Silva',
--     senha = '$2b$10$q/VxCWI1DgULKp6iqS0KeulCG2kzj0bO1X1KVYb677M6oGN3aljua',
--     perfil = 'MEDICO',
--     ativo = 1
-- WHERE email = 'medico@clinica.com';

-- INSERT exemplo (MySQL):
-- INSERT INTO usuarios (nome, email, senha, perfil, cpf, telefone, ativo)
-- VALUES ('Dr. João Silva','medico@clinica.com','$2b$10$q/VxCWI1DgULKp6iqS0KeulCG2kzj0bO1X1KVYb677M6oGN3aljua','MEDICO','98765432100','(11) 98765-4321',1)
-- ON DUPLICATE KEY UPDATE senha = VALUES(senha), perfil = VALUES(perfil), ativo = VALUES(ativo);

-- ===================================
-- VERIFICAÇÃO FINAL (ajuste conforme a coluna correta)
-- ===================================
-- Se estiver usando `senha_hash`:
SELECT
    id,
    nome,
    email,
    perfil,
    ativo,
    LENGTH(senha_hash) as tamanho_hash,
    SUBSTRING(senha_hash, 1, 15) as inicio_hash
FROM usuarios
WHERE email = 'medico@clinica.com';

-- Se estiver usando `senha`:
-- SELECT id, nome, email, perfil, ativo, LENGTH(senha) as tamanho_hash, SUBSTRING(senha,1,15) as inicio_hash FROM usuarios WHERE email = 'medico@clinica.com';

-- Resultado esperado:
-- ✓ perfil = 'MEDICO' (tudo maiúsculo)
-- ✓ ativo = 1 (ou true)
-- ✓ tamanho_hash ≈ 60
-- ✓ inicio_hash = '$2b$10$'

-- -----------------------------------
-- ATALHO DE DESENVOLVIMENTO (RÁPIDO)
-- -----------------------------------
-- Se você só quer acessar a área do médico rapidamente no frontend
-- e não consegue logar pelo backend agora, abra no navegador:
--   http://localhost:5173/dev-login-medico.html
-- (ou ajuste a porta do seu frontend)
-- Clique em "Login como Médico" — isso salva um token falso e um
-- usuário com `perfil: 'MEDICO'` em localStorage e redireciona.
-- REMOVA este arquivo antes de publicar em produção.

