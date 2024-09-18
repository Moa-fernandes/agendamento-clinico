--
-- PostgreSQL database dump
--

-- Dumped from database version 15.5
-- Dumped by pg_dump version 15.5

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: consultas; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.consultas (
    id integer NOT NULL,
    id_paciente integer,
    id_terapeuta integer,
    id_terapia integer,
    data_consulta timestamp without time zone,
    observacoes text,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.consultas OWNER TO postgres;

--
-- Name: consultas_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.consultas_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.consultas_id_seq OWNER TO postgres;

--
-- Name: consultas_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.consultas_id_seq OWNED BY public.consultas.id;


--
-- Name: pacientes; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.pacientes (
    id integer NOT NULL,
    nome character varying(100) NOT NULL,
    data_nascimento date,
    endereco character varying(255),
    telefone character varying(20),
    email character varying(100),
    id_terapeuta integer,
    id_terapia integer,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.pacientes OWNER TO postgres;

--
-- Name: pacientes_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.pacientes_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.pacientes_id_seq OWNER TO postgres;

--
-- Name: pacientes_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.pacientes_id_seq OWNED BY public.pacientes.id;


--
-- Name: sessoes; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.sessoes (
    id integer NOT NULL,
    id_usuario integer,
    sessao_tipo character varying(50) NOT NULL,
    data_inicio timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    data_fim timestamp without time zone
);


ALTER TABLE public.sessoes OWNER TO postgres;

--
-- Name: sessoes_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.sessoes_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.sessoes_id_seq OWNER TO postgres;

--
-- Name: sessoes_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.sessoes_id_seq OWNED BY public.sessoes.id;


--
-- Name: terapeutas; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.terapeutas (
    id integer NOT NULL,
    nome character varying(100) NOT NULL,
    especialidade character varying(100),
    telefone character varying(20),
    email character varying(100),
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.terapeutas OWNER TO postgres;

--
-- Name: terapeutas_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.terapeutas_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.terapeutas_id_seq OWNER TO postgres;

--
-- Name: terapeutas_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.terapeutas_id_seq OWNED BY public.terapeutas.id;


--
-- Name: terapias; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.terapias (
    id integer NOT NULL,
    nome character varying(100) NOT NULL,
    descricao text,
    duracao_minutos integer
);


ALTER TABLE public.terapias OWNER TO postgres;

--
-- Name: terapias_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.terapias_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.terapias_id_seq OWNER TO postgres;

--
-- Name: terapias_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.terapias_id_seq OWNED BY public.terapias.id;


--
-- Name: usuarios; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.usuarios (
    id integer NOT NULL,
    nome character varying(100) NOT NULL,
    email character varying(100) NOT NULL,
    senha character varying(255) NOT NULL,
    role character varying(50) NOT NULL,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.usuarios OWNER TO postgres;

--
-- Name: usuarios_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.usuarios_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.usuarios_id_seq OWNER TO postgres;

--
-- Name: usuarios_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.usuarios_id_seq OWNED BY public.usuarios.id;


--
-- Name: consultas id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.consultas ALTER COLUMN id SET DEFAULT nextval('public.consultas_id_seq'::regclass);


--
-- Name: pacientes id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.pacientes ALTER COLUMN id SET DEFAULT nextval('public.pacientes_id_seq'::regclass);


--
-- Name: sessoes id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.sessoes ALTER COLUMN id SET DEFAULT nextval('public.sessoes_id_seq'::regclass);


--
-- Name: terapeutas id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.terapeutas ALTER COLUMN id SET DEFAULT nextval('public.terapeutas_id_seq'::regclass);


--
-- Name: terapias id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.terapias ALTER COLUMN id SET DEFAULT nextval('public.terapias_id_seq'::regclass);


--
-- Name: usuarios id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.usuarios ALTER COLUMN id SET DEFAULT nextval('public.usuarios_id_seq'::regclass);


--
-- Name: consultas consultas_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.consultas
    ADD CONSTRAINT consultas_pkey PRIMARY KEY (id);


--
-- Name: pacientes pacientes_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.pacientes
    ADD CONSTRAINT pacientes_pkey PRIMARY KEY (id);


--
-- Name: sessoes sessoes_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.sessoes
    ADD CONSTRAINT sessoes_pkey PRIMARY KEY (id);


--
-- Name: terapeutas terapeutas_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.terapeutas
    ADD CONSTRAINT terapeutas_pkey PRIMARY KEY (id);


--
-- Name: terapias terapias_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.terapias
    ADD CONSTRAINT terapias_pkey PRIMARY KEY (id);


--
-- Name: usuarios usuarios_email_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.usuarios
    ADD CONSTRAINT usuarios_email_key UNIQUE (email);


--
-- Name: usuarios usuarios_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.usuarios
    ADD CONSTRAINT usuarios_pkey PRIMARY KEY (id);


--
-- Name: consultas consultas_id_paciente_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.consultas
    ADD CONSTRAINT consultas_id_paciente_fkey FOREIGN KEY (id_paciente) REFERENCES public.pacientes(id);


--
-- Name: consultas consultas_id_terapeuta_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.consultas
    ADD CONSTRAINT consultas_id_terapeuta_fkey FOREIGN KEY (id_terapeuta) REFERENCES public.terapeutas(id);


--
-- Name: consultas consultas_id_terapia_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.consultas
    ADD CONSTRAINT consultas_id_terapia_fkey FOREIGN KEY (id_terapia) REFERENCES public.terapias(id);


--
-- Name: pacientes pacientes_id_terapeuta_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.pacientes
    ADD CONSTRAINT pacientes_id_terapeuta_fkey FOREIGN KEY (id_terapeuta) REFERENCES public.terapeutas(id);


--
-- Name: pacientes pacientes_id_terapia_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.pacientes
    ADD CONSTRAINT pacientes_id_terapia_fkey FOREIGN KEY (id_terapia) REFERENCES public.terapias(id);


--
-- Name: sessoes sessoes_id_usuario_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.sessoes
    ADD CONSTRAINT sessoes_id_usuario_fkey FOREIGN KEY (id_usuario) REFERENCES public.usuarios(id);


--
-- PostgreSQL database dump complete
--

Warning: Add Sala and status in table consultas
