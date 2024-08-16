import React, { useState, useEffect } from 'react';
import { getEmpleados, getProveedorInvitado, registrarEntradaSalida } from '../../services/apiService';
import './RegistroEntradaSalida.css';

const RegistroEntradaSalida: React.FC = () => {
  const [personas, setPersonas] = useState<any[]>([]);
  const [selectedPersona, setSelectedPersona] = useState<number | null>(null);
  const [tipoPersona, setTipoPersona] = useState<string>('Empleado');
  const [horaSalida, setHoraSalida] = useState<string | null>(null);
  const [mostrarMotivo, setMostrarMotivo] = useState<boolean>(false);
  const [motivoRetiro, setMotivoRetiro] = useState<string>('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (tipoPersona === 'Empleado') {
          const empleados = await getEmpleados();
          setPersonas(empleados);
        } else {
          const proveedoresInvitados = await getProveedorInvitado();
          setPersonas(proveedoresInvitados);
        }
      } catch (error) {
        console.error('Error fetching personas:', error);
      }
    };

    fetchData();
  }, [tipoPersona]);

  const handleRegistrarEntrada = async () => {
    try {
      if (selectedPersona) {
        await registrarEntradaSalida({
          persona_id: selectedPersona,
          tipo_persona: tipoPersona,
          hora_ingreso: new Date().toISOString(),
          hora_salida: undefined,
          motivo_retiro: undefined,
          empleado_id: tipoPersona === 'Empleado' ? selectedPersona : undefined,
          proveedorinvitado_id: tipoPersona === 'ProveedorInvitado' ? selectedPersona : undefined
        });
        alert('Entrada registrada con éxito');
      }
    } catch (error) {
      console.error('Error registrando entrada:', error);
    }
  };

  const handleRegistrarSalida = async () => {
    try {
      if (selectedPersona) {
        await registrarEntradaSalida({
          persona_id: selectedPersona,
          tipo_persona: tipoPersona,
          hora_ingreso: new Date().toISOString(),
          hora_salida: horaSalida || new Date().toISOString(),
          motivo_retiro: motivoRetiro || undefined,
          empleado_id: tipoPersona === 'Empleado' ? selectedPersona : undefined,
          proveedorinvitado_id: tipoPersona === 'ProveedorInvitado' ? selectedPersona : undefined
        });
        alert('Salida registrada con éxito');
        setHoraSalida(null);
        setMotivoRetiro('');
      }
    } catch (error) {
      console.error('Error registrando salida:', error);
    }
  };

  const handleTipoPersonaChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setTipoPersona(e.target.value);
    setSelectedPersona(null);
  };

  const handleSalidaClick = () => {
    const currentHour = new Date().getHours();
    setHoraSalida(new Date().toISOString());
    if (currentHour < 16) {
      setMostrarMotivo(true);
    } else {
      setMostrarMotivo(false);
      handleRegistrarSalida();
    }
  };

  return (
    <div className="registro-container">
      <h2>Registro de Entrada/Salida</h2>
      <div className="registro-form">
        <label>Tipo de Persona:</label>
        <select value={tipoPersona} onChange={handleTipoPersonaChange}>
          <option value="Empleado">Empleado</option>
          <option value="ProveedorInvitado">Proveedor/Invitado</option>
        </select>

        <label>Seleccionar Persona:</label>
        <select value={selectedPersona || ''} onChange={(e) => setSelectedPersona(parseInt(e.target.value))}>
          <option value="">Seleccione una persona</option>
          {personas.map((persona) => (
            <option key={persona.id} value={persona.id}>
              {persona.nombre} - {persona.documento_identidad}
            </option>
          ))}
        </select>

        <div className="registro-buttons">
          <button onClick={handleRegistrarEntrada} className="btn btn-success">Registrar Entrada</button>
          <button onClick={handleSalidaClick} className="btn btn-warning">Registrar Salida</button>
        </div>

        {mostrarMotivo && (
          <div className="motivo-salida">
            <label>Motivo de Retiro (obligatorio si es antes de las 16:00):</label>
            <select value={motivoRetiro} onChange={(e) => setMotivoRetiro(e.target.value)}>
              <option value="">Seleccione un motivo</option>
              <option value="Cita médica">Cita médica</option>
              <option value="Calamidad">Calamidad</option>
              <option value="Diligencia personal">Diligencia personal</option>
              <option value="Otro">Otro</option>
            </select>
            <button onClick={handleRegistrarSalida} className="btn btn-primary">Confirmar Salida</button>
          </div>
        )}
      </div>
    </div>
  );
};

export default RegistroEntradaSalida;
