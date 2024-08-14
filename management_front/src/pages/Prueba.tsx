import React, { useState } from 'react';
import Modal from 'react-modal';

Modal.setAppElement('#root');

const SimpleModal = () => {
  const [isOpen, setIsOpen] = useState(true);

  return (
    <div>
        <h1>Hola</h1>
      <Modal
        isOpen={isOpen}
        onRequestClose={() => setIsOpen(false)}
      >
        <h2>Simple Modal</h2>
        <button onClick={() => setIsOpen(false)}>Cerrar</button>
      </Modal>
    </div>
  );
};

export default SimpleModal;