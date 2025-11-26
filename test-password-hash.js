// Script para testar e verificar o hash da senha
// Execute com: node test-password-hash.js

import bcrypt from 'bcrypt';

const senha = 'Medico@123';
const hashEsperado = '$2b$10$q/VxCWI1DgULKp6iqS0KeulCG2kzj0bO1X1KVYb677M6oGN3aljua';

async function testPasswordHash() {
  console.log('\n========================================');
  console.log('TESTE DE VALIDAÇÃO DE SENHA');
  console.log('========================================\n');

  // 1. Gera um novo hash
  console.log('1. Gerando novo hash para comparação...');
  const saltRounds = 10;
  const novoHash = await bcrypt.hash(senha, saltRounds);
  console.log('   Novo hash gerado:', novoHash);

  // 2. Testa se o hash esperado é válido
  console.log('\n2. Testando hash fornecido...');
  console.log('   Senha:', senha);
  console.log('   Hash:', hashEsperado);

  const isValid = await bcrypt.compare(senha, hashEsperado);
  console.log('   Resultado:', isValid ? '✓ VÁLIDO' : '✗ INVÁLIDO');

  if (!isValid) {
    console.log('\n   ⚠ ATENÇÃO: O hash fornecido não corresponde à senha!');
    console.log('   Use o novo hash gerado acima.\n');
  }

  // 3. Testa o novo hash
  console.log('\n3. Testando novo hash gerado...');
  const isNewHashValid = await bcrypt.compare(senha, novoHash);
  console.log('   Resultado:', isNewHashValid ? '✓ VÁLIDO' : '✗ INVÁLIDO');

  // 4. Mostra SQL para atualizar
  console.log('\n========================================');
  console.log('SQL PARA ATUALIZAR A SENHA NO BANCO');
  console.log('========================================\n');

  console.log(`UPDATE usuarios
SET senha = '${novoHash}', atualizado_em = NOW()
WHERE email = 'medico@clinica.com';
`);

  // 5. Testa diferentes senhas comuns
  console.log('\n========================================');
  console.log('TESTE COM SENHAS ALTERNATIVAS');
  console.log('========================================\n');

  const senhasParaTestar = [
    'Medico@123',
    'medico@123',
    'MEDICO@123',
    'Medico123',
    'medico@clinica.com'
  ];

  console.log('Testando se alguma dessas senhas funciona com o hash fornecido:\n');

  for (const senhaTest of senhasParaTestar) {
    const result = await bcrypt.compare(senhaTest, hashEsperado);
    console.log(`   "${senhaTest}":`, result ? '✓ MATCH' : '✗ Não');
  }

  console.log('\n========================================');
  console.log('RECOMENDAÇÃO');
  console.log('========================================\n');

  if (isValid) {
    console.log('✓ O hash está correto.');
    console.log('  Credenciais:');
    console.log('  Email: medico@clinica.com');
    console.log('  Senha: Medico@123\n');
  } else {
    console.log('✗ Use o novo hash gerado acima no seu banco de dados.');
    console.log('  Execute o UPDATE SQL fornecido.\n');
  }
}

testPasswordHash().catch(console.error);
