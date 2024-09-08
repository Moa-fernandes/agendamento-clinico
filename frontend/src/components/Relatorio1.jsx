import React, { useState, useEffect } from 'react';
import { FaDownload, FaFilter } from 'react-icons/fa';
import { Page, Text, View, Document, PDFDownloadLink } from '@react-pdf/renderer';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import Modal from 'react-modal';
import recriareLogo from '../recriare2.png';
import './Relatorio1.css';

Modal.setAppElement('#root');

const Relatorio1 = () => {
    const [consultas, setConsultas] = useState([]);
    const [filteredConsultas, setFilteredConsultas] = useState([]);
    const [terapeutas, setTerapeutas] = useState([]);
    const [filtros, setFiltros] = useState({ paciente: '', terapeuta: '', terapia: '', sala: '', data: '', horario: '' });
    const [currentTime, setCurrentTime] = useState(new Date().toLocaleTimeString('pt-BR', { timeZone: 'America/Sao_Paulo' }));

    useEffect(() => {
        const timer = setInterval(() => {
            setCurrentTime(new Date().toLocaleTimeString('pt-BR', { timeZone: 'America/Sao_Paulo' }));
        }, 1000);
        return () => clearInterval(timer);
    }, []);

    useEffect(() => {
        const fetchData = async () => {
            const consultasResponse = await fetch('http://localhost:5000/consultas');
            const consultasData = await consultasResponse.json();
            setConsultas(consultasData);
            setFilteredConsultas(consultasData);

            const terapeutasResponse = await fetch('http://localhost:5000/terapeutas');
            const terapeutasData = await terapeutasResponse.json();
            setTerapeutas(terapeutasData);
        };
        fetchData();
    }, []);

    const applyFilters = () => {
        let filtered = consultas;

        if (filtros.paciente) {
            filtered = filtered.filter((consulta) => consulta.paciente.toLowerCase().includes(filtros.paciente.toLowerCase()));
        }

        if (filtros.terapeuta) {
            filtered = filtered.filter((consulta) => consulta.terapeuta.toLowerCase().includes(filtros.terapeuta.toLowerCase()));
        }

        if (filtros.terapia) {
            filtered = filtered.filter((consulta) => consulta.terapia.toLowerCase().includes(filtros.terapia.toLowerCase()));
        }

        if (filtros.sala) {
            filtered = filtered.filter((consulta) => {
                // Verifica se a sala é uma string antes de aplicar toLowerCase
                return typeof consulta.sala === 'string' && consulta.sala.toLowerCase().includes(filtros.sala.toLowerCase());
            });
        }

        if (filtros.data) {
            filtered = filtered.filter((consulta) => new Date(consulta.data_consulta).toLocaleDateString('pt-BR') === new Date(filtros.data).toLocaleDateString('pt-BR'));
        }

        if (filtros.horario) {
            filtered = filtered.filter((consulta) => consulta.horario.includes(filtros.horario));
        }

        setFilteredConsultas(filtered);
    };

    const chartData = terapeutas.map((terapeuta) => {
        const count = consultas.filter((consulta) => consulta.terapeuta === terapeuta.nome).length;
        return { name: terapeuta.nome, sessions: count };
    });

    const PDFReport = () => (
        <Document>
            <Page size="A4">
                <View style={{ margin: 10 }}>
                    <Text style={{ fontSize: 24, marginBottom: 10 }}>Relatório de Consultas</Text>
                    {filteredConsultas.map((consulta, idx) => (
                        <View key={idx} style={{ marginBottom: 10 }}>
                            <Text>Paciente: {consulta.paciente}</Text>
                            <Text>Terapeuta: {consulta.terapeuta}</Text>
                            <Text>Terapia: {consulta.terapia}</Text>
                            <Text>Sala: {consulta.sala}</Text>
                            <Text>Data: {new Date(consulta.data_consulta).toLocaleDateString('pt-BR')}</Text>
                            <Text>Hora: {consulta.horario}</Text>
                            <Text>Duração: {consulta.duracao_consulta ? `${consulta.duracao_consulta} minutos` : 'Duração não disponível'}</Text>
                            <Text>Observações: {consulta.observacoes}</Text>
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
                    <h1 className="relatorio-title">Relatório de Consultas</h1>
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
                    <input type="text" placeholder="Terapia" value={filtros.terapia} onChange={(e) => setFiltros({ ...filtros, terapia: e.target.value })} />
                    <input type="text" placeholder="Sala" value={filtros.sala} onChange={(e) => setFiltros({ ...filtros, sala: e.target.value })} />
                    <input type="date" value={filtros.data} onChange={(e) => setFiltros({ ...filtros, data: e.target.value })} />
                    <input type="time" value={filtros.horario} onChange={(e) => setFiltros({ ...filtros, horario: e.target.value })} />
                </div>
                <button onClick={applyFilters} className="relatorio-filter-button">
                    <FaFilter /> Aplicar Filtros
                </button>
                <div className="consulta-counter">
                    <h3>{filteredConsultas.length} Consultas Encontradas</h3>
                </div>
            </div>

            <div className="relatorio-report-section">
                <span className="relatorio-filter-button">Consultas Cadastradas</span>
                {filteredConsultas.length === 0 ? (
                    <p className="relatorio-no-data">Nenhuma consulta encontrada.</p>
                ) : (
                    <table className="relatorio-consultas-table">
                        <thead>
                            <tr>
                                <th>Paciente</th>
                                <th>Terapeuta</th>
                                <th>Terapia</th>
                                <th>Sala</th>
                                <th>Data</th>
                                <th>Hora</th>
                                <th>Duração</th>
                                <th>Observações</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredConsultas.map((consulta) => (
                                <tr key={consulta.id}>
                                    <td>{consulta.paciente}</td>
                                    <td>{consulta.terapeuta}</td>
                                    <td>{consulta.terapia}</td>
                                    <td>{consulta.sala}</td>
                                    <td>{consulta.data_consulta}</td>
                                    <td>{consulta.hora_consulta ? consulta.hora_consulta : "Horário não disponível"}</td>
                                    <td>{consulta.duracao_minutos ? `${consulta.duracao_minutos} min` : "Duração não disponível"}</td>
                                    <td>{consulta.observacoes || "Sem observações"}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </div>

            <div className="relatorio-chart-section">
                <h2>Gráfico de Consultas por Terapeuta</h2>
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
                <PDFDownloadLink document={<PDFReport />} fileName="relatorio_consultas.pdf">
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

export default Relatorio1;
