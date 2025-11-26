const mysql = require('mysql2/promise');

async function createTestAppointments() {
  const connection = await mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'projeto_dev_web'
  });

  try {
    console.log('Conectado ao banco de dados MySQL');

    // Buscar médico e pacientes
    const [medicos] = await connection.query('SELECT id, nome FROM medicos LIMIT 1');
    const [pacientes] = await connection.query('SELECT id, nome FROM pacientes LIMIT 3');

    if (medicos.length === 0) {
      console.error('Nenhum médico encontrado no banco de dados!');
      return;
    }

    if (pacientes.length === 0) {
      console.error('Nenhum paciente encontrado no banco de dados!');
      return;
    }

    const medico = medicos[0];
    console.log(`Médico encontrado: ${medico.nome} (ID: ${medico.id})`);
    console.log(`Pacientes encontrados: ${pacientes.length}`);

    // Limpar consultas de teste anteriores (opcional)
    await connection.query('DELETE FROM consultas WHERE observacoes LIKE "%Consulta de teste%"');
    console.log('Consultas de teste anteriores removidas');

    // Criar consultas de teste
    const hoje = new Date();
    const consultas = [];

    // Consulta 1: Hoje, daqui a 2 horas - AGENDADA
    const consulta1 = new Date(hoje);
    consulta1.setHours(hoje.getHours() + 2, 0, 0, 0);
    consultas.push({
      paciente_id: pacientes[0].id,
      medico_id: medico.id,
      data_hora: consulta1.toISOString().slice(0, 19).replace('T', ' '),
      status: 'AGENDADA',
      observacoes: 'Consulta de teste - Checkup de rotina'
    });

    // Consulta 2: Amanhã - CONFIRMADA
    const consulta2 = new Date(hoje);
    consulta2.setDate(hoje.getDate() + 1);
    consulta2.setHours(14, 30, 0, 0);
    consultas.push({
      paciente_id: pacientes.length > 1 ? pacientes[1].id : pacientes[0].id,
      medico_id: medico.id,
      data_hora: consulta2.toISOString().slice(0, 19).replace('T', ' '),
      status: 'CONFIRMADA',
      observacoes: 'Consulta de teste - Retorno'
    });

    // Consulta 3: Daqui a 3 dias - PENDENTE
    const consulta3 = new Date(hoje);
    consulta3.setDate(hoje.getDate() + 3);
    consulta3.setHours(10, 0, 0, 0);
    consultas.push({
      paciente_id: pacientes.length > 2 ? pacientes[2].id : pacientes[0].id,
      medico_id: medico.id,
      data_hora: consulta3.toISOString().slice(0, 19).replace('T', ' '),
      status: 'PENDENTE',
      observacoes: 'Consulta de teste - Primeira consulta'
    });

    // Consulta 4: Ontem - CONCLUIDA
    const consulta4 = new Date(hoje);
    consulta4.setDate(hoje.getDate() - 1);
    consulta4.setHours(15, 0, 0, 0);
    consultas.push({
      paciente_id: pacientes[0].id,
      medico_id: medico.id,
      data_hora: consulta4.toISOString().slice(0, 19).replace('T', ' '),
      status: 'CONCLUIDA',
      observacoes: 'Consulta de teste - Consulta anterior'
    });

    // Consulta 5: Há 3 dias - CANCELADA
    const consulta5 = new Date(hoje);
    consulta5.setDate(hoje.getDate() - 3);
    consulta5.setHours(11, 30, 0, 0);
    consultas.push({
      paciente_id: pacientes.length > 1 ? pacientes[1].id : pacientes[0].id,
      medico_id: medico.id,
      data_hora: consulta5.toISOString().slice(0, 19).replace('T', ' '),
      status: 'CANCELADA',
      observacoes: 'Consulta de teste - Cancelada pelo paciente'
    });

    // Inserir consultas
    console.log('\nCriando consultas de teste...');
    for (const consulta of consultas) {
      const [result] = await connection.query(
        'INSERT INTO consultas (paciente_id, medico_id, data_hora, status, observacoes, created_at, updated_at) VALUES (?, ?, ?, ?, ?, NOW(), NOW())',
        [consulta.paciente_id, consulta.medico_id, consulta.data_hora, consulta.status, consulta.observacoes]
      );
      console.log(`✓ Consulta criada: ${consulta.status} - ${consulta.data_hora} (ID: ${result.insertId})`);
    }

    console.log('\n✅ Todas as consultas de teste foram criadas com sucesso!');
    console.log('\nResumo:');
    console.log('- 1 consulta AGENDADA (hoje)');
    console.log('- 1 consulta CONFIRMADA (amanhã)');
    console.log('- 1 consulta PENDENTE (daqui a 3 dias)');
    console.log('- 1 consulta CONCLUIDA (ontem)');
    console.log('- 1 consulta CANCELADA (há 3 dias)');
    console.log('\nPara testar:');
    console.log('1. Login como MÉDICO: veja suas consultas em /schedule');
    console.log('2. Login como PACIENTE: veja suas consultas em /appointments');
    console.log('3. Login como ADMIN: gerencie todas as consultas em /admin/consultas');

  } catch (error) {
    console.error('Erro ao criar consultas de teste:', error);
  } finally {
    await connection.end();
  }
}

createTestAppointments();
