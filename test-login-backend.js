// Script para testar login no backend e ver a resposta detalhada
// Execute com: node test-login-backend.js

async function testLogin() {
  const API_URL = 'http://localhost:3001/api/auth/login';

  const credentials = {
    email: 'medico@clinica.com',
    senha: 'Medico@123'
  };

  console.log('\n========================================');
  console.log('TESTE DE LOGIN NO BACKEND');
  console.log('========================================\n');

  console.log('URL:', API_URL);
  console.log('Credenciais:', credentials);
  console.log('\nEnviando requisição...\n');

  try {
    const response = await fetch(API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(credentials)
    });

    console.log('========================================');
    console.log('RESPOSTA DO SERVIDOR');
    console.log('========================================\n');

    console.log('Status:', response.status, response.statusText);
    console.log('\nHeaders:');
    response.headers.forEach((value, key) => {
      console.log(`  ${key}: ${value}`);
    });

    const data = await response.json();

    console.log('\nBody da Resposta:');
    console.log(JSON.stringify(data, null, 2));

    console.log('\n========================================');
    console.log('ANÁLISE');
    console.log('========================================\n');

    if (response.status === 401) {
      console.log('❌ ERRO 401 - Unauthorized');
      console.log('\nPossíveis causas:');
      console.log('1. Usuário não existe no banco de dados');
      console.log('2. Senha incorreta');
      console.log('3. Usuário existe mas está inativo');
      console.log('4. Campo "perfil" está diferente de "MEDICO"');

      if (data.message) {
        console.log('\nMensagem do servidor:', data.message);

        if (data.message.includes('Email ou senha')) {
          console.log('\n⚠ Execute este SQL no PostgreSQL:');
          console.log('\nSELECT id, nome, email, perfil, ativo, LENGTH(senha) as tamanho_senha');
          console.log('FROM usuarios');
          console.log("WHERE email = 'medico@clinica.com';");
          console.log('\nSe não retornar nada, o usuário não existe!');
        }
      }
    } else if (response.status === 200 || response.status === 201) {
      console.log('✅ LOGIN REALIZADO COM SUCESSO!');

      if (data.usuario) {
        console.log('\nDados do usuário:');
        console.log('  Nome:', data.usuario.nome);
        console.log('  Email:', data.usuario.email);
        console.log('  Perfil:', data.usuario.perfil);
      }

      if (data.token) {
        console.log('\n✓ Token JWT recebido');
        console.log('  Token:', data.token.substring(0, 50) + '...');
      }
    } else {
      console.log('⚠ Status inesperado:', response.status);
      console.log('Resposta:', data);
    }

    console.log('\n========================================\n');

  } catch (error) {
    console.log('\n========================================');
    console.log('ERRO NA REQUISIÇÃO');
    console.log('========================================\n');

    console.error('Erro:', error.message);

    if (error.message.includes('fetch')) {
      console.log('\n⚠ O backend não está respondendo!');
      console.log('Verifique se o servidor está rodando em http://localhost:3001');
    }

    console.log('\nStack trace completo:');
    console.error(error);
    console.log('\n========================================\n');
  }
}

// Teste com diferentes variações de senha
async function testMultiplePasswords() {
  console.log('\n========================================');
  console.log('TESTANDO DIFERENTES VARIAÇÕES DE SENHA');
  console.log('========================================\n');

  const senhas = [
    'Medico@123',
    'medico@123',
    'MEDICO@123',
    'Medico123',
    'Dr.João123'
  ];

  for (const senha of senhas) {
    console.log(`Testando senha: "${senha}"`);

    try {
      const response = await fetch('http://localhost:3001/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: 'medico@clinica.com',
          senha: senha
        })
      });

      if (response.ok) {
        console.log(`  ✅ FUNCIONOU!`);
        const data = await response.json();
        console.log(`  Resposta:`, data);
        break;
      } else {
        console.log(`  ❌ Falhou (${response.status})`);
      }
    } catch (error) {
      console.log(`  ❌ Erro: ${error.message}`);
    }
  }

  console.log('\n========================================\n');
}

// Executa os testes
console.log('Iniciando testes...\n');
testLogin()
  .then(() => testMultiplePasswords())
  .catch(console.error);
