CREATE TABLE IF NOT EXISTS bond_requests (
    id UUID PRIMARY KEY,
    fixture_id INT REFERENCES fixtures(fixture_id),
    user_id INT REFERENCES users(id), 
    group_id VARCHAR(50), 
    league_name VARCHAR(100),
    round VARCHAR(50),
    date DATE,
    result VARCHAR(50), -- The predicted result (e.g., "home_win", "draw", "away_win")
    deposit_token VARCHAR(100),
    datetime TIMESTAMP,
    quantity INT,
    seller INT DEFAULT 0,
    odds_name VARCHAR(50),
    odds_values JSONB, 
    wallet BOOLEAN DEFAULT TRUE,
    status VARCHAR(50) DEFAULT 'pending' -- Status of the bond request (pending, received, valid, invalid)
);