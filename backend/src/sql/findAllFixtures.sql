SELECT DISTINCT 
    f.fixture_id, f.date, f.timestamp, f.timezone, f.status_long, f.status_short, f.status_elapsed,
    f.goals_home, f.goals_away, f.referee, f.updated_at, ht.name as home_team_name, ht.logo as home_team_logo,
    at.name as away_team_name, at.logo as away_team_logo, f.remaining_bonds
FROM 
    fixtures f
LEFT JOIN 
    teams ht ON f.home_team_id = ht.id
LEFT JOIN 
    teams at ON f.away_team_id = at.id
WHERE 1=1