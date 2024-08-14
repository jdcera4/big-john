import React from 'react';
import ReporteHorasPorArea from '../../components/ReporteHorasArea/ReporteHorasPorArea';
import ReportePersonasEnEdificio from '../../components/ReportePersonasEnEdificio/ReportePersonasEnEdificio';

const ReportesPage: React.FC = () => {
  return (
    <div>
      <ReporteHorasPorArea />
      <ReportePersonasEnEdificio />
    </div>
  );
};

export default ReportesPage;
