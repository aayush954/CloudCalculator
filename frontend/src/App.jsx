// App.jsx — Root application component
import React from 'react';
import { ThemeProvider } from './context/ThemeContext';
import Navbar    from './components/layout/Navbar';
import Footer    from './components/layout/Footer';
import Dashboard from './pages/Dashboard';
import './index.css';

const App = () => (
  <ThemeProvider>
    <div className="min-h-screen">
      <Navbar />
      <main>
        <Dashboard />
      </main>
      <Footer />
    </div>
  </ThemeProvider>
);

export default App;
