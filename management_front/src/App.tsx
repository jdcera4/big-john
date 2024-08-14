import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Navbar from './components/Navbar/Navbar';

const App: React.FC = () => {
    return (
        <Router>
            <Navbar />
            <div className="container mx-auto p-4">
                <Routes>
                    <Route path="/empleados" element={<div>Empleados</div>} />
                    <Route path="/proveedores-invitados" element={<div>Proveedores/Invitados</div>} />
                    <Route path="/informes" element={<div>Informes</div>} />
                    <Route path="/registro-ingreso-salida" element={<div>Registro Ingreso/Salida</div>} />
                </Routes>
            </div>
        </Router>
    );
};

export default App;
