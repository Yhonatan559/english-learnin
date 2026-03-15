import React from 'react';
import { Outlet, NavLink } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './Layout.css';

export default function Layout() {
  const { user, logout } = useAuth();

  return (
    <div className="layout">
      <header className="header">
        <NavLink to="/" className="logo">English Learning</NavLink>
        <nav className="nav">
          <NavLink to="/" end>Inicio</NavLink>
          <NavLink to="/lessons">Lecciones</NavLink>
          <NavLink to="/conversation">Conversación IA</NavLink>
          <NavLink to="/profile">Perfil</NavLink>
          <span className="user-name">{user?.name}</span>
          <button type="button" className="btn btn-ghost btn-sm" onClick={logout}>Salir</button>
        </nav>
      </header>
      <main className="main">
        <Outlet />
      </main>
    </div>
  );
}
