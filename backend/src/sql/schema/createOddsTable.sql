CREATE TABLE IF NOT EXISTS odds (
    id SERIAL PRIMARY KEY,
    fixture_id INT NOT NULL,
    name VARCHAR(50),
    values JSONB,
    UNIQUE (fixture_id, name)  -- Ensure fixture_id and name are unique together
);