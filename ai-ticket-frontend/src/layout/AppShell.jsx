import React from 'react';
import { Outlet } from 'react-router-dom';
import SidebarNav from './SidebarNav';
import Topbar from './Topbar';
import './AppShell.css';

const AppShell = () => {
  return (
    <div className="app-shell">
      <SidebarNav />
      <div className="app-main">
        <Topbar />
        <main className="app-content">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AppShell;