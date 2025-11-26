-- SQL para criar usuário médico de teste
-- Execute este script no seu banco de dados PostgreSQL

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
)
ON CONFLICT (email) DO UPDATE SET
  senha = EXCLUDED.senha,
  atualizado_em = NOW();

-- Verificar se o usuário foi criado
SELECT id, nome, email, perfil, ativo FROM usuarios WHERE email = 'medico@clinica.com';
