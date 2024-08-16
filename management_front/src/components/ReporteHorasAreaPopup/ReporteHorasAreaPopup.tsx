import React from 'react';
import Modal from 'react-modal';
import './ReporteHorasAreaPopup.css';

interface ReporteHorasAreaPopupProps {
  isOpen: boolean;
  onClose: () => void;
  reportes: any[];
}

const ReporteHorasAreaPopup: React.FC<ReporteHorasAreaPopupProps> = ({ isOpen, onClose, reportes }) => {
  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onClose}
      contentLabel="Reporte de Horas por Área"
      className="reporte-horas-area-modal"
      overlayClassName="reporte-horas-area-modal-overlay"
    >
      <h2>Reporte de Horas por Área</h2>
      {reportes.length > 0 ? (
        <table>
          <thead>
            <tr>
              <th>Área</th>
              <th>Horas Trabajadas</th>
            </tr>
          </thead>
          <tbody>
            {reportes.map((reporte, index) => (
              <tr key={index}>
                <td>{reporte.area}</td>
                <td>{reporte.horas_trabajadas}</td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p>No registra información</p>
      )}
      <div className="modal-close-button">
        <button onClick={onClose} className="btn btn-secondary">Cerrar</button>
      </div>
    </Modal>
  );
};

export default ReporteHorasAreaPopup;
