import React from 'react';
import Modal from 'react-modal';

Modal.setAppElement('#root');

interface ConfirmDeleteModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

const ConfirmDeleteModal: React.FC<ConfirmDeleteModalProps> = ({ isOpen, onClose, onConfirm }) => {
  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onClose}
      contentLabel="Confirmación de Eliminación"
      className="modal"
      overlayClassName="overlay"
    >
      <h2>Confirmar Eliminación</h2>
      <p>¿Estás seguro de que deseas eliminar este proveedor/invitado?</p>
      <button onClick={onConfirm}>Eliminar</button>
      <button onClick={onClose}>Cancelar</button>
    </Modal>
  );
};

export default ConfirmDeleteModal;
