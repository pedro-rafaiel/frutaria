# 🍏 Frutaria API 🍊

Bem-vindo à **Frutaria API**! Este projeto foi criado para facilitar o gerenciamento de produtos de uma frutaria, utilizando **Node.js**, **Express** e **MySQL** no backend, e **React** no frontend. 🌿🍎

---

## 🛠️ Tecnologias utilizadas

### 🍃 Backend
- **Node.js**
- **Express.js**
- **MySQL (mysql2)**
- **CORS**

### 🍊 Frontend
- **React.js**
- **React Router**

---

## 🚀 Como executar o projeto

### 📌 Pré-requisitos
Antes de rodar o projeto, certifique-se de ter instalado:
- 📦 [Node.js](https://nodejs.org/)
- 🗄️ [MySQL](https://www.mysql.com/)

### 🍉 Configuração do banco de dados

1️⃣ Crie um banco de dados MySQL chamado **frutaria**.

2️⃣ Execute o seguinte comando SQL para criar a tabela de produtos:

```sql
CREATE TABLE produtos (
  id_produto INT AUTO_INCREMENT PRIMARY KEY,
  nome VARCHAR(100) NOT NULL,
  preco_unitario DECIMAL(10,2) NOT NULL,
  em_estoque BOOLEAN DEFAULT TRUE
);
```

---

## 🌿 Instruções para rodar o backend

1️⃣ Clone este repositório:
```sh
git clone https://github.com/seu-usuario/frutaria-api.git
cd frutaria-api
```

2️⃣ Instale as dependências:
```sh
npm install
```

3️⃣ Inicie o servidor:
```sh
node server.js
```

✅ O servidor estará rodando em **http://localhost:5000**.

---

## 🍍 Endpoints da API

| Método  | Rota                         | Descrição                                      |
|---------|------------------------------|------------------------------------------------|
| **GET** | `/api/produtos`              | Retorna todos os produtos                      |
| **GET** | `/api/produtos/estoque`      | Retorna os produtos disponíveis em estoque     |
| **POST**| `/api/produtos`              | Adiciona um novo produto                       |
| **PUT** | `/api/produtos/:id`          | Atualiza o preço de um produto                 |
| **PUT** | `/api/produtos/:id/estoque`  | Atualiza o status de estoque de um produto     |
| **DELETE** | `/api/produtos/:id`       | Remove um produto e reorganiza os IDs          |

---

## 🍇 Instruções para rodar o frontend

1️⃣ Navegue até a pasta do frontend:
```sh
cd frontend
```

2️⃣ Instale as dependências:
```sh
npm install
```

3️⃣ Inicie o frontend:
```sh
npm start
```

✅ O frontend estará rodando em **http://localhost:3000**.

---

## 📂 Estrutura do projeto

```
frutaria-api/
│── backend/
│   ├── server.js
│── frontend/
│   ├── src/
│   │   ├── App.js
│   │   ├── ClientPage.js
│   │   ├── EmpresaPage.js
│   │   ├── HomePage.js
│── README.md
```

---

## 👨‍💻 Autor

Desenvolvido por **Pedro Rafael Pereira de Oliveira**. 🚀

Se gostou do projeto, não esqueça de deixar uma ⭐ no repositório!

---

💡 Este projeto é um exemplo de integração entre **Node.js** e **React** para o gerenciamento de produtos de uma frutaria. Esperamos que seja útil para você! 🍏🍊🍇
