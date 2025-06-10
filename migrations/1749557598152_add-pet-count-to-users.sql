-- Up Migration

ALTER TABLE "users"
ADD COLUMN pet_count INTEGER NOT NULL DEFAULT 0;

-- Down Migration