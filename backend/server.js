const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');

// Criando a instância do Express
const app = express();

// Usar o CORS para permitir requisições do frontend
app.use(cors());

// Middleware para processar JSON no body da requisição
app.use(express.json());

// Configurar a conexão com o banco de dados MySQL
const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'admin',
  database: 'frutaria'
});

// Conectar ao banco de dados
connection.connect((err) => {
  if (err) {
    console.error('Erro ao conectar ao banco de dados:', err.message);
    return;
  }
  console.log('Conectado ao banco de dados MySQL!');
});

// Rota para obter todos os produtos
app.get('/api/produtos', (req, res) => {
  const query = 'SELECT * FROM produtos';
  connection.query(query, (err, results) => {
    if (err) {
      console.error('Erro ao buscar produtos:', err.message);
      return res.status(500).send('Erro ao buscar produtos');
    }
    res.json(results);
  });
});

app.get('/api/produtos/estoque', (req, res) => {
  const query = 'SELECT * FROM produtos WHERE em_estoque = TRUE';
  connection.query(query, (err, results) => {
    if (err) {  
      console.error('Erro ao buscar produtos no estoque:', err.message);
      return res.status(500).send('Erro ao buscar produtos no estoque');
    }
    res.json(results);
  });
});

// Rota para adicionar um novo produto
app.post('/api/produtos', (req, res) => {
  const { nome, preco_unitario, em_estoque } = req.body;

  if (!nome || preco_unitario == null) {
    return res.status(400).send('Nome e preço são obrigatórios');
  }

  const estoque = em_estoque != null ? em_estoque : true; // Valor padrão é TRUE

  const query = 'INSERT INTO produtos (nome, preco_unitario, em_estoque) VALUES (?, ?, ?)';
  connection.query(query, [nome, preco_unitario, estoque], (err) => {
    if (err) {
      console.error('Erro ao adicionar produto:', err.message);
      return res.status(500).send('Erro ao adicionar produto');
    }
    res.status(201).send('Produto adicionado com sucesso');
  });
});

// Rota para editar o preço de um produto
app.put('/api/produtos/:id', (req, res) => {
  const { id } = req.params;
  const { preco_unitario } = req.body;

  if (preco_unitario == null) {
    return res.status(400).send('Preço é obrigatório');
  }

  const query = 'UPDATE produtos SET preco_unitario = ? WHERE id_produto = ?';
  connection.query(query, [preco_unitario, id], (err, results) => {
    if (err) {
      console.error('Erro ao atualizar produto:', err.message);
      return res.status(500).send('Erro ao atualizar produto');
    }
    if (results.affectedRows === 0) {
      return res.status(404).send('Produto não encontrado');
    }
    res.send('Produto atualizado com sucesso');
  });
});

app.delete('/api/produtos/:id', (req, res) => {
  const { id } = req.params;

  const deleteQuery = 'DELETE FROM produtos WHERE id_produto = ?';
  connection.query(deleteQuery, [id], (err, results) => {
    if (err) {
      console.error('Erro ao excluir produto:', err.message);
      return res.status(500).send('Erro ao excluir produto');
    }
    if (results.affectedRows === 0) {
      return res.status(404).send('Produto não encontrado');
    }

    // Reorganizar os IDs
    const rearrangeQuery = `
      SET @count = 0;
      UPDATE produtos SET id_produto = (@count := @count + 1) ORDER BY id_produto;
    `;

    // Separar as consultas
    connection.query('SET @count = 0', (setErr) => {
      if (setErr) {
        console.error('Erro ao inicializar contador:', setErr.message);
        return res.status(500).send('Erro ao inicializar contador');
      }

      connection.query(
        'UPDATE produtos SET id_produto = (@count := @count + 1) ORDER BY id_produto',
        (updateErr) => {
          if (updateErr) {
            console.error('Erro ao reorganizar IDs:', updateErr.message);
            return res.status(500).send('Erro ao reorganizar IDs');
          }

          // Resetar o AUTO_INCREMENT
          connection.query(
            'ALTER TABLE produtos AUTO_INCREMENT = 1',
            (resetErr) => {
              if (resetErr) {
                console.error('Erro ao resetar AUTO_INCREMENT:', resetErr.message);
                return res.status(500).send('Erro ao resetar AUTO_INCREMENT');
              }
              res.send('Produto excluído e IDs reorganizados com sucesso');
            }
          );
        }
      );
    });
  });
});
app.put('/api/produtos/:id/estoque', (req, res) => {
  const { id } = req.params;
  const { em_estoque } = req.body;

  if (em_estoque == null) {
    return res.status(400).send('O campo em_estoque é obrigatório');
  }

  const query = 'UPDATE produtos SET em_estoque = ? WHERE id_produto = ?';
  connection.query(query, [em_estoque, id], (err, results) => {
    if (err) {
      console.error('Erro ao atualizar estoque do produto:', err.message);
      return res.status(500).send('Erro ao atualizar estoque do produto');
    }
    if (results.affectedRows === 0) {
      return res.status(404).send('Produto não encontrado');
    }
    res.send('Estoque do produto atualizado com sucesso');
  });
});


// Iniciar o servidor
const PORT = 5000;
app.listen(PORT, () => {
  console.log(`Servidor backend rodando em http://localhost:${PORT}`);
});
