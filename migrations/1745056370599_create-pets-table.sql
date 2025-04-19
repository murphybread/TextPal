-- Up Migration


CREATE TABLE pets (
    -- Primary Identifier and Owner
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    owner_id UUID NOT NULL, -- FK to users(id) will be added later.
    name VARCHAR(255) NOT NULL,

    -- Initial Creation and State
    potential_class VARCHAR(50) NOT NULL DEFAULT 'standard',
    anomaly_level INTEGER NOT NULL DEFAULT 0,
    current_state VARCHAR(50) NOT NULL DEFAULT 'idle',
    base_stats JSONB NOT NULL DEFAULT '{}'::jsonb,
    lore JSONB NOT NULL DEFAULT '[]'::jsonb,

    -- Timestamps
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP
);


-- Down Migration