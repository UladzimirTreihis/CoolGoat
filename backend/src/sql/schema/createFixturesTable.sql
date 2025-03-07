CREATE TABLE IF NOT EXISTS fixtures (
    id SERIAL PRIMARY KEY,
    fixture_id INT UNIQUE NOT NULL,
    league_id INT REFERENCES leagues(id),
    home_team_id INT REFERENCES teams(id),
    away_team_id INT REFERENCES teams(id),
    timezone VARCHAR(255),
    date TIMESTAMP,
    timestamp INT,
    status_long VARCHAR(255),
    status_short VARCHAR(50),
    status_elapsed INT,
    goals_home INT,
    goals_away INT,
    referee VARCHAR(255),
    updated_at TIMESTAMP DEFAULT NOW(),
    remaining_bonds INT DEFAULT 40
);
