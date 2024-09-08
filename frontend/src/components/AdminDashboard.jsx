import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom'; // Para navegação
import recriareLogo from '../recriare2.png'; // Certifique-se de que a imagem exista nesse diretório
import { FaCalendarAlt, FaClipboardList, FaUser, FaUserMd, FaFileAlt } from 'react-icons/fa';
import { FaQuestionCircle } from 'react-icons/fa'; // Importando o ícone de interrogação
import { Link } from 'react-router-dom'; // Importando o Link

const AdminDashboard = () => {
    const [loading, setLoading] = useState(true);
    const [menuOpen, setMenuOpen] = useState(false); // Controle de visibilidade do menu suspenso
    const [time, setTime] = useState('');
    const [location, setLocation] = useState(''); // Localização do usuário
    const [consultas, setConsultas] = useState([]); // Estado para armazenar as consultas do dia

    const navigate = useNavigate(); // Para redirecionamento

    useEffect(() => {
        // Simulando o carregamento de dados ao acessar o dashboard
        const timer = setTimeout(() => {
            setLoading(false);
        }, 3000); // Aguardar 3 segundos antes de mostrar o dashboard

        // Atualizar o horário atual a cada segundo
        const interval = setInterval(() => {
            const date = new Date();
            const options = { timeZone: 'America/Sao_Paulo', hour: '2-digit', minute: '2-digit', second: '2-digit' };
            const formattedTime = date.toLocaleTimeString('pt-BR', options);
            setTime(formattedTime);
        }, 1000);

        // Detectar localização do usuário (navegadores que suportam geolocalização)
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    const { latitude, longitude } = position.coords;
                    fetch(`https://geocode.xyz/${latitude},${longitude}?geoit=json`)
                        .then(response => response.json())
                        .then(data => {
                            if (data.city && data.country) {
                                setLocation(`${data.city}, ${data.country}`);
                            } else {
                                setLocation('Localização não encontrada');
                            }
                        })
                        .catch(() => setLocation('Localização não disponível'));
                },
                () => {
                    setLocation('Localização não permitida');
                }
            );
        } else {
            setLocation('Geolocalização não suportada');
        }

        return () => {
            clearTimeout(timer);
            clearInterval(interval);
        };
    }, []);

    useEffect(() => {
        // Requisição ao backend para obter consultas
        const fetchConsultas = async () => {
            try {
                const response = await fetch('http://localhost:5000/appointments');
                const data = await response.json();

                // Filtrar consultas do dia atual
                const today = new Date().toISOString().split('T')[0];
                const consultasDoDia = data.filter(consulta => consulta.date === today);
                
                setConsultas(consultasDoDia);
            } catch (error) {
                console.error('Erro ao buscar consultas:', error);
            }
        };

        fetchConsultas();
    }, []);

    const toggleMenu = () => {
        setMenuOpen(!menuOpen);
    };

    const handleLogout = () => {
        setLoading(true);
        setTimeout(() => {
            navigate('/'); // Redirecionar para a página de login após 3 segundos
        }, 3000);
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center h-screen bg-white">
                {/* Animação de Loading */}
                <img
                    src={recriareLogo}
                    alt="Loading..."
                    className="animate-spin w-24 h-24"
                />
            </div>
        );
    }

    return (
        <div className="flex flex-col h-screen">
            {/* Header */}
            <header className="w-full bg-gray-800 text-white p-4 flex justify-between items-center">
                <h1 className="text-lg font-bold">Admin Dashboard</h1>

                <div className="relative flex items-center space-x-6">
                    {/* Exibir hora atual e localização */}
                    <div className="text-gray-300">
                        <p>{`Hora atual: ${time} - Horário de Brasília`}</p>
                    </div>
                    <div className="text-gray-300">
                        <p>{location ? `Sua Localização: ${location}` : 'Localizando...'}</p>
                    </div>

                    {/* Botão Help */}
                    <button className="flex items-center space-x-2 text-red-500" style={{ marginRight: '-8px' }}>
                        <FaQuestionCircle className="text-red-500" /> {/* Ícone de interrogação em vermelho */}
                        <span>Help</span>
                    </button>

                    {/* Logo e Menu de perfil */}
                    <button className="flex items-center space-x-2" onClick={toggleMenu}>
                        <img src={recriareLogo} alt="Logo" className="w-8 h-8" />
                    </button>

                    {/* Menu suspenso */}
                    {menuOpen && (
                        <div className="absolute right-0 mt-2 w-48 bg-white text-black rounded-lg shadow-lg z-10">
                            <a href="#profile" className="block px-4 py-2 hover:bg-gray-200">Editar Perfil</a>
                            <button onClick={handleLogout} className="block px-4 py-2 hover:bg-gray-200 w-full text-left">Sair da Conta</button>
                        </div>
                    )}
                </div>
            </header>

            <div className="flex h-full">
                {/* Navbar fixa ao lado esquerdo */}
                <nav className="w-64 bg-gray-800 text-white">
                    <div className="p-4">
                        <h2 className="text-xl font-bold">Módulos</h2>
                    </div>
                    <ul className="mt-4">
                        <li className="p-4 hover:bg-gray-700 flex items-center">
                            <FaCalendarAlt className="mr-2" />
                            <Link to="/agenda-dashboard">Agendamentos</Link>
                        </li>
                        <li className="p-4 hover:bg-gray-700 flex items-center">
                            <FaClipboardList className="mr-2" />
                            <Link to="/cadastro-consulta">Cadastro de Consulta</Link>
                        </li>
                        <li className="p-4 hover:bg-gray-700 flex items-center">
                            <FaUser className="mr-2" />
                            <Link to="/cadastro-paciente">Cadastro de Paciente</Link>
                        </li>
                        <li className="p-4 hover:bg-gray-700 flex items-center">
                            <FaUserMd className="mr-2" />
                            <Link to="/cadastro-terapeuta">Cadastro de Terapeuta</Link>
                        </li>
                        <li className="p-4 hover:bg-gray-700 flex items-center">
                            <FaFileAlt className="mr-2" />
                            <Link to="/cadastro-terapia">Cadastro de Terapias</Link>
                        </li>
                        <li className="p-4 hover:bg-gray-700 flex items-center">
                            <FaFileAlt className="mr-2" />
                            <Link to="/relatorio1">Relatórios</Link>
                            
                        </li>
                        <li className="p-4 hover:bg-gray-700 flex items-center">
                            <FaFileAlt className="mr-2" />
                            <Link to="/relatorio2">Alocações Algoritmo</Link>
                            
                        </li>
                    </ul>
                </nav>

                {/* Conteúdo principal do dashboard */}
                <div className="flex-1 p-10 bg-gray-100">
                    <h1 className="text-2xl font-bold mb-4">Consultas do Dia</h1>
                    
                    {/* Consultas do dia */}
                    <section id="agenda" className="mb-6">
                        {consultas.length > 0 ? (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                {consultas.map((consulta) => (
                                    <div key={consulta.id} className="bg-white shadow-md rounded-lg p-4">
                                        <h3 className="text-lg font-bold">{consulta.patientName}</h3>
                                        <p className="text-gray-600">Terapeuta: {consulta.therapistName}</p>
                                        <p className="text-gray-600">Terapia: {consulta.therapyName}</p>
                                        <p className="text-gray-600">Hora: {consulta.time}</p>
                                        <p className="text-gray-600">Sala: {consulta.sala}</p>
                                        <p className="text-gray-600">Observações: {consulta.observations}</p>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <p>Nenhuma consulta agendada para hoje.</p>
                        )}
                    </section>

                    {/* Outras seções */}
                    
                </div>
            </div>
        </div>
    );
};

export default AdminDashboard;
