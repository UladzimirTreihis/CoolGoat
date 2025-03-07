WITH user_teams AS (
  SELECT DISTINCT f.home_team_id AS team_id
  FROM bond_requests br
  JOIN fixtures f ON br.fixture_id = f.fixture_id
  WHERE br.user_id = $1
  
  UNION
  
  SELECT DISTINCT f.away_team_id AS team_id
  FROM bond_requests br
  JOIN fixtures f ON br.fixture_id = f.fixture_id
  WHERE br.user_id = $1
)

SELECT 
  fx.fixture_id,
  fx.league_id,
  l.round AS league_round,
  fx.home_team_id,
  fx.away_team_id,
  fx.date,
  fx.status_long,
  fx.status_short,
  fx.status_elapsed,
  fx.goals_home,
  fx.goals_away
FROM fixtures fx
JOIN user_teams ut ON fx.home_team_id = ut.team_id OR fx.away_team_id = ut.team_id
LEFT JOIN 
    leagues l ON fx.league_id = l.id
WHERE fx.date > NOW()
ORDER BY fx.league_id, fx.date;
