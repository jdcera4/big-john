import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Navbar from './components/Navbar/Navbar';
import EmployeesPage from './pages/Employe/Employee';
import ProveedorInvitadoPage from './pages/ProveedorInvitado/ProveedorInvitado';
import RegistroEntradaSalida from './pages/RegistroEntradaSalida/RegistroEntradaSalida';

const App: React.FC = () => {
    return (
        <Router>
            <Navbar />
            <div className="container mx-auto p-4">
                <Routes>
                    <Route path="/empleados" element={<EmployeesPage />} />
                    <Route path="/proveedores-invitados" element={<ProveedorInvitadoPage/>} />
                    <Route path="/informes" element={<div>Informes</div>} />
                    <Route path="/registro-ingreso-salida" element={<RegistroEntradaSalida/>} />
                </Routes>
            </div>
        </Router>
    );
};

export default App;
