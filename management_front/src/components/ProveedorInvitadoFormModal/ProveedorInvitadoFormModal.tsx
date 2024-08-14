import React, { useState, useEffect } from 'react';
import Modal from 'react-modal';

Modal.setAppElement('#root');

interface ProveedorInvitadoFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: any) => void;
  initialData?: {
    nombre: string;
    documento_identidad: string;
    tipo_persona: string;
  };
}

const ProveedorInvitadoFormModal: React.FC<ProveedorInvitadoFormModalProps> = ({ isOpen, onClose, onSubmit, initialData }) => {
  const [nombre, setNombre] = useState('');
  const [documentoIdentidad, setDocumentoIdentidad] = useState('');
  const [tipoPersona, setTipoPersona] = useState('Proveedor');

  useEffect(() => {
    if (initialData) {
      setNombre(initialData.nombre);
      setDocumentoIdentidad(initialData.documento_identidad);
      setTipoPersona(initialData.tipo_persona);
    }
  }, [initialData]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({ nombre, documento_identidad: documentoIdentidad, tipo_persona: tipoPersona });
  };

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onClose}
      contentLabel="Formulario Proveedor/Invitado"
      className="modal"
      overlayClassName="overlay"
    >
      <h2>Formulario Proveedor/Invitado</h2>
      <form onSubmit={handleSubmit}>
        <label>
          Nombre:
          <input type="text" value={nombre} onChange={(e) => setNombre(e.target.value)} required />
        </label>
        <label>
          Documento de Identidad:
          <input type="text" value={documentoIdentidad} onChange={(e) => setDocumentoIdentidad(e.target.value)} required />
        </label>
        <label>
          Tipo de Persona:
          <select value={tipoPersona} onChange={(e) => setTipoPersona(e.target.value)}>
            <option value="Proveedor">Proveedor</option>
            <option value="Invitado">Invitado</option>
          </select>
        </label>
        <button type="submit">Guardar</button>
        <button type="button" onClick={onClose}>Cancelar</button>
      </form>
    </Modal>
  );
};

export default ProveedorInvitadoFormModal;
