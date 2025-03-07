INSERT INTO teams (team_id, name, logo)
VALUES ($1, $2, $3)
ON CONFLICT (team_id) DO UPDATE SET
    name = EXCLUDED.name,
    logo = EXCLUDED.logo
RETURNING id;
