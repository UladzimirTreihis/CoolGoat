INSERT INTO odds (fixture_id, name, values)
VALUES ($1, $2, $3)
ON CONFLICT (fixture_id, name) DO UPDATE SET
    values = EXCLUDED.values;
