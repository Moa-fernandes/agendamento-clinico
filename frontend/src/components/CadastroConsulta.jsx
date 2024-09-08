import React, { useState, useEffect } from 'react';
import { FaEdit, FaTrashAlt, FaCheckCircle } from 'react-icons/fa';
import Modal from 'react-modal';
import { Link } from 'react-router-dom';
import recriareLogo from '../recriare2.png'; // Verifique se o caminho está correto.

Modal.setAppElement('#root');

const CadastroConsulta = () => {
    const [consultas, setConsultas] = useState([]);
    const [modalIsOpen, setModalIsOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const [consultaSelecionada, setConsultaSelecionada] = useState(null);
    const [pacientes, setPacientes] = useState([]);
    const [terapeutas, setTerapeutas] = useState([]);
    const [terapias, setTerapias] = useState([]);
    const [sala, setSala] = useState(''); // Estado para a sala
    const [currentTime, setCurrentTime] = useState(new Date().toLocaleTimeString('pt-BR', { timeZone: 'America/Sao_Paulo' }));
    const [filtroId, setFiltroId] = useState('');
    const [filtroData, setFiltroData] = useState('');

    // Atualizar o horário em tempo real
    useEffect(() => {
        const timer = setInterval(() => {
            setCurrentTime(new Date().toLocaleTimeString('pt-BR', { timeZone: 'America/Sao_Paulo' }));
        }, 1000);
        return () => clearInterval(timer);
    }, []);

    // Função para formatar a data no formato dd/mm/yyyy
    const formatarData = (data) => {
        const novaData = new Date(data);
        return novaData.toLocaleDateString('pt-BR');
    };

    // Fetch dos dados para preencher selects
    useEffect(() => {
        fetch('http://localhost:5000/pacientes')
            .then(response => response.json())
            .then(data => setPacientes(data));

        fetch('http://localhost:5000/terapeutas')
            .then(response => response.json())
            .then(data => setTerapeutas(data));

        fetch('http://localhost:5000/terapias')
            .then(response => response.json())
            .then(data => setTerapias(data));

        fetch('http://localhost:5000/consultas')
            .then(response => response.json())
            .then(data => {
                setConsultas(data);
            });
    }, []);

    // Função para deletar uma consulta
    const handleDelete = (id) => {
        fetch(`http://localhost:5000/delete-consulta/${id}`, { method: 'DELETE' })
            .then(() => {
                setConsultas(consultas.filter(consulta => consulta.id !== id));
            });
    };

    // Função para finalizar uma consulta
    const handleFinalize = async (id) => {
        try {
            const response = await fetch(`http://localhost:5000/update-status/${id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    status: 3 // Status 3 representa 'Finalizada'
                })
            });

            if (response.ok) {
                const updatedConsultas = consultas.map(consulta =>
                    consulta.id === id ? { ...consulta, status: 'Finalizada' } : consulta
                );
                setConsultas(updatedConsultas);
            } else {
                console.error("Erro ao atualizar o status da consulta");
            }
        } catch (error) {
            console.error("Erro ao finalizar consulta:", error);
        }
    };

    // Função para abrir modal de edição
    const openModal = (consulta) => {
        setConsultaSelecionada(consulta);
        setModalIsOpen(true);
    };

    const closeModal = () => {
        setModalIsOpen(false);
        setConsultaSelecionada(null);
    };

    // Função para verificar status da consulta
    const getStatus = (consulta) => {
        const dataAtual = new Date();
        const dataConsulta = new Date(consulta.data_consulta);

        if (dataConsulta.toDateString() === dataAtual.toDateString()) {
            return <span className="text-red-500 font-semibold">Consulta do dia</span>;
        } else if (dataConsulta > dataAtual) {
            return <span className="text-blue-500 font-semibold">Agendamento</span>;
        } else {
            return <span className="text-green-500 font-semibold">Finalizada</span>;
        }
    };

    // Consultas filtradas por ID e data, com as finalizadas aparecendo por último
    const consultasFiltradas = consultas
    .filter((consulta) => {
        const dataConsulta = new Date(consulta.data_consulta);
        const dataFiltro = filtroData ? new Date(filtroData) : null;
        return (
            (!filtroId || consulta.id === parseInt(filtroId)) &&
            (!dataFiltro || dataConsulta.toDateString() === dataFiltro.toDateString())
        );
    })
    .sort((a, b) => {
        const dataAtual = new Date();
        const dataA = new Date(a.data_consulta);
        const dataB = new Date(b.data_consulta);

        // 1. Ordenar por status de "Consulta do dia"
        const isAConsultaDia = dataA.toDateString() === dataAtual.toDateString();
        const isBConsultaDia = dataB.toDateString() === dataAtual.toDateString();

        if (isAConsultaDia && !isBConsultaDia) return -1;
        if (!isAConsultaDia && isBConsultaDia) return 1;

        // 2. Ordenar por status de "Agendamento" (datas futuras)
        const isAAgendamento = dataA > dataAtual;
        const isBAgendamento = dataB > dataAtual;

        if (isAAgendamento && !isBAgendamento) return -1;
        if (!isAAgendamento && isBAgendamento) return 1;

        // 3. Ordenar por status de "Finalizada"
        const isAFinalizada = a.status === 'Finalizada';
        const isBFinalizada = b.status === 'Finalizada';

        if (isAFinalizada && !isBFinalizada) return 1;
        if (!isAFinalizada && isBFinalizada) return -1;

        // Se todos os status forem iguais, ordenar pela data
        return dataA - dataB;
    });

    // Função para cadastrar uma nova consulta
    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        const pacienteSelecionado = pacientes.find(p => p.nome === e.target.elements[0].value);
        const terapeutaSelecionado = terapeutas.find(t => t.nome === e.target.elements[1].value);
        const terapiaSelecionada = terapias.find(te => te.nome === e.target.elements[2].value);
        const dataConsulta = new Date(e.target.elements[3].value);
        const observacoes = e.target.elements[4].value;
        const salaSelecionada = e.target.elements[5].value;

        if (!pacienteSelecionado || !terapeutaSelecionado || !terapiaSelecionada || !dataConsulta || !salaSelecionada) {
            console.error("Dados inválidos");
            setLoading(false);
            return;
        }

        // Lógica para definir o status da consulta
        const hoje = new Date();
        let status = 'Agendado'; // Padrão será agendado

        if (dataConsulta.toDateString() === hoje.toDateString()) {
            status = 'Aberto'; // Se a consulta for para hoje
        }

        try {
            const response = await fetch('http://localhost:5000/add-consulta', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    id_paciente: pacienteSelecionado.id,
                    id_terapeuta: terapeutaSelecionado.id,
                    id_terapia: terapiaSelecionada.id,
                    data_consulta: dataConsulta.toISOString(),
                    observacoes,
                    sala: salaSelecionada, // Inclui a sala
                    status // Inclui o status no envio da consulta
                })
            });

            const data = await response.json();
            if (data.success) {
                alert("Consulta cadastrada com sucesso!");
                window.location.reload();
            } else {
                console.error("Erro ao cadastrar consulta:", data.error);
            }
        } catch (error) {
            console.error("Erro na requisição:", error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-100">
            {/* Header com logo e hora, cores neutras */}
            <header className="bg-gray-900 text-white p-2 flex justify-between items-center shadow-md">
                <div className="flex items-center">
                    <img src={recriareLogo} alt="Logo Recriare" className="w-16 h-16 mr-2" />
                </div>
                <div className="flex items-center">
                    <span className="text-lg mr-4">{currentTime}</span>
                    <Link to="/admin-dashboard" className="text-white underline">
                        Voltar à Tela Inicial
                    </Link>
                </div>
            </header>

            <div className="p-4">
                {/* Grid de containers */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">

                    {/* Container 1: Formulário de cadastro */}
                    <div className="bg-white p-6 rounded-lg shadow-md">
                        <h2 className="text-2xl font-semibold mb-6">Cadastrar Consulta</h2>
                        <form onSubmit={handleSubmit}>
                            {loading && <div className="loading-spinner">Cadastrando...</div>}
                            <div className="mb-4">
                                <label className="block text-gray-700">Paciente</label>
                                <input list="pacientes" className="w-full p-2 border rounded" />
                                <datalist id="pacientes">
                                    {pacientes.map((paciente) => (
                                        <option key={paciente.id} value={paciente.nome} />
                                    ))}
                                </datalist>
                            </div>
                            <div className="mb-4">
                                <label className="block text-gray-700">Terapeuta</label>
                                <input list="terapeutas" className="w-full p-2 border rounded" />
                                <datalist id="terapeutas">
                                    {terapeutas.map((terapeuta) => (
                                        <option key={terapeuta.id} value={terapeuta.nome} />
                                    ))}
                                </datalist>
                            </div>
                            <div className="mb-4">
                                <label className="block text-gray-700">Terapia</label>
                                <input list="terapias" className="w-full p-2 border rounded" />
                                <datalist id="terapias">
                                    {terapias.map((terapia) => (
                                        <option key={terapia.id} value={terapia.nome} />
                                    ))}
                                </datalist>
                            </div>
                            <div className="mb-4">
                                <label className="block text-gray-700">Data e Hora da Consulta</label>
                                <input type="datetime-local" className="w-full p-2 border rounded" required />
                            </div>
                            <div className="mb-4">
                                <label className="block text-gray-700">Observações</label>
                                <textarea className="w-full p-2 border rounded"></textarea>
                            </div>
                            <div className="mb-4">
                                <label className="block text-gray-700">Sala</label>
                                <select value={sala} onChange={(e) => setSala(e.target.value)} className="w-full p-2 border rounded">
                                    {[...Array(25)].map((_, i) => (
                                        <option key={i + 1} value={i + 1}>Sala {i + 1}</option>
                                    ))}
                                </select>
                            </div>
                            <button type="submit" className="bg-blue-600 text-white p-2 rounded w-full shadow">
                                Cadastrar
                            </button>
                        </form>
                    </div>

                    {/* Container 2: Consultas cadastradas */}
                    <div className="bg-white p-6 rounded-lg shadow-md overflow-y-auto max-h-128 scrollbar-thin scrollbar-thumb-gray-400 scrollbar-track-gray-200">
                        <h2 className="text-2xl font-semibold mb-6">Consultas Cadastradas</h2>
                        
                        {/* Filtros de ID e Data */}
                        <input
                            type="text"
                            placeholder="Filtrar por ID"
                            value={filtroId}
                            onChange={(e) => setFiltroId(e.target.value)}
                            className="p-2 border rounded mb-4"
                        />
                        <input
                            type="date"
                            value={filtroData}
                            onChange={(e) => setFiltroData(e.target.value)}
                            className="p-2 border rounded mb-4"
                        />
                        
                        {consultasFiltradas.map((consulta) => (
                            <div key={consulta.id} className="flex justify-between items-center mb-2 p-4 bg-gray-100 rounded-lg shadow-md">
                                <div>
                                    <p><strong>ID:</strong> {consulta.id}</p>
                                    <p><strong>Paciente:</strong> {consulta.paciente}</p>
                                    <p><strong>Terapeuta:</strong> {consulta.terapeuta}</p>
                                    <p><strong>Terapia:</strong> {consulta.terapia}</p>
                                    <p><strong>Data de consulta:</strong> {formatarData(consulta.data_consulta)}</p>
                                    <p><strong>Observações:</strong> {consulta.observacoes}</p>
                                    <p><strong>Sala:</strong> {consulta.sala}</p> {/* Exibe a sala */}
                                    <p><strong>Status:</strong> {getStatus(consulta)}</p>
                                </div>
                                <div className="flex space-x-4">
                                    <button onClick={() => openModal(consulta)} className="text-green-500" title="Editar Consulta">
                                        <FaEdit size={20} />
                                    </button>
                                    <button onClick={() => handleDelete(consulta.id)} className="text-red-500" title="Deletar Consulta">
                                        <FaTrashAlt size={20} />
                                    </button>
                                    <button onClick={() => handleFinalize(consulta.id)} className="text-blue-500" title="Finalizar Consulta">
                                        <FaCheckCircle size={20} />
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Modal para edição */}
            {modalIsOpen && (
                <Modal isOpen={modalIsOpen} onRequestClose={closeModal} className="bg-white p-8 rounded-lg shadow-lg max-w-xl mx-auto">
                    <h2 className="text-2xl mb-6 font-semibold">Editar Consulta</h2>
                    <form>
                        <div className="mb-4">
                            <label className="block text-gray-700">Paciente</label>
                            <input type="text" value={consultaSelecionada?.paciente} onChange={(e) => setConsultaSelecionada({ ...consultaSelecionada, paciente: e.target.value })} className="w-full p-2 border rounded" />
                        </div>
                        <div className="mb-4">
                            <label className="block text-gray-700">Terapeuta</label>
                            <input type="text" value={consultaSelecionada?.terapeuta} onChange={(e) => setConsultaSelecionada({ ...consultaSelecionada, terapeuta: e.target.value })} className="w-full p-2 border rounded" />
                        </div>
                        <div className="mb-4">
                            <label className="block text-gray-700">Terapia</label>
                            <input type="text" value={consultaSelecionada?.terapia} onChange={(e) => setConsultaSelecionada({ ...consultaSelecionada, terapia: e.target.value })} className="w-full p-2 border rounded" />
                        </div>
                        <div className="mb-4">
                            <label className="block text-gray-700">Data da Consulta</label>
                            <input type="date" value={consultaSelecionada?.data_consulta} onChange={(e) => setConsultaSelecionada({ ...consultaSelecionada, data_consulta: e.target.value })} className="w-full p-2 border rounded" />
                        </div>
                        <div className="mb-4">
                            <label className="block text-gray-700">Observações</label>
                            <textarea value={consultaSelecionada?.observacoes} onChange={(e) => setConsultaSelecionada({ ...consultaSelecionada, observacoes: e.target.value })} className="w-full p-2 border rounded"></textarea>
                        </div>
                        <button type="submit" className="bg-green-500 text-white p-2 rounded w-full">Salvar</button>
                        <button onClick={closeModal} className="bg-gray-500 text-white p-2 rounded w-full mt-2">Cancelar</button>
                    </form>
                </Modal>
            )}
        </div>
    );
};

export default CadastroConsulta;
