--
-- PostgreSQL database dump
--

-- Dumped from database version 16.9
-- Dumped by pg_dump version 16.5

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
-- Name: ai_insights; Type: TABLE; Schema: public; Owner: neondb_owner
--

CREATE TABLE public.ai_insights (
    id integer NOT NULL,
    event_id integer,
    category text NOT NULL,
    title text NOT NULL,
    description text NOT NULL,
    confidence numeric(5,2) NOT NULL,
    impact text NOT NULL,
    data_source text NOT NULL,
    priority integer DEFAULT 1 NOT NULL,
    created_at timestamp without time zone DEFAULT now()
);


ALTER TABLE public.ai_insights OWNER TO neondb_owner;

--
-- Name: ai_insights_id_seq; Type: SEQUENCE; Schema: public; Owner: neondb_owner
--

CREATE SEQUENCE public.ai_insights_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.ai_insights_id_seq OWNER TO neondb_owner;

--
-- Name: ai_insights_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: neondb_owner
--

ALTER SEQUENCE public.ai_insights_id_seq OWNED BY public.ai_insights.id;


--
-- Name: customer_behavior_metrics; Type: TABLE; Schema: public; Owner: neondb_owner
--

CREATE TABLE public.customer_behavior_metrics (
    id integer NOT NULL,
    event_id integer,
    total_visitors integer NOT NULL,
    bounce_rate numeric(5,2) NOT NULL,
    avg_session_duration_seconds integer NOT NULL,
    pages_per_session numeric(5,2) NOT NULL,
    customer_satisfaction numeric(3,1) NOT NULL,
    nps_score integer NOT NULL,
    "timestamp" timestamp without time zone DEFAULT now()
);


ALTER TABLE public.customer_behavior_metrics OWNER TO neondb_owner;

--
-- Name: customer_behavior_metrics_id_seq; Type: SEQUENCE; Schema: public; Owner: neondb_owner
--

CREATE SEQUENCE public.customer_behavior_metrics_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.customer_behavior_metrics_id_seq OWNER TO neondb_owner;

--
-- Name: customer_behavior_metrics_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: neondb_owner
--

ALTER SEQUENCE public.customer_behavior_metrics_id_seq OWNED BY public.customer_behavior_metrics.id;


--
-- Name: data_field_configs; Type: TABLE; Schema: public; Owner: neondb_owner
--

CREATE TABLE public.data_field_configs (
    id integer NOT NULL,
    event_id integer,
    bundle_id text NOT NULL,
    data_source text NOT NULL,
    field_name text NOT NULL,
    update_frequency text DEFAULT 'realtime'::text NOT NULL,
    retention_days integer DEFAULT 7 NOT NULL,
    is_active boolean DEFAULT true NOT NULL,
    created_at timestamp without time zone DEFAULT now()
);


ALTER TABLE public.data_field_configs OWNER TO neondb_owner;

--
-- Name: data_field_configs_id_seq; Type: SEQUENCE; Schema: public; Owner: neondb_owner
--

CREATE SEQUENCE public.data_field_configs_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.data_field_configs_id_seq OWNER TO neondb_owner;

--
-- Name: data_field_configs_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: neondb_owner
--

ALTER SEQUENCE public.data_field_configs_id_seq OWNED BY public.data_field_configs.id;


--
-- Name: hourly_sales_data; Type: TABLE; Schema: public; Owner: neondb_owner
--

CREATE TABLE public.hourly_sales_data (
    id integer NOT NULL,
    event_id integer,
    hour text NOT NULL,
    date timestamp without time zone NOT NULL,
    target_sales numeric(12,2) NOT NULL,
    actual_sales numeric(12,2) NOT NULL,
    created_at timestamp without time zone DEFAULT now()
);


ALTER TABLE public.hourly_sales_data OWNER TO neondb_owner;

--
-- Name: hourly_sales_data_id_seq; Type: SEQUENCE; Schema: public; Owner: neondb_owner
--

CREATE SEQUENCE public.hourly_sales_data_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.hourly_sales_data_id_seq OWNER TO neondb_owner;

--
-- Name: hourly_sales_data_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: neondb_owner
--

ALTER SEQUENCE public.hourly_sales_data_id_seq OWNED BY public.hourly_sales_data.id;


--
-- Name: incident_resolution_paths; Type: TABLE; Schema: public; Owner: neondb_owner
--

CREATE TABLE public.incident_resolution_paths (
    id integer NOT NULL,
    incident_id integer,
    path_name text NOT NULL,
    path_type text NOT NULL,
    description text NOT NULL,
    success_rate integer NOT NULL,
    time_estimate text,
    tradeoffs text,
    priority integer DEFAULT 1 NOT NULL,
    created_at timestamp without time zone DEFAULT now()
);


ALTER TABLE public.incident_resolution_paths OWNER TO neondb_owner;

--
-- Name: incident_resolution_paths_id_seq; Type: SEQUENCE; Schema: public; Owner: neondb_owner
--

CREATE SEQUENCE public.incident_resolution_paths_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.incident_resolution_paths_id_seq OWNER TO neondb_owner;

--
-- Name: incident_resolution_paths_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: neondb_owner
--

ALTER SEQUENCE public.incident_resolution_paths_id_seq OWNED BY public.incident_resolution_paths.id;


--
-- Name: incidents; Type: TABLE; Schema: public; Owner: neondb_owner
--

CREATE TABLE public.incidents (
    id integer NOT NULL,
    incident_id text NOT NULL,
    title text NOT NULL,
    description text NOT NULL,
    severity text NOT NULL,
    status text DEFAULT 'open'::text NOT NULL,
    assigned_team text,
    impact text,
    eta_minutes integer,
    created_at timestamp without time zone DEFAULT now(),
    resolved_at timestamp without time zone,
    escalation_level integer DEFAULT 1,
    users_affected integer,
    revenue_at_risk numeric(12,2),
    current_action text,
    action_eta_minutes integer,
    action_owner text,
    war_room_active boolean DEFAULT false,
    war_room_participants integer DEFAULT 0
);


ALTER TABLE public.incidents OWNER TO neondb_owner;

--
-- Name: incidents_id_seq; Type: SEQUENCE; Schema: public; Owner: neondb_owner
--

CREATE SEQUENCE public.incidents_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.incidents_id_seq OWNER TO neondb_owner;

--
-- Name: incidents_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: neondb_owner
--

ALTER SEQUENCE public.incidents_id_seq OWNED BY public.incidents.id;


--
-- Name: inventory; Type: TABLE; Schema: public; Owner: neondb_owner
--

CREATE TABLE public.inventory (
    id integer NOT NULL,
    product_id integer,
    store_id integer NOT NULL,
    region text NOT NULL,
    current_stock integer NOT NULL,
    min_threshold integer NOT NULL,
    last_updated timestamp without time zone DEFAULT now()
);


ALTER TABLE public.inventory OWNER TO neondb_owner;

--
-- Name: inventory_alerts; Type: TABLE; Schema: public; Owner: neondb_owner
--

CREATE TABLE public.inventory_alerts (
    id integer NOT NULL,
    product_id integer,
    store_id integer NOT NULL,
    location text NOT NULL,
    current_stock integer NOT NULL,
    min_threshold integer NOT NULL,
    severity text NOT NULL,
    eta text,
    auto_reorder_enabled boolean DEFAULT false,
    created_at timestamp without time zone DEFAULT now()
);


ALTER TABLE public.inventory_alerts OWNER TO neondb_owner;

--
-- Name: inventory_alerts_id_seq; Type: SEQUENCE; Schema: public; Owner: neondb_owner
--

CREATE SEQUENCE public.inventory_alerts_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.inventory_alerts_id_seq OWNER TO neondb_owner;

--
-- Name: inventory_alerts_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: neondb_owner
--

ALTER SEQUENCE public.inventory_alerts_id_seq OWNED BY public.inventory_alerts.id;


--
-- Name: inventory_id_seq; Type: SEQUENCE; Schema: public; Owner: neondb_owner
--

CREATE SEQUENCE public.inventory_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.inventory_id_seq OWNER TO neondb_owner;

--
-- Name: inventory_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: neondb_owner
--

ALTER SEQUENCE public.inventory_id_seq OWNED BY public.inventory.id;


--
-- Name: market_trends; Type: TABLE; Schema: public; Owner: neondb_owner
--

CREATE TABLE public.market_trends (
    id integer NOT NULL,
    event_id integer,
    trend_name text NOT NULL,
    category text NOT NULL,
    impact text NOT NULL,
    confidence numeric(5,2) NOT NULL,
    description text NOT NULL,
    predicted_growth numeric(5,2),
    data_source text NOT NULL,
    last_updated timestamp without time zone DEFAULT now()
);


ALTER TABLE public.market_trends OWNER TO neondb_owner;

--
-- Name: market_trends_id_seq; Type: SEQUENCE; Schema: public; Owner: neondb_owner
--

CREATE SEQUENCE public.market_trends_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.market_trends_id_seq OWNER TO neondb_owner;

--
-- Name: market_trends_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: neondb_owner
--

ALTER SEQUENCE public.market_trends_id_seq OWNED BY public.market_trends.id;


--
-- Name: product_performance; Type: TABLE; Schema: public; Owner: neondb_owner
--

CREATE TABLE public.product_performance (
    id integer NOT NULL,
    product_id integer,
    event_id integer,
    revenue numeric(12,2) NOT NULL,
    units_sold integer NOT NULL,
    ranking integer NOT NULL,
    growth_rate numeric(5,2),
    last_updated timestamp without time zone DEFAULT now()
);


ALTER TABLE public.product_performance OWNER TO neondb_owner;

--
-- Name: product_performance_id_seq; Type: SEQUENCE; Schema: public; Owner: neondb_owner
--

CREATE SEQUENCE public.product_performance_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.product_performance_id_seq OWNER TO neondb_owner;

--
-- Name: product_performance_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: neondb_owner
--

ALTER SEQUENCE public.product_performance_id_seq OWNED BY public.product_performance.id;


--
-- Name: products; Type: TABLE; Schema: public; Owner: neondb_owner
--

CREATE TABLE public.products (
    id integer NOT NULL,
    name text NOT NULL,
    category text NOT NULL,
    size text,
    price numeric(8,2) NOT NULL,
    sku text NOT NULL,
    description text
);


ALTER TABLE public.products OWNER TO neondb_owner;

--
-- Name: products_id_seq; Type: SEQUENCE; Schema: public; Owner: neondb_owner
--

CREATE SEQUENCE public.products_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.products_id_seq OWNER TO neondb_owner;

--
-- Name: products_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: neondb_owner
--

ALTER SEQUENCE public.products_id_seq OWNED BY public.products.id;


--
-- Name: regional_sales_data; Type: TABLE; Schema: public; Owner: neondb_owner
--

CREATE TABLE public.regional_sales_data (
    id integer NOT NULL,
    event_id integer,
    region text NOT NULL,
    store_count integer NOT NULL,
    revenue numeric(12,2) NOT NULL,
    growth_rate numeric(5,2) NOT NULL,
    performance_vs_target numeric(5,2) NOT NULL,
    last_updated timestamp without time zone DEFAULT now()
);


ALTER TABLE public.regional_sales_data OWNER TO neondb_owner;

--
-- Name: regional_sales_data_id_seq; Type: SEQUENCE; Schema: public; Owner: neondb_owner
--

CREATE SEQUENCE public.regional_sales_data_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.regional_sales_data_id_seq OWNER TO neondb_owner;

--
-- Name: regional_sales_data_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: neondb_owner
--

ALTER SEQUENCE public.regional_sales_data_id_seq OWNED BY public.regional_sales_data.id;


--
-- Name: sales_events; Type: TABLE; Schema: public; Owner: neondb_owner
--

CREATE TABLE public.sales_events (
    id integer NOT NULL,
    name text NOT NULL,
    start_date timestamp without time zone NOT NULL,
    end_date timestamp without time zone NOT NULL,
    target_revenue numeric(12,2) NOT NULL,
    status text DEFAULT 'planned'::text NOT NULL,
    signal_config jsonb,
    created_at timestamp without time zone DEFAULT now()
);


ALTER TABLE public.sales_events OWNER TO neondb_owner;

--
-- Name: sales_events_id_seq; Type: SEQUENCE; Schema: public; Owner: neondb_owner
--

CREATE SEQUENCE public.sales_events_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.sales_events_id_seq OWNER TO neondb_owner;

--
-- Name: sales_events_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: neondb_owner
--

ALTER SEQUENCE public.sales_events_id_seq OWNED BY public.sales_events.id;


--
-- Name: sales_metrics; Type: TABLE; Schema: public; Owner: neondb_owner
--

CREATE TABLE public.sales_metrics (
    id integer NOT NULL,
    event_id integer,
    "timestamp" timestamp without time zone NOT NULL,
    total_sales numeric(12,2) NOT NULL,
    active_customers integer NOT NULL,
    avg_basket_size numeric(8,2) NOT NULL,
    conversion_rate numeric(5,2) NOT NULL,
    inventory_health numeric(5,2) NOT NULL
);


ALTER TABLE public.sales_metrics OWNER TO neondb_owner;

--
-- Name: sales_metrics_id_seq; Type: SEQUENCE; Schema: public; Owner: neondb_owner
--

CREATE SEQUENCE public.sales_metrics_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.sales_metrics_id_seq OWNER TO neondb_owner;

--
-- Name: sales_metrics_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: neondb_owner
--

ALTER SEQUENCE public.sales_metrics_id_seq OWNED BY public.sales_metrics.id;


--
-- Name: signal_dependencies; Type: TABLE; Schema: public; Owner: neondb_owner
--

CREATE TABLE public.signal_dependencies (
    id integer NOT NULL,
    event_id integer,
    source_bundle text NOT NULL,
    source_field text NOT NULL,
    target_bundle text NOT NULL,
    target_field text NOT NULL,
    dependency_type text NOT NULL,
    weight integer DEFAULT 1,
    created_at timestamp without time zone DEFAULT now()
);


ALTER TABLE public.signal_dependencies OWNER TO neondb_owner;

--
-- Name: signal_dependencies_id_seq; Type: SEQUENCE; Schema: public; Owner: neondb_owner
--

CREATE SEQUENCE public.signal_dependencies_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.signal_dependencies_id_seq OWNER TO neondb_owner;

--
-- Name: signal_dependencies_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: neondb_owner
--

ALTER SEQUENCE public.signal_dependencies_id_seq OWNED BY public.signal_dependencies.id;


--
-- Name: social_mentions; Type: TABLE; Schema: public; Owner: neondb_owner
--

CREATE TABLE public.social_mentions (
    id integer NOT NULL,
    event_id integer,
    platform text NOT NULL,
    mentions integer NOT NULL,
    sentiment text NOT NULL,
    engagement_rate numeric(5,2) NOT NULL,
    influence_score integer NOT NULL,
    last_updated timestamp without time zone DEFAULT now()
);


ALTER TABLE public.social_mentions OWNER TO neondb_owner;

--
-- Name: social_mentions_id_seq; Type: SEQUENCE; Schema: public; Owner: neondb_owner
--

CREATE SEQUENCE public.social_mentions_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.social_mentions_id_seq OWNER TO neondb_owner;

--
-- Name: social_mentions_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: neondb_owner
--

ALTER SEQUENCE public.social_mentions_id_seq OWNED BY public.social_mentions.id;


--
-- Name: stores; Type: TABLE; Schema: public; Owner: neondb_owner
--

CREATE TABLE public.stores (
    id integer NOT NULL,
    name text NOT NULL,
    region text NOT NULL,
    address text,
    status text DEFAULT 'active'::text NOT NULL,
    store_count integer NOT NULL
);


ALTER TABLE public.stores OWNER TO neondb_owner;

--
-- Name: stores_id_seq; Type: SEQUENCE; Schema: public; Owner: neondb_owner
--

CREATE SEQUENCE public.stores_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.stores_id_seq OWNER TO neondb_owner;

--
-- Name: stores_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: neondb_owner
--

ALTER SEQUENCE public.stores_id_seq OWNED BY public.stores.id;


--
-- Name: system_components; Type: TABLE; Schema: public; Owner: neondb_owner
--

CREATE TABLE public.system_components (
    id integer NOT NULL,
    name text NOT NULL,
    status text NOT NULL,
    response_time_ms integer,
    last_check timestamp without time zone DEFAULT now()
);


ALTER TABLE public.system_components OWNER TO neondb_owner;

--
-- Name: system_components_id_seq; Type: SEQUENCE; Schema: public; Owner: neondb_owner
--

CREATE SEQUENCE public.system_components_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.system_components_id_seq OWNER TO neondb_owner;

--
-- Name: system_components_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: neondb_owner
--

ALTER SEQUENCE public.system_components_id_seq OWNED BY public.system_components.id;


--
-- Name: top_performers; Type: TABLE; Schema: public; Owner: neondb_owner
--

CREATE TABLE public.top_performers (
    id integer NOT NULL,
    event_id integer,
    name text NOT NULL,
    region text NOT NULL,
    store_id integer NOT NULL,
    sales numeric(10,2) NOT NULL,
    target_percentage numeric(5,2) NOT NULL,
    ranking integer NOT NULL,
    last_updated timestamp without time zone DEFAULT now()
);


ALTER TABLE public.top_performers OWNER TO neondb_owner;

--
-- Name: top_performers_id_seq; Type: SEQUENCE; Schema: public; Owner: neondb_owner
--

CREATE SEQUENCE public.top_performers_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.top_performers_id_seq OWNER TO neondb_owner;

--
-- Name: top_performers_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: neondb_owner
--

ALTER SEQUENCE public.top_performers_id_seq OWNED BY public.top_performers.id;


--
-- Name: war_room_participants; Type: TABLE; Schema: public; Owner: neondb_owner
--

CREATE TABLE public.war_room_participants (
    id integer NOT NULL,
    incident_id integer,
    participant_type text NOT NULL,
    name text NOT NULL,
    role text NOT NULL,
    status text NOT NULL,
    description text,
    eta_minutes integer,
    badge_color text,
    created_at timestamp without time zone DEFAULT now()
);


ALTER TABLE public.war_room_participants OWNER TO neondb_owner;

--
-- Name: war_room_participants_id_seq; Type: SEQUENCE; Schema: public; Owner: neondb_owner
--

CREATE SEQUENCE public.war_room_participants_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.war_room_participants_id_seq OWNER TO neondb_owner;

--
-- Name: war_room_participants_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: neondb_owner
--

ALTER SEQUENCE public.war_room_participants_id_seq OWNED BY public.war_room_participants.id;


--
-- Name: ai_insights id; Type: DEFAULT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.ai_insights ALTER COLUMN id SET DEFAULT nextval('public.ai_insights_id_seq'::regclass);


--
-- Name: customer_behavior_metrics id; Type: DEFAULT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.customer_behavior_metrics ALTER COLUMN id SET DEFAULT nextval('public.customer_behavior_metrics_id_seq'::regclass);


--
-- Name: data_field_configs id; Type: DEFAULT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.data_field_configs ALTER COLUMN id SET DEFAULT nextval('public.data_field_configs_id_seq'::regclass);


--
-- Name: hourly_sales_data id; Type: DEFAULT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.hourly_sales_data ALTER COLUMN id SET DEFAULT nextval('public.hourly_sales_data_id_seq'::regclass);


--
-- Name: incident_resolution_paths id; Type: DEFAULT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.incident_resolution_paths ALTER COLUMN id SET DEFAULT nextval('public.incident_resolution_paths_id_seq'::regclass);


--
-- Name: incidents id; Type: DEFAULT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.incidents ALTER COLUMN id SET DEFAULT nextval('public.incidents_id_seq'::regclass);


--
-- Name: inventory id; Type: DEFAULT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.inventory ALTER COLUMN id SET DEFAULT nextval('public.inventory_id_seq'::regclass);


--
-- Name: inventory_alerts id; Type: DEFAULT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.inventory_alerts ALTER COLUMN id SET DEFAULT nextval('public.inventory_alerts_id_seq'::regclass);


--
-- Name: market_trends id; Type: DEFAULT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.market_trends ALTER COLUMN id SET DEFAULT nextval('public.market_trends_id_seq'::regclass);


--
-- Name: product_performance id; Type: DEFAULT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.product_performance ALTER COLUMN id SET DEFAULT nextval('public.product_performance_id_seq'::regclass);


--
-- Name: products id; Type: DEFAULT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.products ALTER COLUMN id SET DEFAULT nextval('public.products_id_seq'::regclass);


--
-- Name: regional_sales_data id; Type: DEFAULT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.regional_sales_data ALTER COLUMN id SET DEFAULT nextval('public.regional_sales_data_id_seq'::regclass);


--
-- Name: sales_events id; Type: DEFAULT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.sales_events ALTER COLUMN id SET DEFAULT nextval('public.sales_events_id_seq'::regclass);


--
-- Name: sales_metrics id; Type: DEFAULT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.sales_metrics ALTER COLUMN id SET DEFAULT nextval('public.sales_metrics_id_seq'::regclass);


--
-- Name: signal_dependencies id; Type: DEFAULT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.signal_dependencies ALTER COLUMN id SET DEFAULT nextval('public.signal_dependencies_id_seq'::regclass);


--
-- Name: social_mentions id; Type: DEFAULT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.social_mentions ALTER COLUMN id SET DEFAULT nextval('public.social_mentions_id_seq'::regclass);


--
-- Name: stores id; Type: DEFAULT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.stores ALTER COLUMN id SET DEFAULT nextval('public.stores_id_seq'::regclass);


--
-- Name: system_components id; Type: DEFAULT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.system_components ALTER COLUMN id SET DEFAULT nextval('public.system_components_id_seq'::regclass);


--
-- Name: top_performers id; Type: DEFAULT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.top_performers ALTER COLUMN id SET DEFAULT nextval('public.top_performers_id_seq'::regclass);


--
-- Name: war_room_participants id; Type: DEFAULT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.war_room_participants ALTER COLUMN id SET DEFAULT nextval('public.war_room_participants_id_seq'::regclass);


--
-- Data for Name: ai_insights; Type: TABLE DATA; Schema: public; Owner: neondb_owner
--

COPY public.ai_insights (id, event_id, category, title, description, confidence, impact, data_source, priority, created_at) FROM stdin;
5	1	prediction	Sales Acceleration Detected	Current trajectory suggests 18% above target by end of day. Recommend increasing inventory for top 3 products.	94.20	high	Sales Prediction Engine	1	2025-07-05 04:37:10.693376
6	1	recommendation	Regional Optimization Opportunity	West Coast region showing 23% higher conversion rates. Consider reallocating marketing spend from underperforming regions.	87.60	medium	Regional Analytics AI	2	2025-07-05 04:37:10.693376
7	1	alert	Customer Satisfaction Trend	NPS score increased by 12 points compared to last quarter. Current strategies are highly effective.	91.80	high	Sentiment Analysis Engine	3	2025-07-05 04:37:10.693376
8	1	prediction	Inventory Optimization Alert	Premium Memory Foam projected to sell out within 6 hours. Immediate restocking recommended.	96.70	high	Inventory Prediction AI	1	2025-07-05 04:37:10.693376
\.


--
-- Data for Name: customer_behavior_metrics; Type: TABLE DATA; Schema: public; Owner: neondb_owner
--

COPY public.customer_behavior_metrics (id, event_id, total_visitors, bounce_rate, avg_session_duration_seconds, pages_per_session, customer_satisfaction, nps_score, "timestamp") FROM stdin;
2	1	12847	23.40	287	4.20	4.7	68	2025-07-05 04:37:10.413663
\.


--
-- Data for Name: data_field_configs; Type: TABLE DATA; Schema: public; Owner: neondb_owner
--

COPY public.data_field_configs (id, event_id, bundle_id, data_source, field_name, update_frequency, retention_days, is_active, created_at) FROM stdin;
1	1	sales	Order Management System	timestamp	realtime	7	t	2025-07-03 06:09:04.293391
2	1	sales	Order Management System	customer_id	realtime	7	t	2025-07-03 06:09:04.515582
3	1	sales	Order Management System	product_sku	realtime	7	t	2025-07-03 06:09:04.710599
4	1	sales	Order Management System	quantity	realtime	7	t	2025-07-03 06:09:04.901558
5	1	sales	Order Management System	discount_applied	realtime	7	t	2025-07-03 06:09:05.098566
6	1	sales	POS Systems	store_id	realtime	7	t	2025-07-03 06:09:05.303219
7	1	sales	POS Systems	cashier_id	realtime	7	t	2025-07-03 06:09:05.509992
8	1	sales	POS Systems	items_sold	realtime	7	t	2025-07-03 06:09:05.701127
9	1	sales	POS Systems	tax_amount	realtime	7	t	2025-07-03 06:09:05.891481
10	1	sales	Customer Database	customer_segment	realtime	7	t	2025-07-03 06:09:06.089318
11	1	sales	Customer Database	loyalty_tier	realtime	7	t	2025-07-03 06:09:06.281672
12	1	sales	Customer Database	purchase_history	realtime	7	t	2025-07-03 06:09:06.48792
13	1	sales	Customer Database	demographics	realtime	7	t	2025-07-03 06:09:06.696077
14	1	sales	Order Management System	customer_id	realtime	7	t	2025-07-03 06:14:17.989986
15	1	sales	Order Management System	product_sku	realtime	7	t	2025-07-03 06:14:18.228122
16	1	market	Price Intelligence API	product_match	realtime	7	t	2025-07-03 06:14:27.293781
17	1	market	Price Intelligence API	availability	realtime	7	t	2025-07-03 06:14:27.500095
18	1	external	Weather API	humidity	realtime	7	t	2025-07-03 06:14:39.282202
19	1	external	News Feed API	headline	realtime	7	t	2025-07-03 06:14:39.488193
20	1	external	News Feed API	source	realtime	7	t	2025-07-03 06:14:39.677736
21	1	external	News Feed API	category	realtime	7	t	2025-07-03 06:14:39.868353
22	1	sales	Order Management System	customer_id	realtime	7	t	2025-07-03 06:29:02.742721
23	1	sales	Order Management System	quantity	realtime	7	t	2025-07-03 06:29:03.022402
24	1	sales	Order Management System	payment_method	realtime	7	t	2025-07-03 06:29:03.243991
25	1	sales	POS Systems	cashier_id	realtime	7	t	2025-07-03 06:29:03.470468
26	1	sales	POS Systems	items_sold	realtime	7	t	2025-07-03 06:29:03.693635
27	1	customer	Web Analytics	page_views	realtime	7	t	2025-07-03 06:29:20.584867
28	1	customer	Web Analytics	bounce_rate	realtime	7	t	2025-07-03 06:29:20.78246
29	1	customer	Web Analytics	conversion_funnel	realtime	7	t	2025-07-03 06:29:20.966013
30	1	customer	Social Media APIs	platform	realtime	7	t	2025-07-03 06:29:21.16107
31	1	customer	Social Media APIs	engagement_rate	realtime	7	t	2025-07-03 06:29:21.344183
32	1	customer	Social Media APIs	hashtags	realtime	7	t	2025-07-03 06:29:21.529942
33	1	customer	Customer Support System	issue_category	realtime	7	t	2025-07-03 06:29:21.714143
34	1	ai	ML Pipeline	prediction_confidence	realtime	7	t	2025-07-03 06:29:34.055734
35	1	ai	ML Pipeline	feature_importance	realtime	7	t	2025-07-03 06:29:34.25326
36	1	ai	ML Pipeline	training_date	realtime	7	t	2025-07-03 06:29:34.432043
37	1	ai	Analytics Engine	anomaly_score	realtime	7	t	2025-07-03 06:29:34.613655
38	1	ai	Analytics Engine	trend_direction	realtime	7	t	2025-07-03 06:29:34.803462
39	1	ai	Analytics Engine	statistical_significance	realtime	7	t	2025-07-03 06:29:34.985022
40	1	ai	Analytics Engine	recommendation	realtime	7	t	2025-07-03 06:29:35.173683
41	1	ai	AI Insights API	confidence_level	realtime	7	t	2025-07-03 06:29:35.357794
42	1	ai	ML Pipeline	prediction_confidence	realtime	7	t	2025-07-05 03:30:44.17897
43	1	ai	ML Pipeline	feature_importance	realtime	7	t	2025-07-05 03:30:44.416254
44	1	ai	ML Pipeline	training_date	realtime	7	t	2025-07-05 03:30:44.600429
45	1	ai	ML Pipeline	accuracy_score	realtime	7	t	2025-07-05 03:30:44.802106
46	1	ai	Analytics Engine	anomaly_score	realtime	7	t	2025-07-05 03:30:44.993495
47	1	ai	Analytics Engine	trend_direction	realtime	7	t	2025-07-05 03:30:45.178701
48	1	ai	Analytics Engine	statistical_significance	realtime	7	t	2025-07-05 03:30:45.386198
49	1	ai	AI Insights API	insight_type	realtime	7	t	2025-07-05 03:30:45.564531
50	1	ai	AI Insights API	confidence_level	realtime	7	t	2025-07-05 03:30:45.755822
51	1	ai	AI Insights API	action_recommendation	realtime	7	t	2025-07-05 03:30:45.95894
52	1	ai	ML Pipeline	prediction_confidence	realtime	7	t	2025-07-05 03:30:46.296786
53	1	ai	ML Pipeline	feature_importance	realtime	7	t	2025-07-05 03:30:46.481131
54	1	ai	ML Pipeline	training_date	realtime	7	t	2025-07-05 03:30:46.673372
55	1	ai	ML Pipeline	accuracy_score	realtime	7	t	2025-07-05 03:30:46.87555
56	1	ai	Analytics Engine	anomaly_score	realtime	7	t	2025-07-05 03:30:47.061251
57	1	ai	Analytics Engine	trend_direction	realtime	7	t	2025-07-05 03:30:47.246298
58	1	ai	Analytics Engine	statistical_significance	realtime	7	t	2025-07-05 03:30:47.42818
59	1	ai	AI Insights API	insight_type	realtime	7	t	2025-07-05 03:30:47.607508
60	1	ai	AI Insights API	confidence_level	realtime	7	t	2025-07-05 03:30:47.780477
61	1	ai	AI Insights API	action_recommendation	realtime	7	t	2025-07-05 03:30:47.985264
62	1	ai	ML Pipeline	prediction_confidence	realtime	7	t	2025-07-05 03:31:40.312043
63	1	ai	ML Pipeline	feature_importance	realtime	7	t	2025-07-05 03:31:40.521309
64	1	ai	ML Pipeline	training_date	realtime	7	t	2025-07-05 03:31:40.700575
65	1	ai	ML Pipeline	accuracy_score	realtime	7	t	2025-07-05 03:31:40.876767
66	1	ai	Analytics Engine	anomaly_score	realtime	7	t	2025-07-05 03:31:41.071933
67	1	ai	Analytics Engine	trend_direction	realtime	7	t	2025-07-05 03:31:41.254283
68	1	ai	Analytics Engine	statistical_significance	realtime	7	t	2025-07-05 03:31:41.45163
69	1	ai	AI Insights API	insight_type	realtime	7	t	2025-07-05 03:31:41.644537
70	1	ai	AI Insights API	confidence_level	realtime	7	t	2025-07-05 03:31:41.823583
71	1	ai	AI Insights API	action_recommendation	realtime	7	t	2025-07-05 03:31:42.005744
72	1	ai	AI Insights API	impact_forecast	realtime	7	t	2025-07-05 03:31:42.178993
73	1	ai	AI Insights API	risk_assessment	realtime	7	t	2025-07-05 03:31:42.371028
74	1	sales	Order Management System	customer_id	realtime	7	t	2025-07-05 04:43:40.566488
75	1	sales	Order Management System	product_sku	realtime	7	t	2025-07-05 04:43:40.775424
76	1	sales	Order Management System	quantity	realtime	7	t	2025-07-05 04:43:40.967148
77	1	sales	Order Management System	discount_applied	realtime	7	t	2025-07-05 04:43:41.165892
78	1	sales	POS Systems	cashier_id	realtime	7	t	2025-07-05 04:43:41.362953
79	1	sales	POS Systems	items_sold	realtime	7	t	2025-07-05 04:43:41.561278
80	1	sales	POS Systems	total_value	realtime	7	t	2025-07-05 04:43:41.754298
81	1	sales	POS Systems	tax_amount	realtime	7	t	2025-07-05 04:43:41.943933
82	1	sales	POS Systems	tender_type	realtime	7	t	2025-07-05 04:43:42.127603
83	1	sales	Customer Database	customer_segment	realtime	7	t	2025-07-05 04:43:42.326158
84	1	sales	Customer Database	loyalty_tier	realtime	7	t	2025-07-05 04:43:42.51843
85	1	sales	Customer Database	purchase_history	realtime	7	t	2025-07-05 04:43:42.690744
86	1	sales	Customer Database	demographics	realtime	7	t	2025-07-05 04:43:42.892566
\.


--
-- Data for Name: hourly_sales_data; Type: TABLE DATA; Schema: public; Owner: neondb_owner
--

COPY public.hourly_sales_data (id, event_id, hour, date, target_sales, actual_sales, created_at) FROM stdin;
49	1	00:00	2025-07-05 00:00:00	90140.60	92811.37	2025-07-05 04:37:10.203523
50	1	01:00	2025-07-05 01:00:00	98629.84	109583.66	2025-07-05 04:37:10.203523
51	1	02:00	2025-07-05 02:00:00	111188.24	124286.49	2025-07-05 04:37:10.203523
52	1	03:00	2025-07-05 03:00:00	120231.87	117543.64	2025-07-05 04:37:10.203523
53	1	04:00	2025-07-05 04:00:00	130725.82	129454.84	2025-07-05 04:37:10.203523
54	1	05:00	2025-07-05 05:00:00	135222.96	153432.35	2025-07-05 04:37:10.203523
55	1	06:00	2025-07-05 06:00:00	131233.83	130837.13	2025-07-05 04:37:10.203523
56	1	07:00	2025-07-05 07:00:00	128735.33	129846.09	2025-07-05 04:37:10.203523
57	1	08:00	2025-07-05 08:00:00	130094.55	148664.70	2025-07-05 04:37:10.203523
58	1	09:00	2025-07-05 09:00:00	124007.51	115398.25	2025-07-05 04:37:10.203523
59	1	10:00	2025-07-05 10:00:00	117055.46	130277.16	2025-07-05 04:37:10.203523
60	1	11:00	2025-07-05 11:00:00	99369.74	110357.43	2025-07-05 04:37:10.203523
61	1	12:00	2025-07-05 12:00:00	94244.81	94495.33	2025-07-05 04:37:10.203523
62	1	13:00	2025-07-05 13:00:00	77089.52	72429.35	2025-07-05 04:37:10.203523
63	1	14:00	2025-07-05 14:00:00	71200.23	76315.01	2025-07-05 04:37:10.203523
64	1	15:00	2025-07-05 15:00:00	53385.63	47572.64	2025-07-05 04:37:10.203523
65	1	16:00	2025-07-05 16:00:00	48737.32	54953.60	2025-07-05 04:37:10.203523
66	1	17:00	2025-07-05 17:00:00	50430.86	54400.29	2025-07-05 04:37:10.203523
67	1	18:00	2025-07-05 18:00:00	40856.93	41552.37	2025-07-05 04:37:10.203523
68	1	19:00	2025-07-05 19:00:00	47108.50	51622.92	2025-07-05 04:37:10.203523
69	1	20:00	2025-07-05 20:00:00	46095.43	47014.25	2025-07-05 04:37:10.203523
70	1	21:00	2025-07-05 21:00:00	61506.73	67646.83	2025-07-05 04:37:10.203523
71	1	22:00	2025-07-05 22:00:00	63860.70	58908.52	2025-07-05 04:37:10.203523
72	1	23:00	2025-07-05 23:00:00	81895.88	86420.95	2025-07-05 04:37:10.203523
\.


--
-- Data for Name: incident_resolution_paths; Type: TABLE DATA; Schema: public; Owner: neondb_owner
--

COPY public.incident_resolution_paths (id, incident_id, path_name, path_type, description, success_rate, time_estimate, tradeoffs, priority, created_at) FROM stdin;
\.


--
-- Data for Name: incidents; Type: TABLE DATA; Schema: public; Owner: neondb_owner
--

COPY public.incidents (id, incident_id, title, description, severity, status, assigned_team, impact, eta_minutes, created_at, resolved_at, escalation_level, users_affected, revenue_at_risk, current_action, action_eta_minutes, action_owner, war_room_active, war_room_participants) FROM stdin;
\.


--
-- Data for Name: inventory; Type: TABLE DATA; Schema: public; Owner: neondb_owner
--

COPY public.inventory (id, product_id, store_id, region, current_stock, min_threshold, last_updated) FROM stdin;
1	1	1	West Coast	16	20	2025-07-03 06:05:51.822
2	1	2	East Coast	94	20	2025-07-03 06:05:51.822
3	1	3	Midwest	28	20	2025-07-03 06:05:51.822
4	2	1	West Coast	64	20	2025-07-03 06:05:51.822
5	2	2	East Coast	25	20	2025-07-03 06:05:51.822
6	2	3	Midwest	99	20	2025-07-03 06:05:51.822
7	3	1	West Coast	23	20	2025-07-03 06:05:51.822
8	3	2	East Coast	104	20	2025-07-03 06:05:51.822
9	3	3	Midwest	72	20	2025-07-03 06:05:51.822
\.


--
-- Data for Name: inventory_alerts; Type: TABLE DATA; Schema: public; Owner: neondb_owner
--

COPY public.inventory_alerts (id, product_id, store_id, location, current_stock, min_threshold, severity, eta, auto_reorder_enabled, created_at) FROM stdin;
4	1	3	West Coast - Store 3	8	15	critical	2 hours	t	2025-07-05 04:37:10.760468
5	2	7	East Coast - Store 7	12	20	warning	4 hours	t	2025-07-05 04:37:10.760468
6	3	12	Midwest - Store 12	23	25	info	6 hours	f	2025-07-05 04:37:10.760468
\.


--
-- Data for Name: market_trends; Type: TABLE DATA; Schema: public; Owner: neondb_owner
--

COPY public.market_trends (id, event_id, trend_name, category, impact, confidence, description, predicted_growth, data_source, last_updated) FROM stdin;
4	1	Sustainable Sleep Products	Environmental	high	87.30	Growing consumer preference for eco-friendly materials driving 23% increase in organic product sales	34.20	Market Research AI	2025-07-05 04:37:10.551184
5	1	Smart Home Integration	Technology	medium	72.80	Sleep technology integration showing steady adoption with 18% quarterly growth	28.70	IoT Analytics Platform	2025-07-05 04:37:10.551184
6	1	Premium Wellness Focus	Consumer Behavior	high	91.20	Premium product segment outperforming budget options by 42% in current quarter	45.60	Consumer Sentiment AI	2025-07-05 04:37:10.551184
\.


--
-- Data for Name: product_performance; Type: TABLE DATA; Schema: public; Owner: neondb_owner
--

COPY public.product_performance (id, product_id, event_id, revenue, units_sold, ranking, growth_rate, last_updated) FROM stdin;
12	1	1	45200.00	156	1	-6.86	2025-07-05 04:37:10.275932
13	2	1	35600.00	89	2	27.59	2025-07-05 04:37:10.275932
14	3	1	38900.00	67	3	-5.06	2025-07-05 04:37:10.275932
\.


--
-- Data for Name: products; Type: TABLE DATA; Schema: public; Owner: neondb_owner
--

COPY public.products (id, name, category, size, price, sku, description) FROM stdin;
1	Premium Memory Foam	Memory Foam	Queen	1299.99	PMF-001	Premium memory foam mattress with cooling gel
2	Hybrid Comfort	Hybrid	King	899.99	HC-002	Hybrid spring and foam construction
3	Natural Latex	Latex	Queen	1599.99	NL-003	100% natural latex mattress
\.


--
-- Data for Name: regional_sales_data; Type: TABLE DATA; Schema: public; Owner: neondb_owner
--

COPY public.regional_sales_data (id, event_id, region, store_count, revenue, growth_rate, performance_vs_target, last_updated) FROM stdin;
6	1	West Coast	24	491026.94	17.61	108.97	2025-07-05 04:37:10.345748
7	1	East Coast	18	377397.49	23.78	88.52	2025-07-05 04:37:10.345748
8	1	Midwest	15	305108.95	5.87	96.70	2025-07-05 04:37:10.345748
9	1	Southwest	12	276018.88	13.17	85.44	2025-07-05 04:37:10.345748
10	1	Southeast	19	333358.44	24.11	110.24	2025-07-05 04:37:10.345748
\.


--
-- Data for Name: sales_events; Type: TABLE DATA; Schema: public; Owner: neondb_owner
--

COPY public.sales_events (id, name, start_date, end_date, target_revenue, status, signal_config, created_at) FROM stdin;
1	Black Friday 2024	2024-11-29 00:00:00	2024-12-02 00:00:00	2500000.00	active	"{\\"bundles\\":[\\"sales\\",\\"market\\",\\"customer\\",\\"inventory\\"],\\"updateFrequency\\":\\"realtime\\"}"	2025-07-03 06:05:51.635015
\.


--
-- Data for Name: sales_metrics; Type: TABLE DATA; Schema: public; Owner: neondb_owner
--

COPY public.sales_metrics (id, event_id, "timestamp", total_sales, active_customers, avg_basket_size, conversion_rate, inventory_health) FROM stdin;
1	1	2025-07-03 06:08:29.327865	125000.00	1247	1453.00	3.20	92.00
\.


--
-- Data for Name: signal_dependencies; Type: TABLE DATA; Schema: public; Owner: neondb_owner
--

COPY public.signal_dependencies (id, event_id, source_bundle, source_field, target_bundle, target_field, dependency_type, weight, created_at) FROM stdin;
\.


--
-- Data for Name: social_mentions; Type: TABLE DATA; Schema: public; Owner: neondb_owner
--

COPY public.social_mentions (id, event_id, platform, mentions, sentiment, engagement_rate, influence_score, last_updated) FROM stdin;
6	1	Twitter	2847	positive	8.20	87	2025-07-05 04:37:10.483597
7	1	Instagram	3921	positive	12.40	92	2025-07-05 04:37:10.483597
8	1	Facebook	1563	mixed	6.80	73	2025-07-05 04:37:10.483597
9	1	TikTok	4206	positive	15.70	95	2025-07-05 04:37:10.483597
10	1	Reddit	892	mixed	4.30	64	2025-07-05 04:37:10.483597
\.


--
-- Data for Name: stores; Type: TABLE DATA; Schema: public; Owner: neondb_owner
--

COPY public.stores (id, name, region, address, status, store_count) FROM stdin;
1	West Coast Region	West Coast	Los Angeles, CA	active	15
2	East Coast Region	East Coast	New York, NY	active	12
3	Midwest Region	Midwest	Chicago, IL	active	8
\.


--
-- Data for Name: system_components; Type: TABLE DATA; Schema: public; Owner: neondb_owner
--

COPY public.system_components (id, name, status, response_time_ms, last_check) FROM stdin;
\.


--
-- Data for Name: top_performers; Type: TABLE DATA; Schema: public; Owner: neondb_owner
--

COPY public.top_performers (id, event_id, name, region, store_id, sales, target_percentage, ranking, last_updated) FROM stdin;
6	1	Alex Thompson	West Coast	1	47200.00	142.30	1	2025-07-05 04:37:10.625633
7	1	Sarah Chen	East Coast	5	39800.00	128.70	2	2025-07-05 04:37:10.625633
8	1	Michael Rodriguez	Midwest	8	35400.00	115.20	3	2025-07-05 04:37:10.625633
9	1	Jessica Park	Southwest	12	33100.00	108.90	4	2025-07-05 04:37:10.625633
10	1	David Kim	Southeast	15	31700.00	103.40	5	2025-07-05 04:37:10.625633
\.


--
-- Data for Name: war_room_participants; Type: TABLE DATA; Schema: public; Owner: neondb_owner
--

COPY public.war_room_participants (id, incident_id, participant_type, name, role, status, description, eta_minutes, badge_color, created_at) FROM stdin;
\.


--
-- Name: ai_insights_id_seq; Type: SEQUENCE SET; Schema: public; Owner: neondb_owner
--

SELECT pg_catalog.setval('public.ai_insights_id_seq', 8, true);


--
-- Name: customer_behavior_metrics_id_seq; Type: SEQUENCE SET; Schema: public; Owner: neondb_owner
--

SELECT pg_catalog.setval('public.customer_behavior_metrics_id_seq', 2, true);


--
-- Name: data_field_configs_id_seq; Type: SEQUENCE SET; Schema: public; Owner: neondb_owner
--

SELECT pg_catalog.setval('public.data_field_configs_id_seq', 86, true);


--
-- Name: hourly_sales_data_id_seq; Type: SEQUENCE SET; Schema: public; Owner: neondb_owner
--

SELECT pg_catalog.setval('public.hourly_sales_data_id_seq', 72, true);


--
-- Name: incident_resolution_paths_id_seq; Type: SEQUENCE SET; Schema: public; Owner: neondb_owner
--

SELECT pg_catalog.setval('public.incident_resolution_paths_id_seq', 1, false);


--
-- Name: incidents_id_seq; Type: SEQUENCE SET; Schema: public; Owner: neondb_owner
--

SELECT pg_catalog.setval('public.incidents_id_seq', 1, false);


--
-- Name: inventory_alerts_id_seq; Type: SEQUENCE SET; Schema: public; Owner: neondb_owner
--

SELECT pg_catalog.setval('public.inventory_alerts_id_seq', 6, true);


--
-- Name: inventory_id_seq; Type: SEQUENCE SET; Schema: public; Owner: neondb_owner
--

SELECT pg_catalog.setval('public.inventory_id_seq', 9, true);


--
-- Name: market_trends_id_seq; Type: SEQUENCE SET; Schema: public; Owner: neondb_owner
--

SELECT pg_catalog.setval('public.market_trends_id_seq', 6, true);


--
-- Name: product_performance_id_seq; Type: SEQUENCE SET; Schema: public; Owner: neondb_owner
--

SELECT pg_catalog.setval('public.product_performance_id_seq', 14, true);


--
-- Name: products_id_seq; Type: SEQUENCE SET; Schema: public; Owner: neondb_owner
--

SELECT pg_catalog.setval('public.products_id_seq', 3, true);


--
-- Name: regional_sales_data_id_seq; Type: SEQUENCE SET; Schema: public; Owner: neondb_owner
--

SELECT pg_catalog.setval('public.regional_sales_data_id_seq', 10, true);


--
-- Name: sales_events_id_seq; Type: SEQUENCE SET; Schema: public; Owner: neondb_owner
--

SELECT pg_catalog.setval('public.sales_events_id_seq', 1, true);


--
-- Name: sales_metrics_id_seq; Type: SEQUENCE SET; Schema: public; Owner: neondb_owner
--

SELECT pg_catalog.setval('public.sales_metrics_id_seq', 1, true);


--
-- Name: signal_dependencies_id_seq; Type: SEQUENCE SET; Schema: public; Owner: neondb_owner
--

SELECT pg_catalog.setval('public.signal_dependencies_id_seq', 1, false);


--
-- Name: social_mentions_id_seq; Type: SEQUENCE SET; Schema: public; Owner: neondb_owner
--

SELECT pg_catalog.setval('public.social_mentions_id_seq', 10, true);


--
-- Name: stores_id_seq; Type: SEQUENCE SET; Schema: public; Owner: neondb_owner
--

SELECT pg_catalog.setval('public.stores_id_seq', 3, true);


--
-- Name: system_components_id_seq; Type: SEQUENCE SET; Schema: public; Owner: neondb_owner
--

SELECT pg_catalog.setval('public.system_components_id_seq', 1, false);


--
-- Name: top_performers_id_seq; Type: SEQUENCE SET; Schema: public; Owner: neondb_owner
--

SELECT pg_catalog.setval('public.top_performers_id_seq', 10, true);


--
-- Name: war_room_participants_id_seq; Type: SEQUENCE SET; Schema: public; Owner: neondb_owner
--

SELECT pg_catalog.setval('public.war_room_participants_id_seq', 1, false);


--
-- Name: ai_insights ai_insights_pkey; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.ai_insights
    ADD CONSTRAINT ai_insights_pkey PRIMARY KEY (id);


--
-- Name: customer_behavior_metrics customer_behavior_metrics_pkey; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.customer_behavior_metrics
    ADD CONSTRAINT customer_behavior_metrics_pkey PRIMARY KEY (id);


--
-- Name: data_field_configs data_field_configs_pkey; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.data_field_configs
    ADD CONSTRAINT data_field_configs_pkey PRIMARY KEY (id);


--
-- Name: hourly_sales_data hourly_sales_data_pkey; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.hourly_sales_data
    ADD CONSTRAINT hourly_sales_data_pkey PRIMARY KEY (id);


--
-- Name: incident_resolution_paths incident_resolution_paths_pkey; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.incident_resolution_paths
    ADD CONSTRAINT incident_resolution_paths_pkey PRIMARY KEY (id);


--
-- Name: incidents incidents_incident_id_unique; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.incidents
    ADD CONSTRAINT incidents_incident_id_unique UNIQUE (incident_id);


--
-- Name: incidents incidents_pkey; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.incidents
    ADD CONSTRAINT incidents_pkey PRIMARY KEY (id);


--
-- Name: inventory_alerts inventory_alerts_pkey; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.inventory_alerts
    ADD CONSTRAINT inventory_alerts_pkey PRIMARY KEY (id);


--
-- Name: inventory inventory_pkey; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.inventory
    ADD CONSTRAINT inventory_pkey PRIMARY KEY (id);


--
-- Name: market_trends market_trends_pkey; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.market_trends
    ADD CONSTRAINT market_trends_pkey PRIMARY KEY (id);


--
-- Name: product_performance product_performance_pkey; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.product_performance
    ADD CONSTRAINT product_performance_pkey PRIMARY KEY (id);


--
-- Name: products products_pkey; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.products
    ADD CONSTRAINT products_pkey PRIMARY KEY (id);


--
-- Name: products products_sku_unique; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.products
    ADD CONSTRAINT products_sku_unique UNIQUE (sku);


--
-- Name: regional_sales_data regional_sales_data_pkey; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.regional_sales_data
    ADD CONSTRAINT regional_sales_data_pkey PRIMARY KEY (id);


--
-- Name: sales_events sales_events_pkey; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.sales_events
    ADD CONSTRAINT sales_events_pkey PRIMARY KEY (id);


--
-- Name: sales_metrics sales_metrics_pkey; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.sales_metrics
    ADD CONSTRAINT sales_metrics_pkey PRIMARY KEY (id);


--
-- Name: signal_dependencies signal_dependencies_pkey; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.signal_dependencies
    ADD CONSTRAINT signal_dependencies_pkey PRIMARY KEY (id);


--
-- Name: social_mentions social_mentions_pkey; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.social_mentions
    ADD CONSTRAINT social_mentions_pkey PRIMARY KEY (id);


--
-- Name: stores stores_pkey; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.stores
    ADD CONSTRAINT stores_pkey PRIMARY KEY (id);


--
-- Name: system_components system_components_pkey; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.system_components
    ADD CONSTRAINT system_components_pkey PRIMARY KEY (id);


--
-- Name: top_performers top_performers_pkey; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.top_performers
    ADD CONSTRAINT top_performers_pkey PRIMARY KEY (id);


--
-- Name: war_room_participants war_room_participants_pkey; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.war_room_participants
    ADD CONSTRAINT war_room_participants_pkey PRIMARY KEY (id);


--
-- Name: ai_insights ai_insights_event_id_sales_events_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.ai_insights
    ADD CONSTRAINT ai_insights_event_id_sales_events_id_fk FOREIGN KEY (event_id) REFERENCES public.sales_events(id);


--
-- Name: customer_behavior_metrics customer_behavior_metrics_event_id_sales_events_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.customer_behavior_metrics
    ADD CONSTRAINT customer_behavior_metrics_event_id_sales_events_id_fk FOREIGN KEY (event_id) REFERENCES public.sales_events(id);


--
-- Name: data_field_configs data_field_configs_event_id_sales_events_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.data_field_configs
    ADD CONSTRAINT data_field_configs_event_id_sales_events_id_fk FOREIGN KEY (event_id) REFERENCES public.sales_events(id);


--
-- Name: hourly_sales_data hourly_sales_data_event_id_sales_events_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.hourly_sales_data
    ADD CONSTRAINT hourly_sales_data_event_id_sales_events_id_fk FOREIGN KEY (event_id) REFERENCES public.sales_events(id);


--
-- Name: incident_resolution_paths incident_resolution_paths_incident_id_incidents_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.incident_resolution_paths
    ADD CONSTRAINT incident_resolution_paths_incident_id_incidents_id_fk FOREIGN KEY (incident_id) REFERENCES public.incidents(id);


--
-- Name: inventory_alerts inventory_alerts_product_id_products_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.inventory_alerts
    ADD CONSTRAINT inventory_alerts_product_id_products_id_fk FOREIGN KEY (product_id) REFERENCES public.products(id);


--
-- Name: inventory inventory_product_id_products_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.inventory
    ADD CONSTRAINT inventory_product_id_products_id_fk FOREIGN KEY (product_id) REFERENCES public.products(id);


--
-- Name: market_trends market_trends_event_id_sales_events_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.market_trends
    ADD CONSTRAINT market_trends_event_id_sales_events_id_fk FOREIGN KEY (event_id) REFERENCES public.sales_events(id);


--
-- Name: product_performance product_performance_event_id_sales_events_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.product_performance
    ADD CONSTRAINT product_performance_event_id_sales_events_id_fk FOREIGN KEY (event_id) REFERENCES public.sales_events(id);


--
-- Name: product_performance product_performance_product_id_products_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.product_performance
    ADD CONSTRAINT product_performance_product_id_products_id_fk FOREIGN KEY (product_id) REFERENCES public.products(id);


--
-- Name: regional_sales_data regional_sales_data_event_id_sales_events_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.regional_sales_data
    ADD CONSTRAINT regional_sales_data_event_id_sales_events_id_fk FOREIGN KEY (event_id) REFERENCES public.sales_events(id);


--
-- Name: sales_metrics sales_metrics_event_id_sales_events_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.sales_metrics
    ADD CONSTRAINT sales_metrics_event_id_sales_events_id_fk FOREIGN KEY (event_id) REFERENCES public.sales_events(id);


--
-- Name: signal_dependencies signal_dependencies_event_id_sales_events_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.signal_dependencies
    ADD CONSTRAINT signal_dependencies_event_id_sales_events_id_fk FOREIGN KEY (event_id) REFERENCES public.sales_events(id);


--
-- Name: social_mentions social_mentions_event_id_sales_events_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.social_mentions
    ADD CONSTRAINT social_mentions_event_id_sales_events_id_fk FOREIGN KEY (event_id) REFERENCES public.sales_events(id);


--
-- Name: top_performers top_performers_event_id_sales_events_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.top_performers
    ADD CONSTRAINT top_performers_event_id_sales_events_id_fk FOREIGN KEY (event_id) REFERENCES public.sales_events(id);


--
-- Name: war_room_participants war_room_participants_incident_id_incidents_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.war_room_participants
    ADD CONSTRAINT war_room_participants_incident_id_incidents_id_fk FOREIGN KEY (incident_id) REFERENCES public.incidents(id);


--
-- Name: DEFAULT PRIVILEGES FOR SEQUENCES; Type: DEFAULT ACL; Schema: public; Owner: cloud_admin
--

ALTER DEFAULT PRIVILEGES FOR ROLE cloud_admin IN SCHEMA public GRANT ALL ON SEQUENCES TO neon_superuser WITH GRANT OPTION;


--
-- Name: DEFAULT PRIVILEGES FOR TABLES; Type: DEFAULT ACL; Schema: public; Owner: cloud_admin
--

ALTER DEFAULT PRIVILEGES FOR ROLE cloud_admin IN SCHEMA public GRANT ALL ON TABLES TO neon_superuser WITH GRANT OPTION;


--
-- PostgreSQL database dump complete
--

