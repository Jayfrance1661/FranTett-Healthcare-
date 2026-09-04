--
-- PostgreSQL database dump
--

\restrict m5rA4WHLnOLg54bvExAy13HyFURm7tVnhEfl0BPoPGxVBV7ygosWrZulZ3BqKot

-- Dumped from database version 18.4
-- Dumped by pg_dump version 18.4

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET transaction_timeout = 0;
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
-- Name: appointments; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.appointments (
    id integer NOT NULL,
    patient_id integer,
    name character varying(200),
    email character varying(150),
    phone character varying(30),
    doctor character varying(150),
    appointment_date date,
    appointment_time character varying(50),
    reason text,
    status character varying(50) DEFAULT 'Pending'::character varying,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    meeting_room character varying(255),
    meeting_provider character varying(50),
    doctor_id integer
);


ALTER TABLE public.appointments OWNER TO postgres;

--
-- Name: appointments_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.appointments_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.appointments_id_seq OWNER TO postgres;

--
-- Name: appointments_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.appointments_id_seq OWNED BY public.appointments.id;


--
-- Name: consultations; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.consultations (
    id integer NOT NULL,
    patient_id integer NOT NULL,
    presenting_complaint text,
    history_of_presenting_complaint text,
    past_medical_history text,
    drug_allergy_history text,
    family_history text,
    social_history text,
    systems_review text,
    summary text,
    examination text,
    investigations text,
    differential_diagnosis text,
    diagnosis text,
    management_plan text,
    treatment text,
    follow_up_date date,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    doctor character varying(150),
    consultation_date date,
    chief_complaint text,
    assessment text,
    clinical_notes text,
    appointment_id integer,
    blood_pressure character varying(20),
    heart_rate numeric,
    temperature numeric,
    respiratory_rate numeric,
    oxygen_saturation numeric,
    weight numeric,
    height numeric,
    bmi numeric
);


ALTER TABLE public.consultations OWNER TO postgres;

--
-- Name: consultations_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.consultations_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.consultations_id_seq OWNER TO postgres;

--
-- Name: consultations_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.consultations_id_seq OWNED BY public.consultations.id;


--
-- Name: contact_messages; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.contact_messages (
    id integer NOT NULL,
    name character varying(150) NOT NULL,
    email character varying(255) NOT NULL,
    subject character varying(255) NOT NULL,
    message text NOT NULL,
    status character varying(30) DEFAULT 'New'::character varying,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.contact_messages OWNER TO postgres;

--
-- Name: contact_messages_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.contact_messages_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.contact_messages_id_seq OWNER TO postgres;

--
-- Name: contact_messages_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.contact_messages_id_seq OWNED BY public.contact_messages.id;


--
-- Name: doctor_availability; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.doctor_availability (
    id integer NOT NULL,
    doctor_id integer NOT NULL,
    day_of_week character varying(20) NOT NULL,
    start_time time without time zone NOT NULL,
    end_time time without time zone NOT NULL,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.doctor_availability OWNER TO postgres;

--
-- Name: doctor_availability_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.doctor_availability_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.doctor_availability_id_seq OWNER TO postgres;

--
-- Name: doctor_availability_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.doctor_availability_id_seq OWNED BY public.doctor_availability.id;


--
-- Name: doctor_leave_days; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.doctor_leave_days (
    id integer NOT NULL,
    doctor_id integer NOT NULL,
    leave_date date NOT NULL,
    reason text,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.doctor_leave_days OWNER TO postgres;

--
-- Name: doctor_leave_days_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.doctor_leave_days_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.doctor_leave_days_id_seq OWNER TO postgres;

--
-- Name: doctor_leave_days_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.doctor_leave_days_id_seq OWNED BY public.doctor_leave_days.id;


--
-- Name: doctors; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.doctors (
    id integer NOT NULL,
    name character varying(150) NOT NULL,
    specialty character varying(150),
    email character varying(150),
    phone character varying(30),
    license_number character varying(100),
    status character varying(30) DEFAULT 'Active'::character varying NOT NULL,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.doctors OWNER TO postgres;

--
-- Name: doctors_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.doctors_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.doctors_id_seq OWNER TO postgres;

--
-- Name: doctors_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.doctors_id_seq OWNED BY public.doctors.id;


--
-- Name: lab_report_parameters; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.lab_report_parameters (
    id integer NOT NULL,
    lab_report_id integer NOT NULL,
    parameter_name character varying(200) NOT NULL,
    result_value text,
    unit character varying(50),
    flag character varying(30),
    reference_range character varying(100),
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.lab_report_parameters OWNER TO postgres;

--
-- Name: lab_report_parameters_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.lab_report_parameters_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.lab_report_parameters_id_seq OWNER TO postgres;

--
-- Name: lab_report_parameters_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.lab_report_parameters_id_seq OWNED BY public.lab_report_parameters.id;


--
-- Name: lab_reports; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.lab_reports (
    id integer NOT NULL,
    patient_id integer NOT NULL,
    consultation_id integer,
    test_name character varying(200) NOT NULL,
    result_date date,
    status character varying(30) DEFAULT 'Final'::character varying,
    recorded_by character varying(150),
    notes text,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.lab_reports OWNER TO postgres;

--
-- Name: lab_reports_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.lab_reports_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.lab_reports_id_seq OWNER TO postgres;

--
-- Name: lab_reports_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.lab_reports_id_seq OWNED BY public.lab_reports.id;


--
-- Name: lab_requests; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.lab_requests (
    id integer NOT NULL,
    patient_id integer NOT NULL,
    requested_tests text NOT NULL,
    clinical_information text,
    requested_by character varying(150),
    request_date date DEFAULT CURRENT_DATE,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    electronic_signature text,
    consultation_id integer
);


ALTER TABLE public.lab_requests OWNER TO postgres;

--
-- Name: lab_requests_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.lab_requests_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.lab_requests_id_seq OWNER TO postgres;

--
-- Name: lab_requests_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.lab_requests_id_seq OWNED BY public.lab_requests.id;


--
-- Name: lab_results; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.lab_results (
    id integer NOT NULL,
    patient_id integer NOT NULL,
    consultation_id integer,
    test_name character varying(200) NOT NULL,
    result_value text,
    unit character varying(50),
    reference_range character varying(100),
    result_date date,
    status character varying(30) DEFAULT 'Final'::character varying,
    notes text,
    recorded_by character varying(150),
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.lab_results OWNER TO postgres;

--
-- Name: lab_results_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.lab_results_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.lab_results_id_seq OWNER TO postgres;

--
-- Name: lab_results_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.lab_results_id_seq OWNED BY public.lab_results.id;


--
-- Name: patient_accounts; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.patient_accounts (
    id integer NOT NULL,
    patient_id integer NOT NULL,
    email character varying(150) NOT NULL,
    password character varying(255) NOT NULL,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.patient_accounts OWNER TO postgres;

--
-- Name: patient_accounts_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.patient_accounts_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.patient_accounts_id_seq OWNER TO postgres;

--
-- Name: patient_accounts_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.patient_accounts_id_seq OWNED BY public.patient_accounts.id;


--
-- Name: patients; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.patients (
    id integer NOT NULL,
    first_name character varying(100),
    last_name character varying(100),
    email character varying(150),
    phone character varying(30),
    date_of_birth date,
    gender character varying(20),
    address text,
    medical_history text,
    allergies text,
    medications text,
    notes text,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.patients OWNER TO postgres;

--
-- Name: patients_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.patients_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.patients_id_seq OWNER TO postgres;

--
-- Name: patients_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.patients_id_seq OWNED BY public.patients.id;


--
-- Name: payments; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.payments (
    id integer NOT NULL,
    patient_id integer NOT NULL,
    appointment_id integer,
    consultation_id integer,
    amount numeric(12,2) NOT NULL,
    currency character varying(10) DEFAULT 'CAD'::character varying NOT NULL,
    payment_method character varying(50) NOT NULL,
    payment_provider character varying(50),
    status character varying(30) DEFAULT 'Pending'::character varying NOT NULL,
    transaction_id character varying(255),
    provider_payment_id character varying(255),
    description text,
    paid_at timestamp without time zone,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


ALTER TABLE public.payments OWNER TO postgres;

--
-- Name: payments_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.payments_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.payments_id_seq OWNER TO postgres;

--
-- Name: payments_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.payments_id_seq OWNED BY public.payments.id;


--
-- Name: prescription_items; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.prescription_items (
    id integer NOT NULL,
    prescription_id integer NOT NULL,
    medication_name text NOT NULL,
    dose text,
    route text,
    frequency text,
    duration text,
    quantity text,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.prescription_items OWNER TO postgres;

--
-- Name: prescription_items_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.prescription_items_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.prescription_items_id_seq OWNER TO postgres;

--
-- Name: prescription_items_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.prescription_items_id_seq OWNED BY public.prescription_items.id;


--
-- Name: prescriptions; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.prescriptions (
    id integer NOT NULL,
    patient_id integer NOT NULL,
    medication text,
    dosage text,
    frequency text,
    duration text,
    route text,
    instructions text,
    notes text,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    doctor character varying(150),
    prescription_date date,
    medication_name text,
    dose text,
    quantity text,
    consultation_id integer
);


ALTER TABLE public.prescriptions OWNER TO postgres;

--
-- Name: prescriptions_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.prescriptions_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.prescriptions_id_seq OWNER TO postgres;

--
-- Name: prescriptions_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.prescriptions_id_seq OWNED BY public.prescriptions.id;


--
-- Name: staff_registration_requests; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.staff_registration_requests (
    id integer NOT NULL,
    full_name character varying(150) NOT NULL,
    email character varying(255) NOT NULL,
    phone character varying(30),
    role character varying(100) NOT NULL,
    password character varying(255) NOT NULL,
    status character varying(20) DEFAULT 'Pending'::character varying NOT NULL,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    reviewed_at timestamp without time zone,
    CONSTRAINT staff_registration_requests_status_check CHECK (((status)::text = ANY (ARRAY[('Pending'::character varying)::text, ('Approved'::character varying)::text, ('Rejected'::character varying)::text])))
);


ALTER TABLE public.staff_registration_requests OWNER TO postgres;

--
-- Name: staff_registration_requests_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.staff_registration_requests_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.staff_registration_requests_id_seq OWNER TO postgres;

--
-- Name: staff_registration_requests_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.staff_registration_requests_id_seq OWNED BY public.staff_registration_requests.id;


--
-- Name: users; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.users (
    id integer NOT NULL,
    email character varying(150) NOT NULL,
    password character varying(255) NOT NULL,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    role character varying(30) DEFAULT 'Staff'::character varying NOT NULL,
    full_name character varying(150),
    phone character varying(30),
    status character varying(30) DEFAULT 'Active'::character varying NOT NULL
);


ALTER TABLE public.users OWNER TO postgres;

--
-- Name: users_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.users_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.users_id_seq OWNER TO postgres;

--
-- Name: users_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.users_id_seq OWNED BY public.users.id;


--
-- Name: vital_signs; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.vital_signs (
    id integer NOT NULL,
    patient_id integer NOT NULL,
    consultation_id integer,
    blood_pressure character varying(30),
    heart_rate numeric(5,2),
    temperature numeric(5,2),
    respiratory_rate numeric(5,2),
    oxygen_saturation numeric(5,2),
    weight numeric(6,2),
    height numeric(6,2),
    bmi numeric(6,2),
    recorded_by character varying(150),
    recorded_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.vital_signs OWNER TO postgres;

--
-- Name: vital_signs_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.vital_signs_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.vital_signs_id_seq OWNER TO postgres;

--
-- Name: vital_signs_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.vital_signs_id_seq OWNED BY public.vital_signs.id;


--
-- Name: appointments id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.appointments ALTER COLUMN id SET DEFAULT nextval('public.appointments_id_seq'::regclass);


--
-- Name: consultations id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.consultations ALTER COLUMN id SET DEFAULT nextval('public.consultations_id_seq'::regclass);


--
-- Name: contact_messages id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.contact_messages ALTER COLUMN id SET DEFAULT nextval('public.contact_messages_id_seq'::regclass);


--
-- Name: doctor_availability id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.doctor_availability ALTER COLUMN id SET DEFAULT nextval('public.doctor_availability_id_seq'::regclass);


--
-- Name: doctor_leave_days id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.doctor_leave_days ALTER COLUMN id SET DEFAULT nextval('public.doctor_leave_days_id_seq'::regclass);


--
-- Name: doctors id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.doctors ALTER COLUMN id SET DEFAULT nextval('public.doctors_id_seq'::regclass);


--
-- Name: lab_report_parameters id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.lab_report_parameters ALTER COLUMN id SET DEFAULT nextval('public.lab_report_parameters_id_seq'::regclass);


--
-- Name: lab_reports id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.lab_reports ALTER COLUMN id SET DEFAULT nextval('public.lab_reports_id_seq'::regclass);


--
-- Name: lab_requests id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.lab_requests ALTER COLUMN id SET DEFAULT nextval('public.lab_requests_id_seq'::regclass);


--
-- Name: lab_results id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.lab_results ALTER COLUMN id SET DEFAULT nextval('public.lab_results_id_seq'::regclass);


--
-- Name: patient_accounts id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.patient_accounts ALTER COLUMN id SET DEFAULT nextval('public.patient_accounts_id_seq'::regclass);


--
-- Name: patients id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.patients ALTER COLUMN id SET DEFAULT nextval('public.patients_id_seq'::regclass);


--
-- Name: payments id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.payments ALTER COLUMN id SET DEFAULT nextval('public.payments_id_seq'::regclass);


--
-- Name: prescription_items id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.prescription_items ALTER COLUMN id SET DEFAULT nextval('public.prescription_items_id_seq'::regclass);


--
-- Name: prescriptions id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.prescriptions ALTER COLUMN id SET DEFAULT nextval('public.prescriptions_id_seq'::regclass);


--
-- Name: staff_registration_requests id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.staff_registration_requests ALTER COLUMN id SET DEFAULT nextval('public.staff_registration_requests_id_seq'::regclass);


--
-- Name: users id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users ALTER COLUMN id SET DEFAULT nextval('public.users_id_seq'::regclass);


--
-- Name: vital_signs id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.vital_signs ALTER COLUMN id SET DEFAULT nextval('public.vital_signs_id_seq'::regclass);


--
-- Data for Name: appointments; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO public.appointments (id, patient_id, name, email, phone, doctor, appointment_date, appointment_time, reason, status, created_at, meeting_room, meeting_provider, doctor_id) VALUES (15, 16, 'Kofi Bentil', 'Geoffrey.Cr@cap.com', '9058508085', 'Dr. Francis Tetteh', '2026-09-04', '13:36', 'COUGH', 'Confirmed', '2026-08-28 11:37:02.785786', 'frantett-1d985cde5a157d1a0764c85d8f6fe656', 'livekit', 1);
INSERT INTO public.appointments (id, patient_id, name, email, phone, doctor, appointment_date, appointment_time, reason, status, created_at, meeting_room, meeting_provider, doctor_id) VALUES (16, 17, 'FRANCIS TETTEH', 'TOSHIP@LINDFASTGRP.COM', '9056709400', 'Dr. Talent', '2026-09-10', '16:02', 'rashes', 'Confirmed', '2026-09-01 15:02:41.207351', 'frantett-378f18672845e827ba44d540ba81507f', 'livekit', 2);
INSERT INTO public.appointments (id, patient_id, name, email, phone, doctor, appointment_date, appointment_time, reason, status, created_at, meeting_room, meeting_provider, doctor_id) VALUES (17, 18, 'Yaw Boateng', 'jayfrance@gmail.com', '0542648990', 'Dr. Francis Tetteh', '2026-09-09', '12:00', 'test consultation', 'Cancelled', '2026-09-04 04:09:58.320162', 'frantett-824afb470e74f6c185a08fd0f11a5aaf', 'livekit', 1);
INSERT INTO public.appointments (id, patient_id, name, email, phone, doctor, appointment_date, appointment_time, reason, status, created_at, meeting_room, meeting_provider, doctor_id) VALUES (18, 18, 'Yaw Boateng', 'jayfrance@gmail.com', '0542648990', 'Dr. Talent', '2026-09-10', '11:00', 'chest pains', 'Pending', '2026-09-04 04:54:40.031996', 'frantett-050cfa4985143ce87f0ffc60d11338ef', 'livekit', 2);


--
-- Data for Name: consultations; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO public.consultations (id, patient_id, presenting_complaint, history_of_presenting_complaint, past_medical_history, drug_allergy_history, family_history, social_history, systems_review, summary, examination, investigations, differential_diagnosis, diagnosis, management_plan, treatment, follow_up_date, created_at, updated_at, doctor, consultation_date, chief_complaint, assessment, clinical_notes, appointment_id, blood_pressure, heart_rate, temperature, respiratory_rate, oxygen_saturation, weight, height, bmi) VALUES (16, 16, NULL, '4days', 'BP', 'P''MOLE', 'DM', 'SMOKING', 'C/A', 'STABLE', 'C/A', 'FBC', 'PNEUMONIA', 'PNEUMONIA', 'ANTIBIOTIC', 'AMOXICLAV', '2026-09-09', '2026-09-01 09:19:32.58197', '2026-09-01 14:16:30.594114', 'DR. FRANCIS', '2026-09-01', 'cough', NULL, 'REVIEW', 15, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL);
INSERT INTO public.consultations (id, patient_id, presenting_complaint, history_of_presenting_complaint, past_medical_history, drug_allergy_history, family_history, social_history, systems_review, summary, examination, investigations, differential_diagnosis, diagnosis, management_plan, treatment, follow_up_date, created_at, updated_at, doctor, consultation_date, chief_complaint, assessment, clinical_notes, appointment_id, blood_pressure, heart_rate, temperature, respiratory_rate, oxygen_saturation, weight, height, bmi) VALUES (17, 17, NULL, '5days', 'dm', 'bp', 'dm', 'smoke', 'a/c', 'a/c', 'stable', 'fbc', 'cold', 'cold', 'antibiotics', 'Paracetamol', '2026-09-09', '2026-09-01 15:04:45.702964', '2026-09-04 15:39:25.109805', 'DR. FRANCIS', '2026-09-01', 'cough', NULL, 'stable', 16, '133/90', 80, 30, 16, 96, 78, 160, 30.5);


--
-- Data for Name: contact_messages; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO public.contact_messages (id, name, email, subject, message, status, created_at) VALUES (1, 'OPOKU BILSON', 'FRANTETT1661@GMAIL.COM', 'MEDICATION', 'DO YOU HAVE MEDICATION FOR PNEUMONIA.', 'New', '2026-08-21 02:37:18.493359');
INSERT INTO public.contact_messages (id, name, email, subject, message, status, created_at) VALUES (2, 'NANA', 'FRANTETT@GMAIL.COM', 'drug', 'do you have campa', 'New', '2026-08-21 03:02:14.657881');
INSERT INTO public.contact_messages (id, name, email, subject, message, status, created_at) VALUES (3, 'JOHN DOE', 'FRANTETT@GMAIL.COM', 'drug', 'kherb', 'New', '2026-08-21 03:03:48.67147');
INSERT INTO public.contact_messages (id, name, email, subject, message, status, created_at) VALUES (5, 'Karl Jones', 'TOSHIP@LINDFAST.COM', 'i need help', 'salbutamol', 'New', '2026-08-21 09:16:43.264774');


--
-- Data for Name: doctor_availability; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO public.doctor_availability (id, doctor_id, day_of_week, start_time, end_time, created_at) VALUES (1, 1, 'Monday', '08:00:00', '17:00:00', '2026-08-22 16:47:56.184601');
INSERT INTO public.doctor_availability (id, doctor_id, day_of_week, start_time, end_time, created_at) VALUES (2, 1, 'Tuesday', '08:00:00', '17:00:00', '2026-08-22 16:47:56.184601');
INSERT INTO public.doctor_availability (id, doctor_id, day_of_week, start_time, end_time, created_at) VALUES (3, 1, 'Wednesday', '08:00:00', '17:00:00', '2026-08-22 16:47:56.184601');
INSERT INTO public.doctor_availability (id, doctor_id, day_of_week, start_time, end_time, created_at) VALUES (4, 1, 'Thursday', '08:00:00', '17:00:00', '2026-08-22 16:47:56.184601');
INSERT INTO public.doctor_availability (id, doctor_id, day_of_week, start_time, end_time, created_at) VALUES (5, 1, 'Friday', '08:00:00', '17:00:00', '2026-08-22 16:47:56.184601');
INSERT INTO public.doctor_availability (id, doctor_id, day_of_week, start_time, end_time, created_at) VALUES (6, 1, 'Monday', '08:00:00', '17:00:00', '2026-08-27 01:25:38.197217');
INSERT INTO public.doctor_availability (id, doctor_id, day_of_week, start_time, end_time, created_at) VALUES (7, 2, 'Monday', '08:00:00', '17:00:00', '2026-08-27 01:26:07.400782');
INSERT INTO public.doctor_availability (id, doctor_id, day_of_week, start_time, end_time, created_at) VALUES (8, 2, 'Tuesday', '08:00:00', '17:00:00', '2026-08-27 01:26:13.405595');
INSERT INTO public.doctor_availability (id, doctor_id, day_of_week, start_time, end_time, created_at) VALUES (9, 2, 'Wednesday', '08:00:00', '17:00:00', '2026-08-27 01:26:17.944608');
INSERT INTO public.doctor_availability (id, doctor_id, day_of_week, start_time, end_time, created_at) VALUES (10, 2, 'Thursday', '08:00:00', '17:00:00', '2026-08-27 01:26:22.287359');
INSERT INTO public.doctor_availability (id, doctor_id, day_of_week, start_time, end_time, created_at) VALUES (11, 2, 'Friday', '08:00:00', '17:00:00', '2026-08-27 01:26:30.173763');
INSERT INTO public.doctor_availability (id, doctor_id, day_of_week, start_time, end_time, created_at) VALUES (12, 3, 'Monday', '08:00:00', '17:00:00', '2026-08-27 01:26:51.322348');
INSERT INTO public.doctor_availability (id, doctor_id, day_of_week, start_time, end_time, created_at) VALUES (13, 3, 'Tuesday', '08:00:00', '17:00:00', '2026-08-27 01:26:56.680713');
INSERT INTO public.doctor_availability (id, doctor_id, day_of_week, start_time, end_time, created_at) VALUES (14, 3, 'Wednesday', '08:00:00', '17:00:00', '2026-08-27 01:27:01.058723');
INSERT INTO public.doctor_availability (id, doctor_id, day_of_week, start_time, end_time, created_at) VALUES (15, 3, 'Thursday', '08:00:00', '17:00:00', '2026-08-27 01:27:07.310909');
INSERT INTO public.doctor_availability (id, doctor_id, day_of_week, start_time, end_time, created_at) VALUES (16, 3, 'Friday', '08:00:00', '17:00:00', '2026-08-27 01:27:12.491862');
INSERT INTO public.doctor_availability (id, doctor_id, day_of_week, start_time, end_time, created_at) VALUES (17, 5, 'Monday', '08:00:00', '17:00:00', '2026-08-27 01:27:48.293741');
INSERT INTO public.doctor_availability (id, doctor_id, day_of_week, start_time, end_time, created_at) VALUES (18, 5, 'Tuesday', '08:00:00', '17:00:00', '2026-08-27 01:27:52.969108');
INSERT INTO public.doctor_availability (id, doctor_id, day_of_week, start_time, end_time, created_at) VALUES (19, 5, 'Wednesday', '08:00:00', '17:00:00', '2026-08-27 01:27:56.778416');
INSERT INTO public.doctor_availability (id, doctor_id, day_of_week, start_time, end_time, created_at) VALUES (20, 5, 'Thursday', '08:00:00', '17:00:00', '2026-08-27 01:28:00.447424');
INSERT INTO public.doctor_availability (id, doctor_id, day_of_week, start_time, end_time, created_at) VALUES (21, 5, 'Friday', '08:00:00', '17:00:00', '2026-08-27 01:28:05.807705');


--
-- Data for Name: doctor_leave_days; Type: TABLE DATA; Schema: public; Owner: postgres
--



--
-- Data for Name: doctors; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO public.doctors (id, name, specialty, email, phone, license_number, status, created_at) VALUES (5, 'Dr Sam', 'Naturopathic Doctor', 'jftsuccess@gmail.com', '0542648990', NULL, 'Active', '2026-08-19 03:17:06.939902');
INSERT INTO public.doctors (id, name, specialty, email, phone, license_number, status, created_at) VALUES (2, 'Dr. Talent', 'Naturopathic Doctor', 'jftsuccess@gmail.com', '0542648990', NULL, 'Active', '2026-08-19 02:24:25.390514');
INSERT INTO public.doctors (id, name, specialty, email, phone, license_number, status, created_at) VALUES (3, 'Dr. Emily Brown', 'Pediatrician', 'jftsuccess@gmail.com', '0542648990', NULL, 'Active', '2026-08-19 02:24:25.390514');
INSERT INTO public.doctors (id, name, specialty, email, phone, license_number, status, created_at) VALUES (6, 'Dr Jerry', 'Pediatrician', 'jayfranc@gmail.com', '908657565', NULL, 'Active', '2026-08-19 03:18:55.959147');
INSERT INTO public.doctors (id, name, specialty, email, phone, license_number, status, created_at) VALUES (1, 'Dr. Francis Tetteh', 'Naturopathic Doctor', 'jayfrance1661@gmail.com', '4168789387', NULL, 'Active', '2026-08-19 02:24:25.390514');


--
-- Data for Name: lab_report_parameters; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO public.lab_report_parameters (id, lab_report_id, parameter_name, result_value, unit, flag, reference_range, created_at) VALUES (13, 6, 'WBC', '12', 'g/dl', 'Normal', '11-16g/dl', '2026-09-04 14:08:39.321198');


--
-- Data for Name: lab_reports; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO public.lab_reports (id, patient_id, consultation_id, test_name, result_date, status, recorded_by, notes, created_at) VALUES (6, 17, 17, 'FBC', '2026-09-02', 'Final', 'Francis', 'Review', '2026-09-02 01:56:26.310848');


--
-- Data for Name: lab_requests; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO public.lab_requests (id, patient_id, requested_tests, clinical_information, requested_by, request_date, created_at, electronic_signature, consultation_id) VALUES (16, 16, 'FBC, Kidney Function Test, Liver Function Test, Lipid Profile', 'COUGH', 'francis', '2026-09-01', '2026-09-01 09:21:01.043074', 'data:image/png;base64,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', 16);
INSERT INTO public.lab_requests (id, patient_id, requested_tests, clinical_information, requested_by, request_date, created_at, electronic_signature, consultation_id) VALUES (17, 17, 'FBC, Kidney Function Test, Liver Function Test', NULL, 'francis', '2026-09-01', '2026-09-01 15:05:19.59027', 'data:image/png;base64,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', 17);


--
-- Data for Name: lab_results; Type: TABLE DATA; Schema: public; Owner: postgres
--



--
-- Data for Name: patient_accounts; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO public.patient_accounts (id, patient_id, email, password, created_at) VALUES (6, 18, 'jayfrance@gmail.com', '$2b$12$aNJMaKFx9jYrH.UjegMdcOtjyUc4TGwlcqBHYYNR8e5eDywrpUw3S', '2026-09-04 02:44:25.370896');


--
-- Data for Name: patients; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO public.patients (id, first_name, last_name, email, phone, date_of_birth, gender, address, medical_history, allergies, medications, notes, created_at, updated_at) VALUES (16, 'Kofi', 'Bentil', 'Geoffrey.Cr@cap.com', '9058508085', NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2026-08-28 11:37:02.785786', '2026-08-28 11:37:02.785786');
INSERT INTO public.patients (id, first_name, last_name, email, phone, date_of_birth, gender, address, medical_history, allergies, medications, notes, created_at, updated_at) VALUES (17, 'FRANCIS', 'TETTEH', 'TOSHIP@LINDFASTGRP.COM', '9056709400', NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2026-09-01 15:02:41.207351', '2026-09-01 15:02:41.207351');
INSERT INTO public.patients (id, first_name, last_name, email, phone, date_of_birth, gender, address, medical_history, allergies, medications, notes, created_at, updated_at) VALUES (18, 'Yaw', 'Boateng', 'jayfrance@gmail.com', '0542648990', '2026-09-01', 'Male', '80 upper highland drive', NULL, NULL, NULL, NULL, '2026-09-04 02:44:23.901838', '2026-09-04 04:54:40.031996');


--
-- Data for Name: payments; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO public.payments (id, patient_id, appointment_id, consultation_id, amount, currency, payment_method, payment_provider, status, transaction_id, provider_payment_id, description, paid_at, created_at, updated_at) VALUES (7, 17, 16, 17, 10.00, 'CAD', 'card', 'stripe', 'Paid', 'pi_3UBPS0AyN7RoHNdl0WYwE9Bv', 'cs_test_a1wHARKCzxIvXMOWETPO3LJQfmqAEOCzfI626zxqCqm4JE2VJ6lxk4lvPp', 'FranTett Stripe test payment', '2026-09-03 02:42:33.076961', '2026-09-03 01:23:53.456595', '2026-09-03 02:42:33.076961');
INSERT INTO public.payments (id, patient_id, appointment_id, consultation_id, amount, currency, payment_method, payment_provider, status, transaction_id, provider_payment_id, description, paid_at, created_at, updated_at) VALUES (8, 17, NULL, NULL, 10.00, 'EUR', 'mobile_money', 'mtn_momo', 'Paid', '2021282630', '13b526e9-6dd6-4e34-9649-09e2f13fa5d5', 'FranTett Healthcare MTN sandbox test', '2026-09-04 00:20:28.729917', '2026-09-03 14:58:16.966668', '2026-09-04 00:20:28.729917');
INSERT INTO public.payments (id, patient_id, appointment_id, consultation_id, amount, currency, payment_method, payment_provider, status, transaction_id, provider_payment_id, description, paid_at, created_at, updated_at) VALUES (9, 17, NULL, NULL, 10.00, 'EUR', 'mobile_money', 'mtn_momo', 'Paid', '1603019624', '6f4251d9-1f0d-42ef-888c-f1eb23ee6a1e', 'MTN MoMo UI test', '2026-09-04 01:27:36.336773', '2026-09-04 01:27:30.780028', '2026-09-04 01:27:36.336773');


--
-- Data for Name: prescription_items; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO public.prescription_items (id, prescription_id, medication_name, dose, route, frequency, duration, quantity, created_at) VALUES (13, 11, 'cgg', '3', '3', 'bg', '7', '15', '2026-08-31 14:11:03.101069');
INSERT INTO public.prescription_items (id, prescription_id, medication_name, dose, route, frequency, duration, quantity, created_at) VALUES (14, 12, 'FGH', '222', NULL, 'BID', '7', '12', '2026-09-01 10:46:06.559684');
INSERT INTO public.prescription_items (id, prescription_id, medication_name, dose, route, frequency, duration, quantity, created_at) VALUES (15, 13, 'cipro', '500mg', 'oral', 'bid', '7days', '14', '2026-09-01 13:46:16.506697');
INSERT INTO public.prescription_items (id, prescription_id, medication_name, dose, route, frequency, duration, quantity, created_at) VALUES (16, 14, 'para', '1g', 'oral', 'bid', '7days', '14', '2026-09-01 14:16:26.507975');
INSERT INTO public.prescription_items (id, prescription_id, medication_name, dose, route, frequency, duration, quantity, created_at) VALUES (21, 15, 'Ciprofloxacin', '1g', 'oral', 'tid', '5days', '10', '2026-09-04 14:08:39.388697');


--
-- Data for Name: prescriptions; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO public.prescriptions (id, patient_id, medication, dosage, frequency, duration, route, instructions, notes, created_at, updated_at, doctor, prescription_date, medication_name, dose, quantity, consultation_id) VALUES (11, 16, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2026-08-31 14:11:03.101069', '2026-08-31 14:11:03.101069', NULL, '2026-08-31', NULL, NULL, NULL, NULL);
INSERT INTO public.prescriptions (id, patient_id, medication, dosage, frequency, duration, route, instructions, notes, created_at, updated_at, doctor, prescription_date, medication_name, dose, quantity, consultation_id) VALUES (12, 16, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2026-09-01 10:46:06.559684', '2026-09-01 10:46:06.559684', NULL, '2026-09-01', NULL, NULL, NULL, NULL);
INSERT INTO public.prescriptions (id, patient_id, medication, dosage, frequency, duration, route, instructions, notes, created_at, updated_at, doctor, prescription_date, medication_name, dose, quantity, consultation_id) VALUES (13, 16, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2026-09-01 13:46:16.506697', '2026-09-01 13:46:16.506697', 'DR. FRANCIS', '2026-09-01', NULL, NULL, NULL, 16);
INSERT INTO public.prescriptions (id, patient_id, medication, dosage, frequency, duration, route, instructions, notes, created_at, updated_at, doctor, prescription_date, medication_name, dose, quantity, consultation_id) VALUES (14, 16, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2026-09-01 14:16:26.507975', '2026-09-01 14:16:26.507975', 'DR. FRANCIS', '2026-09-01', NULL, NULL, NULL, 16);
INSERT INTO public.prescriptions (id, patient_id, medication, dosage, frequency, duration, route, instructions, notes, created_at, updated_at, doctor, prescription_date, medication_name, dose, quantity, consultation_id) VALUES (15, 17, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2026-09-01 15:05:47.62766', '2026-09-04 14:08:39.388697', NULL, '2026-09-01', NULL, NULL, NULL, 17);


--
-- Data for Name: staff_registration_requests; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO public.staff_registration_requests (id, full_name, email, phone, role, password, status, created_at, reviewed_at) VALUES (1, 'Emmanuel Ansah', 'emmanuel@gmail.com', '0542648990', 'Doctor', '$2b$12$mOg5icssdw8DHWWS8js7tehSEp9Nq38FI6gT8jZNWSUOj6ek/NgpO', 'Approved', '2026-08-21 15:45:28.48984', '2026-08-21 15:47:20.253474');
INSERT INTO public.staff_registration_requests (id, full_name, email, phone, role, password, status, created_at, reviewed_at) VALUES (2, 'Ireen Aaasam', 'ireenaasam@gmail.com', '0245744300', 'Nurse', '$2b$12$oBNah8wk4M4AEtnbc8T.tO1652uw7XaNlUUlfucArh3MC2txLxoHa', 'Approved', '2026-08-22 03:36:06.034555', '2026-08-22 03:37:44.832258');


--
-- Data for Name: users; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO public.users (id, email, password, created_at, role, full_name, phone, status) VALUES (1, 'jayfrance1661@gmail.com', '$2b$12$5pNP0NwBxZTE4W4JVn7wGeR65RTuBbOImUzNEk0dF9xBhb1.0AIBu', '2026-08-14 02:25:20.461923', 'Admin', 'Jay France', NULL, 'Active');
INSERT INTO public.users (id, email, password, created_at, role, full_name, phone, status) VALUES (3, 'emmanuel@gmail.com', '$2b$12$mOg5icssdw8DHWWS8js7tehSEp9Nq38FI6gT8jZNWSUOj6ek/NgpO', '2026-08-21 15:47:20.253474', 'Staff', 'Emmanuel', NULL, 'Active');
INSERT INTO public.users (id, email, password, created_at, role, full_name, phone, status) VALUES (4, 'ireenaasam@gmail.com', '$2b$12$oBNah8wk4M4AEtnbc8T.tO1652uw7XaNlUUlfucArh3MC2txLxoHa', '2026-08-22 03:37:44.832258', 'Nurse', 'Ireena', NULL, 'Active');


--
-- Data for Name: vital_signs; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO public.vital_signs (id, patient_id, consultation_id, blood_pressure, heart_rate, temperature, respiratory_rate, oxygen_saturation, weight, height, bmi, recorded_by, recorded_at) VALUES (11, 16, NULL, '133/80', 79.00, 38.00, 16.00, 96.00, 78.00, 169.00, 27.31, 'francis', '2026-08-31 10:11:41.011636');
INSERT INTO public.vital_signs (id, patient_id, consultation_id, blood_pressure, heart_rate, temperature, respiratory_rate, oxygen_saturation, weight, height, bmi, recorded_by, recorded_at) VALUES (12, 17, 17, '133/90', 80.00, 30.00, 16.00, 96.00, 78.00, 169.00, 27.31, 'francis', '2026-09-01 15:05:02.833085');


--
-- Name: appointments_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.appointments_id_seq', 18, true);


--
-- Name: consultations_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.consultations_id_seq', 17, true);


--
-- Name: contact_messages_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.contact_messages_id_seq', 5, true);


--
-- Name: doctor_availability_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.doctor_availability_id_seq', 21, true);


--
-- Name: doctor_leave_days_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.doctor_leave_days_id_seq', 1, false);


--
-- Name: doctors_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.doctors_id_seq', 6, true);


--
-- Name: lab_report_parameters_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.lab_report_parameters_id_seq', 13, true);


--
-- Name: lab_reports_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.lab_reports_id_seq', 6, true);


--
-- Name: lab_requests_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.lab_requests_id_seq', 17, true);


--
-- Name: lab_results_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.lab_results_id_seq', 2, true);


--
-- Name: patient_accounts_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.patient_accounts_id_seq', 6, true);


--
-- Name: patients_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.patients_id_seq', 18, true);


--
-- Name: payments_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.payments_id_seq', 9, true);


--
-- Name: prescription_items_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.prescription_items_id_seq', 21, true);


--
-- Name: prescriptions_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.prescriptions_id_seq', 15, true);


--
-- Name: staff_registration_requests_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.staff_registration_requests_id_seq', 2, true);


--
-- Name: users_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.users_id_seq', 4, true);


--
-- Name: vital_signs_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.vital_signs_id_seq', 12, true);


--
-- Name: appointments appointments_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.appointments
    ADD CONSTRAINT appointments_pkey PRIMARY KEY (id);


--
-- Name: consultations consultations_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.consultations
    ADD CONSTRAINT consultations_pkey PRIMARY KEY (id);


--
-- Name: contact_messages contact_messages_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.contact_messages
    ADD CONSTRAINT contact_messages_pkey PRIMARY KEY (id);


--
-- Name: doctor_availability doctor_availability_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.doctor_availability
    ADD CONSTRAINT doctor_availability_pkey PRIMARY KEY (id);


--
-- Name: doctor_leave_days doctor_leave_days_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.doctor_leave_days
    ADD CONSTRAINT doctor_leave_days_pkey PRIMARY KEY (id);


--
-- Name: doctors doctors_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.doctors
    ADD CONSTRAINT doctors_pkey PRIMARY KEY (id);


--
-- Name: lab_report_parameters lab_report_parameters_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.lab_report_parameters
    ADD CONSTRAINT lab_report_parameters_pkey PRIMARY KEY (id);


--
-- Name: lab_reports lab_reports_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.lab_reports
    ADD CONSTRAINT lab_reports_pkey PRIMARY KEY (id);


--
-- Name: lab_requests lab_requests_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.lab_requests
    ADD CONSTRAINT lab_requests_pkey PRIMARY KEY (id);


--
-- Name: lab_results lab_results_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.lab_results
    ADD CONSTRAINT lab_results_pkey PRIMARY KEY (id);


--
-- Name: patient_accounts patient_accounts_email_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.patient_accounts
    ADD CONSTRAINT patient_accounts_email_key UNIQUE (email);


--
-- Name: patient_accounts patient_accounts_patient_id_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.patient_accounts
    ADD CONSTRAINT patient_accounts_patient_id_key UNIQUE (patient_id);


--
-- Name: patient_accounts patient_accounts_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.patient_accounts
    ADD CONSTRAINT patient_accounts_pkey PRIMARY KEY (id);


--
-- Name: patients patients_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.patients
    ADD CONSTRAINT patients_pkey PRIMARY KEY (id);


--
-- Name: payments payments_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.payments
    ADD CONSTRAINT payments_pkey PRIMARY KEY (id);


--
-- Name: prescription_items prescription_items_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.prescription_items
    ADD CONSTRAINT prescription_items_pkey PRIMARY KEY (id);


--
-- Name: prescriptions prescriptions_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.prescriptions
    ADD CONSTRAINT prescriptions_pkey PRIMARY KEY (id);


--
-- Name: staff_registration_requests staff_registration_requests_email_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.staff_registration_requests
    ADD CONSTRAINT staff_registration_requests_email_key UNIQUE (email);


--
-- Name: staff_registration_requests staff_registration_requests_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.staff_registration_requests
    ADD CONSTRAINT staff_registration_requests_pkey PRIMARY KEY (id);


--
-- Name: users users_email_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key UNIQUE (email);


--
-- Name: users users_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_pkey PRIMARY KEY (id);


--
-- Name: vital_signs vital_signs_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.vital_signs
    ADD CONSTRAINT vital_signs_pkey PRIMARY KEY (id);


--
-- Name: idx_lab_requests_consultation_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_lab_requests_consultation_id ON public.lab_requests USING btree (consultation_id);


--
-- Name: idx_prescriptions_consultation_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_prescriptions_consultation_id ON public.prescriptions USING btree (consultation_id);


--
-- Name: idx_vital_signs_consultation_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_vital_signs_consultation_id ON public.vital_signs USING btree (consultation_id);


--
-- Name: lab_results_consultation_id_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX lab_results_consultation_id_idx ON public.lab_results USING btree (consultation_id);


--
-- Name: appointments appointments_patient_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.appointments
    ADD CONSTRAINT appointments_patient_id_fkey FOREIGN KEY (patient_id) REFERENCES public.patients(id) ON DELETE CASCADE;


--
-- Name: consultations consultations_appointment_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.consultations
    ADD CONSTRAINT consultations_appointment_id_fkey FOREIGN KEY (appointment_id) REFERENCES public.appointments(id) ON DELETE SET NULL;


--
-- Name: consultations consultations_patient_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.consultations
    ADD CONSTRAINT consultations_patient_id_fkey FOREIGN KEY (patient_id) REFERENCES public.patients(id) ON DELETE CASCADE;


--
-- Name: doctor_availability doctor_availability_doctor_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.doctor_availability
    ADD CONSTRAINT doctor_availability_doctor_id_fkey FOREIGN KEY (doctor_id) REFERENCES public.doctors(id) ON DELETE CASCADE;


--
-- Name: doctor_leave_days doctor_leave_days_doctor_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.doctor_leave_days
    ADD CONSTRAINT doctor_leave_days_doctor_id_fkey FOREIGN KEY (doctor_id) REFERENCES public.doctors(id) ON DELETE CASCADE;


--
-- Name: lab_report_parameters lab_report_parameters_lab_report_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.lab_report_parameters
    ADD CONSTRAINT lab_report_parameters_lab_report_id_fkey FOREIGN KEY (lab_report_id) REFERENCES public.lab_reports(id) ON DELETE CASCADE;


--
-- Name: lab_reports lab_reports_consultation_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.lab_reports
    ADD CONSTRAINT lab_reports_consultation_id_fkey FOREIGN KEY (consultation_id) REFERENCES public.consultations(id) ON DELETE SET NULL;


--
-- Name: lab_reports lab_reports_patient_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.lab_reports
    ADD CONSTRAINT lab_reports_patient_id_fkey FOREIGN KEY (patient_id) REFERENCES public.patients(id) ON DELETE CASCADE;


--
-- Name: lab_requests lab_requests_consultation_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.lab_requests
    ADD CONSTRAINT lab_requests_consultation_id_fkey FOREIGN KEY (consultation_id) REFERENCES public.consultations(id) ON DELETE SET NULL;


--
-- Name: lab_requests lab_requests_patient_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.lab_requests
    ADD CONSTRAINT lab_requests_patient_id_fkey FOREIGN KEY (patient_id) REFERENCES public.patients(id) ON DELETE CASCADE;


--
-- Name: lab_results lab_results_consultation_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.lab_results
    ADD CONSTRAINT lab_results_consultation_id_fkey FOREIGN KEY (consultation_id) REFERENCES public.consultations(id) ON DELETE SET NULL;


--
-- Name: lab_results lab_results_patient_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.lab_results
    ADD CONSTRAINT lab_results_patient_id_fkey FOREIGN KEY (patient_id) REFERENCES public.patients(id) ON DELETE CASCADE;


--
-- Name: patient_accounts patient_accounts_patient_fk; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.patient_accounts
    ADD CONSTRAINT patient_accounts_patient_fk FOREIGN KEY (patient_id) REFERENCES public.patients(id) ON DELETE CASCADE;


--
-- Name: payments payments_appointment_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.payments
    ADD CONSTRAINT payments_appointment_id_fkey FOREIGN KEY (appointment_id) REFERENCES public.appointments(id) ON DELETE SET NULL;


--
-- Name: payments payments_consultation_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.payments
    ADD CONSTRAINT payments_consultation_id_fkey FOREIGN KEY (consultation_id) REFERENCES public.consultations(id) ON DELETE SET NULL;


--
-- Name: payments payments_patient_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.payments
    ADD CONSTRAINT payments_patient_id_fkey FOREIGN KEY (patient_id) REFERENCES public.patients(id) ON DELETE CASCADE;


--
-- Name: prescription_items prescription_items_prescription_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.prescription_items
    ADD CONSTRAINT prescription_items_prescription_id_fkey FOREIGN KEY (prescription_id) REFERENCES public.prescriptions(id) ON DELETE CASCADE;


--
-- Name: prescriptions prescriptions_consultation_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.prescriptions
    ADD CONSTRAINT prescriptions_consultation_id_fkey FOREIGN KEY (consultation_id) REFERENCES public.consultations(id) ON DELETE SET NULL;


--
-- Name: prescriptions prescriptions_patient_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.prescriptions
    ADD CONSTRAINT prescriptions_patient_id_fkey FOREIGN KEY (patient_id) REFERENCES public.patients(id) ON DELETE CASCADE;


--
-- Name: vital_signs vital_signs_consultation_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.vital_signs
    ADD CONSTRAINT vital_signs_consultation_id_fkey FOREIGN KEY (consultation_id) REFERENCES public.consultations(id) ON DELETE SET NULL;


--
-- Name: vital_signs vital_signs_patient_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.vital_signs
    ADD CONSTRAINT vital_signs_patient_id_fkey FOREIGN KEY (patient_id) REFERENCES public.patients(id) ON DELETE CASCADE;


--
-- PostgreSQL database dump complete
--

\unrestrict m5rA4WHLnOLg54bvExAy13HyFURm7tVnhEfl0BPoPGxVBV7ygosWrZulZ3BqKot

