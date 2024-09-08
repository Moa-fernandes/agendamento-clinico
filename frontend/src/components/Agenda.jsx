import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';
import recriareLogo from '../recriare2.png'; // Certifique-se que o caminho está correto

const Agenda = () => {
    const [appointments, setAppointments] = useState([]);
    const [salas, setSalas] = useState([]);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(true);
    const [selectedAppointment, setSelectedAppointment] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [currentTime, setCurrentTime] = useState('');
    const modalRef = useRef(null);

    // Função para formatar data no formato dia/mês/ano
    const formatarData = (data) => {
        return new Date(data).toLocaleDateString('pt-BR');
    };

    // Função para buscar os agendamentos e salas do backend
    useEffect(() => {
        const fetchAppointments = async () => {
            try {
                const response = await fetch('http://localhost:5000/appointments'); // Substitua pela URL correta
                if (!response.ok) {
                    throw new Error(`Erro ao buscar os agendamentos: ${response.status}`);
                }
                const data = await response.json();
                setAppointments(data.map((appointment) => ({
                    id: appointment.id,
                    title: appointment.patientName,
                    start: `${appointment.date}T${appointment.time}`,
                    extendedProps: {
                        therapistName: appointment.therapistName,
                        therapyName: appointment.therapyName,
                        therapyDescription: appointment.therapyDescription,
                        therapyDuration: appointment.therapyDuration,
                        observations: appointment.observations,
                        sala: appointment.sala, // Sala vinculada ao agendamento
                        status: appointment.status // Status da consulta
                    },
                })));

                // Atualizar status das salas com base nos agendamentos
                const allSalas = Array.from({ length: 25 }, (_, i) => ({
                    id: i + 1,
                    nome: `Sala ${i + 1}`,
                    status: 'disponivel', // Inicialmente todas disponíveis
                    appointmentInfo: null, // Inicializa sem consulta
                }));

                const updatedSalas = allSalas.map((sala) => {
                    const salaAgendada = data.find((appointment) => appointment.sala === sala.id && appointment.status === '2'); // Status "2" = agendado
                    const salaEmConsulta = data.find((appointment) => appointment.sala === sala.id && appointment.status === '1'); // Status "1" = em consulta
                    const salaDoDia = data.find((appointment) => {
                        const appointmentDate = new Date(appointment.date).toDateString();
                        const currentDate = new Date().toDateString();
                        return appointment.sala === sala.id && appointmentDate === currentDate;
                    });

                    let appointmentInfo = '';
                    if (salaAgendada || salaEmConsulta || salaDoDia) {
                        const appointment = salaAgendada || salaEmConsulta || salaDoDia;
                        appointmentInfo = `Paciente: ${appointment.patientName}\nTerapeuta: ${appointment.therapistName}\nTerapia: ${appointment.therapyName}\nData: ${formatarData(appointment.date)}\nHora: ${appointment.time}\nObservações: ${appointment.observations}`;
                    }

                    if (salaDoDia) {
                        return { ...sala, status: 'consulta_do_dia', appointmentInfo };
                    } else if (salaEmConsulta) {
                        return { ...sala, status: 'consulta', appointmentInfo };
                    } else if (salaAgendada) {
                        return { ...sala, status: 'agendado', appointmentInfo };
                    } else {
                        return { ...sala, status: 'disponivel', appointmentInfo };
                    }
                });

                setSalas(updatedSalas);

            } catch (error) {
                setError(error.message);
                console.error('Erro ao buscar agendamentos:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchAppointments();

        // Atualiza a hora de Brasília a cada segundo
        const intervalId = setInterval(() => {
            const now = new Date();
            const brazilTime = now.toLocaleTimeString('pt-BR', { timeZone: 'America/Sao_Paulo' });
            setCurrentTime(brazilTime);
        }, 1000);

        return () => clearInterval(intervalId); // Limpar o intervalo ao desmontar
    }, []);

    // Função para definir a cor do status
    const getStatusColor = (status) => {
        switch (status) {
            case 'disponivel':
                return 'bg-green-500'; // Verde
            case 'agendado':
                return 'bg-yellow-500'; // Amarelo
            case 'consulta_do_dia':
                return 'bg-red-500'; // Vermelho para consultas do dia
            case 'consulta':
                return 'bg-red-500'; // Vermelho para consultas em andamento
            default:
                return 'bg-gray-500';
        }
    };

    // Função para tornar o modal arrastável
    useEffect(() => {
        if (isModalOpen && modalRef.current) {
            const modal = modalRef.current;
            let isDragging = false;
            let startX, startY, initialX, initialY;

            const handleMouseDown = (e) => {
                isDragging = true;
                startX = e.clientX;
                startY = e.clientY;
                initialX = modal.offsetLeft;
                initialY = modal.offsetTop;
                document.addEventListener('mousemove', handleMouseMove);
                document.addEventListener('mouseup', handleMouseUp);
            };

            const handleMouseMove = (e) => {
                if (isDragging) {
                    const dx = e.clientX - startX;
                    const dy = e.clientY - startY;
                    modal.style.left = `${initialX + dx}px`;
                    modal.style.top = `${initialY + dy}px`;
                }
            };

            const handleMouseUp = () => {
                isDragging = false;
                document.removeEventListener('mousemove', handleMouseMove);
                document.removeEventListener('mouseup', handleMouseUp);
            };

            modal.addEventListener('mousedown', handleMouseDown);

            return () => {
                modal.removeEventListener('mousedown', handleMouseDown);
            };
        }
    }, [isModalOpen]);

    // Função para lidar com o clique em um evento
    const handleEventClick = (clickInfo) => {
        const appointment = {
            id: clickInfo.event.id,
            title: clickInfo.event.title,
            date: formatarData(clickInfo.event.startStr.split('T')[0]),
            time: clickInfo.event.startStr.split('T')[1].substr(0, 5),
            therapistName: clickInfo.event.extendedProps.therapistName,
            therapyName: clickInfo.event.extendedProps.therapyName,
            therapyDescription: clickInfo.event.extendedProps.therapyDescription,
            therapyDuration: clickInfo.event.extendedProps.therapyDuration,
            observations: clickInfo.event.extendedProps.observations,
            sala: clickInfo.event.extendedProps.sala, // Sala vinculada à consulta
        };
        setSelectedAppointment(appointment);
        setIsModalOpen(true);
    };

    // Função para fechar o modal
    const closeModal = () => {
        setIsModalOpen(false);
        setSelectedAppointment(null);
    };

    // Função para personalizar o conteúdo do evento
    const renderEventContent = (eventInfo) => {
        return (
            <div className="text-sm">
                <strong>{eventInfo.event.title}</strong><br />
                <span className="text-gray-500">Terapeuta: {eventInfo.event.extendedProps.therapistName}</span>
            </div>
        );
    };

    return (
        <div className="container mx-auto p-4">
            {/* Header com o horário de Brasília e centralizado */}
            <div className="flex justify-center items-center mb-4">
                <h1 className="text-3xl font-bold">Agenda de Consultas</h1>
            </div>
            <div className="flex justify-between items-center">
                <div className="text-right">
                    {/* Coloca o horário na frente do texto */}
                    <p className="text-gray-500 text-xl font-bold">Horário de Brasília: {currentTime}</p>
                </div>
                <Link to="/admin-dashboard" className="text-blue-500 hover:text-blue-700 transition duration-300 underline text-lg">
                    Voltar à página inicial
                </Link>
            </div>

            <br />

            {/* Exibir status das salas dinamicamente */}
            <div className="flex justify-center items-center mb-4">
                <h4 className="text-1xl font-bold">
                    <div className="flex justify-center items-center mb-4">
                        <h1 className="text-1xl font-bold">Salas</h1>
                    </div>
                    <span className="inline-flex items-center">
                        <span className="w-3 h-3 rounded-full bg-green-500 mr-1"></span> Disponíveis
                    </span> 
                    <span className="inline-flex items-center mx-2">
                        <span className="w-3 h-3 rounded-full bg-yellow-500 mr-1"></span> Agendadas
                    </span> 
                    <span className="inline-flex items-center">
                        <span className="w-3 h-3 rounded-full bg-red-500 mr-1"></span> Ocupadas
                    </span>
                </h4>
            </div>

            <br />

            <div className="grid grid-cols-5 gap-4 mb-4 justify-center items-center">
                {salas.map((sala) => (
                    <div key={sala.id} className="flex items-center justify-center" title={sala.appointmentInfo}>
                        <div className={`w-4 h-4 rounded-full ${getStatusColor(sala.status)} mr-2`} />
                        <span>{sala.nome}</span>
                    </div>
                ))}
            </div>

            {loading && (
                <div className="flex items-center justify-center h-screen bg-white">
                    {/* Animação de Loading */}
                    <img src={recriareLogo} alt="Loading..." className="animate-spin w-24 h-24" />
                </div>
            )}

            {error && <p className="text-red-500 text-center">{error}</p>}

            {!loading && !error && (
                <div className="bg-white shadow-lg rounded-lg p-6">
                    <FullCalendar
                        plugins={[dayGridPlugin, interactionPlugin]}
                        initialView="dayGridMonth"
                        events={appointments}
                        eventClick={handleEventClick}
                        editable={true}
                        selectable={true}
                        headerToolbar={{
                            left: 'prev,next today',
                            center: 'title',
                            right: 'dayGridMonth,dayGridWeek,dayGridDay'
                        }}
                        locale="pt-br"
                        eventContent={renderEventContent}
                    />
                </div>
            )}

            {/* Modal para exibir detalhes do agendamento */}
            {isModalOpen && selectedAppointment && (
                <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
                    <div
                        ref={modalRef}
                        className="bg-white p-6 rounded-lg shadow-xl w-11/12 max-w-md relative cursor-move"
                        style={{ position: 'absolute', top: '10%', left: '10%' }}
                    >
                        {/* Botão de fechar */}
                        <button
                            onClick={closeModal}
                            className="absolute top-2 right-2 text-red-500 text-2xl"
                        >
                            &times;
                        </button>
                        <h2 className="text-2xl font-bold mb-4 text-red-500">Detalhes do Agendamento</h2>
                        <p><strong>Paciente:</strong> {selectedAppointment.title}</p>
                        <p><strong>Terapeuta:</strong> {selectedAppointment.therapistName || 'N/A'}</p>
                        <p><strong>Terapia:</strong> {selectedAppointment.therapyName || 'N/A'}</p>
                        <p><strong>Descrição da Terapia:</strong> {selectedAppointment.therapyDescription || 'N/A'}</p>
                        <p><strong>Duração:</strong> {selectedAppointment.therapyDuration} minutos</p>
                        <p><strong>Data:</strong> {selectedAppointment.date}</p>
                        <p><strong>Hora:</strong> {selectedAppointment.time}</p>
                        <p><strong>Sala:</strong> {selectedAppointment.sala}</p>
                        <div className="flex justify-end mt-4">
                            <button
                                onClick={closeModal}
                                className="bg-blue-300 text-gray-700 px-4 py-2 rounded ml-2"
                            >
                                Fechar
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Agenda;
