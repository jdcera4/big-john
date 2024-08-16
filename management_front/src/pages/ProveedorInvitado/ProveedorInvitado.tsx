import React, { useState, useEffect } from 'react';
import { getProveedorInvitado, createProveedorInvitado, updatedProveedorInvitado, deleteProveedorInvitado } from '../../services/apiService';
import { ProveedorInvitado } from '../../interfaces/ProveedorInvitado.interface';
import './ProveedorInvitados.css'
import ProveedorInvitadoFormModal from '../../components/ProveedorInvitadoFormModal/ProveedorInvitadoFormModal';
import ConfirmDeleteModal from '../../components/ConfirmDeleteModal/ConfirmDeleteModal';

const ProveedorInvitadoPage: React.FC = () => {
  const [proveedores, setProveedores] = useState<ProveedorInvitado[]>([]);
  const [filteredProveedores, setFilteredProveedores] = useState<ProveedorInvitado[]>([]);
  const [search, setSearch] = useState<string>('');
  const [filterType, setFilterType] = useState<string>('');
  const [modalIsOpen, setModalIsOpen] = useState<boolean>(false);
  const [editModalIsOpen, setEditModalIsOpen] = useState<boolean>(false);
  const [confirmDeleteIsOpen, setConfirmDeleteIsOpen] = useState<boolean>(false);
  const [selectedProveedor, setSelectedProveedor] = useState<ProveedorInvitado | null>(null);
  const [selectedIdForDelete, setSelectedIdForDelete] = useState<number | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getProveedorInvitado();
        setProveedores(data);
        setFilteredProveedores(data);
      } catch (error) {
        console.error('Error fetching proveedores:', error);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    setFilteredProveedores(
      proveedores.filter(proveedor =>
        (proveedor.nombre.toLowerCase().includes(search.toLowerCase()) ||
         proveedor.documento_identidad.includes(search)) &&
        (filterType === '' || proveedor.tipo_persona === filterType)
      )
    );
  }, [search, proveedores, filterType]);

  const handleOpenModal = () => setModalIsOpen(true);
  const handleCloseModal = () => setModalIsOpen(false);

  const handleOpenEditModal = (proveedor: ProveedorInvitado) => {
    setSelectedProveedor(proveedor);
    setEditModalIsOpen(true);
  };
  const handleCloseEditModal = () => {
    setSelectedProveedor(null);
    setEditModalIsOpen(false);
  };

  const handleOpenConfirmDeleteModal = (id: number) => {
    setSelectedIdForDelete(id);
    setConfirmDeleteIsOpen(true);
  };
  const handleCloseConfirmDeleteModal = () => {
    setSelectedIdForDelete(null);
    setConfirmDeleteIsOpen(false);
  };

  const handleCreateProveedor = async (data: any) => {
    try {
      await createProveedorInvitado(data);
      const updatedData = await getProveedorInvitado();
      setProveedores(updatedData);
      handleCloseModal();
    } catch (error) {
      console.error('Error creating proveedor:', error);
    }
  };

  const handleUpdateProveedor = async (data: any) => {
    if (selectedProveedor) {
      try {
        await updatedProveedorInvitado(data, selectedProveedor.id);
        const updatedData = await getProveedorInvitado();
        setProveedores(updatedData);
        handleCloseEditModal();
      } catch (error) {
        console.error('Error updating proveedor:', error);
      }
    }
  };

  const handleDeleteProveedor = async () => {
    if (selectedIdForDelete !== null) {
      try {
        await deleteProveedorInvitado(selectedIdForDelete);
        const updatedData = await getProveedorInvitado();
        setProveedores(updatedData);
        handleCloseConfirmDeleteModal();
      } catch (error) {
        console.error('Error deleting proveedor:', error);
      }
    }
  };

  return (
    <div>
      <input
        type="text"
        placeholder="Buscar por nombre o documento"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />
      <select onChange={(e) => setFilterType(e.target.value)} value={filterType}>
        <option value="">Tipo de Persona</option>
        <option value="Proveedor">Proveedor</option>
        <option value="Invitado">Invitado</option>
      </select>
      <button onClick={handleOpenModal}>Agregar Proveedor/Invitado</button>
      <table>
        <thead>
          <tr>
            <th>#</th>
            <th>Nombre</th>
            <th>Documento de Identidad</th>
            <th>Tipo de Persona</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {filteredProveedores.length > 0 ? (
            filteredProveedores.map((proveedor, index) => (
              <tr key={proveedor.id}>
                <td>{index + 1}</td>
                <td>{proveedor.nombre}</td>
                <td>{proveedor.documento_identidad}</td>
                <td>{proveedor.tipo_persona}</td>
                <td>
                  <button onClick={() => handleOpenEditModal(proveedor)}>Actualizar</button>
                  <button onClick={() => handleOpenConfirmDeleteModal(proveedor.id)}>Eliminar</button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={5}>No se encontraron proveedores/invitados.</td>
            </tr>
          )}
        </tbody>
      </table>

      {modalIsOpen && <ProveedorInvitadoFormModal isOpen={modalIsOpen} onClose={handleCloseModal} onSubmit={handleCreateProveedor} />}
      {editModalIsOpen && selectedProveedor && <ProveedorInvitadoFormModal isOpen={editModalIsOpen} onClose={handleCloseEditModal} onSubmit={handleUpdateProveedor} initialData={selectedProveedor} />}
      {confirmDeleteIsOpen && <ConfirmDeleteModal isOpen={confirmDeleteIsOpen} onClose={handleCloseConfirmDeleteModal} onConfirm={handleDeleteProveedor} />}
    </div>
  );
};

export default ProveedorInvitadoPage;
