import React, { useState } from 'react';
import { FaUser, FaEye, FaEyeSlash } from 'react-icons/fa';
import recriareLogo from '../recriare2.png'; // Certifique-se de que a imagem existe nesse diretório

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('moamoamoa');
    const [error, setError] = useState('');
    const [showPassword, setShowPassword] = useState(false); // Para exibir ou esconder senha

    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        try {
            const response = await fetch('http://localhost:5000/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email, password }),
            });

            const data = await response.json();

            if (data.success) {
                if (data.role === 'admin') {
                    window.location.href = '/admin-dashboard';
                } else if (data.role === 'terapeuta') {
                    window.location.href = '/terapeuta-dashboard';
                } else {
                    window.location.href = '/cliente-dashboard';
                }
            } else {
                setError('Credenciais inválidas');
            }
        } catch (error) {
            setError('Erro ao tentar fazer login');
        }
    };

    return (
        <div className="relative w-full h-screen bg-white flex justify-center items-center">
            {/* Logo acima da caixa de login */}
            <img src={recriareLogo} alt="Recriare Logo" className="w-[120px] md:w-[150px] absolute top-2" />


            {/* Polígono ao lado esquerdo colado na caixa de login */}
            <div className="absolute bg-red-500 shadow-lg w-[150px] h-[150px] rotate-[157deg] rounded-[85px] left-[10%] top-[10%]"></div>

            {/* Polígono ao lado direito colado na caixa de login */}
            <div className="absolute bg-green-500 shadow-lg w-[150px] h-[150px] rotate-[157deg] rounded-[85px] right-[50%] top-[30%]"></div>

            {/* Polígono no rodapé da caixa de login */}
            <div className="absolute bg-yellow-500 shadow-lg w-[200px] h-[200px] rotate-[157deg] rounded-[85px] left-[40%] top-[60%]"></div>

            {/* Polígono na direita da tela */}
            <div className="absolute bg-blue-500 shadow-lg w-[400px] h-[400px] rotate-[157deg] rounded-[85px] right-10 top-[10%]"></div>

            {/* Caixa de Login mais para a esquerda */}
            <div className="relative z-10 w-[90%] max-w-[410px] h-auto bg-white shadow-lg rounded-[10px] flex flex-col items-center justify-center p-6 md:p-20 left-[-20%]">
                <h1 className="text-lg md:text-xl font-semibold text-gray-800 mb-4">Bem vindo ao LOGIN</h1>
                {error && <p className="text-red-500 mb-4">{error}</p>}
                <form onSubmit={handleSubmit} className="w-full">
                    <div className="mb-4 relative">
                        <label className="block text-gray-700 text-sm font-bold mb-2">Usuário:</label>
                        <div className="relative">
                            <FaUser className="absolute left-3 top-[35%] text-gray-400" />
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="shadow appearance-none border rounded w-full py-2 pl-10 pr-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                required
                            />
                        </div>
                    </div>

                    <div className="mb-4 relative">
                        <label className="block text-gray-700 text-sm font-bold mb-2">Senha:</label>
                        <div className="relative">
                            <input
                                type={showPassword ? 'text' : 'password'}
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="shadow appearance-none border rounded w-full py-2 pl-3 pr-10 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                required
                            />
                            {showPassword ? (
                                <FaEyeSlash
                                    onClick={togglePasswordVisibility}
                                    className="absolute right-3 top-[35%] text-gray-400 cursor-pointer"
                                />
                            ) : (
                                <FaEye
                                    onClick={togglePasswordVisibility}
                                    className="absolute right-3 top-[35%] text-gray-400 cursor-pointer"
                                />
                            )}
                        </div>
                    </div>

                    <div className="flex items-center justify-between">
                        <button
                            type="submit"
                            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                        >
                            Entrar
                        </button>
                    </div>
                </form>
            </div>

            {/* Rodapé */}
            <footer className="absolute bottom-0 w-full bg-blue-500 text-white text-center py-2 sm:py-4">
                <p className="text-xs sm:text-sm">Developed by Moa Fernandes</p>
            </footer>
        </div>
    );
};

export default Login;
