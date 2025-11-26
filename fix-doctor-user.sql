-- ========================================
-- SCRIPT COMPLETO PARA CORRIGIR USUÁRIO MÉDICO
-- ========================================

-- 1. VERIFICAR SE O USUÁRIO JÁ EXISTE
SELECT
    id,
    nome,
    email,
    perfil,
    ativo,
    LENGTH(senha) as tamanho_hash,
    criado_em
FROM usuarios
WHERE email = 'medico@clinica.com';

-- Se retornou um resultado, vá para o passo 2
-- Se não retornou nada, pule para o passo 4

-- ========================================
-- 2. ATUALIZAR USUÁRIO EXISTENTE (se já existe)
-- ========================================

-- Atualiza TODOS os campos importantes
UPDATE usuarios
SET
    nome = 'Dr. João Silva',
    senha = '$2b$10$q/VxCWI1DgULKp6iqS0KeulCG2kzj0bO1X1KVYb677M6oGN3aljua',
    perfil = 'MEDICO',
    cpf = '98765432100',
    telefone = '(11) 98765-4321',
    ativo = true,
    atualizado_em = NOW()
WHERE email = 'medico@clinica.com';

-- ========================================
-- 3. VERIFICAR DEPOIS DA ATUALIZAÇÃO
-- ========================================

SELECT
    id,
    nome,
    email,
    perfil,
    ativo,
    telefone,
    LENGTH(senha) as tamanho_hash,
    SUBSTRING(senha, 1, 10) as inicio_hash
FROM usuarios
WHERE email = 'medico@clinica.com';

-- Você deve ver:
-- - perfil: MEDICO (maiúsculas)
-- - ativo: true
-- - tamanho_hash: 60
-- - inicio_hash: $2b$10$

-- ========================================
-- 4. CRIAR NOVO USUÁRIO (se não existe)
-- ========================================

-- Primeiro tenta deletar se existir
DELETE FROM usuarios WHERE email = 'medico@clinica.com';

-- Depois insere novamente
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
-- 5. VERIFICAÇÃO FINAL
-- ========================================

-- Este SELECT deve retornar exatamente 1 linha
SELECT
    id,
    nome,
    email,
    perfil,
    ativo,
    cpf,
    telefone,
    criado_em,
    atualizado_em
FROM usuarios
WHERE email = 'medico@clinica.com';

-- ========================================
-- 6. TESTE DE PERFIS
-- ========================================

-- Verifica quantos usuários de cada perfil existem
SELECT perfil, COUNT(*) as quantidade
FROM usuarios
GROUP BY perfil;

-- ========================================
-- CREDENCIAIS PARA LOGIN
-- ========================================

-- Email: medico@clinica.com
-- Senha: Medico@123
--
-- IMPORTANTE: A senha é case-sensitive!
-- Use exatamente: Medico@123
--
-- Não funciona:
-- - medico@123
-- - MEDICO@123
-- - Medico123
