// src/PasswordPopup.js
import React, { useState } from 'react';
import './PasswordPopup.css';

function PasswordPopup({ isVisible, onClose, onSuccess }) {
  const [senha, setSenha] = useState('');

  const handleSubmit = () => {
    if (senha === '123') {
      onSuccess();
      onClose();
    } else {
      alert('Senha incorreta.');
    }
  };

  if (!isVisible) return null;

  return (
    <div className="password-popup">
      <div className="popup-contents">
        <h3>Digite a senha</h3>
        <input
          type="password"
          placeholder="Senha"
          value={senha}
          onChange={(e) => setSenha(e.target.value)}
        />
        <button onClick={handleSubmit}>Entrar</button>
        <button onClick={onClose}>Fechar</button>
      </div>
    </div>
  );
}

export default PasswordPopup;
