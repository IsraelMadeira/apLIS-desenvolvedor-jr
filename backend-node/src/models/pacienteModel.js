import pool from "../config/database.js";

const selectFields = `
  SELECT
    id,
    nome,
    DATE_FORMAT(data_nascimento, '%Y-%m-%d') AS data_nascimento,
    carteirinha,
    cpf,
    created_at,
    updated_at
  FROM pacientes
`;

const toEntity = (row) => ({
  id: row.id,
  nome: row.nome,
  dataNascimento: row.data_nascimento,
  carteirinha: row.carteirinha,
  cpf: row.cpf,
  createdAt: row.created_at,
  updatedAt: row.updated_at
});

const findAll = async () => {
  const [rows] = await pool.execute(`${selectFields} ORDER BY id DESC`);
  return rows.map(toEntity);
};

const findById = async (id) => {
  const [rows] = await pool.execute(`${selectFields} WHERE id = :id`, { id });

  if (!rows.length) {
    return null;
  }

  return toEntity(rows[0]);
};

const create = async ({ nome, dataNascimento, carteirinha, cpf }) => {
  const [result] = await pool.execute(
    `
      INSERT INTO pacientes (nome, data_nascimento, carteirinha, cpf)
      VALUES (:nome, :dataNascimento, :carteirinha, :cpf)
    `,
    { nome, dataNascimento, carteirinha, cpf }
  );

  return findById(result.insertId);
};

const update = async (id, { nome, dataNascimento, carteirinha, cpf }) => {
  const [result] = await pool.execute(
    `
      UPDATE pacientes
      SET nome = :nome,
          data_nascimento = :dataNascimento,
          carteirinha = :carteirinha,
          cpf = :cpf
      WHERE id = :id
    `,
    { id, nome, dataNascimento, carteirinha, cpf }
  );

  if (result.affectedRows === 0) {
    return null;
  }

  return findById(id);
};

const remove = async (id) => {
  const [result] = await pool.execute("DELETE FROM pacientes WHERE id = :id", { id });
  return result.affectedRows > 0;
};

const PacienteModel = {
  findAll,
  findById,
  create,
  update,
  remove
};

export default PacienteModel;
