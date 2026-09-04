--
-- PostgreSQL database cluster dump
--

\restrict 5TmoTTAl2AcctXCpPYSIEhIGeBvHa15jNP5kzjzVCOM2SzVsEeDc8fOtHvTinxc

SET default_transaction_read_only = off;

SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;

--
-- Roles
--

CREATE ROLE postgres;
ALTER ROLE postgres WITH SUPERUSER INHERIT CREATEROLE CREATEDB LOGIN REPLICATION BYPASSRLS PASSWORD 'SCRAM-SHA-256$4096:2BznmGaqXQzF+Xqz5eIlqw==$UmIlo1nkDTbg4zuXCrZ4uoWlW3PHh3svtSxVBC/EYM4=:qo5OXiKC0lQM/fTBeIivrMcirGPseJK7dtiQZjTOZ2o=';

--
-- User Configurations
--








\unrestrict 5TmoTTAl2AcctXCpPYSIEhIGeBvHa15jNP5kzjzVCOM2SzVsEeDc8fOtHvTinxc

--
-- PostgreSQL database cluster dump complete
--

