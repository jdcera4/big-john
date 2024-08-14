import React, { useEffect, useState } from 'react';
import Modal from 'react-modal';
import { getReporteHorasEmpleado } from '../../services/apiService';

Modal.setAppElement('#root');

interface EmployeeReportModalProps {
  isOpen: boolean;
  onClose: () => void;
  employeeId: number;
  startDate: string;
  endDate: string;
}

const EmployeeReportModal: React.FC<EmployeeReportModalProps> = ({ isOpen, onClose, employeeId, startDate, endDate }) => {
  const [hoursReport, setHoursReport] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    if (employeeId && startDate && endDate) {
      const fetchData = async () => {
        try {
          const reportData = await getReporteHorasEmpleado(employeeId, 'dia', startDate, endDate);
          setHoursReport(reportData);
        } catch (error) {
          console.error('Error fetching data:', error);
        } finally {
          setLoading(false);
        }
      };

      fetchData();
    }
  }, [employeeId, startDate, endDate]);

  if (loading) {
    return <div>Cargando...</div>;
  }

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onClose}
      contentLabel="Reporte de Horas del Empleado"
      className="modal"
      overlayClassName="overlay"
    >
      <h2 className="modal-header">Reporte de Horas</h2>
      <table className="modal-table">
        <thead>
          <tr>
            <th>Fecha</th>
            <th>Horas Trabajadas</th>
          </tr>
        </thead>
        <tbody>
          {hoursReport.length > 0 ? (
            hoursReport.map((report, index) => (
              <tr key={index}>
                <td>{report.fecha}</td>
                <td>{report.horas_trabajadas}</td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={2} className="no-data">No se encontraron registros.</td>
            </tr>
          )}
        </tbody>
      </table>
      <button
        onClick={onClose}
        className="modal-close-button"
      >
        Cerrar
      </button>
    </Modal>
  );
};

export default EmployeeReportModal;
