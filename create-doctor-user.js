// Script para gerar hash bcrypt da senha de médico
// Execute com: node create-doctor-user.js

import bcrypt from 'bcrypt';

const doctorData = {
  email: 'medico@clinica.com',
  senha: 'Medico@123',
  nome: 'Dr. João Silva',
  cpf: '98765432100',
  telefone: '(11) 98765-4321',
  perfil: 'MEDICO'
};

async function generateHash() {
  try {
    const saltRounds = 10;
    const hash = await bcrypt.hash(doctorData.senha, saltRounds);

    console.log('\n========================================');
    console.log('CREDENCIAIS DE MÉDICO PARA TESTE');
    console.log('========================================\n');
    console.log('Email:', doctorData.email);
    console.log('Senha:', doctorData.senha);
    console.log('Nome:', doctorData.nome);
    console.log('\n========================================');
    console.log('SQL PARA INSERIR NO BANCO DE DADOS');
    console.log('========================================\n');

    const sql = `
INSERT INTO usuarios (nome, email, senha, perfil, cpf, telefone, ativo, criado_em, atualizado_em)
VALUES (
  '${doctorData.nome}',
  '${doctorData.email}',
  '${hash}',
  '${doctorData.perfil}',
  '${doctorData.cpf}',
  '${doctorData.telefone}',
  true,
  NOW(),
  NOW()
)
ON CONFLICT (email) DO UPDATE SET
  senha = EXCLUDED.senha,
  atualizado_em = NOW();
`;

    console.log(sql);
    console.log('\n========================================\n');

    console.log('HASH bcrypt da senha (copie se precisar):');
    console.log(hash);
    console.log('\n');

  } catch (error) {
    console.error('Erro ao gerar hash:', error);
  }
}

generateHash();
