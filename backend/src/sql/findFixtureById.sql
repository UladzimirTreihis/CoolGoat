SELECT 
    f.fixture_id, f.date, f.timestamp, f.timezone, f.status_long, f.status_short, f.status_elapsed,
    f.goals_home, f.goals_away, f.referee, f.remaining_bonds,
    l.id AS league_id, l.name AS league_name, l.country AS league_country, l.logo AS league_logo, l.flag AS league_flag, l.season AS league_season, l.round AS league_round,
    ht.id AS home_team_id, ht.name AS home_team_name, ht.logo AS home_team_logo,
    at.id AS away_team_id, at.name AS away_team_name, at.logo AS away_team_logo,
    o.id AS odds_id, o.name AS odds_name, o.values AS odds_values
FROM 
    fixtures f
LEFT JOIN 
    leagues l ON f.league_id = l.id
LEFT JOIN 
    teams ht ON f.home_team_id = ht.id
LEFT JOIN 
    teams at ON f.away_team_id = at.id
LEFT JOIN 
    odds o ON f.fixture_id = o.fixture_id
WHERE 
    f.fixture_id = $1;
