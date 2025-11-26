-- ========================================
-- SQL CORRIGIDO - Campo correto: senha_hash
-- ========================================

-- 1. Verificar se já existe
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

-- 2. Deletar se existir (para recriar do zero)
DELETE FROM usuarios WHERE email = 'medico@clinica.com';

-- 3. Criar o usuário médico
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

-- 4. Verificar se foi criado corretamente
SELECT
    id,
    nome,
    email,
    perfil,
    ativo,
    cpf,
    telefone,
    LENGTH(senha_hash) as tamanho_hash,
    SUBSTRING(senha_hash, 1, 15) as inicio_hash,
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
-- - ativo: 1
-- - tamanho_hash: 60
-- - inicio_hash: $2b$10$
-- ========================================

-- ========================================
-- CREDENCIAIS PARA LOGIN
-- ========================================
-- Email: medico@clinica.com
-- Senha: Medico@123
-- ========================================
