-- ========================================
-- SQL DEFINITIVO PARA CRIAR USUÁRIO MÉDICO
-- VERSÃO MYSQL
-- ========================================
-- Execute este arquivo COMPLETO no MySQL
-- ========================================

-- PASSO 1: Descobrir quais colunas existem na tabela
SELECT
    COLUMN_NAME as column_name,
    DATA_TYPE as data_type,
    IS_NULLABLE,
    COLUMN_KEY
FROM INFORMATION_SCHEMA.COLUMNS
WHERE TABLE_SCHEMA = DATABASE()
  AND TABLE_NAME = 'usuarios'
ORDER BY ORDINAL_POSITION;

-- ========================================
-- Anote se a coluna de senha se chama:
--   - "senha" ou "senha_hash"
-- Anote se existe a coluna "telefone"
-- ========================================

-- PASSO 2: Ver se o usuário médico já existe
SELECT
    id,
    nome,
    email,
    perfil,
    ativo
FROM usuarios
WHERE email = 'medico@clinica.com';

-- ========================================
-- PASSO 3A: Se a coluna for "senha" E existe "telefone"
-- ========================================

DELETE FROM usuarios WHERE email = 'medico@clinica.com';

INSERT INTO usuarios (
    nome,
    email,
    senha,
    perfil,
    cpf,
    telefone,
    ativo,
    criado_em,
    atualizado_em
)
VALUES (
    'Dr. João Silva',
    'medico@clinica.com',
    '$2b$10$q/VxCWI1DgULKp6iqS0KeulCG2kzj0bO1X1KVYb677M6oGN3aljua',
    'MEDICO',
    '98765432100',
    '(11) 98765-4321',
    1,
    NOW(),
    NOW()
);

-- ========================================
-- PASSO 3B: Se a coluna for "senha_hash" E existe "telefone"
-- ========================================
-- DESCOMENTE ABAIXO se o PASSO 3A falhar

/*
DELETE FROM usuarios WHERE email = 'medico@clinica.com';

INSERT INTO usuarios (
    nome,
    email,
    senha_hash,
    perfil,
    cpf,
    telefone,
    ativo,
    criado_em,
    atualizado_em
)
VALUES (
    'Dr. João Silva',
    'medico@clinica.com',
    '$2b$10$q/VxCWI1DgULKp6iqS0KeulCG2kzj0bO1X1KVYb677M6oGN3aljua',
    'MEDICO',
    '98765432100',
    '(11) 98765-4321',
    1,
    NOW(),
    NOW()
);
*/

-- ========================================
-- PASSO 3C: Se a coluna for "senha" E NÃO existe "telefone"
-- ========================================
-- DESCOMENTE ABAIXO se o PASSO 3A falhar por causa de "telefone"

/*
DELETE FROM usuarios WHERE email = 'medico@clinica.com';

INSERT INTO usuarios (
    nome,
    email,
    senha,
    perfil,
    cpf,
    ativo,
    criado_em,
    atualizado_em
)
VALUES (
    'Dr. João Silva',
    'medico@clinica.com',
    '$2b$10$q/VxCWI1DgULKp6iqS0KeulCG2kzj0bO1X1KVYb677M6oGN3aljua',
    'MEDICO',
    '98765432100',
    1,
    NOW(),
    NOW()
);
*/

-- ========================================
-- PASSO 3D: Se a coluna for "senha_hash" E NÃO existe "telefone"
-- ========================================
-- DESCOMENTE ABAIXO se necessário

/*
DELETE FROM usuarios WHERE email = 'medico@clinica.com';

INSERT INTO usuarios (
    nome,
    email,
    senha_hash,
    perfil,
    cpf,
    ativo,
    criado_em,
    atualizado_em
)
VALUES (
    'Dr. João Silva',
    'medico@clinica.com',
    '$2b$10$q/VxCWI1DgULKp6iqS0KeulCG2kzj0bO1X1KVYb677M6oGN3aljua',
    'MEDICO',
    '98765432100',
    1,
    NOW(),
    NOW()
);
*/

-- ========================================
-- PASSO 4: Verificar se foi criado com sucesso
-- ========================================

SELECT
    id,
    nome,
    email,
    perfil,
    cpf,
    ativo,
    criado_em
FROM usuarios
WHERE email = 'medico@clinica.com';

-- ========================================
-- PASSO 5: Ver o hash da senha para debug
-- ========================================

SELECT
    id,
    nome,
    email,
    perfil,
    ativo,
    LENGTH(senha) as tamanho_senha,
    SUBSTRING(senha, 1, 15) as inicio_hash
FROM usuarios
WHERE email = 'medico@clinica.com';

-- OU se a coluna for senha_hash:

/*
SELECT
    id,
    nome,
    email,
    perfil,
    ativo,
    LENGTH(senha_hash) as tamanho_senha,
    SUBSTRING(senha_hash, 1, 15) as inicio_hash
FROM usuarios
WHERE email = 'medico@clinica.com';
*/

-- ========================================
-- RESULTADO ESPERADO:
-- ========================================
-- Deve retornar 1 linha com:
-- - nome: Dr. João Silva
-- - email: medico@clinica.com
-- - perfil: MEDICO
-- - ativo: 1 (ou true)
-- - tamanho_senha: 60
-- - inicio_hash: $2b$10$
-- ========================================

-- ========================================
-- CREDENCIAIS PARA LOGIN
-- ========================================
-- Email: medico@clinica.com
-- Senha: Medico@123
-- ========================================
