const mysql = require('mysql2/promise');

async function checkPatients() {
  let conn;
  try {
    // Tenta conectar com diferentes configurações
    const configs = [
      { host: 'localhost', user: 'root', password: 'root', database: 'consulta_db' },
      { host: 'localhost', user: 'root', password: '', database: 'consulta_db' },
      { host: 'localhost', user: 'root', password: 'password', database: 'consulta_db' },
    ];

    for (const config of configs) {
      try {
        console.log(`Tentando conectar com user=${config.user}, password=${config.password ? '***' : '(empty)'}...`);
        conn = await mysql.createConnection(config);
        console.log('✅ Conexão bem-sucedida!\n');
        break;
      } catch (e) {
        console.log(`❌ Falhou: ${e.message}`);
      }
    }

    if (!conn) {
      console.log('\n❌ Não foi possível conectar ao banco com nenhuma configuração.');
      return;
    }

    // Lista todos os usuários
    console.log('=== TODOS OS USUÁRIOS ===');
    const [allUsers] = await conn.query('SELECT id, nome, email, cargo, status FROM usuarios ORDER BY id');
    console.log(`Total: ${allUsers.length} usuários\n`);
    console.table(allUsers);

    // Conta por cargo
    console.log('\n=== DISTRIBUIÇÃO POR CARGO ===');
    const [cargos] = await conn.query('SELECT cargo, COUNT(*) as total FROM usuarios GROUP BY cargo');
    console.table(cargos);

    // Lista apenas pacientes
    console.log('\n=== PACIENTES (cargo = PACIENTE) ===');
    const [pacientes] = await conn.query('SELECT id, nome, email, cpf, telefone, status FROM usuarios WHERE cargo = ? ORDER BY id', ['PACIENTE']);
    console.log(`Total: ${pacientes.length} pacientes\n`);

    if (pacientes.length > 0) {
      console.table(pacientes);
    } else {
      console.log('⚠️ NENHUM PACIENTE ENCONTRADO!');
      console.log('\n💡 Para criar pacientes de teste, execute:');
      console.log('INSERT INTO usuarios (nome, email, senha, cargo, cpf, telefone, status) VALUES');
      console.log("('João Silva', 'joao@teste.com', '$2b$10$hash', 'PACIENTE', '12345678901', '11999999999', 1),");
      console.log("('Maria Santos', 'maria@teste.com', '$2b$10$hash', 'PACIENTE', '98765432100', '11988888888', 1);");
    }

    await conn.end();
    console.log('\n✅ Verificação concluída!');

  } catch (error) {
    console.error('❌ Erro:', error.message);
    if (conn) await conn.end();
  }
}

checkPatients();
