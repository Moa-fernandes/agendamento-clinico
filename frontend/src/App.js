import React from 'react';
import './css/logins.css';  // Importando o arquivo CSS
import Login from './components/Login';  // Importando o componente Login
import AdminDashboard from './components/AdminDashboard'; // Importando o componente AdminDashboard
import Agenda from './components/Agenda'; // Importando o componente Agenda
import CadastroConsulta from './components/CadastroConsulta'; // Importando o componente CadastroConsulta
import CadastroPaciente from './components/CadastroPaciente'; // Importando o componente CadastroPaciente
import CadastroTerapeuta from './components/CadastroTerapeuta'; // Importando o componente CadastroTerapeuta
import CadastroTerapia from './components/CadastroTerapia'; // Importando o componente CadastroTerapia
import Relatorio1 from './components/Relatorio1'; // Importando o componente Relatorio1
import Relatorio2 from './components/Relatorio2'; // Importando o componente Relatorio2

import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          {/* Rota para a página de Login */}
          <Route path="/" element={<Login />} />
          
          {/* Rota para o Admin Dashboard */}
          <Route path="/admin-dashboard" element={<AdminDashboard />} />
          
          {/* Rota para a Agenda */}
          <Route path="/agenda-dashboard" element={<Agenda />} />
          
          {/* Rota para Cadastro de Consulta */}
          <Route path="/cadastro-consulta" element={<CadastroConsulta />} />

          {/* Rota para Cadastro de Paciente */}
          <Route path="/cadastro-paciente" element={<CadastroPaciente />} />

          {/* Rota para Cadastro de Terapeuta */}
          <Route path="/cadastro-terapeuta" element={<CadastroTerapeuta />} />

          {/* Rota para Cadastro de Terapia */}
          <Route path="/cadastro-terapia" element={<CadastroTerapia />} />

          {/* Rota para o Relatório 1 */}
          <Route path="/relatorio1" element={<Relatorio1 />} />
          
          {/* Rota para o Relatório 2 */}
          <Route path="/relatorio2" element={<Relatorio2 />} />

        </Routes>
      </div>
    </Router>
  );
}

export default App;
