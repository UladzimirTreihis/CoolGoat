CREATE TABLE IF NOT EXISTS leagues (
    id SERIAL PRIMARY KEY,
    league_id INT UNIQUE NOT NULL,
    name VARCHAR(255),
    country VARCHAR(255),
    logo VARCHAR(255),
    flag VARCHAR(255),
    season INT,
    round VARCHAR(255)
);
