--
-- PostgreSQL database dump
--

\restrict eZMJmathITDEHcfBjjIDz8UYe3etpk7XXxeVmNwk8ADppRdBlRwQgtRRUWH8YBg

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

COPY public.appointments (id, patient_id, name, email, phone, doctor, appointment_date, appointment_time, reason, status, created_at, meeting_room, meeting_provider, doctor_id) FROM stdin;
15	16	Kofi Bentil	Geoffrey.Cr@cap.com	9058508085	Dr. Francis Tetteh	2026-09-04	13:36	COUGH	Confirmed	2026-08-28 11:37:02.785786	frantett-1d985cde5a157d1a0764c85d8f6fe656	livekit	1
\.


--
-- Data for Name: consultations; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.consultations (id, patient_id, presenting_complaint, history_of_presenting_complaint, past_medical_history, drug_allergy_history, family_history, social_history, systems_review, summary, examination, investigations, differential_diagnosis, diagnosis, management_plan, treatment, follow_up_date, created_at, updated_at, doctor, consultation_date, chief_complaint, assessment, clinical_notes, appointment_id, blood_pressure, heart_rate, temperature, respiratory_rate, oxygen_saturation, weight, height, bmi) FROM stdin;
12	16	\N	4DAYS	BP	P'MOL	DM	SMOKE	C/A	STABLE	C/A	FBC	COLD	COLD	GOOD	CIPRO	2026-09-02	2026-08-28 11:40:50.404509	2026-08-28 11:43:32.952325	DR. FRANCIS	2026-08-28	COUGH	\N	GOOD	15	120	80	36	18	98	79	178	24.9
13	16	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	2026-08-28 11:59:10.360431	2026-08-28 11:59:10.360431	\N	2026-08-28	\N	\N	\N	15	\N	\N	\N	\N	\N	\N	\N	\N
\.


--
-- Data for Name: contact_messages; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.contact_messages (id, name, email, subject, message, status, created_at) FROM stdin;
1	OPOKU BILSON	FRANTETT1661@GMAIL.COM	MEDICATION	DO YOU HAVE MEDICATION FOR PNEUMONIA.	New	2026-08-21 02:37:18.493359
2	NANA	FRANTETT@GMAIL.COM	drug	do you have campa	New	2026-08-21 03:02:14.657881
3	JOHN DOE	FRANTETT@GMAIL.COM	drug	kherb	New	2026-08-21 03:03:48.67147
5	Karl Jones	TOSHIP@LINDFAST.COM	i need help	salbutamol	New	2026-08-21 09:16:43.264774
\.


--
-- Data for Name: doctor_availability; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.doctor_availability (id, doctor_id, day_of_week, start_time, end_time, created_at) FROM stdin;
1	1	Monday	08:00:00	17:00:00	2026-08-22 16:47:56.184601
2	1	Tuesday	08:00:00	17:00:00	2026-08-22 16:47:56.184601
3	1	Wednesday	08:00:00	17:00:00	2026-08-22 16:47:56.184601
4	1	Thursday	08:00:00	17:00:00	2026-08-22 16:47:56.184601
5	1	Friday	08:00:00	17:00:00	2026-08-22 16:47:56.184601
6	1	Monday	08:00:00	17:00:00	2026-08-27 01:25:38.197217
7	2	Monday	08:00:00	17:00:00	2026-08-27 01:26:07.400782
8	2	Tuesday	08:00:00	17:00:00	2026-08-27 01:26:13.405595
9	2	Wednesday	08:00:00	17:00:00	2026-08-27 01:26:17.944608
10	2	Thursday	08:00:00	17:00:00	2026-08-27 01:26:22.287359
11	2	Friday	08:00:00	17:00:00	2026-08-27 01:26:30.173763
12	3	Monday	08:00:00	17:00:00	2026-08-27 01:26:51.322348
13	3	Tuesday	08:00:00	17:00:00	2026-08-27 01:26:56.680713
14	3	Wednesday	08:00:00	17:00:00	2026-08-27 01:27:01.058723
15	3	Thursday	08:00:00	17:00:00	2026-08-27 01:27:07.310909
16	3	Friday	08:00:00	17:00:00	2026-08-27 01:27:12.491862
17	5	Monday	08:00:00	17:00:00	2026-08-27 01:27:48.293741
18	5	Tuesday	08:00:00	17:00:00	2026-08-27 01:27:52.969108
19	5	Wednesday	08:00:00	17:00:00	2026-08-27 01:27:56.778416
20	5	Thursday	08:00:00	17:00:00	2026-08-27 01:28:00.447424
21	5	Friday	08:00:00	17:00:00	2026-08-27 01:28:05.807705
\.


--
-- Data for Name: doctor_leave_days; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.doctor_leave_days (id, doctor_id, leave_date, reason, created_at) FROM stdin;
\.


--
-- Data for Name: doctors; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.doctors (id, name, specialty, email, phone, license_number, status, created_at) FROM stdin;
5	Dr Sam	Naturopathic Doctor	jftsuccess@gmail.com	0542648990	\N	Active	2026-08-19 03:17:06.939902
2	Dr. Talent	Naturopathic Doctor	jftsuccess@gmail.com	0542648990	\N	Active	2026-08-19 02:24:25.390514
3	Dr. Emily Brown	Pediatrician	jftsuccess@gmail.com	0542648990	\N	Active	2026-08-19 02:24:25.390514
6	Dr Jerry	Pediatrician	jayfranc@gmail.com	908657565	\N	Active	2026-08-19 03:18:55.959147
1	Dr. Francis Tetteh	Naturopathic Doctor	jayfrance1661@gmail.com	4168789387	\N	Active	2026-08-19 02:24:25.390514
\.


--
-- Data for Name: lab_report_parameters; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.lab_report_parameters (id, lab_report_id, parameter_name, result_value, unit, flag, reference_range, created_at) FROM stdin;
\.


--
-- Data for Name: lab_reports; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.lab_reports (id, patient_id, consultation_id, test_name, result_date, status, recorded_by, notes, created_at) FROM stdin;
\.


--
-- Data for Name: lab_requests; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.lab_requests (id, patient_id, requested_tests, clinical_information, requested_by, request_date, created_at, electronic_signature, consultation_id) FROM stdin;
\.


--
-- Data for Name: lab_results; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.lab_results (id, patient_id, consultation_id, test_name, result_value, unit, reference_range, result_date, status, notes, recorded_by, created_at) FROM stdin;
\.


--
-- Data for Name: patient_accounts; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.patient_accounts (id, patient_id, email, password, created_at) FROM stdin;
\.


--
-- Data for Name: patients; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.patients (id, first_name, last_name, email, phone, date_of_birth, gender, address, medical_history, allergies, medications, notes, created_at, updated_at) FROM stdin;
16	Kofi	Bentil	Geoffrey.Cr@cap.com	9058508085	\N	\N	\N	\N	\N	\N	\N	2026-08-28 11:37:02.785786	2026-08-28 11:37:02.785786
\.


--
-- Data for Name: prescription_items; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.prescription_items (id, prescription_id, medication_name, dose, route, frequency, duration, quantity, created_at) FROM stdin;
\.


--
-- Data for Name: prescriptions; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.prescriptions (id, patient_id, medication, dosage, frequency, duration, route, instructions, notes, created_at, updated_at, doctor, prescription_date, medication_name, dose, quantity, consultation_id) FROM stdin;
\.


--
-- Data for Name: staff_registration_requests; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.staff_registration_requests (id, full_name, email, phone, role, password, status, created_at, reviewed_at) FROM stdin;
1	Emmanuel Ansah	emmanuel@gmail.com	0542648990	Doctor	$2b$12$mOg5icssdw8DHWWS8js7tehSEp9Nq38FI6gT8jZNWSUOj6ek/NgpO	Approved	2026-08-21 15:45:28.48984	2026-08-21 15:47:20.253474
2	Ireen Aaasam	ireenaasam@gmail.com	0245744300	Nurse	$2b$12$oBNah8wk4M4AEtnbc8T.tO1652uw7XaNlUUlfucArh3MC2txLxoHa	Approved	2026-08-22 03:36:06.034555	2026-08-22 03:37:44.832258
\.


--
-- Data for Name: users; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.users (id, email, password, created_at, role, full_name, phone, status) FROM stdin;
1	jayfrance1661@gmail.com	$2b$12$5pNP0NwBxZTE4W4JVn7wGeR65RTuBbOImUzNEk0dF9xBhb1.0AIBu	2026-08-14 02:25:20.461923	Admin	Jay France	\N	Active
3	emmanuel@gmail.com	$2b$12$mOg5icssdw8DHWWS8js7tehSEp9Nq38FI6gT8jZNWSUOj6ek/NgpO	2026-08-21 15:47:20.253474	Staff	Emmanuel	\N	Active
4	ireenaasam@gmail.com	$2b$12$oBNah8wk4M4AEtnbc8T.tO1652uw7XaNlUUlfucArh3MC2txLxoHa	2026-08-22 03:37:44.832258	Nurse	Ireena	\N	Active
\.


--
-- Data for Name: vital_signs; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.vital_signs (id, patient_id, consultation_id, blood_pressure, heart_rate, temperature, respiratory_rate, oxygen_saturation, weight, height, bmi, recorded_by, recorded_at) FROM stdin;
\.


--
-- Name: appointments_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.appointments_id_seq', 15, true);


--
-- Name: consultations_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.consultations_id_seq', 13, true);


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

SELECT pg_catalog.setval('public.lab_report_parameters_id_seq', 6, true);


--
-- Name: lab_reports_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.lab_reports_id_seq', 4, true);


--
-- Name: lab_requests_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.lab_requests_id_seq', 13, true);


--
-- Name: lab_results_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.lab_results_id_seq', 2, true);


--
-- Name: patient_accounts_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.patient_accounts_id_seq', 5, true);


--
-- Name: patients_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.patients_id_seq', 16, true);


--
-- Name: prescription_items_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.prescription_items_id_seq', 12, true);


--
-- Name: prescriptions_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.prescriptions_id_seq', 10, true);


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

SELECT pg_catalog.setval('public.vital_signs_id_seq', 10, true);


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

\unrestrict eZMJmathITDEHcfBjjIDz8UYe3etpk7XXxeVmNwk8ADppRdBlRwQgtRRUWH8YBg

