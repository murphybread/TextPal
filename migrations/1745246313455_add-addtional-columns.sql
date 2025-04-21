-- Up Migration
ALTER TABLE pets
    ADD COLUMN IF NOT EXISTS assigned_number VARCHAR(50),
    ADD COLUMN IF NOT EXISTS image_url TEXT,
    ADD COLUMN IF NOT EXISTS description TEXT,
    ADD COLUMN IF NOT EXISTS object_class VARCHAR(50),
    ADD COLUMN IF NOT EXISTS current_status JSONB NOT NULL DEFAULT '{}'::jsonb;


-- Down Migration