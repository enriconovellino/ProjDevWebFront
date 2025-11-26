# Solução Definitiva - Login do Médico

## O hash está CORRETO! ✓

O teste confirmou que o hash da senha está funcionando perfeitamente:
- Hash: `$2b$10$q/VxCWI1DgULKp6iqS0KeulCG2kzj0bO1X1KVYb677M6oGN3aljua`
- Senha: `Medico@123` (exatamente assim, com M maiúsculo)

## Passos para Resolver

### Opção 1: Atualizar Usuário Existente (RECOMENDADO)

Se o usuário já foi criado no backend, execute este SQL:

```sql
UPDATE usuarios
SET
    nome = 'Dr. João Silva',
    senha = '$2b$10$q/VxCWI1DgULKp6iqS0KeulCG2kzj0bO1X1KVYb677M6oGN3aljua',
    perfil = 'MEDICO',
    ativo = true,
    atualizado_em = NOW()
WHERE email = 'medico@clinica.com';
```

### Opção 2: Criar do Zero

Execute o arquivo completo: `fix-doctor-user.sql`

Ou use estes comandos:

```sql
-- Deleta se existir
DELETE FROM usuarios WHERE email = 'medico@clinica.com';

-- Cria novamente
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
```

## Credenciais (CASE-SENSITIVE!)

```
Email: medico@clinica.com
Senha: Medico@123
```

**ATENÇÃO:**
- ✓ `Medico@123` - CORRETO
- ✗ `medico@123` - ERRADO
- ✗ `MEDICO@123` - ERRADO
- ✗ `Medico123` - ERRADO

## Verificação Obrigatória

Após executar o SQL, verifique se tudo está correto:

```sql
SELECT
    id,
    nome,
    email,
    perfil,
    ativo,
    LENGTH(senha) as tamanho_hash,
    SUBSTRING(senha, 1, 10) as inicio_hash
FROM usuarios
WHERE email = 'medico@clinica.com';
```

**Resultado esperado:**
- `perfil`: MEDICO (tudo maiúsculo)
- `ativo`: true (ou t)
- `tamanho_hash`: 60
- `inicio_hash`: $2b$10$

## Checklist Final

Antes de tentar fazer login, confirme:

- [ ] Usuário existe no banco (`SELECT * FROM usuarios WHERE email = 'medico@clinica.com'`)
- [ ] Campo `perfil` = 'MEDICO' (maiúsculas)
- [ ] Campo `ativo` = true
- [ ] Campo `senha` tem 60 caracteres
- [ ] Backend está rodando (http://localhost:3000)
- [ ] Você está usando a senha exatamente como: `Medico@123`

## Se Ainda Não Funcionar

### 1. Verifique os logs do backend

Quando você tentar fazer login, o backend deve mostrar algo como:
```
POST /api/auth/login
Tentando login para: medico@clinica.com
```

### 2. Teste direto via curl

```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"medico@clinica.com","senha":"Medico@123"}'
```

### 3. Use a página de teste

Abra `test-doctor-login.html` no navegador para ver o erro detalhado.

## Possíveis Causas se Continuar Falhando

1. **Backend usando algoritmo diferente**: O backend pode estar usando outro método além de bcrypt
2. **Campo de perfil diferente**: Verifique no código do backend qual campo ele compara (perfil, role, tipo_usuario, etc)
3. **Validação customizada**: O backend pode ter regras adicionais que não sabemos
4. **Email com espaços**: Verifique se não há espaços extras no email

## Contato

Se nada disso resolver, precisamos verificar:
- Código do backend (arquivo de autenticação)
- Logs do servidor quando tenta fazer login
- Estrutura exata da tabela usuarios
