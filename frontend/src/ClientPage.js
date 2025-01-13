import React, { useEffect, useState } from 'react';
import axios from 'axios';
import cartIcon2 from './img/carinho-vendas1.svg';
import cartIcon3 from './img/carinho-vendas2.svg';
import dinheiroIcon from './img/dinheiro.svg';
import cartaoIcon from './img/cartao.svg';
import pixIcon from './img/pix.svg';
import { useNavigate } from 'react-router-dom';
import PasswordPopup from './PasswordPopup';
import './ClientPage.css';

function CarrinhoPopup({ carrinho, isVisible, onClose, setCarrinho }) {
    const [valorPago, setValorPago] = useState('');
    const [formaPagamento, setFormaPagamento] = useState('Dinheiro');
    const [tipoCartao, setTipoCartao] = useState('Débito');
  
    const valorBruto = carrinho.reduce((acc, item) => acc + item.valor_total, 0);
    const desconto = formaPagamento === 'Dinheiro' || formaPagamento === 'Pix' ? 0.08 * valorBruto : 0;
    const taxaCartao =
      formaPagamento === 'Cartão' && tipoCartao === 'Crédito' ? 0.05 * valorBruto :
      formaPagamento === 'Cartão' && tipoCartao === 'Débito' ? 0.03 * valorBruto : 0;
  
    const valorTotal = valorBruto - desconto + taxaCartao;
    const troco = parseFloat(valorPago || 0) - valorTotal;

    const removerItem = (index) => {
        const novoCarrinho = [...carrinho];
        novoCarrinho.splice(index, 1);
        setCarrinho(novoCarrinho);
    };

    const alterarQuantidade = (index, novaQuantidade) => {
        if (novaQuantidade <= 0) return;
        const novoCarrinho = [...carrinho];
        const item = novoCarrinho[index];
        item.quantidade = novaQuantidade;
        item.valor_total = novaQuantidade * item.preco_unitario;
        setCarrinho(novoCarrinho);
    };

    const limparCarrinho = () => {
        setCarrinho([]);
    };

    const finalizarCompra = () => {
        const numeroWhatsApp = '5588992055854';
    
        const resumoCarrinho = carrinho.map((item) => {
            const precoUnitario = parseFloat(item.preco_unitario) || 0;
            const quantidade = parseFloat(item.quantidade) || 0;
            const valorTotal = parseFloat(item.valor_total) || 0;
            return `Produto: ${item.nome}\nPreço Unitário: R$${precoUnitario.toFixed(2)}\nQuantidade: ${quantidade}\nValor Total: R$${valorTotal.toFixed(2)}\n`;
        }).join('\n');
    
        const detalhesPagamento = `
            Forma de Pagamento: ${formaPagamento}${formaPagamento === 'Cartão' ? ` (${tipoCartao})` : ''}
            Desconto: R$${desconto.toFixed(2)}
            Taxa do Cartão: R$${taxaCartao.toFixed(2)}
            Valor Bruto: R$${valorBruto.toFixed(2)}
            Valor Total (com ajustes): R$${valorTotal.toFixed(2)}
            Valor Pago: R$${parseFloat(valorPago || 0).toFixed(2)}
            Troco: R$${troco >= 0 ? troco.toFixed(2) : 'Valor insuficiente ou não necesário'}
        `;
    
        const mensagem = `Resumo da Compra:\n\n${resumoCarrinho}\n${detalhesPagamento}`;
    
        const linkWhatsApp = `https://wa.me/${numeroWhatsApp}?text=${encodeURIComponent(mensagem)}`;
        window.open(linkWhatsApp, '_blank');
    };
    
      

    if (!isVisible) return null;

    return (
      <div className="popup-overlay">
        <div className="popup-content">
          <button className="close-popup" onClick={onClose}>X</button>
          <h2>Carrinho</h2>
          <table>
            <thead>
              <tr>
                <th>Produto</th>
                <th>Preço Unitário</th>
                <th>Quantidade</th>
                <th>Valor Total</th>
                <th>Ações</th>
              </tr>
            </thead>
            <tbody>
              {carrinho.map((item, index) => (
                <tr key={index}>
                  <td>{item.nome}</td>
                  <td>R$ {(parseFloat(item.preco_unitario) || 0).toFixed(2)}</td>
                  <td>
                    <input
                      type="number"
                      min="1"
                      value={item.quantidade}
                      onChange={(e) => alterarQuantidade(index, parseInt(e.target.value))}
                    />
                  </td>
                  <td>R$ {(parseFloat(item.valor_total) || 0).toFixed(2)}</td>
                  <td>
                    <button onClick={() => removerItem(index)}>Remover</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <h3>Total Bruto: R$ {valorBruto.toFixed(2)}</h3>
          <div className="pagamento">
            <label className="pagamento-label">Forma de Pagamento:</label>
            <div className="pagamento-opcoes">
                <label className="pagamento-opcao">
                <img src={dinheiroIcon} alt="Dinheiro" className="icon-pagamento" />
                <input
                    type="radio"
                    value="Dinheiro"
                    checked={formaPagamento === 'Dinheiro'}
                    onChange={() => setFormaPagamento('Dinheiro')}
                />
                <span>Dinheiro</span>
                </label>
                <label className="pagamento-opcao">
                <img src={cartaoIcon} alt="Cartão" className="icon-pagamento" />
                <input
                    type="radio"
                    value="Cartão"
                    checked={formaPagamento === 'Cartão'}
                    onChange={() => setFormaPagamento('Cartão')}
                />
                <span>Cartão</span>
                </label>
                <label className="pagamento-opcao">
                <img src={pixIcon} alt="Pix" className="icon-pagamento" />
                <input
                    type="radio"
                    value="Pix"
                    checked={formaPagamento === 'Pix'}
                    onChange={() => setFormaPagamento('Pix')}
                />
                <span>Pix</span>
                </label>
            </div>

            {formaPagamento === 'Cartão' && (
                <div className="cartao-opcoes">
                <label>
                    <input
                    type="radio"
                    value="Débito"
                    checked={tipoCartao === 'Débito'}
                    onChange={() => setTipoCartao('Débito')}
                    />
                    <span>Débito</span>
                </label>
                <label>
                    <input
                    type="radio"
                    value="Crédito"
                    checked={tipoCartao === 'Crédito'}
                    onChange={() => setTipoCartao('Crédito')}
                    />
                    <span>Crédito</span>
                </label>
                </div>
            )}

            {formaPagamento === 'Dinheiro' && (
                <div className="dinheiro-opcoes">
                <label>
                    Valor Pago:
                    <input
                    type="number"
                    value={valorPago}
                    onChange={(e) => setValorPago(e.target.value)}
                    placeholder="Digite o valor pago"
                    />
                </label>
                <h4 className="troco">Troco: R$ {troco >= 0 ? troco.toFixed(2) : 'Valor insuficiente'}</h4>
                </div>
            )}
            </div>

          <h3>Desconto: R$ {desconto.toFixed(2)}</h3>
          <h3>Taxa do Cartão: R$ {taxaCartao.toFixed(2)}</h3>
          <h3>Total Final: R$ {valorTotal.toFixed(2)}</h3>
          <button onClick={limparCarrinho} className="btn-limpar">Limpar Carrinho</button>
          <button onClick={finalizarCompra} className="btn-finalizar">Finalizar Compra</button>
        </div>
      </div>
    );
}
    
function ClientPage() {
  const [produtos, setProdutos] = useState([]);
  const [carrinho, setCarrinho] = useState([]);
  const [pesquisa, setPesquisa] = useState('');
  const [isCarrinhoVisible, setCarrinhoVisible] = useState(false);
  const [popupVisible, setPopupVisible] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    fetchProdutos();
  }, []);

  const fetchProdutos = () => {
    axios.get('http://localhost:5000/api/produtos')
      .then(response => setProdutos(response.data))
      .catch(error => console.error('Erro ao carregar produtos:', error));
  };

  const adicionarAoCarrinho = (produto) => {
    if (!produto.em_estoque) {
      alert(`O produto "${produto.nome}" está sem estoque no momento.`);
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

  const openPopup = () => setPopupVisible(true);
  const closePopup = () => setPopupVisible(false);

  const handleAccess = () => {
    navigate('/empresa');
    closePopup();
  };

  return (
    <div className="App">
      <h1>Produtos da Frutaria</h1>
      <div className='empresa-access'>
      <button className="popup-button-out custom-button" onClick={openPopup}>Acessar Área da Empresa</button>
      <PasswordPopup
        isVisible={popupVisible}
        onClose={closePopup}
        onSuccess={handleAccess}
      />
      </div>  
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
            <th>Ações</th>
          </tr>
        </thead>
        <tbody>
            {produtosFiltrados.map((produto) => (
                <tr key={produto.id_produto}>
                <td>{produto.id_produto}</td>
                <td>{produto.nome}</td>
                <td>R$ {(parseFloat(produto.preco_unitario) || 0).toFixed(2)}</td>
                <td>
                    {produto.em_estoque ? (
                    <button className="btn-carrinho" onClick={() => adicionarAoCarrinho(produto)}>
                    </button>
                    ) : (
                    <button className="btn-carrinho disabled" disabled>
                    </button>
                    )}
                </td>
                </tr>
            ))}
        </tbody>
      </table>

      <button className="floating-cart" onClick={() => setCarrinhoVisible(true)}>
            <img src={carrinho.length > 0 ? cartIcon3 : cartIcon2} alt="Carrinho" />
        {carrinho.length > 0 && <span>{carrinho.length}</span>}
      </button> 

      <CarrinhoPopup
        carrinho={carrinho}
        isVisible={isCarrinhoVisible}
        onClose={() => setCarrinhoVisible(false)}
        setCarrinho={setCarrinho}
      />
    </div>
  );
}

export default ClientPage;
