CREATE TABLE IF NOT EXISTS bond_requests_received (
    id UUID PRIMARY KEY,
    fixture_id INT REFERENCES fixtures(fixture_id),
    group_id VARCHAR(50),
    league_name VARCHAR(200),
    round VARCHAR(200),
    date DATE,
    result VARCHAR(200), -- The predicted result (e.g., "home_win", "draw", "away_win")
    deposit_token VARCHAR(200),
    datetime TIMESTAMP,
    quantity INT,
    seller INT DEFAULT 0
);