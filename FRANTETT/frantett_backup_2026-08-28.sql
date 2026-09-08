--
-- PostgreSQL database dump
--

\restrict bhmL34HndzUoDkXWTt4xbl4iFIhXXFKkqIOMq6i68IaaCHQ2KLgEwCbCT6aUaYa

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
    quantity text
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
6	8	Test Patient	test@example.com	1234567890	Dr. Francis Tetteh	2026-08-25	10:00	Test appointment	Pending	2026-08-21 01:01:39.644262	\N	\N	\N
7	2	ISAAC MENSAH	jayfra@gmail.com	908657565	Dr. Francis Tetteh	2026-08-27	02:11	COUGH	Pending	2026-08-21 01:11:26.736008	\N	\N	\N
8	4	Mike Jake	jayfran@gmail.com	9086575	Dr. Talent	2026-08-22	04:23	cough	Pending	2026-08-21 01:23:43.089201	\N	\N	\N
9	9	Frimpong Joseph	jftsuccess1661@gmail.com	0254674675	Dr. Sam	2026-08-30	17:26	uti	Pending	2026-08-21 01:27:45.474119	\N	\N	\N
12	3	LiveKit Test	livekittest@example.com	908657565	Dr. Emily Brown	2026-09-02	16:32	LiveKit consultation test	Confirmed	2026-08-27 02:32:29.027542	frantett-f35a6c25ee16a70ca163f76fe4b0e83a	livekit	3
10	3	Kwaku Addo	kwaku@gmail.com	908657565	Dr. Francis Tetteh	2026-08-27	08:00	diarrhoea	Completed	2026-08-22 19:00:19.743715	\N	\N	\N
13	2	Jack Mack	jack@gmail.com	908657565	Dr. Talent	2026-09-02	15:05	Chest pains	Confirmed	2026-08-28 01:06:27.782815	frantett-f7da0ab2192a809e0d1696ed0329a585	livekit	2
\.


--
-- Data for Name: consultations; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.consultations (id, patient_id, presenting_complaint, history_of_presenting_complaint, past_medical_history, drug_allergy_history, family_history, social_history, systems_review, summary, examination, investigations, differential_diagnosis, diagnosis, management_plan, treatment, follow_up_date, created_at, updated_at, doctor, consultation_date, chief_complaint, assessment, clinical_notes, appointment_id, blood_pressure, heart_rate, temperature, respiratory_rate, oxygen_saturation, weight, height, bmi) FROM stdin;
3	5	\N	A KNOW HYPERTENSIVE PATIENT ON MEDICATION WHO WAS APPARENTLY WELL UNTIL ABOUT FOUR DAYS AGO WHEN SHE STARTED EXPERIENCING CHEST PAINS WHICH IS BURNING IN CHARACTER WITH NO RADIATION AGGRAVATED AFTER EATING WITH NO RELIEVING FACTOR. RATED THE PAINS 6/7. \n\nODQ: FEVER-, VOMITING-, DIARRHOEA-, HEARTBURNS+	PUD-, MI-, DM+, HPT+, HF-, HA-	AMLODIPINE 10MG, GLIMEPRIDE 5MG	HPT+, DM+	TEACHER WITH 2 KIDS, MARRIED, DOES NOT SMOKE NOR DRINK	CVS-- DIZZINES-, PALPITATIONS-, FATIGUE-, DYSPNOEA-\nGUT--- POLYURIA-, DYSURIA-, FREQUENCY-	GENERALLY STABLE	CVS--- H1+H2 PRESENT, NO MUMURS\nGIT-----EPIGASTRIC TENDERNESS, NO ABD DISTENTION, FLAT FULL\nCNS--- CONCIOUS AND ALERT	H. PYLORI TEST, CHEST XRAY, FBC, ECG	PUD\nPNUEMONIA\nMI	PUD	TRIPPLE TERAPY	KHERB 60MLS TID 7/7\nDYSPESIA 30MLS TID 7/7\nENTERICA 30MLS TID 7/7	2026-08-22	2026-08-17 03:33:12.037753	2026-08-17 03:53:21.193612	DR FRNCIS	2026-08-17	CHEST PAINS 4/7	STABLE	FOR REVIEW	\N	\N	\N	\N	\N	\N	\N	\N	\N
5	13	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	2026-08-24 10:42:02.717661	2026-08-24 10:42:02.717661	\N	2026-08-24	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
4	5	\N	4days	nil	nil	nil	nil	nil	nil	nil	nil	nil	nil	nil	nil	2026-09-05	2026-08-19 10:51:31.046592	2026-08-24 12:00:55.756844	Dr. Talent	2026-08-19	chills  4/7	\N	normal	\N	\N	\N	\N	\N	\N	\N	\N	\N
6	3	\N	nil	NIL	NIL	NIL	NIL	NIL	NIL	NIL	NIL	NIL	NIL	NIL	NIL	2026-09-02	2026-08-27 09:43:50.431443	2026-08-27 13:29:08.453039	Dr. Francis	2026-08-27	nil	\N	TEST	12	120/80	72	36	18	98	70	175	22.9
7	3	\N	NIL	NIL	NIL	NIL	NIL	NIL	NIL	NIL	NIL	NIL	NIL	NIL	NIL	2026-08-28	2026-08-27 14:35:39.29034	2026-08-27 14:55:40.812072	DR. Francis	2026-08-27	NIL	\N	NIL	12	120/80	72	35.6	18	95	70	175	22.9
9	2	\N	4 days	bp	para	dm	smoke	c/a	stable	c/a	Xray	typhoid	typhoid	cipro	cipro	2026-09-04	2026-08-28 03:41:15.392781	2026-08-28 03:41:15.392781	DR TALENT	2026-08-28	Vomiting	\N	review	13	\N	\N	\N	\N	\N	\N	\N	\N
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
1	1	WBC	19	G/M	Normal	10-20	2026-08-23 05:10:52.887706
2	2	WBC	19	G/M	Normal	10-20	2026-08-23 05:10:52.244408
3	1	MCV	6	G/L	Low	5-10	2026-08-23 05:10:52.887706
4	2	MCV	6	G/L	Low	5-10	2026-08-23 05:10:52.244408
\.


--
-- Data for Name: lab_reports; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.lab_reports (id, patient_id, consultation_id, test_name, result_date, status, recorded_by, notes, created_at) FROM stdin;
2	13	\N	FBC	2026-08-28	Final	Francis	NORMAL	2026-08-23 05:10:52.244408
1	13	\N	FBC	2026-08-28	Final	Francis	NORMAL	2026-08-23 05:10:52.887706
\.


--
-- Data for Name: lab_requests; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.lab_requests (id, patient_id, requested_tests, clinical_information, requested_by, request_date, created_at, electronic_signature, consultation_id) FROM stdin;
1	13	FBC, Kidney Function Test, Urinalysis	Frequent urination	Dr. Francis	2026-08-23	2026-08-23 16:44:23.704074	\N	\N
2	13	FBC, Kidney Function Test, Urinalysis	Frequent urination	Dr. Francis	2026-08-23	2026-08-23 16:44:25.6976	\N	\N
3	13	FBC, Kidney Function Test, Urinalysis	Frequent urination	Dr. Francis	2026-08-23	2026-08-23 16:44:25.785507	\N	\N
4	13	FBC, Kidney Function Test	\N	francis	2026-08-24	2026-08-24 12:06:30.6992	\N	\N
5	13	FBC, Kidney Function Test, Liver Function Test	\N	francis	2026-08-24	2026-08-24 14:05:48.920017	\N	\N
6	13	FBC, Kidney Function Test, Liver Function Test, Lipid Profile	\N	sam	2026-08-25	2026-08-25 00:54:41.89683	\N	\N
7	13	Kidney Function Test, Lipid Profile, Urinalysis	\N	sam	2026-08-25	2026-08-25 01:10:25.04445	data:image/png;base64,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	\N
8	13	Kidney Function Test, Lipid Profile	\N	dan	2026-08-25	2026-08-25 02:11:02.388017	data:image/png;base64,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	\N
11	2	FBC, Liver Function Test, Lipid Profile, Urinalysis	\N	dan	2026-08-28	2026-08-28 03:42:12.075788	data:image/png;base64,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	\N
\.


--
-- Data for Name: lab_results; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.lab_results (id, patient_id, consultation_id, test_name, result_value, unit, reference_range, result_date, status, notes, recorded_by, created_at) FROM stdin;
2	13	\N	FBC	23	GL	12-14	2026-08-23	Final	NORMAL	\N	2026-08-23 04:11:23.755777
\.


--
-- Data for Name: patient_accounts; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.patient_accounts (id, patient_id, email, password, created_at) FROM stdin;
1	10	testpatient@frantett.com	$2b$12$Qb1xLJc7ZpFhw3NnOgZ3LeP2QA/z.F9eeKM2BtsaWG8wnRb8Yy5zW	2026-08-21 04:13:44.706957
2	11	jayfrance1661@gmail.com	$2b$12$ZC6LYG/tqJPDKuhuLRAy9Olg.aRJjAuml6VYp9MzqmwceXlmpXXsK	2026-08-21 05:25:39.33496
3	12	toship@lind.com	$2b$12$oxHLRZSNyiuoUUyikjS4A.8kqjw7lcV0P9RgW0B5aAi.97iFejJ7.	2026-08-21 10:40:39.950032
4	13	toshiped@lind.com	$2b$12$6wnIn/LdNRtdtcoKoVham.RfaSWs0209KYfU0hETDQznYC8T4FDNy	2026-08-21 13:15:57.689769
\.


--
-- Data for Name: patients; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.patients (id, first_name, last_name, email, phone, date_of_birth, gender, address, medical_history, allergies, medications, notes, created_at, updated_at) FROM stdin;
5	ISAAC	MENSAH	JAY@GMAIL.COM	87866976	2026-07-28	Male	80 UPPER HIGHLAND DRIVE	HYPERTENSION, DIABETES	NO KNOWN ALLERGIES	AMLODIPINE 10MG, GLIMEPRIDE 5MG	HERE TO SEEK FOR MEDICAL ATTENTION	2026-08-17 03:14:36.634079	2026-08-17 03:14:36.634079
6	Victor	Smith	jftsucc@gmail.com	8056709477	\N	\N	\N	\N	\N	\N	\N	2026-08-18 13:15:20.237852	2026-08-18 13:26:44.046766
7	Abigail	Karl	Geoffrey@whitecap.com	9675545545	\N	\N	\N	\N	\N	\N	\N	2026-08-18 14:12:35.968306	2026-08-19 11:38:15.728748
8	Test	Patient	test@example.com	1234567890	\N	\N	\N	\N	\N	\N	\N	2026-08-21 01:01:39.644262	2026-08-21 01:01:39.644262
4	Mike	Jake	jayfran@gmail.com	9086575	\N	\N	\N	\N	\N	\N	\N	2026-08-16 03:06:36.557833	2026-08-21 01:23:43.089201
9	Frimpong	Joseph	jftsuccess1661@gmail.com	0254674675	\N	\N	\N	\N	\N	\N	\N	2026-08-21 01:27:45.474119	2026-08-21 01:27:45.474119
10	Test	Patient	testpatient@frantett.com	1234567890	\N	\N	\N	\N	\N	\N	\N	2026-08-21 04:13:43.749308	2026-08-21 04:13:43.749308
12	PORTE	DESMARA	toship@lind.com	19057910606	\N	\N	\N	\N	\N	\N	\N	2026-08-21 10:40:39.688508	2026-08-21 10:40:39.688508
11	Micheal	Owusu	jayfrance1661@gmail.com	519-555-1234	1995-06-15	Male	London, Ontario, Canada	No significant medical history	None known	None	Test patient profile	2026-08-21 05:25:38.039002	2026-08-21 05:25:38.039002
13	John	Boye	toshiped@lind.com	19057910606	2026-07-27	Male	34 SPEIRS GIFFEN AVENUE	\N	\N	\N	\N	2026-08-21 13:15:57.424095	2026-08-21 13:15:57.424095
3	LiveKit	Test	livekittest@example.com	908657565	2026-07-30	Female	ujki	hj	kk	nh	gh	2026-08-16 03:05:25.040832	2026-08-27 02:32:29.027542
2	Jack	Mack	jack@gmail.com	908657565	2026-07-30	Male	ujki	nil	nil	nil	nil	2026-08-16 01:47:26.338642	2026-08-28 01:06:27.782815
\.


--
-- Data for Name: prescription_items; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.prescription_items (id, prescription_id, medication_name, dose, route, frequency, duration, quantity, created_at) FROM stdin;
1	6	CIPROFLOXACIN	500MG	ORAL	BID	74	16	2026-08-17 05:09:46.035031
2	5	CIPROFLOXACIN	500MG	ORAL	BID	74	16	2026-08-17 05:09:46.157377
3	7	Ciprofloxacin	200	ORAL	BID	7DAYS	14	2026-08-17 05:39:39.403158
4	7	METRONIDAZOLE	400MG	ORAL	TID	7DAYS	30	2026-08-17 05:39:39.403158
5	8	CIPR	500	ORALLY	BID	7DAYS	14	2026-08-17 05:41:26.617436
\.


--
-- Data for Name: prescriptions; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.prescriptions (id, patient_id, medication, dosage, frequency, duration, route, instructions, notes, created_at, updated_at, doctor, prescription_date, medication_name, dose, quantity) FROM stdin;
1	2	\N	\N	BID	7DAYS	ORAL	KKKK	VGG	2026-08-16 02:06:19.686886	2026-08-16 02:06:44.660174	Dr SAM	2026-08-16	CIPRO	500MG	12
4	5	\N	\N	TID	7DAYS	ORA	BEFORE MEALS	TAKE IT CONSISTENTLY	2026-08-17 03:35:57.956104	2026-08-17 03:35:57.956104	DR FRANCIS	2026-08-17	KHERB	60MLS	2
6	5	\N	\N	\N	\N	\N	\N	\N	2026-08-17 05:09:46.035031	2026-08-17 05:09:46.035031	DR FRANCIS	2026-08-17	\N	\N	\N
5	5	\N	\N	\N	\N	\N	\N	\N	2026-08-17 05:09:46.157377	2026-08-17 05:09:46.157377	DR FRANCIS	2026-08-17	\N	\N	\N
7	5	\N	\N	\N	\N	\N	CONSITENTLY	REVIEW	2026-08-17 05:39:39.403158	2026-08-17 05:39:39.403158	\N	2026-08-17	\N	\N	\N
8	4	\N	\N	\N	\N	\N	NIL	NIL	2026-08-17 05:41:26.617436	2026-08-17 05:41:26.617436	\N	2026-08-17	\N	\N	\N
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
1	13	\N	120/70	70.00	36.00	80.00	70.00	70.00	175.00	22.86	francis	2026-08-23 00:43:47.013508
3	2	\N	120/70	72.00	36.00	12.00	96.00	55.00	154.00	23.19	francis	2026-08-24 04:12:05.331998
4	2	\N	120/70	72.00	36.00	12.00	96.00	55.00	154.00	23.19	francis	2026-08-24 04:12:31.914841
5	13	\N	120/70	72.00	36.00	12.00	96.00	55.00	154.00	23.19	francis	2026-08-24 04:28:17.928908
6	13	\N	140/90	82.00	37.00	15.00	96.00	80.00	155.00	33.30	francis	2026-08-24 09:28:38.464598
\.


--
-- Name: appointments_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.appointments_id_seq', 13, true);


--
-- Name: consultations_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.consultations_id_seq', 9, true);


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

SELECT pg_catalog.setval('public.lab_report_parameters_id_seq', 4, true);


--
-- Name: lab_reports_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.lab_reports_id_seq', 2, true);


--
-- Name: lab_requests_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.lab_requests_id_seq', 11, true);


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

SELECT pg_catalog.setval('public.patients_id_seq', 14, true);


--
-- Name: prescription_items_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.prescription_items_id_seq', 11, true);


--
-- Name: prescriptions_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.prescriptions_id_seq', 9, true);


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

SELECT pg_catalog.setval('public.vital_signs_id_seq', 6, true);


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

\unrestrict bhmL34HndzUoDkXWTt4xbl4iFIhXXFKkqIOMq6i68IaaCHQ2KLgEwCbCT6aUaYa

