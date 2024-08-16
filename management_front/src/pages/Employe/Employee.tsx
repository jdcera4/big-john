import React, { useState, useEffect } from 'react';
import { getEmpleados } from '../../services/apiService';
import { Employee } from '../../interfaces/Employe.interface';
import './Employee.css'
import EmployeeReportModal from '../../components/EmployeReport/EmployeeReportModal';

const EmployeesPage: React.FC = () => {
    const [employees, setEmployees] = useState<Employee[]>([]);
    const [filteredEmployees, setFilteredEmployees] = useState<Employee[]>([]);
    const [search, setSearch] = useState<string>('');
    const [modalIsOpen, setModalIsOpen] = useState<boolean>(false);
    const [selectedEmployeeId, setSelectedEmployeeId] = useState<number | null>(null);
    const [startDate, setStartDate] = useState<string>('');
    const [endDate, setEndDate] = useState<string>('');

    useEffect(() => {
      const fetchData = async () => {
        try {
          const data = await getEmpleados();
          setEmployees(data);
          setFilteredEmployees(data);
        } catch (error) {
          console.error('Error fetching employees:', error);
        }
      };
  
      fetchData();
    }, []);
  
    useEffect(() => {
      setFilteredEmployees(
        employees.filter(employee =>
          employee.nombre.toLowerCase().includes(search.toLowerCase()) ||
          employee.documento_identidad.includes(search)
        )
      );
    }, [search, employees]);

    const handleOpenModal = (id: number) => {
      setSelectedEmployeeId(id);
      setModalIsOpen(true);
    };
  
    const handleCloseModal = () => {
      setModalIsOpen(false);
      setSelectedEmployeeId(null);
    };
  
    return (
      <div>
        <input
          type="text"
          placeholder="Buscar por nombre o documento"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={{ margin: 20, padding: '10px', fontSize: '16px', borderRadius: '4px', border: '1px solid #ccc' }}
        />
        <div className="date-picker-container">
          <label htmlFor="start-date">Fecha de Inicio:</label>
          <input
            id="start-date"
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
          />
          <label htmlFor="end-date">Fecha de Fin:</label>
          <input
            id="end-date"
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
          />
        </div>
        <table>
          <thead>
            <tr>
              <th>#</th>
              <th>Nombre</th>
              <th>Documento de Identidad</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {filteredEmployees.length > 0 ? (
              filteredEmployees.map((employee, index) => (
                <tr key={employee.id}>
                  <td>{index + 1}</td>
                  <td>{employee.nombre}</td>
                  <td>{employee.documento_identidad}</td>
                  <td>
                    <button 
                      onClick={() => handleOpenModal(employee.id)}
                      className="btn btn-primary"
                    >
                      Reporte horas
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={4}>No se encontraron empleados.</td>
              </tr>
            )}
          </tbody>
        </table>
        {selectedEmployeeId !== null && (
          <EmployeeReportModal
            isOpen={modalIsOpen}
            onClose={handleCloseModal}
            employeeId={selectedEmployeeId}
            startDate={startDate}
            endDate={endDate}
          />
        )}
      </div>
    );
  };

export default EmployeesPage;
