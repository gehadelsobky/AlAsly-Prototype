-- ============================================================================
-- FILE: 001_extensions.sql
-- PURPOSE: Enable PostgreSQL extensions required by the Al Asly database
-- RUN ORDER: First, before any CREATE TABLE statements
-- ============================================================================

-- UUID generation using crypto random
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Password hashing and crypto functions
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- Trigram support for fuzzy full-text search on product names
CREATE EXTENSION IF NOT EXISTS "pg_trgm";

-- Vector support for AI embeddings (Phase 2: semantic search)
-- NOTE: pgvector requires installation via: pip install pgvector
-- For local development, this extension is optional.
-- If not installed, product_embeddings table will use BYTEA instead
-- CREATE EXTENSION IF NOT EXISTS "vector";

-- ============================================================================
-- Extensions are now ready for use in schema creation
-- ============================================================================
