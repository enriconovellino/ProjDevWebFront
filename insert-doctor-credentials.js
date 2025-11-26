#!/usr/bin/env node
/**
 * Script para criar credenciais de médico no banco de dados
 *
 * Este script cria ou atualiza um usuário médico com as seguintes credenciais:
 * Email: medico@clinica.com
 * Senha: Medico@123
 *
 * Execute: node insert-doctor-credentials.js
 */

import pg from 'pg';
import mysql from 'mysql2/promise';
import bcrypt from 'bcrypt';
import readline from 'readline';

const { Pool: PgPool } = pg;

// Credenciais do médico
const DOCTOR_CREDENTIALS = {
  nome: 'Dr. João Silva',
  email: 'medico@clinica.com',
  senha: 'Medico@123',
  perfil: 'MEDICO',
  cpf: '98765432100',
  telefone: '(11) 98765-4321',
  ativo: true
};

// Função para fazer perguntas ao usuário
function question(prompt) {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  });

  return new Promise(resolve => {
    rl.question(prompt, answer => {
      rl.close();
      resolve(answer);
    });
  });
}

// Função para gerar hash bcrypt
async function generateHash(password) {
  const saltRounds = 10;
  return await bcrypt.hash(password, saltRounds);
}

// Função para inserir no PostgreSQL
async function insertPostgres(config) {
  const pool = new PgPool(config);

  try {
    console.log('\n🔄 Conectando ao PostgreSQL...');

    const hash = await generateHash(DOCTOR_CREDENTIALS.senha);

    // Primeiro, verifica se o usuário já existe
    const checkQuery = `
      SELECT id, nome, email, perfil, ativo
      FROM usuarios
      WHERE email = $1
    `;

    const checkResult = await pool.query(checkQuery, [DOCTOR_CREDENTIALS.email]);

    if (checkResult.rows.length > 0) {
      console.log('\n⚠️  Usuário já existe! Atualizando...');

      const updateQuery = `
        UPDATE usuarios
        SET
          nome = $1,
          senha = $2,
          perfil = $3,
          cpf = $4,
          telefone = $5,
          ativo = $6,
          atualizado_em = NOW()
        WHERE email = $7
        RETURNING id, nome, email, perfil, ativo
      `;

      const updateResult = await pool.query(updateQuery, [
        DOCTOR_CREDENTIALS.nome,
        hash,
        DOCTOR_CREDENTIALS.perfil,
        DOCTOR_CREDENTIALS.cpf,
        DOCTOR_CREDENTIALS.telefone,
        DOCTOR_CREDENTIALS.ativo,
        DOCTOR_CREDENTIALS.email
      ]);

      console.log('\n✅ Usuário atualizado com sucesso!');
      console.log(updateResult.rows[0]);

    } else {
      console.log('\n🆕 Criando novo usuário...');

      const insertQuery = `
        INSERT INTO usuarios (nome, email, senha, perfil, cpf, telefone, ativo, criado_em, atualizado_em)
        VALUES ($1, $2, $3, $4, $5, $6, $7, NOW(), NOW())
        RETURNING id, nome, email, perfil, ativo
      `;

      const insertResult = await pool.query(insertQuery, [
        DOCTOR_CREDENTIALS.nome,
        DOCTOR_CREDENTIALS.email,
        hash,
        DOCTOR_CREDENTIALS.perfil,
        DOCTOR_CREDENTIALS.cpf,
        DOCTOR_CREDENTIALS.telefone,
        DOCTOR_CREDENTIALS.ativo
      ]);

      console.log('\n✅ Usuário criado com sucesso!');
      console.log(insertResult.rows[0]);
    }

    // Verifica o usuário criado
    console.log('\n🔍 Verificando usuário no banco...');
    const verifyResult = await pool.query(
      `SELECT id, nome, email, perfil, ativo,
              LENGTH(senha) as tamanho_hash,
              SUBSTRING(senha, 1, 10) as inicio_hash
       FROM usuarios
       WHERE email = $1`,
      [DOCTOR_CREDENTIALS.email]
    );

    console.log('\n📋 Dados do usuário:');
    console.table(verifyResult.rows);

    console.log('\n✅ CREDENCIAIS DE ACESSO:');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('📧 Email:  ', DOCTOR_CREDENTIALS.email);
    console.log('🔑 Senha:  ', DOCTOR_CREDENTIALS.senha);
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

  } catch (error) {
    console.error('\n❌ Erro ao inserir no PostgreSQL:', error.message);
    throw error;
  } finally {
    await pool.end();
  }
}

// Função para inserir no MySQL
async function insertMySQL(config) {
  let connection;

  try {
    console.log('\n🔄 Conectando ao MySQL...');

    connection = await mysql.createConnection(config);

    const hash = await generateHash(DOCTOR_CREDENTIALS.senha);

    // Primeiro, verifica se o usuário já existe
    const [checkRows] = await connection.execute(
      'SELECT id, nome, email, perfil, ativo FROM usuarios WHERE email = ?',
      [DOCTOR_CREDENTIALS.email]
    );

    if (checkRows.length > 0) {
      console.log('\n⚠️  Usuário já existe! Atualizando...');

      await connection.execute(
        `UPDATE usuarios
         SET nome = ?, senha = ?, perfil = ?, cpf = ?, telefone = ?, ativo = ?, atualizado_em = NOW()
         WHERE email = ?`,
        [
          DOCTOR_CREDENTIALS.nome,
          hash,
          DOCTOR_CREDENTIALS.perfil,
          DOCTOR_CREDENTIALS.cpf,
          DOCTOR_CREDENTIALS.telefone,
          DOCTOR_CREDENTIALS.ativo ? 1 : 0,
          DOCTOR_CREDENTIALS.email
        ]
      );

      console.log('\n✅ Usuário atualizado com sucesso!');

    } else {
      console.log('\n🆕 Criando novo usuário...');

      await connection.execute(
        `INSERT INTO usuarios (nome, email, senha, perfil, cpf, telefone, ativo, criado_em, atualizado_em)
         VALUES (?, ?, ?, ?, ?, ?, ?, NOW(), NOW())`,
        [
          DOCTOR_CREDENTIALS.nome,
          DOCTOR_CREDENTIALS.email,
          hash,
          DOCTOR_CREDENTIALS.perfil,
          DOCTOR_CREDENTIALS.cpf,
          DOCTOR_CREDENTIALS.telefone,
          DOCTOR_CREDENTIALS.ativo ? 1 : 0
        ]
      );

      console.log('\n✅ Usuário criado com sucesso!');
    }

    // Verifica o usuário criado
    console.log('\n🔍 Verificando usuário no banco...');
    const [verifyRows] = await connection.execute(
      `SELECT id, nome, email, perfil, ativo,
              LENGTH(senha) as tamanho_hash,
              SUBSTRING(senha, 1, 10) as inicio_hash
       FROM usuarios
       WHERE email = ?`,
      [DOCTOR_CREDENTIALS.email]
    );

    console.log('\n📋 Dados do usuário:');
    console.table(verifyRows);

    console.log('\n✅ CREDENCIAIS DE ACESSO:');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('📧 Email:  ', DOCTOR_CREDENTIALS.email);
    console.log('🔑 Senha:  ', DOCTOR_CREDENTIALS.senha);
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

  } catch (error) {
    console.error('\n❌ Erro ao inserir no MySQL:', error.message);
    throw error;
  } finally {
    if (connection) {
      await connection.end();
    }
  }
}

// Função principal
async function main() {
  console.log('\n╔═══════════════════════════════════════════════════════╗');
  console.log('║   CRIAR CREDENCIAIS DE MÉDICO NO BANCO DE DADOS      ║');
  console.log('╚═══════════════════════════════════════════════════════╝\n');

  // Pergunta qual banco de dados usar
  console.log('Qual banco de dados você está usando?');
  console.log('1 - PostgreSQL');
  console.log('2 - MySQL\n');

  const dbChoice = await question('Digite 1 ou 2: ');

  if (dbChoice === '1') {
    // Configuração PostgreSQL
    console.log('\n📝 Configure a conexão PostgreSQL:\n');

    const host = await question('Host (padrão: localhost): ') || 'localhost';
    const port = await question('Porta (padrão: 5432): ') || '5432';
    const database = await question('Nome do banco: ');
    const user = await question('Usuário: ');
    const password = await question('Senha: ');

    const config = {
      host,
      port: parseInt(port),
      database,
      user,
      password
    };

    await insertPostgres(config);

  } else if (dbChoice === '2') {
    // Configuração MySQL
    console.log('\n📝 Configure a conexão MySQL:\n');

    const host = await question('Host (padrão: localhost): ') || 'localhost';
    const port = await question('Porta (padrão: 3306): ') || '3306';
    const database = await question('Nome do banco: ');
    const user = await question('Usuário: ');
    const password = await question('Senha: ');

    const config = {
      host,
      port: parseInt(port),
      database,
      user,
      password
    };

    await insertMySQL(config);

  } else {
    console.log('\n❌ Opção inválida!');
    process.exit(1);
  }

  console.log('\n✅ Processo concluído! Agora você pode fazer login na aplicação.\n');
}

// Executa o script
main().catch(error => {
  console.error('\n💥 Erro fatal:', error);
  process.exit(1);
});
