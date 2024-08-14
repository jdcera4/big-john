import React, { useState, useEffect } from 'react';
import { getReporteHorasArea } from '../../services/apiService';

const ReporteHorasArea: React.FC = () => {
  const [reportes, setReportes] = useState<any[]>([]);
  const [areaSeleccionada, setAreaSeleccionada] = useState<string>('');
  const [startDate, setStartDate] = useState<string>('');
  const [endDate, setEndDate] = useState<string>('');

  const fetchReportes = async () => {
    try {
      if (areaSeleccionada && startDate && endDate) {
        console.log(areaSeleccionada)
        console.log(startDate)
        console.log(endDate)
        const data = await getReporteHorasArea(areaSeleccionada, startDate, endDate);
        setReportes(data);
      } else {
        alert('Por favor, selecciona todos los filtros.');
      }
    } catch (error) {
      console.error('Error fetching reportes de horas por área:', error);
    }
  };

  useEffect(() => {
    if (startDate && endDate && areaSeleccionada) {
      fetchReportes();
    }
  }, [startDate, endDate, areaSeleccionada]);

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

      <table>
        <thead>
          <tr>
            <th>Área</th>
            <th>Horas Trabajadas</th>
          </tr>
        </thead>
        <tbody>
          {reportes.map((reporte) => (
            <tr key={reporte.area}>
              <td>{reporte.area}</td>
              <td>{reporte.horas_trabajadas}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ReporteHorasArea;
