INSERT INTO leagues (league_id, name, country, logo, flag, season, round)
VALUES ($1, $2, $3, $4, $5, $6, $7)
ON CONFLICT (league_id) DO UPDATE SET
    name = EXCLUDED.name,
    country = EXCLUDED.country,
    logo = EXCLUDED.logo,
    flag = EXCLUDED.flag,
    season = EXCLUDED.season,
    round = EXCLUDED.round
RETURNING id;
