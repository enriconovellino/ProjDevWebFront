-- ========================================
-- SQL FINAL CORRETO - Apenas colunas que existem
-- ========================================

-- 1. Deletar se existir
DELETE FROM usuarios WHERE email = 'medico@clinica.com';

-- 2. Criar o usuário médico (SEM telefone)
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

-- 3. Verificar se foi criado
SELECT id, nome, email, perfil, cpf, ativo
FROM usuarios
WHERE email = 'medico@clinica.com';

-- ========================================
-- CREDENCIAIS PARA LOGIN
-- ========================================
-- Email: medico@clinica.com
-- Senha: Medico@123
-- ========================================
