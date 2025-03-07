INSERT INTO recommendations (user_id, fixture_id, created_at)
VALUES ($1, $2, NOW())
ON CONFLICT (user_id, fixture_id) DO UPDATE SET
    created_at = NOW()
RETURNING id;