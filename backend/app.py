from flask import Flask, jsonify, request
import psycopg2
from flask_cors import CORS
from datetime import datetime

app = Flask(__name__)
CORS(app)

# Função para conectar ao banco
def get_db_connection():
    conn = psycopg2.connect(
        dbname="agendaRecriare",
        user="postgres",  
        password="moamoamoa",
        host="localhost",
        port="5432"
    )
    return conn

# Rota de login
@app.route('/login', methods=['POST'])
def login():
    data = request.get_json()
    email = data.get('email')
    password = data.get('password')

    conn = get_db_connection()
    cur = conn.cursor()

    cur.execute("SELECT email, senha, role FROM usuarios WHERE email=%s", (email,))
    user = cur.fetchone()

    cur.close()
    conn.close()

    if user and user[1] == password:
        role = user[2]
        return jsonify({"success": True, "role": role})
    else:
        return jsonify({"success": False}), 401

# Rota para obter pacientes
@app.route('/pacientes', methods=['GET'])
def get_pacientes():
    conn = get_db_connection()
    cur = conn.cursor()
    cur.execute('SELECT id, nome, data_nascimento, endereco, telefone, email FROM pacientes;')
    pacientes = cur.fetchall()
    cur.close()
    conn.close()

    pacientes_list = [{'id': p[0], 'nome': p[1], 'data_nascimento': p[2], 'endereco': p[3], 'telefone': p[4], 'email': p[5]} for p in pacientes]
    return jsonify(pacientes_list)

# Rota para deletar um paciente
@app.route('/delete-paciente/<int:id>', methods=['DELETE'])
def delete_paciente(id):
    conn = get_db_connection()
    cur = conn.cursor()
    cur.execute('DELETE FROM pacientes WHERE id = %s;', (id,))
    conn.commit()
    cur.close()
    conn.close()
    return '', 204


# Rota para obter terapeutas
@app.route('/terapeutas', methods=['GET'])
def get_terapeutas():
    conn = get_db_connection()
    cur = conn.cursor()
    cur.execute('SELECT id, nome, especialidade, telefone, email FROM terapeutas;')
    terapeutas = cur.fetchall()
    cur.close()
    conn.close()

    terapeutas_list = [{'id': t[0], 'nome': t[1], 'especialidade': t[2], 'telefone': t[3], 'email': t[4]} for t in terapeutas]
    return jsonify(terapeutas_list)


# Rota para obter terapias
@app.route('/terapias', methods=['GET'])
def get_terapias():
    conn = get_db_connection()
    cur = conn.cursor()
    # Incluí as colunas descricao e duracao_minutos na consulta SQL
    cur.execute('SELECT id, nome, descricao, duracao_minutos FROM terapias;')
    terapias = cur.fetchall()
    cur.close()
    conn.close()

    # Modifiquei o dicionário para incluir descricao e duracao_minutos
    terapias_list = [{'id': te[0], 'nome': te[1], 'descricao': te[2], 'duracao_minutos': te[3]} for te in terapias]
    return jsonify(terapias_list)


# Rota para obter consultas (para Agenda)
@app.route('/appointments', methods=['GET'])
def get_appointments():
    conn = get_db_connection()
    cur = conn.cursor()

    cur.execute("""
        SELECT 
            c.id, 
            p.nome AS paciente, 
            t.nome AS terapeuta, 
            c.data_consulta, 
            c.observacoes, 
            te.nome AS terapia_nome, 
            te.descricao AS terapia_descricao, 
            te.duracao_minutos AS terapia_duracao,
                c.sala,
            c.status
        FROM 
            consultas c
        JOIN 
            pacientes p ON c.id_paciente = p.id
        JOIN 
            terapeutas t ON c.id_terapeuta = t.id
        JOIN 
            terapias te ON c.id_terapia = te.id
        ORDER BY 
            c.data_consulta ASC
    """)
    consultas = cur.fetchall()
    cur.close()
    conn.close()

    consultas_list = []
    for consulta in consultas:
        consulta_dict = {
            'id': consulta[0],
            'patientName': consulta[1],
            'therapistName': consulta[2],
            'date': consulta[3].strftime('%Y-%m-%d'),
            'time': consulta[3].strftime('%H:%M'),
            'observations': consulta[4],
            'therapyName': consulta[5],
            'therapyDescription': consulta[6],
            'therapyDuration': consulta[7],
            'sala': consulta[8],  # Sala da consulta
            'status': consulta[9]  # Inclui o status no JSON
        }
        consultas_list.append(consulta_dict)

    return jsonify(consultas_list)

# Rota para adicionar uma terapia
@app.route('/add-terapia', methods=['POST'])
def add_terapia():
    data = request.get_json()
    nome = data.get('nome')
    descricao = data.get('descricao')
    duracao_minutos = data.get('duracao_minutos')

    # Verifica se todos os dados obrigatórios estão presentes
    if not nome or not descricao or not duracao_minutos:
        return jsonify({'success': False, 'message': 'Campos obrigatórios estão faltando'}), 400

    conn = get_db_connection()
    cur = conn.cursor()

    try:
        cur.execute("""
            INSERT INTO terapias (nome, descricao, duracao_minutos)
            VALUES (%s, %s, %s)
            RETURNING id
        """, (nome, descricao, duracao_minutos))

        terapia_id = cur.fetchone()[0]
        conn.commit()
        return jsonify({'success': True, 'id': terapia_id}), 201
    except Exception as e:
        return jsonify({'success': False, 'error': str(e)}), 400
    finally:
        cur.close()
        conn.close()


# Rota para adicionar terapeuta
@app.route('/add-terapeuta', methods=['POST'])
def add_terapeuta():
    data = request.get_json()
    nome = data.get('nome')
    especialidade = data.get('especialidade')
    telefone = data.get('telefone')
    email = data.get('email')

    if not nome or not especialidade or not telefone or not email:
        return jsonify({'success': False, 'message': 'Campos obrigatórios estão faltando'}), 400

    conn = get_db_connection()
    cur = conn.cursor()

    try:
        cur.execute("""
            INSERT INTO terapeutas (nome, especialidade, telefone, email)
            VALUES (%s, %s, %s, %s)
            RETURNING id
        """, (nome, especialidade, telefone, email))

        terapeuta_id = cur.fetchone()[0]
        conn.commit()
        return jsonify({'success': True, 'id': terapeuta_id}), 201
    except Exception as e:
        return jsonify({'success': False, 'error': str(e)}), 400
    finally:
        cur.close()
        conn.close()


# Rota para deletar terapeuta
@app.route('/delete-terapeuta/<int:id>', methods=['DELETE'])
def delete_terapeuta(id):
    conn = get_db_connection()
    cur = conn.cursor()
    cur.execute('DELETE FROM terapeutas WHERE id = %s;', (id,))
    conn.commit()
    cur.close()
    conn.close()
    return '', 204


# Rota para adicionar consulta
@app.route('/add-consulta', methods=['POST'])
def add_consulta():
    data = request.get_json()
    id_paciente = data['id_paciente']
    id_terapeuta = data['id_terapeuta']
    id_terapia = data['id_terapia']
    data_consulta = data['data_consulta']
    observacoes = data.get('observacoes', '')
    sala = data['sala']
    

    conn = get_db_connection()
    cur = conn.cursor()

    try:
        # Inserir a consulta com os IDs corretos de paciente, terapeuta e terapia
        cur.execute("""
            INSERT INTO consultas (id_paciente, id_terapeuta, id_terapia, data_consulta, observacoes, sala)
            VALUES (%s, %s, %s, %s, %s, %s)
            RETURNING id
        """, (id_paciente, id_terapeuta, id_terapia, data_consulta, observacoes, sala))
        
        consulta_id = cur.fetchone()[0]
        conn.commit()
        return jsonify({'success': True, 'id': consulta_id}), 201
    except Exception as e:
        return jsonify({'success': False, 'error': str(e)}), 400
    finally:
        cur.close()
        conn.close()

# Rota para adicionar paciente
@app.route('/add-paciente', methods=['POST'])
def add_paciente():
    data = request.get_json()
    nome = data.get('nome')
    data_nascimento = data.get('data_nascimento')
    endereco = data.get('endereco')
    telefone = data.get('telefone')
    email = data.get('email')
    id_terapeuta = data.get('id_terapeuta')
    id_terapia = data.get('id_terapia')

    # Verifica se todos os dados obrigatórios estão presentes
    if not nome or not data_nascimento or not endereco or not telefone or not email:
        return jsonify({'success': False, 'message': 'Campos obrigatórios estão faltando'}), 400

    conn = get_db_connection()
    cur = conn.cursor()

    try:
        cur.execute("""
            INSERT INTO pacientes (nome, data_nascimento, endereco, telefone, email, id_terapeuta, id_terapia)
            VALUES (%s, %s, %s, %s, %s, %s, %s)
            RETURNING id
        """, (nome, data_nascimento, endereco, telefone, email, id_terapeuta, id_terapia))

        paciente_id = cur.fetchone()[0]
        conn.commit()
        return jsonify({'success': True, 'id': paciente_id}), 201
    except Exception as e:
        return jsonify({'success': False, 'error': str(e)}), 400
    finally:
        cur.close()
        conn.close()




# Rota para editar uma consulta
@app.route('/edit-consulta/<int:id>', methods=['PUT'])
def edit_consulta(id):
    data = request.get_json()
    id_paciente = data['id_paciente']
    id_terapeuta = data['id_terapeuta']
    id_terapia = data['id_terapia']
    data_consulta = data['data_consulta']
    observacoes = data.get('observacoes', '')
    sala = data['sala']

    conn = get_db_connection()
    cur = conn.cursor()
    cur.execute("""
        UPDATE consultas
        SET id_paciente = %s, id_terapeuta = %s, id_terapia = %s, data_consulta = %s, observacoes = %s, sala = %s
        WHERE id = %s
    """, (id_paciente, id_terapeuta, id_terapia, data_consulta, observacoes, sala, id))
    conn.commit()
    cur.close()
    conn.close()

    return jsonify({'success': True})

# Rota para atualizar o status da consulta
@app.route('/update-status/<int:id>', methods=['PUT'])
def update_status(id):
    data = request.get_json()
    status = data['status']

    conn = get_db_connection()
    cur = conn.cursor()
    cur.execute("""
        UPDATE consultas
        SET status = %s
        WHERE id = %s
    """, (status, id))
    conn.commit()
    cur.close()
    conn.close()

    return jsonify({'success': True})

# Rota para obter consultas (para Cadastro de Consulta)
@app.route('/consultas', methods=['GET'])
def get_consultas():
    conn = get_db_connection()
    cur = conn.cursor()

    # Realizar JOINs para obter nomes de paciente, terapeuta e terapia
    cur.execute("""
        SELECT 
            c.id, 
            p.nome AS paciente, 
            t.nome AS terapeuta, 
            te.nome AS terapia, 
            c.data_consulta, 
            c.observacoes, 
            te.duracao_minutos,
            c.sala
        FROM 
            consultas c
        JOIN 
            pacientes p ON c.id_paciente = p.id
        JOIN 
            terapeutas t ON c.id_terapeuta = t.id
        JOIN 
            terapias te ON c.id_terapia = te.id
    """)
    
    consultas = cur.fetchall()
    cur.close()
    conn.close()

    consultas_list = []
    for consulta in consultas:
        consulta_dict = {
            'id': consulta[0],
            'paciente': consulta[1],
            'terapeuta': consulta[2],
            'terapia': consulta[3],
            'data_consulta': consulta[4].strftime('%Y-%m-%d'),
            'hora_consulta': consulta[4].strftime('%H:%M:%S'),  # Adiciona a hora aqui
            'observacoes': consulta[5],
            'duracao_minutos': consulta[6],
            'sala': consulta[7]
        }
        consultas_list.append(consulta_dict)

    return jsonify(consultas_list)


# Rota para deletar consulta
@app.route('/delete-consulta/<int:id>', methods=['DELETE'])
def delete_consulta(id):
    conn = get_db_connection()
    cur = conn.cursor()
    cur.execute('DELETE FROM consultas WHERE id = %s;', (id,))
    conn.commit()
    cur.close()
    conn.close()
    return '', 204

if __name__ == '__main__':
    app.run(debug=True)
