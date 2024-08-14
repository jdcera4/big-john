import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Navbar from './components/Navbar/Navbar';
import EmployeesPage from './pages/Employe/Employee';
import SimpleModal from './pages/prueba';

const App: React.FC = () => {
    return (
        <Router>
            <Navbar />
            <div className="container mx-auto p-4">
                <Routes>
                    <Route path="/empleados" element={<EmployeesPage />} />
                    <Route path="/proveedores-invitados" element={<SimpleModal/>} />
                    <Route path="/informes" element={<div>Informes</div>} />
                    <Route path="/registro-ingreso-salida" element={<div>Registro Ingreso/Salida</div>} />
                </Routes>
            </div>
        </Router>
    );
};

export default App;
