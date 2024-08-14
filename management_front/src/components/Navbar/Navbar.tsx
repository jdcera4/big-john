import { useState } from 'react';
import './Navbar.css'
const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  return (
    <nav className="navbar">
      <div className="navbar-logo">Mi Aplicación</div>
      <button className="menu-button" onClick={toggleMenu}>
        ☰
      </button>
      <ul className={`navbar-links ${menuOpen ? 'active' : ''}`}>
        <li><a href="/empleados">Empleados</a></li>
        <li><a href="/proveedores-invitados">Proveedores/Invitados</a></li>
        <li><a href="/informes">Informes</a></li>
        <li><a href="/registro">Registro Ingreso/Salida</a></li>
      </ul>
    </nav>
  );
};

export default Navbar;
