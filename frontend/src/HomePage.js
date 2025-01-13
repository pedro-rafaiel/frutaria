import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import PasswordPopup from './PasswordPopup';
import './HomePage.css';

function HomePage() {
  const [popupVisible, setPopupVisible] = useState(false);
  const navigate = useNavigate();

  const openPopup = () => setPopupVisible(true);
  const closePopup = () => setPopupVisible(false);

  const handleAccess = () => {
    navigate('/empresa');
  };
  const handleClientClick = () => {
    navigate('/cliente');
  };
  return (
    <div className="home-container">
      <div className="home-content">
        <h1>Bem-vindo à Frutaria Oliveira!</h1>
        <p>Escolha uma opção para começar</p>
        <div className="home-buttons">
          <button className="btn" onClick={handleClientClick}>
            <span>Fazer Compras</span>
          </button>
          <button className="btn" onClick={openPopup}>Acessar Área da Empresa</button>
            <PasswordPopup
                isVisible={popupVisible}
                onClose={closePopup}
                onSuccess={handleAccess}
            />
        </div>
      </div>
    </div>
  );
}

export default HomePage;
