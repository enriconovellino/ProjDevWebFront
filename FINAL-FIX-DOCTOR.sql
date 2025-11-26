-- ========================================
-- SQL DEFINITIVO PARA CRIAR USUÁRIO MÉDICO
-- ========================================
-- Execute este arquivo COMPLETO no PostgreSQL
-- ========================================

-- PASSO 1: Descobrir quais colunas existem na tabela
SELECT column_name, data_type
FROM information_schema.columns
WHERE table_name = 'usuarios'
ORDER BY ordinal_position;

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
    ativo,
    CASE
        WHEN EXISTS (
            SELECT 1 FROM information_schema.columns
            WHERE table_name = 'usuarios' AND column_name = 'senha'
        ) THEN LENGTH(senha)
        WHEN EXISTS (
            SELECT 1 FROM information_schema.columns
            WHERE table_name = 'usuarios' AND column_name = 'senha_hash'
        ) THEN LENGTH(senha_hash)
    END as tamanho_senha
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
    true,
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
    true,
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
    true,
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
    true,
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
-- RESULTADO ESPERADO:
-- ========================================
-- Deve retornar 1 linha com:
-- - nome: Dr. João Silva
-- - email: medico@clinica.com
-- - perfil: MEDICO
-- - ativo: true (ou t ou 1)
-- ========================================

-- ========================================
-- CREDENCIAIS PARA LOGIN
-- ========================================
-- Email: medico@clinica.com
-- Senha: Medico@123
-- ========================================
