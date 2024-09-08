import React, { useState, useEffect } from 'react';
import { FaDownload, FaFilter } from 'react-icons/fa';
import { Page, Text, View, Document, PDFDownloadLink } from '@react-pdf/renderer';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import Modal from 'react-modal';
import recriareLogo from '../recriare2.png';
import './Relatorio2.css';

Modal.setAppElement('#root');

const Relatorio2 = () => {
    const [consultas, setConsultas] = useState([]);
    const [alocacoes, setAlocacoes] = useState([]);
    const [filtros, setFiltros] = useState({ paciente: '', terapeuta: '', sala: '', horario: '' });
    const [currentTime, setCurrentTime] = useState(new Date().toLocaleTimeString('pt-BR', { timeZone: 'America/Sao_Paulo' }));

    useEffect(() => {
        const timer = setInterval(() => {
            setCurrentTime(new Date().toLocaleTimeString('pt-BR', { timeZone: 'America/Sao_Paulo' }));
        }, 1000);
        return () => clearInterval(timer);
    }, []);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch('http://localhost:5000/consultas');
                const data = await response.json();
                setConsultas(data);
                setAlocacoes(data); // Usar os dados diretamente na tabela
            } catch (error) {
                console.error('Erro ao buscar dados:', error);
            }
        };
        fetchData();
    }, []);

    const applyFilters = () => {
        let filtered = consultas;

        if (filtros.paciente) {
            filtered = filtered.filter((consulta) =>
                consulta.paciente.toLowerCase().includes(filtros.paciente.toLowerCase())
            );
        }

        if (filtros.terapeuta) {
            filtered = filtered.filter((consulta) =>
                consulta.terapeuta.toLowerCase().includes(filtros.terapeuta.toLowerCase())
            );
        }

        if (filtros.sala) {
            filtered = filtered.filter((consulta) =>
                consulta.sala && consulta.sala.toLowerCase().includes(filtros.sala.toLowerCase())
            );
        }

        if (filtros.horario) {
            filtered = filtered.filter((consulta) =>
                consulta.hora_consulta.includes(filtros.horario)
            );
        }

        setAlocacoes(filtered);
    };

    const chartData = consultas.map((consulta) => ({
        name: consulta.terapeuta,
        sessions: consultas.filter((c) => c.terapeuta === consulta.terapeuta).length,
    }));

    const PDFReport = () => (
        <Document>
            <Page size="A4">
                <View style={{ margin: 10 }}>
                    <Text style={{ fontSize: 24, marginBottom: 10 }}>Relatório de Alocações</Text>
                    {alocacoes.map((alocacao, idx) => (
                        <View key={idx} style={{ marginBottom: 10 }}>
                            <Text>Paciente: {alocacao.paciente}</Text>
                            <Text>Terapeuta: {alocacao.terapeuta}</Text>
                            <Text>Terapia: {alocacao.terapia}</Text>
                            <Text>Sala: {alocacao.sala}</Text>
                            <Text>Horário: {new Date(alocacao.data_consulta).toLocaleString('pt-BR')}</Text>
                            <Text>Observações: {alocacao.observacoes}</Text>
                        </View>
                    ))}
                </View>
            </Page>
        </Document>
    );

    return (
        <div className="relatorio-page-container">
            <header className="relatorio-header">
                <div className="relatorio-header-left">
                    <img src={recriareLogo} alt="Logo Recriare" className="relatorio-logo" />
                    <h1 className="relatorio-title">Relatório de Alocações</h1>
                </div>
                <div className="relatorio-header-right">
                    <span className="relatorio-current-time">{currentTime}</span>
                    <a href="/admin-dashboard" className="relatorio-back-link">Voltar à Tela Inicial</a>
                </div>
            </header>

            <div className="relatorio-filters">
                <h2>Filtros</h2>
                <div className="relatorio-grid">
                    <input type="text" placeholder="Paciente" value={filtros.paciente} onChange={(e) => setFiltros({ ...filtros, paciente: e.target.value })} />
                    <input type="text" placeholder="Terapeuta" value={filtros.terapeuta} onChange={(e) => setFiltros({ ...filtros, terapeuta: e.target.value })} />
                    <input type="text" placeholder="Sala" value={filtros.sala} onChange={(e) => setFiltros({ ...filtros, sala: e.target.value })} />
                    <input type="time" value={filtros.horario} onChange={(e) => setFiltros({ ...filtros, horario: e.target.value })} />
                </div>
                <button onClick={applyFilters} className="relatorio-filter-button">
                    <FaFilter /> Aplicar Filtros
                </button>
                <div className="consulta-counter">
                    <h3>{alocacoes.length} Alocações Encontradas</h3>
                </div>
            </div>

            <div className="relatorio-report-section">
                {alocacoes.length === 0 ? (
                    <p className="relatorio-no-data">Nenhuma alocação encontrada.</p>
                ) : (
                    <table className="relatorio-consultas-table">
                        <thead>
                            <tr>
                                <th>Paciente</th>
                                <th>Terapeuta</th>
                                <th>Terapia</th>
                                <th>Sala</th>
                                <th>Horário</th>
                                <th>Observações</th>
                            </tr>
                        </thead>
                        <tbody>
                            {alocacoes.map((alocacao, idx) => (
                                <tr key={idx}>
                                    <td>{alocacao.paciente}</td>
                                    <td>{alocacao.terapeuta}</td>
                                    <td>{alocacao.terapia}</td>
                                    <td>{alocacao.sala}</td>
                                    <td>{alocacao.hora_consulta}</td>
                                    <td>{alocacao.observacoes}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </div>

            <div className="relatorio-chart-section">
                <h2>Gráfico de Alocações por Terapeuta</h2>
                <ResponsiveContainer width="100%" height={400}>
                    <BarChart data={chartData}>
                        <XAxis dataKey="name" />
                        <YAxis />
                        <Tooltip />
                        <Bar dataKey="sessions" fill="#3498db" />
                    </BarChart>
                </ResponsiveContainer>
            </div>

            <div className="relatorio-pdf-download">
                <PDFDownloadLink document={<PDFReport />} fileName="relatorio_alocacoes.pdf">
                    {({ loading }) => (
                        <button className="relatorio-download-button">
                            <FaDownload /> {loading ? 'Gerando PDF...' : 'Baixar Relatório em PDF'}
                        </button>
                    )}
                </PDFDownloadLink>
            </div>
        </div>
    );
};

export default Relatorio2;
