import React, { useState, useEffect } from 'react';
import { FaEdit, FaTrashAlt } from 'react-icons/fa';
import Modal from 'react-modal';
import { Link } from 'react-router-dom';
import recriareLogo from '../recriare2.png'; // Caminho correto da imagem

Modal.setAppElement('#root');

const CadastroPaciente = () => {
    const [pacientes, setPacientes] = useState([]);
    const [modalIsOpen, setModalIsOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const [pacienteSelecionado, setPacienteSelecionado] = useState(null);
    const [nome, setNome] = useState('');
    const [dataNascimento, setDataNascimento] = useState('');
    const [endereco, setEndereco] = useState('');
    const [telefone, setTelefone] = useState('');
    const [email, setEmail] = useState('');
    const [currentTime, setCurrentTime] = useState(new Date().toLocaleTimeString('pt-BR', { timeZone: 'America/Sao_Paulo' }));
    const [filtroNome, setFiltroNome] = useState('');

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

    // Fetch dos dados para preencher a lista de pacientes
    const fetchPacientes = () => {
        fetch('http://localhost:5000/pacientes')
            .then(response => response.json())
            .then(data => setPacientes(data));
    };

    useEffect(() => {
        fetchPacientes();
    }, []);

    // Função para cadastrar um novo paciente
    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        const novoPaciente = {
            nome,
            data_nascimento: dataNascimento,
            endereco,
            telefone,
            email,
            id_terapeuta: 1, // ID do terapeuta para testes
            id_terapia: 1 // ID da terapia para testes
        };

        try {
            const response = await fetch('http://localhost:5000/add-paciente', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(novoPaciente)
            });

            const data = await response.json();
            if (data.success) {
                alert("Paciente cadastrado com sucesso!");
                fetchPacientes(); // Atualiza a lista de pacientes
                setNome('');
                setDataNascimento('');
                setEndereco('');
                setTelefone('');
                setEmail('');
            } else {
                alert("Erro ao cadastrar paciente: " + data.error);
            }
        } catch (error) {
            console.error("Erro na requisição:", error);
            alert("Erro na requisição");
        } finally {
            setLoading(false);
        }
    };

    // Função para deletar um paciente
    const handleDelete = (id) => {
        fetch(`http://localhost:5000/delete-paciente/${id}`, { method: 'DELETE' })
            .then(() => {
                setPacientes(pacientes.filter(paciente => paciente.id !== id));
            });
    };

    // Função para abrir modal de edição
    const openModal = (paciente) => {
        setPacienteSelecionado(paciente);
        setModalIsOpen(true);
    };

    const closeModal = () => {
        setModalIsOpen(false);
        setPacienteSelecionado(null);
    };

    // Filtrar pacientes pelo nome
    const pacientesFiltrados = pacientes.filter(paciente =>
        paciente.nome.toLowerCase().includes(filtroNome.toLowerCase())
    );

    return (
        <div className="min-h-screen bg-gray-100">
            {/* Header com logo e hora */}
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
                        <h2 className="text-2xl font-semibold mb-6">Cadastrar Paciente</h2>
                        <form onSubmit={handleSubmit}>

                            {loading && <div className="loading-spinner">Cadastrando...</div>}
                            <div className="mb-4">
                                <label className="block text-gray-700">Nome</label>
                                <input
                                    type="text"
                                    value={nome}
                                    onChange={(e) => setNome(e.target.value)}
                                    className="w-full p-2 border rounded"
                                    required
                                />
                            </div>
                            <div className="mb-4">
                                <label className="block text-gray-700">Data de Nascimento</label>
                                <input
                                    type="date"
                                    value={dataNascimento}
                                    onChange={(e) => setDataNascimento(e.target.value)}
                                    className="w-full p-2 border rounded"
                                    required
                                />
                            </div>
                            <div className="mb-4">
                                <label className="block text-gray-700">Endereço</label>
                                <input
                                    type="text"
                                    value={endereco}
                                    onChange={(e) => setEndereco(e.target.value)}
                                    className="w-full p-2 border rounded"
                                    required
                                />
                            </div>
                            <div className="mb-4">
                                <label className="block text-gray-700">Telefone</label>
                                <input
                                    type="text"
                                    value={telefone}
                                    onChange={(e) => setTelefone(e.target.value)}
                                    className="w-full p-2 border rounded"
                                    required
                                />
                            </div>
                            <div className="mb-4">
                                <label className="block text-gray-700">Email</label>
                                <input
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="w-full p-2 border rounded"
                                    required
                                />
                            </div>
                            <button
                                type="submit"
                                className="bg-blue-600 text-white p-2 rounded w-full shadow">
                                Cadastrar
                            </button>
                        </form>
                    </div>

                    {/* Container 2: Pacientes cadastrados */}
                    <div className="bg-white p-6 rounded-lg shadow-md overflow-y-auto max-h-128 scrollbar-thin scrollbar-thumb-gray-400 scrollbar-track-gray-200">
                        <h2 className="text-2xl font-semibold mb-6">Pacientes Cadastrados</h2>
                        
                        {/* Filtro de nome */}
                        <input
                            type="text"
                            placeholder="Filtrar por nome"
                            value={filtroNome}
                            onChange={(e) => setFiltroNome(e.target.value)}
                            className="p-2 border rounded mb-4"
                        />

                        {pacientesFiltrados.map((paciente) => (
                            <div key={paciente.id} className="flex justify-between items-center mb-2 p-4 bg-gray-100 rounded-lg shadow-md">
                                <div>
                                    <p><strong>Nome:</strong> {paciente.nome}</p>
                                    <p><strong>Data de Nascimento:</strong> {formatarData(paciente.data_nascimento)}</p>
                                    <p><strong>Endereço:</strong> {paciente.endereco}</p>
                                    <p><strong>Telefone:</strong> {paciente.telefone}</p>
                                    <p><strong>Email:</strong> {paciente.email}</p>
                                </div>
                                <div className="flex space-x-4">
                                    <button onClick={() => openModal(paciente)} className="text-green-500" title="Editar Paciente">
                                        <FaEdit size={20} />
                                    </button>
                                    <button onClick={() => handleDelete(paciente.id)} className="text-red-500" title="Deletar Paciente">
                                        <FaTrashAlt size={20} />
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
                    <h2 className="text-2xl mb-6 font-semibold">Editar Paciente</h2>
                    <form>
                        <div className="mb-4">
                            <label className="block text-gray-700">Nome</label>
                            <input type="text" value={pacienteSelecionado?.nome} onChange={(e) => setPacienteSelecionado({ ...pacienteSelecionado, nome: e.target.value })} className="w-full p-2 border rounded" />
                        </div>
                        <div className="mb-4">
                            <label className="block text-gray-700">Data de Nascimento</label>
                            <input type="date" value={pacienteSelecionado?.data_nascimento} onChange={(e) => setPacienteSelecionado({ ...pacienteSelecionado, data_nascimento: e.target.value })} className="w-full p-2 border rounded" />
                        </div>
                        <div className="mb-4">
                            <label className="block text-gray-700">Endereço</label>
                            <input type="text" value={pacienteSelecionado?.endereco} onChange={(e) => setPacienteSelecionado({ ...pacienteSelecionado, endereco: e.target.value })} className="w-full p-2 border rounded" />
                        </div>
                        <div className="mb-4">
                            <label className="block text-gray-700">Telefone</label>
                            <input type="text" value={pacienteSelecionado?.telefone} onChange={(e) => setPacienteSelecionado({ ...pacienteSelecionado, telefone: e.target.value })} className="w-full p-2 border rounded" />
                        </div>
                        <div className="mb-4">
                            <label className="block text-gray-700">Email</label>
                            <input type="email" value={pacienteSelecionado?.email} onChange={(e) => setPacienteSelecionado({ ...pacienteSelecionado, email: e.target.value })} className="w-full p-2 border rounded" />
                        </div>
                        <button type="submit" className="bg-green-500 text-white p-2 rounded w-full">Salvar</button>
                        <button onClick={closeModal} className="bg-gray-500 text-white p-2 rounded w-full mt-2">Cancelar</button>
                    </form>
                </Modal>
            )}
        </div>
    );
};

export default CadastroPaciente;
