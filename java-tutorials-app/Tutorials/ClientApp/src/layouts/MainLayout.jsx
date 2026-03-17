import { Link, useLocation } from 'react-router-dom';
import { Sidebar } from 'primereact/sidebar';
import { Button } from 'primereact/button';
import { useState } from 'react';
import PropTypes from 'prop-types';
import viteLogo from '/vite.svg';
import nrLogo from '/new_relic_logo_horizontal.png';

const MainLayout = ({ children }) => {
  const [visible, setVisible] = useState(false);
  const location = useLocation();

  const navItems = [
    { path: '/tutorials', label: 'Tutorials', icon: 'pi pi-list' },
    { path: '/add', label: 'Add New', icon: 'pi pi-plus' },
    { path: '/published', label: 'Published', icon: 'pi pi-check-circle' },
    { path: '/dashboard', label: 'Dashboard', icon: 'pi pi-chart-bar' },
    { path: '/analytics', label: 'Analytics', icon: 'pi pi-chart-line' }
  ];

  return (
    <div className="main-layout">
      {/* Header */}
      <header className="navbar navbar-expand navbar-dark bg-dark">
        <Button 
          icon="pi pi-bars" 
          onClick={() => setVisible(true)}
          className="p-button-rounded p-button-text p-button-plain text-white mr-2 d-md-none"
        />
        
        <a href="/" className="navbar-brand d-flex align-items-center">
          <img src={nrLogo} alt="Vite logo" height={40} />
          <span className="pl-2">Tutorials Manager</span>
        </a>
        
        <div className="navbar-nav mr-auto d-none d-md-flex">
          {navItems.map(item => (
            <li className="nav-item" key={item.path}>
              <Link 
                to={item.path} 
                className={`nav-link d-flex align-items-center ${location.pathname === item.path ? 'active' : ''}`}
              >
                <i className={`${item.icon} mr-1`}></i>
                {item.label}
              </Link>
            </li>
          ))}
        </div>
        
        {/* <div className="ml-auto d-flex align-items-center">
          <Button 
            icon="pi pi-user" 
            className="p-button-rounded p-button-text p-button-plain text-white"
          />
        </div> */}
      </header>

      {/* Mobile Sidebar */}
      <Sidebar visible={visible} onHide={() => setVisible(false)} className="p-sidebar-md">
        <div className="sidebar-header d-flex align-items-center justify-content-center mb-4">
          <img src={viteLogo} alt="Logo" height={30} />
          <h3 className="ml-2 mb-0">Tutorials Manager</h3>
        </div>
        
        <div className="sidebar-menu">
          {navItems.map(item => (
            <Link 
              key={item.path}
              to={item.path} 
              className={`sidebar-item d-flex align-items-center p-3 ${location.pathname === item.path ? 'active' : ''}`}
              onClick={() => setVisible(false)}
            >
              <i className={`${item.icon} mr-3`}></i>
              <span>{item.label}</span>
            </Link>
          ))}
        </div>
      </Sidebar>

      {/* Main Content */}
      <main className="container-fluid mt-4">
        {children}
      </main>

      {/* Footer */}
      <footer className="bg-light text-center text-muted py-3 mt-5">
        <div className="container">
          <p className="mb-0">© {new Date().getFullYear()} Tutorials Manager - PERN Stack Application</p>
        </div>
      </footer>
    </div>
  );
};

MainLayout.propTypes = {
  children: PropTypes.node.isRequired
};

export default MainLayout; 