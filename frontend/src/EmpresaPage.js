import React, { useEffect, useState } from 'react';
import axios from 'axios';
import html2canvas from 'html2canvas';
import { useNavigate } from 'react-router-dom';
import './EmpresaPage.css';

function AdicionarProduto({ onAdd }) {
    const [nome, setNome] = useState('');
    const [preco, setPreco] = useState('');
    const [emEstoque, setEmEstoque] = useState(true);
  
    const handleSubmit = (e) => {
      e.preventDefault();
      axios.post('http://localhost:5000/api/produtos', { 
          nome, 
          preco_unitario: parseFloat(preco), 
          em_estoque: emEstoque 
        })
        .then(() => {
          onAdd();
          setNome('');
          setPreco('');
          setEmEstoque(true);
        })
        .catch(error => console.error('Erro ao adicionar produto:', error));
    };
  
    return (
      <form onSubmit={handleSubmit} className="form-adicionar">
        <h2>Adicionar Produto</h2>
        <input
          type="text"
          placeholder="Nome"
          value={nome}
          onChange={(e) => setNome(e.target.value)}
          required
        />
        <input
          type="number"
          placeholder="Preço Unitário"
          value={preco}
          onChange={(e) => setPreco(e.target.value)}
          required
        />
        <label>
          <input
            type="checkbox"
            checked={emEstoque}
            onChange={(e) => setEmEstoque(e.target.checked)}
          />
          Em Estoque
        </label>
        <button type="submit">Adicionar</button>
      </form>
    );
  }

  function EditarEstoque({ produto, onUpdate }) {
    const handleToggleEstoque = () => {
      axios
        .put(`http://localhost:5000/api/produtos/${produto.id_produto}/estoque`, { 
          em_estoque: !produto.em_estoque 
        })
        .then(() => {
          onUpdate(); // Atualiza a interface após sucesso
        })
        .catch(error => {
          console.error('Erro ao atualizar estoque:', error); // Log de erro para depuração
        });
    };
  
    return (
      <button 
        onClick={handleToggleEstoque} 
        className={`btn-estoque ${produto.em_estoque ? "" : "sem-estoque"}`} 
      >
        {produto.em_estoque ? "Em Estoque" : "Sem Estoque"} {}
      </button>
    );
  }
  

function EditarProduto({ produto, onUpdate }) {
  const [preco, setPreco] = useState(produto.preco_unitario);

  const handleSubmit = (e) => {
    e.preventDefault();
    axios.put(`http://localhost:5000/api/produtos/${produto.id_produto}`, { preco_unitario: parseFloat(preco) })
      .then(() => {
        onUpdate();
      })
      .catch(error => console.error('Erro ao editar produto:', error));
  };

  return (
    <form onSubmit={handleSubmit} className="form-editar">
      <div className="editar-container">
        <input
          type="number"
          value={preco}
          onChange={(e) => setPreco(e.target.value)}
          required
        />
      </div>
      <button type="submit">Salvar</button>
    </form>
  );
}

function ExcluirProduto({ id, onDelete }) {
  const handleDelete = () => {
    axios.delete(`http://localhost:5000/api/produtos/${id}`)
      .then(() => {
        onDelete();
      })
      .catch(error => console.error('Erro ao excluir produto:', error));
  };

  return <button onClick={handleDelete} className="btn-excluir">Excluir</button>;
}

function Carrinho({ carrinho }) {
  const [valorPago, setValorPago] = useState('');
  const valorTotal = carrinho.reduce((acc, item) => acc + item.valor_total, 0);
  const troco = parseFloat(valorPago || 0) - valorTotal;

  const finalizarCompra = () => {
    const numeroWhatsApp = '5588992055854';
    const mensagem = `Resumo da compra:
  ${carrinho.map((item) => {
    const precoUnitario = parseFloat(item.preco_unitario) || 0;
    const quantidade = parseFloat(item.quantidade) || 0;
    const valorTotal = parseFloat(item.valor_total) || 0;

    return `Produto: ${item.nome}, Preço Unitário: R$${precoUnitario.toFixed(2)}, Quantidade: ${quantidade}, Total: R$${valorTotal.toFixed(2)}`;
  }).join('\n')}
  Total Geral: R$${valorTotal.toFixed(2)}
  Valor Pago: R$${parseFloat(valorPago || 0).toFixed(2)}
  Troco: R$${troco >= 0 ? troco.toFixed(2) : 'Valor insuficiente'}`;

    const carrinhoElement = document.querySelector('.carrinho');

    html2canvas(carrinhoElement).then(() => {
      const linkWhatsApp = `https://wa.me/${numeroWhatsApp}?text=${encodeURIComponent(mensagem)}`;
      window.open(linkWhatsApp, '_blank');
    });
  };

  return (
    <div className="carrinho">
      <h2>Carrinho</h2>
      <table>
        <thead>
          <tr>
            <th>Produto</th>
            <th>Preço Unitário</th>
            <th>Quantidade</th>
            <th>Valor Total</th>
          </tr>
        </thead>
        <tbody>
          {carrinho.map((item, index) => (
            <tr key={index}>
              <td>{item.nome}</td>
              <td>R$ {(parseFloat(item.preco_unitario) || 0).toFixed(2)}</td>
              <td>{item.quantidade}</td>
              <td>R$ {(parseFloat(item.valor_total) || 0).toFixed(2)}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <h3>Valor Total: R$ {valorTotal.toFixed(2)}</h3>

      <div className="pagamento">
        <label>
          Valor Pago:
          <input
            type="number"
            value={valorPago}
            onChange={(e) => setValorPago(e.target.value)}
            placeholder="Digite o valor pago"
          />
        </label>
        <h4>Troco: R$ {troco >= 0 ? troco.toFixed(2) : 'Valor insuficiente'}</h4>
      </div>

      <button onClick={finalizarCompra} className="btn-finalizar">Finalizar Compra</button>
    </div>
  );
}

function EmpresaPage() {
    const [produtos, setProdutos] = useState([]);
    const [carrinho, setCarrinho] = useState([]);
    const [pesquisa, setPesquisa] = useState('');
    const navigate = useNavigate();
  
    const fetchProdutos = () => {
      axios.get('http://localhost:5000/api/produtos')
        .then(response => setProdutos(response.data))
        .catch(error => console.error('Erro ao carregar produtos:', error));
    };
  
    useEffect(() => {
      fetchProdutos();
    }, []);
  
    const adicionarAoCarrinho = (produto) => {
      if (!produto.em_estoque) {
        alert(`O produto "${produto.nome}" está fora de estoque.`);
        return;
      }
  
      const quantidade = parseFloat(prompt(`Digite a quantidade para o produto "${produto.nome}":`));
      if (quantidade && quantidade > 0) {
        const valor_total = quantidade * produto.preco_unitario;
        setCarrinho([...carrinho, { ...produto, quantidade, valor_total }]);
      }
    };
  
    const produtosFiltrados = produtos.filter(produto =>
      produto.nome.toLowerCase().includes(pesquisa.toLowerCase())
    );
  
    return (
      <div className="App">
        <h1>Área da Empresa - Produtos</h1>
        <button className="btn-voltar" onClick={() => navigate('/cliente')}>
          Voltar para área do cliente
        </button>        
        <AdicionarProduto onAdd={fetchProdutos} />
        <input
          type="text"
          placeholder="Pesquisar produtos"
          value={pesquisa}
          onChange={(e) => setPesquisa(e.target.value)}
          className="pesquisa-produtos"
        />
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Nome</th>
              <th>Preço Unitário</th>
              <th>Estoque</th>
              <th>Ações</th>
            </tr>
          </thead>
          <tbody>
            {produtosFiltrados.map(produto => (
              <tr key={produto.id_produto}>
                <td>{produto.id_produto}</td>
                <td>{produto.nome}</td>
                <td>R$ {(parseFloat(produto.preco_unitario) || 0).toFixed(2)}</td>
                <td>
                  <EditarEstoque produto={produto} onUpdate={fetchProdutos} />
                </td>
                <td>
                  <div className="editar-container">
                    <EditarProduto produto={produto} onUpdate={fetchProdutos} />
                  </div>
                  <div className="btn-group">
                    <ExcluirProduto id={produto.id_produto} onDelete={fetchProdutos} />
                    <button className="btn-carrinho2" onClick={() => adicionarAoCarrinho(produto)}>
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
  
        <Carrinho carrinho={carrinho} />
      </div>
    );
  }
  
  export default EmpresaPage;