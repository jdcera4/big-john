import React, { useState, useEffect } from 'react';
import { getPersonasEnEdificio } from '../../services/apiService';

const ReportePersonasEnEdificio: React.FC = () => {
  const [reportData, setReportData] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const data = await getPersonasEnEdificio();
        setReportData(data);
      } catch (error) {
        console.error('Error fetching report data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const extractHour = (isoString: string): string => {
    const date = new Date(isoString);
    return date.toLocaleTimeString();
  };

  return (
    <div className="reportes-container">
      <h2>Reporte de Personas en el Edificio</h2>
      {loading && <p>Cargando...</p>}

      {reportData.length > 0 && (
        <table className="report-table">
          <thead>
            <tr>
              <th>Nombre</th>
              <th>Tipo persona</th>
              <th>Área</th>
              <th>Hora de Entrada</th>
            </tr>
          </thead>
          <tbody>
            {reportData.map((row, index) => (
              <tr key={index}>
                <td>{row.nombre}</td>
                <td>{row.tipo_persona}</td>
                <td>{row.area || 'N/A'}</td>
                <td>{extractHour(row.hora_ingreso)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default ReportePersonasEnEdificio;
