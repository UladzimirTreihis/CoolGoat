CREATE TABLE IF NOT EXISTS webpay_transactions (
    id VARCHAR(26) PRIMARY KEY,
    user_id INT REFERENCES users(id) ON DELETE CASCADE,
    request_id UUID REFERENCES bond_requests(id),
    amount DECIMAL(10, 2) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    status VARCHAR(50) DEFAULT 'pending',
    token VARCHAR(128) DEFAULT ''
);