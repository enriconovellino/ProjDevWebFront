-- Script para verificar e debugar o usuário médico

-- 1. Verificar se o usuário médico existe
SELECT
    id,
    nome,
    email,
    perfil,
    cpf,
    telefone,
    ativo,
    criado_em,
    LENGTH(senha) as tamanho_hash_senha
FROM usuarios
WHERE email = 'medico@clinica.com';

-- 2. Verificar todos os usuários do tipo MEDICO
SELECT
    id,
    nome,
    email,
    perfil,
    ativo
FROM usuarios
WHERE perfil = 'MEDICO';

-- 3. Se o usuário não existir ou precisar recriar, use este SQL:
-- (Descomente as linhas abaixo se precisar recriar)

/*
DELETE FROM usuarios WHERE email = 'medico@clinica.com';

INSERT INTO usuarios (nome, email, senha, perfil, cpf, telefone, ativo, criado_em, atualizado_em)
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

-- 4. Verificar novamente após inserir
SELECT
    id,
    nome,
    email,
    perfil,
    ativo,
    criado_em
FROM usuarios
WHERE email = 'medico@clinica.com';
