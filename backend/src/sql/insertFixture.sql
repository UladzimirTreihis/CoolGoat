INSERT INTO fixtures (fixture_id, league_id, home_team_id, away_team_id, timezone, date, timestamp,
                      status_long, status_short, status_elapsed, goals_home, goals_away, referee, updated_at)
VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, NOW())
ON CONFLICT (fixture_id) DO UPDATE SET
    status_long = EXCLUDED.status_long,
    status_short = EXCLUDED.status_short,
    status_elapsed = EXCLUDED.status_elapsed,
    goals_home = EXCLUDED.goals_home,
    goals_away = EXCLUDED.goals_away,
    referee = EXCLUDED.referee,
    updated_at = NOW()  -- Automatically updates the timestamp
RETURNING id;
