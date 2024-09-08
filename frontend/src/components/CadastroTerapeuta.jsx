import React, { useState, useEffect } from 'react';
import { FaEdit, FaTrashAlt } from 'react-icons/fa';
import Modal from 'react-modal';
import { Link } from 'react-router-dom';
import recriareLogo from '../recriare2.png'; // Verifique se o caminho está correto.

Modal.setAppElement('#root');

const CadastroTerapeuta = () => {
    const [terapeutas, setTerapeutas] = useState([]);
    const [terapias, setTerapias] = useState([]); // Para listar as terapias
    const [modalIsOpen, setModalIsOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const [terapeutaSelecionado, setTerapeutaSelecionado] = useState(null);
    const [nome, setNome] = useState('');
    const [especialidade, setEspecialidade] = useState('');
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

    
    // Fetch dos terapeutas cadastrados
    const fetchTerapeutas = () => {
        fetch('http://localhost:5000/terapeutas')
            .then(response => response.json())
            .then(data => setTerapeutas(data));
    };

    // Fetch das terapias cadastradas para usar no select
    const fetchTerapias = () => {
        fetch('http://localhost:5000/terapias')
            .then(response => response.json())
            .then(data => setTerapias(data));
    };

    useEffect(() => {
        fetchTerapeutas();
        fetchTerapias(); // Buscando terapias
    }, []);

    // Função para cadastrar um novo terapeuta
    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        const novoTerapeuta = {
            nome,
            especialidade, // Deve ser o nome da terapia selecionada
            telefone,
            email
        };

        try {
            const response = await fetch('http://localhost:5000/add-terapeuta', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(novoTerapeuta)
            });

            const data = await response.json();
            if (data.success) {
                alert("Terapeuta cadastrado com sucesso!");
                fetchTerapeutas(); // Atualiza a lista de terapeutas
                setNome('');
                setEspecialidade('');
                setTelefone('');
                setEmail('');
            } else {
                alert("Erro ao cadastrar terapeuta: " + data.error);
            }
        } catch (error) {
            console.error("Erro na requisição:", error);
            alert("Erro na requisição");
        } finally {
            setLoading(false);
        }
    };

    // Função para deletar um terapeuta
    const handleDelete = (id) => {
        fetch(`http://localhost:5000/delete-terapeuta/${id}`, { method: 'DELETE' })
            .then(() => {
                setTerapeutas(terapeutas.filter(terapeuta => terapeuta.id !== id));
            });
    };

    // Função para abrir modal de edição
    const openModal = (terapeuta) => {
        setTerapeutaSelecionado(terapeuta);
        setModalIsOpen(true);
    };

    const closeModal = () => {
        setModalIsOpen(false);
        setTerapeutaSelecionado(null);
    };

    // Filtrar terapeutas pelo nome
    const terapeutasFiltrados = terapeutas.filter(terapeuta =>
        terapeuta.nome.toLowerCase().includes(filtroNome.toLowerCase())
    );

    return (
        <div className="min-h-screen bg-gray-100">
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
                        <h2 className="text-2xl font-semibold mb-6">Cadastrar Terapeuta</h2>
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
                                <label className="block text-gray-700">Especialidade (Terapia)</label>
                                <select
                                    value={especialidade}
                                    onChange={(e) => setEspecialidade(e.target.value)}
                                    className="w-full p-2 border rounded"
                                    required
                                >
                                    <option value="">Selecione uma Terapia</option>
                                    {terapias.map((terapia) => (
                                        <option key={terapia.id} value={terapia.nome}>
                                            {terapia.nome}
                                        </option>
                                    ))}
                                </select>
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

                    {/* Container 2: Terapeutas cadastrados */}
                    <div className="bg-white p-6 rounded-lg shadow-md overflow-y-auto max-h-128 scrollbar-thin scrollbar-thumb-gray-400 scrollbar-track-gray-200">
                        <h2 className="text-2xl font-semibold mb-6">Terapeutas Cadastrados</h2>
                        
                        {/* Filtro de nome */}
                        <input
                            type="text"
                            placeholder="Filtrar por nome"
                            value={filtroNome}
                            onChange={(e) => setFiltroNome(e.target.value)}
                            className="p-2 border rounded mb-4"
                        />

                        {terapeutasFiltrados.map((terapeuta) => (
                            <div key={terapeuta.id} className="flex justify-between items-center mb-2 p-4 bg-gray-100 rounded-lg shadow-md">
                                <div>
                                    <p><strong>Nome:</strong> {terapeuta.nome}</p>
                                    <p><strong>Especialidade:</strong> {terapeuta.especialidade}</p>
                                    <p><strong>Telefone:</strong> {terapeuta.telefone}</p>
                                    <p><strong>Email:</strong> {terapeuta.email}</p>
                                </div>
                                <div className="flex space-x-4">
                                    <button onClick={() => openModal(terapeuta)} className="text-green-500" title="Editar Terapeuta">
                                        <FaEdit size={20} />
                                    </button>
                                    <button onClick={() => handleDelete(terapeuta.id)} className="text-red-500" title="Deletar Terapeuta">
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
                    <h2 className="text-2xl mb-6 font-semibold">Editar Terapeuta</h2>
                    <form>
                        <div className="mb-4">
                            <label className="block text-gray-700">Nome</label>
                            <input type="text" value={terapeutaSelecionado?.nome} onChange={(e) => setTerapeutaSelecionado({ ...terapeutaSelecionado, nome: e.target.value })} className="w-full p-2 border rounded" />
                        </div>
                        <div className="mb-4">
                            <label className="block text-gray-700">Especialidade (Terapia)</label>
                            <select
                                value={terapeutaSelecionado?.especialidade}
                                onChange={(e) => setTerapeutaSelecionado({ ...terapeutaSelecionado, especialidade: e.target.value })}
                                className="w-full p-2 border rounded"
                            >
                                <option value="">Selecione uma Terapia</option>
                                {terapias.map((terapia) => (
                                    <option key={terapia.id} value={terapia.nome}>
                                        {terapia.nome}
                                    </option>
                                ))}
                            </select>
                        </div>
                        <div className="mb-4">
                            <label className="block text-gray-700">Telefone</label>
                            <input type="text" value={terapeutaSelecionado?.telefone} onChange={(e) => setTerapeutaSelecionado({ ...terapeutaSelecionado, telefone: e.target.value })} className="w-full p-2 border rounded" />
                        </div>
                        <div className="mb-4">
                            <label className="block text-gray-700">Email</label>
                            <input type="email" value={terapeutaSelecionado?.email} onChange={(e) => setTerapeutaSelecionado({ ...terapeutaSelecionado, email: e.target.value })} className="w-full p-2 border rounded" />
                        </div>
                        <button type="submit" className="bg-green-500 text-white p-2 rounded w-full">Salvar</button>
                        <button onClick={closeModal} className="bg-gray-500 text-white p-2 rounded w-full mt-2">Cancelar</button>
                    </form>
                </Modal>
            )}
        </div>
    );
};

export default CadastroTerapeuta;
