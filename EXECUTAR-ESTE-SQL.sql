-- ========================================
-- EXECUTE ESTE SQL NO SEU POSTGRESQL
-- ========================================
-- Este SQL vai:
-- 1. Verificar se o usuário existe
-- 2. Deletar se existir
-- 3. Criar novamente com dados corretos
-- 4. Verificar se foi criado
-- ========================================

-- PASSO 1: Verificar se já existe
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

-- Se retornou algo, vá para o PASSO 2
-- Se não retornou nada, pule para o PASSO 3

-- ========================================
-- PASSO 2: Deletar usuário existente
-- ========================================

DELETE FROM usuarios WHERE email = 'medico@clinica.com';

-- ========================================
-- PASSO 3: Criar o usuário médico
-- ========================================

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
-- PASSO 4: VERIFICAR se foi criado
-- ========================================

SELECT
    id,
    nome,
    email,
    perfil,
    ativo,
    cpf,
    telefone,
    LENGTH(senha) as tamanho_senha,
    SUBSTRING(senha, 1, 15) as inicio_hash,
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
-- - ativo: true (ou t)
-- - tamanho_senha: 60
-- - inicio_hash: $2b$10$
-- ========================================

-- ========================================
-- EXTRA: Ver todos os usuários
-- ========================================

SELECT id, nome, email, perfil, ativo
FROM usuarios
ORDER BY criado_em DESC;

-- ========================================
-- CREDENCIAIS PARA LOGIN
-- ========================================
-- Email: medico@clinica.com
-- Senha: Medico@123
--
-- IMPORTANTE: Digite exatamente assim!
-- ========================================
