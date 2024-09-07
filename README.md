
# Agendamento Clínico - Admin Dashboard

Bem-vindo ao Admin Dashboard do sistema de Agendamento Clínico, desenvolvido para facilitar a gestão de consultas, pacientes, terapeutas e terapias. Este sistema foi desenvolvido utilizando uma série de tecnologias modernas no frontend e backend para garantir uma experiência eficiente e intuitiva.

## Desenvolvedor

Este projeto foi desenvolvido por **Moacir Fernandes**, Desenvolvedor Pleno.

## Funcionalidades Principais

### 1. **Agenda**
   - Visualize e gerencie a agenda de consultas.
   - Filtre consultas por paciente, terapeuta, terapia e data.
   - Exiba detalhes como hora, duração e observações das consultas.

### 2. **Cadastro de Consulta**
   - Cadastre novas consultas para os pacientes.
   - Selecione o paciente, terapeuta e terapia durante o cadastro.
   - Atribua data, hora e sala para cada consulta.

### 3. **Cadastro de Paciente**
   - Gerencie o cadastro de pacientes.
   - Inclua informações como nome, data de nascimento, endereço, telefone e e-mail.
   - Relacione pacientes com terapeutas e terapias específicas.

### 4. **Cadastro de Terapeuta**
   - Cadastre e gerencie os terapeutas que prestarão serviços na plataforma.
   - Inclua detalhes como nome, especialidade, telefone e e-mail.

### 5. **Cadastro de Terapias**
   - Gerencie e adicione novas terapias oferecidas no sistema.
   - Defina a duração de cada terapia e adicione uma descrição.

### 6. **Relatórios**
   - Geração de relatórios diários, semanais e mensais.
   - Exporte relatórios em PDF para visualização e análise.

---

## Tecnologias Utilizadas

### **Backend** - Python Flask
O backend foi desenvolvido utilizando o **Flask**, um framework minimalista de Python, junto com outras tecnologias para garantir uma API RESTful eficiente.

- **Flask**: Framework web usado para criar a API.
- **PostgreSQL**: Banco de dados relacional utilizado para armazenar informações de pacientes, terapeutas, consultas e terapias.
- **psycopg2**: Biblioteca que faz a conexão entre Flask e PostgreSQL.
- **Flask-CORS**: Permite o controle de acessos cross-origin, facilitando a comunicação entre o frontend e o backend.
- **JWT (JSON Web Token)**: Utilizado para autenticação e autorização de usuários no sistema.
  
### **Frontend** - React.js
O frontend foi desenvolvido utilizando **React.js**, proporcionando uma experiência de usuário dinâmica e interativa.

- **React**: Biblioteca JavaScript utilizada para construir interfaces de usuário.
- **react-icons**: Biblioteca de ícones usada para ícones como filtros e downloads.
- **react-pdf/renderer**: Biblioteca para gerar PDFs no frontend, utilizada na geração de relatórios.
- **recharts**: Biblioteca de gráficos utilizada para criar visualizações gráficas dos dados no dashboard.
- **Tailwind CSS / Custom CSS**: Utilizadas para estilização e design da interface de usuário.
  
---

## Passo a Passo de Instalação

### 1. **Requisitos**
   - **Python** (>=3.8)
   - **Node.js** (>=14.x.x)
   - **PostgreSQL** (>=12.x.x)
   - **Git**

### 2. **Clonando o Repositório**
   ```bash
   git clone https://github.com/seu-repositorio/agendamento-clinico.git
   cd agendamento-clinico
   ```

### 3. **Instalação do Backend (Flask)**

1. Crie um ambiente virtual:
   ```bash
   python3 -m venv venv
   source venv/bin/activate  # No Windows: venv\Scripts\activate
   ```

2. Instale as dependências do backend:
   ```bash
   pip install -r requirements.txt
   ```

3. Crie o banco de dados PostgreSQL e configure-o no arquivo `app.py`:
   ```python
   # app.py
   conn = psycopg2.connect(
       dbname="agendaRecriare",
       user="postgres",  
       password="sua-senha",
       host="localhost",
       port="5432"
   )
   ```

4. Inicialize o servidor Flask:
   ```bash
   flask run
   ```

### 4. **Instalação do Frontend (React)**

1. Navegue até a pasta do frontend:
   ```bash
   cd frontend
   ```

2. Instale as dependências do projeto React:
   ```bash
   npm install
   ```

3. Inicialize o servidor de desenvolvimento:
   ```bash
   npm start
   ```

### 5. **Bibliotecas do Backend**
   - **Flask**: 
     ```bash
     pip install Flask
     ```
   - **psycopg2**:
     ```bash
     pip install psycopg2
     ```
   - **Flask-CORS**:
     ```bash
     pip install flask-cors
     ```
   - **Flask-JWT-Extended**:
     ```bash
     pip install Flask-JWT-Extended
     ```

### 6. **Bibliotecas do Frontend**
   - **React**:
     ```bash
     npx create-react-app frontend
     ```
   - **react-icons**:
     ```bash
     npm install react-icons
     ```
   - **react-pdf/renderer**:
     ```bash
     npm install @react-pdf/renderer
     ```
   - **recharts**:
     ```bash
     npm install recharts
     ```
   - **axios** (para chamadas API):
     ```bash
     npm install axios
     ```

---

## Estrutura de Pastas

```bash
agendamento-clinico/
├── backend/                # Código do servidor Flask
│   ├── app.py              # Arquivo principal do servidor
│   ├── requirements.txt    # Dependências do backend
├── frontend/               # Código do cliente React
│   ├── src/                # Código-fonte do React
│   ├── public/             # Arquivos estáticos
│   ├── package.json        # Dependências do frontend
└── README.md               # Instruções do projeto
```

---

## Uso

1. Acesse o Admin Dashboard através do navegador.
2. Navegue pelas diferentes funcionalidades disponíveis:
   - **Agenda**: Para visualizar e gerenciar consultas.
   - **Cadastro de Consulta**: Para adicionar novas consultas.
   - **Cadastro de Paciente**: Para gerenciar pacientes.
   - **Cadastro de Terapeuta**: Para gerenciar terapeutas.
   - **Cadastro de Terapias**: Para gerenciar e adicionar novas terapias.
   - **Relatórios**: Para visualizar relatórios de desempenho.

---

## Contribuições

Contribuições são bem-vindas! Sinta-se à vontade para abrir um Pull Request ou relatar problemas na aba de Issues.

---

## Licença

Este projeto está sob a licença MIT. Consulte o arquivo [LICENSE](LICENSE) para mais informações.
