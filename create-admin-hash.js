// Script para gerar hash bcrypt da senha de admin
// Execute com: node create-admin-hash.js

import bcrypt from 'bcrypt';

const adminData = {
  email: 'admin@clinica.com',
  senha: 'Admin@123',
  nome: 'Administrador do Sistema',
  cpf: '12345678900',
  perfil: 'ADMIN'
};

async function generateHash() {
  try {
    const saltRounds = 10;
    const hash = await bcrypt.hash(adminData.senha, saltRounds);

    console.log('\n========================================');
    console.log('CREDENCIAIS DE ADMIN PARA TESTE');
    console.log('========================================\n');
    console.log('Email:', adminData.email);
    console.log('Senha:', adminData.senha);
    console.log('\n========================================');
    console.log('SQL PARA INSERIR NO BANCO DE DADOS');
    console.log('========================================\n');

    const sql = `
INSERT INTO usuarios (nome, email, senha, perfil, cpf, ativo, criado_em, atualizado_em)
VALUES (
  '${adminData.nome}',
  '${adminData.email}',
  '${hash}',
  '${adminData.perfil}',
  '${adminData.cpf}',
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
