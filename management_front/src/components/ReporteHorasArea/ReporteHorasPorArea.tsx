import React, { useState } from 'react';
import { getReporteHorasArea } from '../../services/apiService';
import ReporteHorasAreaPopup from '../ReporteHorasAreaPopup/ReporteHorasAreaPopup';

const ReporteHorasArea: React.FC = () => {
  const [reportes, setReportes] = useState<any[]>([]);
  const [areaSeleccionada, setAreaSeleccionada] = useState<string>('');
  const [startDate, setStartDate] = useState<string>('');
  const [endDate, setEndDate] = useState<string>('');
  const [isPopupOpen, setIsPopupOpen] = useState<boolean>(false);

  const fetchReportes = async () => {
    try {
      if (areaSeleccionada && startDate && endDate) {
        const data = await getReporteHorasArea(areaSeleccionada, startDate, endDate);
        setReportes(data);
        setIsPopupOpen(true);
      } else {
        alert('Por favor, selecciona todos los filtros.');
      }
    } catch (error) {
      console.error('Error fetching reportes de horas por área:', error);
    }
  };

  return (
    <div className="reporte-container">
      <h2>Reporte de Horas por Área</h2>
      <div className="reporte-filters">
        <label>Área:</label>
        <select value={areaSeleccionada} onChange={(e) => setAreaSeleccionada(e.target.value)}>
          <option value="">Seleccione un área</option>
          <option value="Recursos Humanos">Recursos Humanos</option>
          <option value="Tecnologia">Tecnología</option>
          <option value="Finanzas">Finanzas</option>
          <option value="Marketing">Marketing</option>
          <option value="Ventas">Ventas</option>
          <option value="Administracion">Administración</option>
          <option value="Atencion al Cliente">Atención al Cliente</option>
          <option value="Legal">Legal</option>
          <option value="Operaciones">Operaciones</option>
          <option value="Compras">Compras</option>
          <option value="Produccion">Producción</option>
          <option value="Investigacion y Desarrollo">Investigación y Desarrollo</option>
          <option value="Calidad">Calidad</option>
          <option value="Logistica">Logística</option>
          <option value="Desarrollo de Negocios">Desarrollo de Negocios</option>
        </select>

        <label>Fecha de Inicio:</label>
        <input
          type="date"
          value={startDate}
          onChange={(e) => setStartDate(e.target.value)}
        />

        <label>Fecha de Fin:</label>
        <input
          type="date"
          value={endDate}
          onChange={(e) => setEndDate(e.target.value)}
        />

        <button onClick={fetchReportes} className="btn btn-primary">Generar Reporte</button>
      </div>
      <ReporteHorasAreaPopup
        isOpen={isPopupOpen}
        onClose={() => setIsPopupOpen(false)}
        reportes={reportes}
      />
    </div>
  );
};

export default ReporteHorasArea;
