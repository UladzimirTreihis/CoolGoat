CREATE TABLE IF NOT EXISTS teams (
    id SERIAL PRIMARY KEY,
    team_id INT UNIQUE NOT NULL,
    name VARCHAR(255),
    logo VARCHAR(255)
);
