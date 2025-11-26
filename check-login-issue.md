# Checklist para Resolver Problema de Login

## Problemas Comuns

### 1. Hash da Senha Incorreto
O hash da senha deve ser gerado com bcrypt. Verifique se:
- O backend está usando bcrypt para comparar senhas
- O hash foi gerado com bcrypt (começa com `$2b$` ou `$2a$`)
- O número de rounds é compatível (geralmente 10)

### 2. Perfil com Letras Diferentes
O perfil deve ser EXATAMENTE `MEDICO` (tudo maiúsculo).

Execute:
```sql
SELECT perfil FROM usuarios WHERE email = 'medico@clinica.com';
```

Se retornar algo diferente de `MEDICO`, corrija:
```sql
UPDATE usuarios SET perfil = 'MEDICO' WHERE email = 'medico@clinica.com';
```

### 3. Usuário Inativo
Verifique se o campo `ativo` está como `true`:

```sql
SELECT ativo FROM usuarios WHERE email = 'medico@clinica.com';
```

Se estiver `false`:
```sql
UPDATE usuarios SET ativo = true WHERE email = 'medico@clinica.com';
```

### 4. Email com Espaços ou Caracteres Extras
Verifique se não há espaços no email:

```sql
SELECT email, LENGTH(email) FROM usuarios WHERE email LIKE '%medico%';
```

### 5. Verificação Completa do Usuário

Execute este SQL para ver TODOS os detalhes:

```sql
SELECT
    id,
    nome,
    email,
    perfil,
    ativo,
    LENGTH(senha) as tamanho_senha,
    SUBSTRING(senha, 1, 10) as inicio_hash,
    criado_em
FROM usuarios
WHERE email = 'medico@clinica.com';
```

**O que você deve ver:**
- `perfil`: MEDICO (exatamente assim)
- `ativo`: true
- `tamanho_senha`: 60 (padrão bcrypt)
- `inicio_hash`: $2b$10$ ou $2a$10$

## Como o Backend Valida o Login

O backend provavelmente faz:
1. Busca usuário pelo email
2. Verifica se está ativo
3. Compara a senha usando `bcrypt.compare(senhaDigitada, senhaHashNoBanco)`

## Teste do Backend

Verifique os logs do backend quando você tenta fazer login. Você deve ver algo como:
- "Tentativa de login para: medico@clinica.com"
- "Usuário encontrado: Dr. João Silva"
- "Senha válida" ou "Senha inválida"

## Se Nada Funcionar: Recrie com Este SQL

```sql
-- 1. Deleta o usuário existente
DELETE FROM usuarios WHERE email = 'medico@clinica.com';

-- 2. Cria novamente com hash testado
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

-- 3. Verifica
SELECT id, nome, email, perfil, ativo FROM usuarios WHERE email = 'medico@clinica.com';
```

Este hash é da senha `Medico@123` e foi testado.
