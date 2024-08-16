import React, { useState, useEffect } from 'react';
import { getReporteHorasArea, getAreas } from '../../services/apiService';
import ReporteHorasAreaPopup from '../ReporteHorasAreaPopup/ReporteHorasAreaPopup';

const ReporteHorasArea: React.FC = () => {
  const [reportes, setReportes] = useState<any[]>([]);
  const [areas, setAreas] = useState<any[]>([]); // Cambio a `any[]` si estás esperando objetos complejos
  const [areaSeleccionada, setAreaSeleccionada] = useState<string>('');
  const [startDate, setStartDate] = useState<string>('');
  const [endDate, setEndDate] = useState<string>('');
  const [isPopupOpen, setIsPopupOpen] = useState<boolean>(false);

  // Función para obtener las áreas desde la API
  const fetchAreas = async () => {
    try {
      const data = await getAreas();
      setAreas(data);
    } catch (error) {
      console.error('Error fetching áreas:', error);
    }
  };

  // Llamar a la API para obtener las áreas cuando el componente se monta
  useEffect(() => {
    fetchAreas();
  }, []);

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
          {areas.map((area) => (
            <option key={area.id} value={area.nombre}>
              {area.nombre}
            </option>
          ))}
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
