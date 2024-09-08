import React, { useState, useEffect } from 'react';
import { FaEdit, FaTrashAlt } from 'react-icons/fa';
import Modal from 'react-modal';
import { Link } from 'react-router-dom';
import recriareLogo from '../recriare2.png'; // Verifique se o caminho está correto.

Modal.setAppElement('#root');

const CadastroTerapia = () => {
    const [terapias, setTerapias] = useState([]);
    const [modalIsOpen, setModalIsOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const [terapiaSelecionada, setTerapiaSelecionada] = useState(null);
    const [nome, setNome] = useState('');
    const [descricao, setDescricao] = useState('');
    const [duracao, setDuracao] = useState('');
    const [currentTime, setCurrentTime] = useState(new Date().toLocaleTimeString('pt-BR', { timeZone: 'America/Sao_Paulo' }));
    const [filtroNome, setFiltroNome] = useState('');

    // Atualizar o horário em tempo real
    useEffect(() => {
        const timer = setInterval(() => {
            setCurrentTime(new Date().toLocaleTimeString('pt-BR', { timeZone: 'America/Sao_Paulo' }));
        }, 1000);
        return () => clearInterval(timer);
    }, []);

   

    // Fetch das terapias cadastradas
    const fetchTerapias = () => {
        fetch('http://localhost:5000/terapias')
            .then(response => response.json())
            .then(data => setTerapias(data));
    };

    useEffect(() => {
        fetchTerapias();
    }, []);

    // Função para cadastrar uma nova terapia
    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        const novaTerapia = {
            nome,
            descricao,
            duracao_minutos: duracao
        };

        try {
            const response = await fetch('http://localhost:5000/add-terapia', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(novaTerapia)
            });

            const data = await response.json();
            if (data.success) {
                alert("Terapia cadastrada com sucesso!");
                fetchTerapias(); // Atualiza a lista de terapias
                setNome('');
                setDescricao('');
                setDuracao('');
            } else {
                alert("Erro ao cadastrar terapia: " + data.error);
            }
        } catch (error) {
            console.error("Erro na requisição:", error);
            alert("Erro na requisição");
        } finally {
            setLoading(false);
        }
    };

    // Função para deletar uma terapia
    const handleDelete = (id) => {
        fetch(`http://localhost:5000/delete-terapia/${id}`, { method: 'DELETE' })
            .then(() => {
                setTerapias(terapias.filter(terapia => terapia.id !== id));
            });
    };

    // Função para abrir modal de edição
    const openModal = (terapia) => {
        setTerapiaSelecionada(terapia);
        setModalIsOpen(true);
    };

    const closeModal = () => {
        setModalIsOpen(false);
        setTerapiaSelecionada(null);
    };

    // Função para editar a terapia
    const handleEdit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            const response = await fetch(`http://localhost:5000/edit-terapia/${terapiaSelecionada.id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(terapiaSelecionada)
            });

            const data = await response.json();
            if (data.success) {
                alert("Terapia editada com sucesso!");
                fetchTerapias(); // Atualiza a lista de terapias
                closeModal(); // Fecha o modal após salvar
            } else {
                alert("Erro ao editar terapia: " + data.error);
            }
        } catch (error) {
            console.error("Erro na requisição:", error);
            alert("Erro na requisição");
        } finally {
            setLoading(false);
        }
    };

    // Filtrar terapias pelo nome
    const terapiasFiltradas = terapias.filter(terapia =>
        terapia.nome.toLowerCase().includes(filtroNome.toLowerCase())
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
                        <h2 className="text-2xl font-semibold mb-6">Cadastrar Terapia</h2>
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
                                <label className="block text-gray-700">Descrição</label>
                                <textarea
                                    value={descricao}
                                    onChange={(e) => setDescricao(e.target.value)}
                                    className="w-full p-2 border rounded"
                                    required
                                ></textarea>
                            </div>
                            <div className="mb-4">
                                <label className="block text-gray-700">Duração (em minutos)</label>
                                <input
                                    type="number"
                                    value={duracao}
                                    onChange={(e) => setDuracao(e.target.value)}
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

                    {/* Container 2: Terapias cadastradas */}
                    <div className="bg-white p-6 rounded-lg shadow-md overflow-y-auto max-h-128 scrollbar-thin scrollbar-thumb-gray-400 scrollbar-track-gray-200">
                        <h2 className="text-2xl font-semibold mb-6">Terapias Cadastradas</h2>
                        
                        {/* Filtro de nome */}
                        <input
                            type="text"
                            placeholder="Filtrar por nome"
                            value={filtroNome}
                            onChange={(e) => setFiltroNome(e.target.value)}
                            className="p-2 border rounded mb-4"
                        />

                        {terapiasFiltradas.map((terapia) => (
                            <div key={terapia.id} className="flex justify-between items-center mb-2 p-4 bg-gray-100 rounded-lg shadow-md">
                                <div>
                                    <p><strong>Nome:</strong> {terapia.nome}</p>
                                    <p><strong>Descrição:</strong> {terapia.descricao}</p>
                                    <p><strong>Duração:</strong> {terapia.duracao_minutos} minutos</p>
                                </div>
                                <div className="flex space-x-4">
                                    <button onClick={() => openModal(terapia)} className="text-green-500" title="Editar Terapia">
                                        <FaEdit size={20} />
                                    </button>
                                    <button onClick={() => handleDelete(terapia.id)} className="text-red-500" title="Deletar Terapia">
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
                    <h2 className="text-2xl mb-6 font-semibold">Editar Terapia</h2>
                    <form onSubmit={handleEdit}>
                        <div className="mb-4">
                            <label className="block text-gray-700">Nome</label>
                            <input type="text" value={terapiaSelecionada?.nome} onChange={(e) => setTerapiaSelecionada({ ...terapiaSelecionada, nome: e.target.value })} className="w-full p-2 border rounded" />
                        </div>
                        <div className="mb-4">
                            <label className="block text-gray-700">Descrição</label>
                            <textarea value={terapiaSelecionada?.descricao} onChange={(e) => setTerapiaSelecionada({ ...terapiaSelecionada, descricao: e.target.value })} className="w-full p-2 border rounded"></textarea>
                        </div>
                        <div className="mb-4">
                            <label className="block text-gray-700">Duração (em minutos)</label>
                            <input type="number" value={terapiaSelecionada?.duracao_minutos} onChange={(e) => setTerapiaSelecionada({ ...terapiaSelecionada, duracao_minutos: e.target.value })} className="w-full p-2 border rounded" />
                        </div>
                        <button type="submit" className="bg-green-500 text-white p-2 rounded w-full">Salvar</button>
                        <button onClick={closeModal} className="bg-gray-500 text-white p-2 rounded w-full mt-2">Cancelar</button>
                    </form>
                </Modal>
            )}
        </div>
    );
};

export default CadastroTerapia;
