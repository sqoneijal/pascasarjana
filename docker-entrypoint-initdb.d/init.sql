CREATE USER replicator WITH PASSWORD 'KQYsG4Hi201ajyEzOSGzr4MVfw==';
-- GRANT CONNECT ON DATABASE tugas_akhir TO replicator,postgres;
-- \connect tugas_akhir
-- GRANT SELECT ON ALL TABLES IN SCHEMA public TO replicator,postgres;
-- GRANT SELECT ON ALL SEQUENCES IN SCHEMA public TO replicator,postgres;
-- GRANT USAGE ON SCHEMA public TO replicator,postgres;
-- GRANT ALL PRIVILEGES ON DATABASE tugas_akhir TO postgres;
-- ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT SELECT ON TABLES TO replicator,postgres;
