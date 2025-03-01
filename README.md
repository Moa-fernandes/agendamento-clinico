---

# Clinical Scheduling System - Admin Dashboard

Welcome to the Admin Dashboard of the Clinical Scheduling System, designed to streamline the management of appointments, patients, therapists, and therapies. This system was created to optimize workflow in clinics and practices, utilizing modern technologies on both the frontend and backend to ensure an efficient and intuitive experience.

## Developer

This project was developed by **Moacir Fernandes**.

## Key Features

### 1. **Agenda**
   - View and manage the appointment schedule.
   - Filter appointments by patient, therapist, therapy, and date.
   - Display details such as time, duration, and consultation notes.

### 2. **Appointment Registration**
   - Register new appointments for patients.
   - Select the patient, therapist, and therapy during registration.
   - Assign a date, time, and room for each appointment.

### 3. **Patient Registration**
   - Manage patient registrations.
   - Include details such as name, date of birth, address, phone number, and email.
   - Link patients to specific therapists and therapies.

### 4. **Therapist Registration**
   - Register and manage therapists providing services on the platform.
   - Include details such as name, specialty, phone number, and email.

### 5. **Therapy Registration**
   - Manage and add new therapies offered in the system.
   - Set the duration of each therapy and add a description.

### 6. **Reports**
   - Generate daily, weekly, and monthly reports for clinic performance analysis.
   - Comprehensive report to view all system activities, including appointments, patients, rooms, and therapists.
   - **Allocation Report**, which uses an algorithm to cross-reference patient, room, and therapist data, optimizing resource usage efficiently.
   - Export reports in PDF format for review and analysis.

---

## Technologies Used

### **Backend** - Python Flask
The backend was developed using **Flask**, a minimalistic Python framework, along with other technologies to ensure an efficient RESTful API.

- **Flask**: Web framework used to create the API.
- **PostgreSQL**: Relational database used to store information about patients, therapists, appointments, and therapies.
- **psycopg2**: Library used to connect Flask and PostgreSQL.
- **Flask-CORS**: Allows cross-origin access control, facilitating communication between frontend and backend.
- **JWT (JSON Web Token)**: Used for user authentication and authorization.

### **Frontend** - React.js
The frontend was developed using **React.js**, providing a dynamic and interactive user experience.

- **React**: JavaScript library used for building user interfaces.
- **react-icons**: Icon library used for icons like filters and downloads.
- **react-pdf/renderer**: Library used to generate PDFs on the frontend, utilized in report generation.
- **recharts**: Chart library used to create graphical data visualizations on the dashboard.
- **Tailwind CSS / Custom CSS**: Used for styling and designing the user interface.

---

## Installation Guide

### 1. **Requirements**
   - **Python** (>=3.8)
   - **Node.js** (>=14.x.x)
   - **PostgreSQL** (>=12.x.x)
   - **Git**

### 2. **Cloning the Repository**
   ```bash
   git clone https://github.com/your-repository/clinical-scheduling.git
   cd clinical-scheduling
   ```

### 3. **Backend Installation (Flask)**

1. Create a virtual environment:
   ```bash
   python3 -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   ```

2. Install backend dependencies:
   ```bash
   pip install -r requirements.txt
   ```

3. Set up the PostgreSQL database and configure it in the `app.py` file:
   ```python
   # app.py
   conn = psycopg2.connect(
       dbname="agendaRecriare",
       user="postgres",
       password="your-password",
       host="localhost",
       port="5432"
   )
   ```

4. Start the Flask server:
   ```bash
   flask run
   ```

### 4. **Frontend Installation (React)**

1. Navigate to the frontend folder:
   ```bash
   cd frontend
   ```

2. Install the React project dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm start
   ```

---

## Usage

1. Access the Admin Dashboard via the browser.
2. Navigate through the available features:
   - **Agenda**: To view and manage appointments.
   - **Appointment Registration**: To add new appointments.
   - **Patient Registration**: To manage patients.
   - **Therapist Registration**: To manage therapists.
   - **Therapy Registration**: To manage and add new therapies.
   - **Reports**: To view performance reports, including the Allocation Report.

---

## Contributions

Contributions are welcome! Feel free to open a Pull Request or report issues on the Issues tab.

---

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for more information.

---

This version includes the allocation report and mentions the algorithm developed for patient, room, and therapist matching.

---



Aqui está o README atualizado para o **Admin Dashboard do Sistema de Agendamento Clínico**, com as informações sobre relatórios e o algoritmo de alocação de pacientes, salas e especialistas:

---

# Agendamento Clínico - Admin Dashboard

Bem-vindo ao Admin Dashboard do sistema de Agendamento Clínico, desenvolvido para facilitar a gestão de consultas, pacientes, terapeutas e terapias. Este sistema foi criado para otimizar o fluxo de trabalho em clínicas e consultórios, utilizando uma série de tecnologias modernas no frontend e backend para garantir uma experiência eficiente e intuitiva.

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
   - Geração de relatórios diários, semanais e mensais para análise do desempenho da clínica.
   - Relatório geral para visualizar todas as atividades do sistema, incluindo consultas, pacientes, salas e terapeutas.
   - Relatório de **Alocação**, que utiliza um algoritmo desenvolvido para o cruzamento de dados de pacientes, salas e especialistas (terapeutas), otimizando o uso dos recursos de forma eficiente.
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

---

## Uso

1. Acesse o Admin Dashboard através do navegador.
2. Navegue pelas diferentes funcionalidades disponíveis:
   - **Agenda**: Para visualizar e gerenciar consultas.
   - **Cadastro de Consulta**: Para adicionar novas consultas.
   - **Cadastro de Paciente**: Para gerenciar pacientes.
   - **Cadastro de Terapeuta**: Para gerenciar terapeutas.
   - **Cadastro de Terapias**: Para gerenciar e adicionar novas terapias.
   - **Relatórios**: Para visualizar relatórios de desempenho, incluindo o Relatório de Alocação.

---

## Contribuições

Contribuições são bem-vindas! Sinta-se à vontade para abrir um Pull Request ou relatar problemas na aba de Issues.

---

## Licença

Este projeto está sob a licença MIT. Consulte o arquivo [LICENSE](LICENSE) para mais informações.

---

Essa versão inclui o relatório de alocação e menciona o algoritmo desenvolvido para o cruzamento de pacientes, salas e terapeutas.
