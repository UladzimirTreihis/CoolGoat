CREATE TABLE IF NOT EXISTS bond_validations (
    id SERIAL PRIMARY KEY,
    request_id UUID REFERENCES bond_requests(id),
    fixture_id INT REFERENCES fixtures(fixture_id),
    valid BOOLEAN NOT NULL, -- Indicates whether the bond request was valid
    validation_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);